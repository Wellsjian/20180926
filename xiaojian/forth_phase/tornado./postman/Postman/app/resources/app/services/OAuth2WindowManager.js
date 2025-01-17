let _ = require('lodash'),
    sdk = require('postman-collection'),
    electron = require('electron'),
    BrowserWindow = electron.BrowserWindow;

/**
 * A simple window manager that interfaces with a OAuth 2 authentication helper.
 * The purpose of this module is to handle the user agent interaction of the auth flows.
 * This is designed to interface with postman-runtime later.
 *
 * @class OAuth2WindowManager
 */
class OAuth2WindowManager {

  constructor (options = {}) {
    this.cookiePartitionId = options.cookiePartitionId;
    this.strictSSL = options.strictSSL;
  }

  /**
   * Function to handle permission requests
   * All Permissions will be denied automatically.
   * Denied permission are ['media', 'geolocation', 'notifications', 'midiSysex', 'pointerLock', 'fullscreen' 'openExternal]
   */
  permissionRequestHandler (webContents, permission, callback) {
    return callback(false);
  }

  /**
   * Opens a given URL in a window. Looks for a given match on the redirects and ends when it finds one.
   *
   * @param {SDKUrl} url url to open the auth window with
   * @param {Object} matchOptions with property `params`, to look for
   * @param {Function} callback callback will be executed when a match is found
   *
   * @returns {undefined}
   */
  startLoginWith (url, matchOptions, callback) {
    _.isString(url) && (url = new sdk.Url(url));

    // do not allow opening any protocol that is not http or https,
    // this prevents security vulnerabilities, do not remove this ever, ever
    if (!(url.protocol === 'https' || url.protocol === 'http')) {
      callback && callback(new Error('Invalid protocol for auth URL. Only HTTP and HTTPS protocol are allowed.'));
      return;
    }

    let authWindow = new BrowserWindow({
          width: 800,
          height: 600,
          show: false,
          title: 'Postman OAuth 2.0',
          webPreferences: {
            nodeIntegration: false,
            partition: this.cookiePartitionId
          }
        }),
        expectedUrl = new sdk.Url(matchOptions.uri),
        expectedHost = expectedUrl.host && expectedUrl.host.join('.'),
        urlMatched = !(expectedUrl.protocol && expectedUrl.host), // if no valid url was given, we don't try to match the redirect urls
        didCompleteAuth = false,
        isUrlMatching = function (urlRedirect) {
          let actualUrl = new sdk.Url(urlRedirect);
          return actualUrl.host && actualUrl.host.join('.') === expectedHost;
        },
        handleUrlChange = function (urlRedirect) {
          pm.logger.info('OAuth2WindowManager~startLoginWith - Received redirect on auth login window');
          let actualUrl = new sdk.Url(urlRedirect),
            paramFound = false,

            // combine params in query string and hash
            params = new sdk.PropertyList(sdk.QueryParam, {}, _.concat(actualUrl.query.toJSON(), sdk.QueryParam.parse(actualUrl.hash))),

            error,
            endAuthFlow = function () {
              // bail out listeners for similar events
              didCompleteAuth = true;

              // It crashes when used directly.
              // https://github.com/electron/electron/issues/1685#issuecomment-102259335
              setTimeout(function () {
                authWindow && authWindow.close();
              });
            };

          if (!urlMatched) {
            isUrlMatching(urlRedirect) && (urlMatched = true);
          }

          if (!urlMatched) {
            pm.logger.info('OAuth2WindowManager~startLoginWith - URL did not match the registered callbackURL, so skipping');
            return;
          }

          // decode param values
          params.each(function (param) {
            param && (param.value = decodeURIComponent(param.value));
          });

          // if query or hash has an error we have to bubble it up
          error = params.find((param) => { return _.toLower(param.key) === 'error'; });

          if (error) {
            endAuthFlow();
            callback(error.value, params.toObject());
            return;
          }

          paramFound = params.find((param) => {
            return _.includes(matchOptions.params, _.toLower(param.key));
          });

          if (paramFound) {
            pm.logger.info('OAuth2WindowManager~startLoginWith - Matched code/access_token. Closing auth login window now.');
            endAuthFlow();
            callback && callback(null, params.toObject());
            return;
          }
        };

    authWindow.on('close', function () {
      /* calling clearAuthCache() to close all open connections and not to clear any cached auth data
         Here is the link to the exact line in electron repository
         https://github.com/electron/electron/blob/1918e76913ed550a3b2738ac541de48cb9db4afa/atom/browser/api/atom_api_session.cc#L313
         that needs to get executed when a window get closed so that any session tickets related to previous sessions is removed
      */
      authWindow.webContents.session.clearAuthCache({ type: '', origin: '' });

      // do not leak memory
      authWindow = null;
    }, false);

    // attach listeners to all events, and try to extract code/access_token
    // bail out if we could extract from the first event
    // set `didCompleteAuth` flag to true for bail out
    authWindow.webContents.on('did-get-redirect-request', function (event2, oldUrl, newUrl) {
      if (didCompleteAuth) {
        return;
      }
      handleUrlChange(newUrl);
    });

    authWindow.webContents.on('did-fail-load', function (error) {
      if (didCompleteAuth) {
        return;
      }

      let redirectUrls = _.get(error, ['sender', 'history']);
      _.some(redirectUrls, (redirectUrl) => {
        if (isUrlMatching(redirectUrl)) {
          handleUrlChange(redirectUrl);
          return true;
        }
      }) || pm.logger.warn('error in Oauth2: did-fail-load', error);
    });

    authWindow.webContents.on('will-navigate', function (event2, newUrl) {
      if (didCompleteAuth) {
        return;
      }
      handleUrlChange(newUrl);
    });

    authWindow.webContents.on('did-navigate', function (event2, newUrl) {
      if (didCompleteAuth) {
        return;
      }
      handleUrlChange(newUrl);
    });

    authWindow.webContents.on('did-navigate-in-page', function (event2, newUrl) {
      if (didCompleteAuth) {
        return;
      }
      handleUrlChange(newUrl);
    });

    // Workaround to handle server side redirections while obtaining Access Token in OAuth2 flow
    // as a solution to the issue - https://github.com/postmanlabs/postman-app-support/issues/6895.
    // Issue happened due to upgrade from electron 1.8.8 to 3.x which deprecated 'did-get-redirect-request' event
    authWindow.webContents.session.webRequest.onBeforeRedirect((details) => {
      if (didCompleteAuth) {
        return;
      }
      handleUrlChange(details.url);
    });

    authWindow.webContents.on('certificate-error', function (event, url, error, certificate, callback) {
      if (!this.strictSSL) {
        event.preventDefault();
        callback(true);
      }
      else {
        callback(false);
      }
    });

    let session = _.get(authWindow, 'webContents.session');

    /**
     * Setting the handler which will respond to permission requests for the session.
     */
    session && session.setPermissionRequestHandler(this.permissionRequestHandler);

    pm.logger.info('OAuth2WindowManager~startLoginWith - Opening auth login window', url.toString());

    // open authorization url in a window
    authWindow.loadURL(url.toString());
    authWindow.show();
    return;
  }
}

module.exports = OAuth2WindowManager;
