webpackJsonp([25],{

/***/ 1020:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GenericContextMenu; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__electron_ElectronService__ = __webpack_require__(199);
let

GenericContextMenu = class GenericContextMenu {
  constructor() {
    this.Remote = __webpack_require__(20).remote;
    this.Menu = this.Remote.Menu;
    this.MenuItem = this.Remote.MenuItem;
    this.currentSelection = '';

    /**
                                 * On right click in any input field, text gets automatically selected even if there was no explicit selection made before.
                                 * The text which gets automatically selected on right click, depends on the cursor position.
                                 */
    window.addEventListener('contextmenu', e => {
      e.preventDefault();
      this.currentSelection = window.getSelection().toString();
      let menu = this.buildMenu(e);

      // Empty menu fix for windows native app
      if (menu && _.size(menu.items)) {
        menu.popup(Object(__WEBPACK_IMPORTED_MODULE_0__electron_ElectronService__["c" /* getCurrentWindow */])());
      }
    }, false);
  }

  buildMenu(e) {
    let menu = new this.Menu(),
    isInput = _.get(e, 'target.nodeName') === 'INPUT' || _.get(e, 'target.nodeName') === 'TEXTAREA',
    selectedText = this.currentSelection;

    // Resetting values so that context menu is not triggered on right clicking anywhere on the screen
    this.currentSelection = '';

    if (!_.isEmpty(selectedText) || isInput) {
      this.buildGenericMenu(menu);
    }
    return menu;
  }

  buildGenericMenu(menu) {

    menu.append(new this.MenuItem({
      label: 'Undo',
      role: 'undo' }));

    menu.append(new this.MenuItem({
      label: 'Redo',
      role: 'redo' }));

    menu.append(new this.MenuItem({ type: 'separator' }));
    menu.append(new this.MenuItem({
      label: 'Cut',
      role: 'cut' }));

    menu.append(new this.MenuItem({
      label: 'Copy',
      role: 'copy' }));

    menu.append(new this.MenuItem({
      label: 'Paste',
      role: 'paste' }));

    menu.append(new this.MenuItem({
      label: 'Select All',
      role: 'selectall' }));

    menu.append(new this.MenuItem({ type: 'separator' }));
  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1021:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const RUNNER_DATA_FILE_TYPE_CSV = 'text/csv';
/* harmony export (immutable) */ __webpack_exports__["a"] = RUNNER_DATA_FILE_TYPE_CSV;

const RUNNER_DATA_FILE_TYPE_JSON = 'application/json';
/* harmony export (immutable) */ __webpack_exports__["b"] = RUNNER_DATA_FILE_TYPE_JSON;

const RUNNER_DATA_FILE_TYPE_UNDETERMINED = 'Undetermined';
/* harmony export (immutable) */ __webpack_exports__["c"] = RUNNER_DATA_FILE_TYPE_UNDETERMINED;


/***/ }),

/***/ 1022:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RUNNER_SAVE_ALL_RESPONSES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return RUNNER_SAVE_FAILED_RESPONSES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return RUNNER_SAVE_NO_RESPONSES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return RUNNER_SAVE_RESPONSES_LABELS; });
const RUNNER_SAVE_ALL_RESPONSES = 'all';
const RUNNER_SAVE_FAILED_RESPONSES = 'failed';
const RUNNER_SAVE_NO_RESPONSES = 'none';

let RUNNER_SAVE_RESPONSES_LABELS = {};

RUNNER_SAVE_RESPONSES_LABELS[RUNNER_SAVE_ALL_RESPONSES] = 'For all requests';
RUNNER_SAVE_RESPONSES_LABELS[RUNNER_SAVE_FAILED_RESPONSES] = 'For failed requests';
RUNNER_SAVE_RESPONSES_LABELS[RUNNER_SAVE_NO_RESPONSES] = 'For no requests';



/***/ }),

/***/ 1023:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__uid_helper__ = __webpack_require__(90);


/**
                                              * Finds the entities that belong to a workspace
                                              * @param  {[Object]} workspace         [The workspace object]
                                              * @param  {[Array]} entities           [Array of entities to be looked through]
                                              * @param  {[String]} entityDependency  [Key for the dependency]
                                              * @return {[Array]}                    [Entities belonging to the workspace]
                                              */
const getWorkspaceEntities = (workspace, entities, entityKey) => {
  if (!workspace || !entities || !entityKey) {
    return [];
  }

  let workspaceEntities = [],
  entityDependencies = _.get(workspace, ['dependencies', entityKey]);

  if (!entityDependencies) {
    return workspaceEntities;
  }

  workspaceEntities = _.chain(entityDependencies).
  map(entity => _.find(entities, ['id', Object(__WEBPACK_IMPORTED_MODULE_0__uid_helper__["a" /* decomposeUID */])(entity).modelId])).
  compact().
  value();

  return workspaceEntities;
};
/* harmony export (immutable) */ __webpack_exports__["a"] = getWorkspaceEntities;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1024:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(169);

module.exports = Graph;

var DEFAULT_EDGE_NAME = "\x00",
    GRAPH_NODE = "\x00",
    EDGE_KEY_DELIM = "\x01";

// Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.

function Graph(opts) {
  this._isDirected = _.has(opts, "directed") ? opts.directed : true;
  this._isMultigraph = _.has(opts, "multigraph") ? opts.multigraph : false;
  this._isCompound = _.has(opts, "compound") ? opts.compound : false;

  // Label for the graph itself
  this._label = undefined;

  // Defaults to be set when creating a new node
  this._defaultNodeLabelFn = _.constant(undefined);

  // Defaults to be set when creating a new edge
  this._defaultEdgeLabelFn = _.constant(undefined);

  // v -> label
  this._nodes = {};

  if (this._isCompound) {
    // v -> parent
    this._parent = {};

    // v -> children
    this._children = {};
    this._children[GRAPH_NODE] = {};
  }

  // v -> edgeObj
  this._in = {};

  // u -> v -> Number
  this._preds = {};

  // v -> edgeObj
  this._out = {};

  // v -> w -> Number
  this._sucs = {};

  // e -> edgeObj
  this._edgeObjs = {};

  // e -> label
  this._edgeLabels = {};
}

/* Number of nodes in the graph. Should only be changed by the implementation. */
Graph.prototype._nodeCount = 0;

/* Number of edges in the graph. Should only be changed by the implementation. */
Graph.prototype._edgeCount = 0;


/* === Graph functions ========= */

Graph.prototype.isDirected = function() {
  return this._isDirected;
};

Graph.prototype.isMultigraph = function() {
  return this._isMultigraph;
};

Graph.prototype.isCompound = function() {
  return this._isCompound;
};

Graph.prototype.setGraph = function(label) {
  this._label = label;
  return this;
};

Graph.prototype.graph = function() {
  return this._label;
};


/* === Node functions ========== */

Graph.prototype.setDefaultNodeLabel = function(newDefault) {
  if (!_.isFunction(newDefault)) {
    newDefault = _.constant(newDefault);
  }
  this._defaultNodeLabelFn = newDefault;
  return this;
};

Graph.prototype.nodeCount = function() {
  return this._nodeCount;
};

Graph.prototype.nodes = function() {
  return _.keys(this._nodes);
};

Graph.prototype.sources = function() {
  var self = this;
  return _.filter(this.nodes(), function(v) {
    return _.isEmpty(self._in[v]);
  });
};

Graph.prototype.sinks = function() {
  var self = this;
  return _.filter(this.nodes(), function(v) {
    return _.isEmpty(self._out[v]);
  });
};

Graph.prototype.setNodes = function(vs, value) {
  var args = arguments;
  var self = this;
  _.each(vs, function(v) {
    if (args.length > 1) {
      self.setNode(v, value);
    } else {
      self.setNode(v);
    }
  });
  return this;
};

Graph.prototype.setNode = function(v, value) {
  if (_.has(this._nodes, v)) {
    if (arguments.length > 1) {
      this._nodes[v] = value;
    }
    return this;
  }

  this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
  if (this._isCompound) {
    this._parent[v] = GRAPH_NODE;
    this._children[v] = {};
    this._children[GRAPH_NODE][v] = true;
  }
  this._in[v] = {};
  this._preds[v] = {};
  this._out[v] = {};
  this._sucs[v] = {};
  ++this._nodeCount;
  return this;
};

Graph.prototype.node = function(v) {
  return this._nodes[v];
};

Graph.prototype.hasNode = function(v) {
  return _.has(this._nodes, v);
};

Graph.prototype.removeNode =  function(v) {
  var self = this;
  if (_.has(this._nodes, v)) {
    var removeEdge = function(e) { self.removeEdge(self._edgeObjs[e]); };
    delete this._nodes[v];
    if (this._isCompound) {
      this._removeFromParentsChildList(v);
      delete this._parent[v];
      _.each(this.children(v), function(child) {
        self.setParent(child);
      });
      delete this._children[v];
    }
    _.each(_.keys(this._in[v]), removeEdge);
    delete this._in[v];
    delete this._preds[v];
    _.each(_.keys(this._out[v]), removeEdge);
    delete this._out[v];
    delete this._sucs[v];
    --this._nodeCount;
  }
  return this;
};

Graph.prototype.setParent = function(v, parent) {
  if (!this._isCompound) {
    throw new Error("Cannot set parent in a non-compound graph");
  }

  if (_.isUndefined(parent)) {
    parent = GRAPH_NODE;
  } else {
    // Coerce parent to string
    parent += "";
    for (var ancestor = parent;
         !_.isUndefined(ancestor);
         ancestor = this.parent(ancestor)) {
      if (ancestor === v) {
        throw new Error("Setting " + parent+ " as parent of " + v +
                        " would create a cycle");
      }
    }

    this.setNode(parent);
  }

  this.setNode(v);
  this._removeFromParentsChildList(v);
  this._parent[v] = parent;
  this._children[parent][v] = true;
  return this;
};

Graph.prototype._removeFromParentsChildList = function(v) {
  delete this._children[this._parent[v]][v];
};

Graph.prototype.parent = function(v) {
  if (this._isCompound) {
    var parent = this._parent[v];
    if (parent !== GRAPH_NODE) {
      return parent;
    }
  }
};

Graph.prototype.children = function(v) {
  if (_.isUndefined(v)) {
    v = GRAPH_NODE;
  }

  if (this._isCompound) {
    var children = this._children[v];
    if (children) {
      return _.keys(children);
    }
  } else if (v === GRAPH_NODE) {
    return this.nodes();
  } else if (this.hasNode(v)) {
    return [];
  }
};

Graph.prototype.predecessors = function(v) {
  var predsV = this._preds[v];
  if (predsV) {
    return _.keys(predsV);
  }
};

Graph.prototype.successors = function(v) {
  var sucsV = this._sucs[v];
  if (sucsV) {
    return _.keys(sucsV);
  }
};

Graph.prototype.neighbors = function(v) {
  var preds = this.predecessors(v);
  if (preds) {
    return _.union(preds, this.successors(v));
  }
};

Graph.prototype.isLeaf = function (v) {
  var neighbors;
  if (this.isDirected()) {
    neighbors = this.successors(v);
  } else {
    neighbors = this.neighbors(v);
  }
  return neighbors.length === 0;
};

Graph.prototype.filterNodes = function(filter) {
  var copy = new this.constructor({
    directed: this._isDirected,
    multigraph: this._isMultigraph,
    compound: this._isCompound
  });

  copy.setGraph(this.graph());

  var self = this;
  _.each(this._nodes, function(value, v) {
    if (filter(v)) {
      copy.setNode(v, value);
    }
  });

  _.each(this._edgeObjs, function(e) {
    if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
      copy.setEdge(e, self.edge(e));
    }
  });

  var parents = {};
  function findParent(v) {
    var parent = self.parent(v);
    if (parent === undefined || copy.hasNode(parent)) {
      parents[v] = parent;
      return parent;
    } else if (parent in parents) {
      return parents[parent];
    } else {
      return findParent(parent);
    }
  }

  if (this._isCompound) {
    _.each(copy.nodes(), function(v) {
      copy.setParent(v, findParent(v));
    });
  }

  return copy;
};

/* === Edge functions ========== */

Graph.prototype.setDefaultEdgeLabel = function(newDefault) {
  if (!_.isFunction(newDefault)) {
    newDefault = _.constant(newDefault);
  }
  this._defaultEdgeLabelFn = newDefault;
  return this;
};

Graph.prototype.edgeCount = function() {
  return this._edgeCount;
};

Graph.prototype.edges = function() {
  return _.values(this._edgeObjs);
};

Graph.prototype.setPath = function(vs, value) {
  var self = this,
      args = arguments;
  _.reduce(vs, function(v, w) {
    if (args.length > 1) {
      self.setEdge(v, w, value);
    } else {
      self.setEdge(v, w);
    }
    return w;
  });
  return this;
};

/*
 * setEdge(v, w, [value, [name]])
 * setEdge({ v, w, [name] }, [value])
 */
Graph.prototype.setEdge = function() {
  var v, w, name, value,
      valueSpecified = false,
      arg0 = arguments[0];

  if (typeof arg0 === "object" && arg0 !== null && "v" in arg0) {
    v = arg0.v;
    w = arg0.w;
    name = arg0.name;
    if (arguments.length === 2) {
      value = arguments[1];
      valueSpecified = true;
    }
  } else {
    v = arg0;
    w = arguments[1];
    name = arguments[3];
    if (arguments.length > 2) {
      value = arguments[2];
      valueSpecified = true;
    }
  }

  v = "" + v;
  w = "" + w;
  if (!_.isUndefined(name)) {
    name = "" + name;
  }

  var e = edgeArgsToId(this._isDirected, v, w, name);
  if (_.has(this._edgeLabels, e)) {
    if (valueSpecified) {
      this._edgeLabels[e] = value;
    }
    return this;
  }

  if (!_.isUndefined(name) && !this._isMultigraph) {
    throw new Error("Cannot set a named edge when isMultigraph = false");
  }

  // It didn't exist, so we need to create it.
  // First ensure the nodes exist.
  this.setNode(v);
  this.setNode(w);

  this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name);

  var edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
  // Ensure we add undirected edges in a consistent way.
  v = edgeObj.v;
  w = edgeObj.w;

  Object.freeze(edgeObj);
  this._edgeObjs[e] = edgeObj;
  incrementOrInitEntry(this._preds[w], v);
  incrementOrInitEntry(this._sucs[v], w);
  this._in[w][e] = edgeObj;
  this._out[v][e] = edgeObj;
  this._edgeCount++;
  return this;
};

Graph.prototype.edge = function(v, w, name) {
  var e = (arguments.length === 1
            ? edgeObjToId(this._isDirected, arguments[0])
            : edgeArgsToId(this._isDirected, v, w, name));
  return this._edgeLabels[e];
};

Graph.prototype.hasEdge = function(v, w, name) {
  var e = (arguments.length === 1
            ? edgeObjToId(this._isDirected, arguments[0])
            : edgeArgsToId(this._isDirected, v, w, name));
  return _.has(this._edgeLabels, e);
};

Graph.prototype.removeEdge = function(v, w, name) {
  var e = (arguments.length === 1
            ? edgeObjToId(this._isDirected, arguments[0])
            : edgeArgsToId(this._isDirected, v, w, name)),
      edge = this._edgeObjs[e];
  if (edge) {
    v = edge.v;
    w = edge.w;
    delete this._edgeLabels[e];
    delete this._edgeObjs[e];
    decrementOrRemoveEntry(this._preds[w], v);
    decrementOrRemoveEntry(this._sucs[v], w);
    delete this._in[w][e];
    delete this._out[v][e];
    this._edgeCount--;
  }
  return this;
};

Graph.prototype.inEdges = function(v, u) {
  var inV = this._in[v];
  if (inV) {
    var edges = _.values(inV);
    if (!u) {
      return edges;
    }
    return _.filter(edges, function(edge) { return edge.v === u; });
  }
};

Graph.prototype.outEdges = function(v, w) {
  var outV = this._out[v];
  if (outV) {
    var edges = _.values(outV);
    if (!w) {
      return edges;
    }
    return _.filter(edges, function(edge) { return edge.w === w; });
  }
};

Graph.prototype.nodeEdges = function(v, w) {
  var inEdges = this.inEdges(v, w);
  if (inEdges) {
    return inEdges.concat(this.outEdges(v, w));
  }
};

function incrementOrInitEntry(map, k) {
  if (map[k]) {
    map[k]++;
  } else {
    map[k] = 1;
  }
}

function decrementOrRemoveEntry(map, k) {
  if (!--map[k]) { delete map[k]; }
}

function edgeArgsToId(isDirected, v_, w_, name) {
  var v = "" + v_;
  var w = "" + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM +
             (_.isUndefined(name) ? DEFAULT_EDGE_NAME : name);
}

function edgeArgsToObj(isDirected, v_, w_, name) {
  var v = "" + v_;
  var w = "" + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  var edgeObj =  { v: v, w: w };
  if (name) {
    edgeObj.name = name;
  }
  return edgeObj;
}

function edgeObjToId(isDirected, edgeObj) {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}


/***/ }),

/***/ 1025:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_httpstatuscodes__ = __webpack_require__(1037);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_controllers_EnvironmentController__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_controllers_GlobalsController__ = __webpack_require__(100);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};




const getISODate = timestamp => {
  try {
    return new Date(timestamp).toISOString();
  }
  catch (e) {
    return new Date().toISOString();
  }
};

const fetchFromState = key => {
  return pm.runnerStore.getState()[key];
};

const getCollection = id => {
  return _.find(fetchFromState('collections'), ['id', id]) || null;
};

const getFolderFromCollection = (id, collectionId) => {
  if (!id || !collectionId) {
    return null;
  }

  let folder = _.find(fetchFromState('folders'), ['id', id]) || null;
  if (folder && _.isEqual(folder.collection, collectionId)) {
    return folder;
  } else
  {
    return null;
  }
};

const getEnvironment = (id, cb) => {
  return _.find(fetchFromState('environments'), ['id', id]) || null;
};

const getGlobals = (id, cb) => {
  if (!id) {
    cb(null);
    return;
  }

  __WEBPACK_IMPORTED_MODULE_3__modules_controllers_GlobalsController__["a" /* default */].get({ workspace: id }).then(globals => {
    cb(globals);
  }).
  catch(e => {
    cb(null);
  });
};

const getTotalTime = iterations => {
  let timeToReturn;
  return _.reduce(iterations, (time, iteration) => {
    timeToReturn = 0;
    _.forEach(iteration, request => {
      if (request.response) {
        try {
          timeToReturn += parseInt(_.get(request, 'response.time', 0));
        }
        catch (e) {
          timeToReturn += 0;
        }
      }
    });
    return time + timeToReturn;
  }, 0);
};

const getRequests = (creationDate, iterations) => {
  let passIncrement,
  failIncrement;
  return _.reduce(iterations, (requests, iteration) => {
    _.forEach(iteration, request => {
      let exists = _.findIndex(requests, req => {
        return req.id === request.id;
      });

      let responseCode = request.response ? {
        code: request.response.code,
        name: request.response.name,
        detail: __WEBPACK_IMPORTED_MODULE_0__utils_httpstatuscodes__["a" /* default */][request.response.code] } :
      undefined;

      if (exists === -1) {
        requests.push({
          name: request.name,
          id: request.id,
          url: request.request.url,
          time: creationDate,
          responseCode: responseCode,
          testPassFailCounts: _.reduce(request.tests, (testPassFailCounts, test) => {
            testPassFailCounts[test.name] = {
              pass: test.status === 'pass' ? 1 : 0,
              fail: test.status === 'fail' ? 1 : 0 };

            return testPassFailCounts;
          }, {}) });

      } else
      {
        requests[exists] = _extends({},
        requests[exists], {
          time: _.get(request, 'response.time', 0),
          responseCode: responseCode,
          testPassFailCounts: _.reduce(request.tests, (testPassFailCounts, test) => {
            passIncrement = test.status === 'pass' ? 1 : 0;
            failIncrement = test.status === 'fail' ? 1 : 0;
            testPassFailCounts[test.name] = {
              pass: _.get(testPassFailCounts, `${test.name}.pass`, 0) + passIncrement,
              fail: _.get(testPassFailCounts, `${test.name}.fail`, 0) + failIncrement };

            return testPassFailCounts;
          }, requests[exists].testPassFailCounts) });

      }
    });

    return requests;
  }, []);
};

const getResults = iterations => {
  let passIncrement,
  failIncrement;
  return _.reduce(iterations, (results, iteration) => {
    _.forEach(iteration, request => {
      let exists = _.findIndex(results, req => {
        return req.id === request.id;
      });

      if (exists === -1) {
        request.response && results.push({
          name: request.name,
          id: request.id,
          url: request.request.url,
          totalTime: 0,
          responseCode: {
            code: request.response.code,
            name: request.response.name,
            detail: __WEBPACK_IMPORTED_MODULE_0__utils_httpstatuscodes__["a" /* default */][request.response.code] },

          tests: _.reduce(request.tests, (tests, test) => {
            tests[test.name] = test.status === 'pass';
            return tests;
          }, {}),
          testPassFailCounts: _.reduce(request.tests, (testPassFailCounts, test) => {
            testPassFailCounts[test.name] = {
              pass: test.status === 'pass' ? 1 : 0,
              fail: test.status === 'fail' ? 1 : 0 };

            return testPassFailCounts;
          }, {}),
          times: [_.get(request, 'response.time', 0)],
          allTests: [_.reduce(request.tests, (tests, test) => {
            tests[test.name] = test.status === 'pass';
            return tests;
          }, {})],
          time: _.get(request, 'response.time', 0),
          totalRequestTime: _.get(request, 'response.time', 0),
          iterationResults: {} });

      } else
      if (request.response) {
        results[exists] = _extends({},
        results[exists], {
          url: request.url,
          responseCode: {
            code: request.response.code,
            name: request.response.name,
            detail: __WEBPACK_IMPORTED_MODULE_0__utils_httpstatuscodes__["a" /* default */][request.response.code] },

          tests: _.reduce(request.tests, (tests, test) => {
            tests[test.name] = test.status === 'pass';
            return tests;
          }, {}),
          testPassFailCounts: _.reduce(request.tests, (testPassFailCounts, test) => {
            passIncrement = test.status === 'pass' ? 1 : 0;
            failIncrement = test.status === 'fail' ? 1 : 0;
            testPassFailCounts[test.name] = {
              pass: _.get(testPassFailCounts, `${test.name}.pass`, 0) + passIncrement,
              fail: _.get(testPassFailCounts, `${test.name}.fail`, 0) + failIncrement };

            return testPassFailCounts;
          }, results[exists].testPassFailCounts),
          times: [
          ...results[exists].times,
          _.get(request, 'response.time', 0)],

          allTests: [
          ...results[exists].allTests,
          _.reduce(request.tests, (tests, test) => {
            tests[test.name] = test.status === 'pass';
            return tests;
          }, {})],

          time: _.get(request, 'response.time', 0),
          totalRequestTime: parseInt(_.get(results[exists], 'totalRequestTime', 0)) + parseInt(_.get(request, 'response.time', 0)),
          iterationResults: {} });

      }
    });

    return results;
  }, []);
};


const getIterations = run => {
  let iterations = [],
  iteration,
  requestInCollection;

  iterations[0] = [];
  _.forEach(run.results, (request, index) => {
    requestInCollection = _.find(run.collection.requests, req => {
      return req.id === request.id;
    });

    iterations[0].push({
      id: request.id,
      ref: request.id,
      name: request.name,
      request: {
        url: request.url,
        method: requestInCollection ? requestInCollection.method : '',
        headers: requestInCollection ? requestInCollection.headers : [],
        body: requestInCollection ? requestInCollection.data : '' },

      response: {
        size: null,
        time: run.results[index].time,
        code: _.get(run, `results[${index}].responseCode.code`, ''),
        name: _.get(run, `results[${index}].responseCode.name`, ''),
        headers: [],
        body: 'Response body unavailable' },

      tests: _.reduce(request.tests, (tests, test, name) => {
        tests.push({
          name: name,
          status: test ? 'pass' : 'fail',
          passCount: request.testPassFailCounts[name].pass,
          failCount: request.testPassFailCounts[name].fail });

        return tests;
      }, []) });

  });

  return iterations;
};

const getActiveWorkspace = () => {
  return fetchFromState('selection').workspace.id;
};

const BackboneToRedux = run => {
  return {
    [run.id]: {
      id: run.id,
      name: run.name,
      error: false,
      status: 'finished',
      target: {
        collection: run.collection_id,
        folder: run.folder_id },

      createdAt: getISODate(run.timestamp),
      environment: run.environment_id === '0' ? null : run.environment_id,
      persist: true,
      failedTestCount: run.totalFail,
      totalTestCount: run.totalPass + run.totalFail,
      iterations: getIterations(run),
      currentIteration: run.count,
      workspace: getActiveWorkspace(),
      collection: run.collection_id,

      // Current user becomes the owner of the imported run
      owner: pm.runnerStore.getState().user.id } };


};
/* harmony export (immutable) */ __webpack_exports__["a"] = BackboneToRedux;


const ReduxToBackbone = (runId, run, cb) => {
  /* Convert Redux state to Backbone model for exporting */
  let collection = getCollection(run.target.collection),
  environment = getEnvironment(run.environment),
  folder = getFolderFromCollection(run.target.folder, _.get(collection, 'id'));

  getGlobals(getActiveWorkspace(), globals => {
    let data = run.data || [],
    iterations = _.keys(run.iterations).length,
    exportRun = {
      id: runId,
      name: run.name,
      allTests: [],
      timestamp: getISODate(run.createdAt),
      collection_id: run.target.collection,
      folder_id: run.target.folder ? run.target.folder : 0,
      target_type: run.target.folder ? 'folder' : 'collection',
      environment_id: environment ? environment.id : '0',
      data: data,
      delay: run.delay,
      count: iterations,
      collection: collection,
      folder: folder,
      environment: null, // environment,
      globals: globals ? globals.values : [],
      results: getResults(run.iterations),
      totalPass: run.totalTestCount - run.failedTestCount,
      totalFail: run.failedTestCount,
      totalTime: getTotalTime(run.iterations),
      lifecycle: 'done',
      requests: getRequests(run.createdAt, run.iterations),
      synced: false };

    cb(null, exportRun);
  });
};
/* harmony export (immutable) */ __webpack_exports__["b"] = ReduxToBackbone;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1038:
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(1654),
    isObjectLike = __webpack_require__(89);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),

/***/ 1039:
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(1054),
    eq = __webpack_require__(399);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),

/***/ 1042:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return flattenCollection; });
/* unused harmony export flattenCollections */
/* unused harmony export computeVisibility */
/* unused harmony export getParents */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getNodePath; });
/* unused harmony export getAllToggleableNodes */
/**
 * Denormalize folder children
 * @param  {string} folderId          folder id
 * @param  {Array} options.requests   all requests in collection
 * @param  {Array} options.folders    all folders in collection
 * @return {Object}                   denormalized folder object
 */

/**
     * Denormalize request children
     * @param  {string} requestId         request id
     * @param  {Array} options.requests   all requests in collection
     * @return {Object}                   denormalized folder object
     */

/**
         * Denormalize node children
         * @param  {string} folderId          folder id
         * @param  {Array} options.requests   all requests in collection
         * @param  {Array} options.folders    all folders in collection
         * @return {Object}                   denormalized folder object
         */

/**
             * Denormalize collection children
             * @param  {object} collection collection in v1 format
             * @return {object}            denormalized collection
             */

/** =========================================================================**/
/*
                                                                                   FLATTENING UTILS
                                                                                  */

/**
                                                                                      * Deep flatten a node in denormalized collection
                                                                                      * @param  {Object} node node in denormalized collection tree
                                                                                      * @param  {number} depth depth of node (default: 0)
                                                                                      * @return {Array}       deep flattened node
                                                                                      */
// function flattenNode (node, depth) {
function flattenNode(flattened, node, depth, map) {
  // let flattenedNode = _.omit(node, ['children']),
  //     nodeDepth = depth || 0,
  //     flattenedChildren = _.flatMap(node.children, (childNode) => {
  //       return flattenNode(childNode, nodeDepth + 1);
  //     });

  // flattenedNode.endOffset = _.size(flattenedChildren);
  // flattenedNode.depth = nodeDepth;

  // // TODO: add parent and child offsets

  // return _.concat(flattenedNode, flattenedChildren);

  // console.log('flattening', node)

  if (!node) {
    return flattened;
  }

  // node.endOffset = _.size(node.folders_order) + _.size(node.order)
  flattened.push(node);

  _.each(node.folders_order, folderId => {
    let folder = _.find(map.folders, ['id', folderId]);
    if (folder) {
      folder.type = 'folder';
      folder.depth = depth + 1;
      flattenNode(flattened, folder, depth + 1, map);
    }
  });

  _.each(node.order, requestId => {
    let request = _.find(map.requests, ['id', requestId]);
    if (request) {
      request.type = 'request';
      request.depth = depth + 1;
      flattened.push(request);
    }
  });

  return flattened;
}

/**
   * marks all children as (in)visible
   * @param  {Array}  visibilityMap visibilityMap
   * @param  {Array}  flatTree      flattened tree
   * @param  {Array}  openNodes     ids of open items
   * @param  {number}  nodeIdx      index of node in flattened tree
   * @param  {Boolean} isVisible    boolean for flagging (in)visible
   * @param  {Boolean} deep         deep
   * @return {undefined}            no return value. visibilityMap is mutated
   */
function _markChildrenVisibility(visibilityMap, flatTree, openNodes, nodeIdx, isVisible, deep) {
  let node = flatTree[nodeIdx],
  idx = nodeIdx + 1,
  endIdx = _.findIndex(flatTree, n => {return n.depth <= node.depth;}, idx + 1); // nodeIdx + node.endOffset + 1;

  if (endIdx === -1) {
    endIdx = _.size(flatTree);
  }

  // if deep, mark the whole subtree
  if (deep) {
    while (idx < endIdx) {
      let itemNode = flatTree[idx];

      visibilityMap[idx] = isVisible;

      // fast forward to next subtree
      if (_isNodeToggleable(itemNode) && !_isNodeOpen(itemNode, openNodes)) {
        let endOffset = _.findIndex(flatTree, n => {return n.depth <= itemNode.depth;}, idx + 1);
        if (endOffset === -1) {
          endOffset = _.size(flatTree) - idx;
        }
        idx += endOffset; // itemNode.endOffset;
      }

      ++idx;
    }

    return;
  }

  let nodeDepth = node.depth,
  immediateChildDepth = nodeDepth + 1;

  // loop from immediate child to start of next subtree
  while (idx < endIdx) {
    let itemNode = flatTree[idx],
    itemNodeDepth = itemNode.depth;

    if (itemNodeDepth <= nodeDepth) {
      break;
    }

    if (itemNodeDepth === immediateChildDepth) {
      visibilityMap[idx] = isVisible;
    }

    ++idx;
  }

  return;
}

/**
  * marks all parents as (in)visible
  * @param  {Array}  visibilityMap visibilityMap
  * @param  {Array}  flatTree      flattened tree
  * @param  {number}  nodeIdx      index of node in flattened tree
  * @param  {Boolean} isVisible    boolean for flagging (in)visible
  * @return {undefined}            no return value. visibilityMap is mutated
   */
function _markParentVisibility(visibilityMap, flatTree, nodeIdx, isVisible) {
  let node = flatTree[nodeIdx],
  nodeDepth = node.depth,
  idx = nodeIdx - 1,
  parentDepth = nodeDepth - 1;

  while (idx > -1) {
    let tmpNode = flatTree[idx],
    tmpNodeDepth = tmpNode.depth;
    if (tmpNodeDepth <= parentDepth) {
      visibilityMap[idx] = isVisible;
      --parentDepth;
    }
    --idx;
  }
}

/**
   * get parent items
   * @param  {Array} flatTree flattened tree
   * @param  {Object} nodeIdx index in flattened tree
   * @return {Array}          array of parent nodes
   */
function getParents(flatTree, nodeIdx) {
  let node = flatTree[nodeIdx],
  nodeDepth = node.depth,
  parents = [],
  idx = nodeIdx - 1,
  parentDepth = nodeDepth - 1;

  while (idx > -1) {
    let tmpNode = flatTree[idx],
    tmpNodeDepth = tmpNode.depth;
    if (tmpNodeDepth <= parentDepth) {
      parents.push(flatTree[idx]);
      --parentDepth;
    }
    --idx;
  }

  return parents;
}

/**
   * Get path for the item
   * @param  {Array} flatTree flattened tree
   * @param  {Object} node    node
   * @return {string}         path
   */
function getNodePath(flatTree, node) {

  let nodeIdx = _.findIndex(flatTree, ['id', node.id]);

  if (nodeIdx === -1) {
    return '';
  }

  let parents = getParents(flatTree, nodeIdx),
  pathItems = _.concat([node], parents);


  return _.chain(pathItems).
  reverse().
  map('name').
  join(' / ').
  value();
}

/**
   * check if the node is open
   * @param  {Object}  node      node in flattened tree
   * @param  {Array}  openNodes  ids of open nodes
   * @return {Boolean}           whether node is open
   */
function _isNodeOpen(node, openNodes) {
  return openNodes.get(node.id);

  // return _.includes(openNodes, node.id);
}

/**
   * check if node is toggled
   * @param  {Object}  node node in flattened tree
   * @return {Boolean}      whether node is toggleable
   */
function _isNodeToggleable(node) {
  return _.includes(['collection', 'folder'], node.type);
}

/**
   * returns id of all toggleable nodes
   * @param  {Array} flatTree flattened tree
   * @return {Array}          ids of toggleable nodes
   */
function getAllToggleableNodes(flatTree) {
  return _.chain(flatTree).
  filter(_isNodeToggleable).
  map('id').
  value();
}

/**
   * computes visibility map
   * @param  {Array} flatCollection flattened collection
   * @param  {Array} openNodes      array of open node ids
   * @param  {string} filterQuery    search filter
   * @return {Array}                visibility map
   */
function computeVisibility(flatCollection, openNodes, filterQuery) {
  let visibilityMap = new Array(_.size(flatCollection));
  _.fill(visibilityMap, false);
  visibilityMap[0] = true;

  _.each(flatCollection, (node, index) => {
    if (_isNodeToggleable(node) && _isNodeOpen(node, openNodes)) {
      // find the next sibling
      let endIndex = _.findIndex(flatCollection, n => n.depth <= node.depth, index + 1);
      if (endIndex === -1) {
        endIndex = _.size(flatCollection);
      }

      visibilityMap[index] = true;
      _.each(new Array(endIndex - index), (n, i) => {
        if (flatCollection[index + i].depth === node.depth + 1) {
          visibilityMap[index + i] = true;
        }
      });
    }
  });

  return visibilityMap;
}

/**
   * computes visibility map
   * @param  {Array} flatCollection flattened collection
   * @param  {Array} openNodes      array of open node ids
   * @param  {string} filterQuery    search filter
   * @return {Array}                visibility map
   */
function _computeVisibilityQuery(flatCollection, openNodes, filterQuery) {
  let lowerFilterQuery = _.toLower(filterQuery),
  matchingNodes = new Array(_.size(flatCollection)),
  visibilityMap = new Array(_.size(flatCollection));

  _.fill(matchingNodes, false);
  _.fill(visibilityMap, false);

  _.forEach(flatCollection, (flatNode, itemIdx) => {
    let lowerItemName = _.toLower(flatNode.name);

    // if not matching, flag as not visible
    if (!_.includes(lowerItemName, lowerFilterQuery)) {
      return;
    }

    matchingNodes[itemIdx] = true;
  });

  let matchIdx = 0,
  endMatchIdx = matchingNodes.length;

  while (matchIdx < endMatchIdx) {
    if (!matchingNodes[matchIdx]) {
      ++matchIdx;
      continue; // eslint-disable-line no-continue
    }

    let matchNode = flatCollection[matchIdx];

    // mark node as visible
    visibilityMap[matchIdx] = true;

    // if toggleable node, deep mark subtree and fast forward
    if (_isNodeToggleable(matchNode) && _isNodeOpen(matchNode, openNodes)) {
      _markChildrenVisibility(visibilityMap, flatCollection, openNodes, matchIdx, true, true);
      matchIdx += matchNode.endOffset;
    }

    // mark parent chain
    _markParentVisibility(visibilityMap, flatCollection, matchIdx, true);

    ++matchIdx;
  }

  let idx = 0,
  length = flatCollection.length;

  while (idx < length) {
    let node = flatCollection[idx];

    if (_isNodeToggleable(node)) {
      // if toggleable node, and is not open, deep mark subtree and fast forward
      if (visibilityMap[idx] && !_isNodeOpen(node, openNodes)) {
        _markChildrenVisibility(visibilityMap, flatCollection, openNodes, idx, false, true);
        let endIdx = _.findIndex(flatCollection, n => {return n.depth <= node.depth;}, idx + 1);
        if (endIdx === -1) {
          endIdx = _.size(flatCollection) - idx;
        }
        idx += endIdx;
      }
    }

    ++idx;
  }

  return visibilityMap;
}

/**
   * Deep flattens a collection
   * @param  {Object} collection collection in v1 format
   * @return {Array}             flattened collection
   */
function flattenCollection(collection, folders = [], requests = []) {
  // let denormalized = denormalizeCollection(collection);
  // return flattenNode(denormalized);
  collection.type = 'collection';
  collection.depth = 0;
  return flattenNode([], collection, 0, { folders, requests });
}

/**
   * Flattens list of collections
   * @param  {Array} collections              Array of v1 collections
   * @param  {Array} options.openCollections  Array of ids of open collections
   * @param  {Array} options.openFolders      Array of ids of open folders
   * @return {Array}                          Flattened collections
   */
function flattenCollections(collections) {
  return _.chain(collections).
  sortBy(collection => {
    return collection.get('name');
  }).
  map(collection => {
    return flattenCollection(collection.toJSON());
  }).
  value();
}


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1043:
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(1044),
    toKey = __webpack_require__(583);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),

/***/ 1044:
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(52),
    isKey = __webpack_require__(723),
    stringToPath = __webpack_require__(1643),
    toString = __webpack_require__(1645);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),

/***/ 1045:
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(600),
    arraySome = __webpack_require__(1655),
    cacheHas = __webpack_require__(601);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),

/***/ 1046:
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(109);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ 1047:
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(1048),
    getSymbols = __webpack_require__(725),
    keys = __webpack_require__(153);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ 1048:
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(729),
    isArray = __webpack_require__(52);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ 1049:
/***/ (function(module, exports) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ 1050:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(110);

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;


/***/ }),

/***/ 1051:
/***/ (function(module, exports) {

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;


/***/ }),

/***/ 1052:
/***/ (function(module, exports) {

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;


/***/ }),

/***/ 1053:
/***/ (function(module, exports, __webpack_require__) {

var baseFor = __webpack_require__(1669),
    keys = __webpack_require__(153);

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;


/***/ }),

/***/ 1054:
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(1070);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),

/***/ 1055:
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(729),
    getPrototype = __webpack_require__(590),
    getSymbols = __webpack_require__(725),
    stubArray = __webpack_require__(1049);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),

/***/ 1062:
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(1044),
    isArguments = __webpack_require__(239),
    isArray = __webpack_require__(52),
    isIndex = __webpack_require__(307),
    isLength = __webpack_require__(214),
    toKey = __webpack_require__(583);

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),

/***/ 1063:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(110);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),

/***/ 15:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 1563:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const RUNNER_TAB_RUNS = 'runner';
/* harmony export (immutable) */ __webpack_exports__["b"] = RUNNER_TAB_RUNS;

const RUNNER_TAB_RESULTS = 'results';
/* harmony export (immutable) */ __webpack_exports__["a"] = RUNNER_TAB_RESULTS;

const RUNNER_TAB_SUMMARY = 'summary';
/* harmony export (immutable) */ __webpack_exports__["c"] = RUNNER_TAB_SUMMARY;


/***/ }),

/***/ 1564:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerResultsHeader; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_Dropdowns__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Icons_RightSolidIcon__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__postman_date_helper__ = __webpack_require__(577);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__postman_date_helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__postman_date_helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_PluralizeHelper__ = __webpack_require__(1026);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__base_RadialProgress__ = __webpack_require__(3614);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modules_services_AnalyticsService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_uid_helper__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__utils_GetWorkspaceEntities__ = __webpack_require__(1023);
var _class;









let


RunnerResultsHeader = __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default()(_class = class RunnerResultsHeader extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = { time: 0 };

    this.updateTime = this.updateTime.bind(this);
    this.handleOpenSummary = this.handleOpenSummary.bind(this);
  }

  componentDidMount() {
    this.updateTime();
    this.timeInterval = setInterval(this.updateTime, 60000);
  }

  updateTime() {
    let run = this.props.run;
    this.setState({ time: __WEBPACK_IMPORTED_MODULE_5__postman_date_helper___default.a.getFormattedDateAndTime(run.createdAt) });
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  getCollection(id) {
    return _.find(this.props.collections, ['id', id]);
  }

  getEnvironmentName(id) {
    let environment = _.find(this.props.environments, ['id', id]);
    if (!environment) {
      return 'No Environment';
    }
    return environment.name;
  }

  isError(iteration) {
    return _.some(iteration, request => {
      return request.error;
    });
  }

  isRetryable() {
    let run = this.props.run,
    collection = false,
    folder = true,
    environment = true;

    if (!run) {
      return false;
    }

    if (!this.props.activeWorkspace) {
      return false;
    }

    let targetCollection = _.get(run, 'target.collection');
    if (_.isEmpty(targetCollection)) {
      return false;
    }

    let collections = Object(__WEBPACK_IMPORTED_MODULE_10__utils_GetWorkspaceEntities__["a" /* getWorkspaceEntities */])(this.props.activeWorkspace, this.props.collections, 'collections');

    if (!collections) {
      return false;
    }

    collection = _.some(collections, ['id', targetCollection]);

    if (!collection) {
      return false;
    }

    let targetFolder = _.get(run, 'target.folder');
    if (!_.isEmpty(targetFolder)) {
      folder = _.some(this.props.folders, folder => {
        return folder.id === targetFolder && folder.collection === targetCollection;
      });

      if (!folder) {
        return false;
      }
    }

    if (run.environment) {
      let environments = Object(__WEBPACK_IMPORTED_MODULE_10__utils_GetWorkspaceEntities__["a" /* getWorkspaceEntities */])(this.props.activeWorkspace, this.props.environments, 'environments');
      environment = _.some(environments, ['id', run.environment]);

      if (!environment) {
        return false;
      }
    }

    return true;
  }

  getProgress() {
    let run = this.props.run,
    collection = _.get(run, 'target.collection'),
    requests = _.filter(this.props.requests, ['collection', collection]),
    requestCount = _.size(requests);

    if (requestCount === 0) {
      return 0;
    }

    let iterationCount = run.iterations.length,
    total = requestCount * iterationCount,
    doneIterations = run.currentIteration,
    doneRequestsInIteration = _.get(run, ['iterations', run.currentIteration, 'length'], 0),
    done = doneIterations * requestCount + doneRequestsInIteration;

    if (done >= total) {
      total += done - total + 1;
    }
    return Math.min(Math.floor(done / total * 100), 100);
  }

  getProgressText(value) {
    if (value < 1000) {
      return value;
    }
    return (value / 1000).toPrecision(3) + 'K';
  }

  handleOpenSummary() {
    __WEBPACK_IMPORTED_MODULE_8__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'stats');
    this.props.onOpenSummary && this.props.onOpenSummary();
  }

  render() {
    const run = this.props.run;

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__header' },

        _.includes(['running', 'paused', 'stopping'], run.status) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__base_RadialProgress__["a" /* default */], {
          borderWidth: 3,
          className: 'runner-results__header__progress',
          progress: this.getProgress(),
          radius: 30 }),




        _.includes(['finished', 'stopped'], run.status) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__header__passed-wrapper' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__header__passed' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__header__passed-count' },
              this.getProgressText(run.totalTestCount - run.failedTestCount)), 'PASSED')),







        _.includes(['finished', 'stopped'], run.status) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__header__failed-wrapper' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__header__failed' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__header__failed-count' },
              this.getProgressText(run.failedTestCount)), 'FAILED')),






        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__meta' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__meta__name-iter' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__meta__name' },
              run.name),



            _.includes(['running', 'stopping'], run.status) &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__meta__iterations' }, 'Running ',

              run.iterations.length + (run.iterations.length === 1 ? ' iteration' : ' iterations'), '...'),




            run.status === 'paused' &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__meta__iterations' }, 'Paused'),





            _.includes(['finished', 'stopped'], run.status) &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__meta__iterations' },
              __WEBPACK_IMPORTED_MODULE_5__postman_date_helper___default.a.getFormattedTime(run.createdAt))),




          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__meta__environment' },

            this.getEnvironmentName(run.environment))),




        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__actions' },

          _.includes(['running', 'paused'], run.status) &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Buttons__["a" /* Button */], {
              className: 'runner-results__action--abort',
              type: 'secondary',
              onClick: this.props.onRunAction.bind(this, 'stop') }, 'Stop Run'),





          _.includes(['stopping'], run.status) &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Buttons__["a" /* Button */], {
              className: 'runner-results__action--abort',
              type: 'secondary' }, 'Stopping...'),





          _.includes(['running', 'stopping'], run.status) &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Buttons__["a" /* Button */], {
              className: 'runner-results__action--pause',
              type: 'secondary',
              onClick: this.props.onRunAction.bind(this, 'pause'),
              disabled: _.includes(['stopping'], run.status) }, 'Pause'),






          _.includes(['paused'], run.status) &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Buttons__["a" /* Button */], {
              className: 'runner-results__action--resume',
              type: 'secondary',
              onClick: this.props.onRunAction.bind(this, 'resume') }, 'Resume'),






          _.includes(['finished', 'stopped'], run.status) &&
          !this.isError(run.iterations) &&
          this.props.showSummaryLink &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Buttons__["a" /* Button */], {
              className: 'runner-results__summary-link',
              size: 'large',
              type: 'primary',
              onClick: this.handleOpenSummary }, 'Run Summary ',

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Icons_RightSolidIcon__["a" /* default */], { className: 'runner-results__forward-icon', style: 'primary' })),



          _.includes(['finished', 'stopped'], run.status) &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Buttons__["a" /* Button */], {
              className: 'runner-results__action--export',
              type: 'secondary',
              onClick: this.props.onExport.bind(this, this.props.run.id) }, 'Export Results'),





          _.includes(['finished', 'stopped'], run.status) &&
          this.isRetryable() &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Buttons__["a" /* Button */], {
              className: 'runner-results__action--retry',
              type: 'secondary',
              onClick: this.props.onRunAction.bind(this, 'retry') }, 'Retry'),





          _.includes(['finished', 'stopped'], run.status) &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Buttons__["a" /* Button */], {
              className: 'runner-results__action--new',
              type: 'secondary',
              onClick: this.props.onNewRun.bind(this) }, 'New'))));







  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1565:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerResultsSidebar; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_classnames__);
var _class;

let


RunnerResultsSidebar = __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default()(_class = class RunnerResultsSidebar extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  getTabClasses(tab) {
    return __WEBPACK_IMPORTED_MODULE_2_classnames___default()({
      'runner-results__sidebar__all': tab === 'all',
      'runner-results__sidebar__passed': tab === 'pass',
      'runner-results__sidebar__failed': tab === 'fail',
      'is-selected': this.props.selectedFilter === tab });

  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__sidebar' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: this.getTabClasses('all'),
            onClick: this.props.onFilterChange.bind(this, 'all') },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'passed' }),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'failed' })),



        this.props.status !== 'running' &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: this.getTabClasses('pass'),
            onClick: this.props.onFilterChange.bind(this, 'pass') },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'passed' })),



        this.props.status !== 'running' &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: this.getTabClasses('fail'),
            onClick: this.props.onFilterChange.bind(this, 'fail') },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'failed' }))));




  }}) || _class;

/***/ }),

/***/ 1566:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return List; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_util__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_prop_types__);



let

List = class List extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor() {
    super();

    this.state = {
      height: 0,
      actualStart: 0,
      startItem: 0,
      actualEnd: 0,
      endItem: 0 };


    this.handleScroll = this.handleScroll.bind(this);
    this.averageHeight = 0;
  }

  componentWillMount() {
    this.setDimensions();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.startItem !== this.state.startItem) {
      this.props.onItemRender && this.props.onItemRender(nextState.startItem, nextState.endItem);
    }

    let me = this.refs.list;
    this.shouldScroll = me.scrollTop + me.offsetHeight === me.scrollHeight;
  }

  componentDidUpdate(prevProps) {
    if (this.shouldScroll && this.props.autoScroll && !_.isEqual(this.props.list, prevProps.list)) {
      this.handleScroll();
    }
  }

  getClasses() {
    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'pm-list': true,
      [`${this.props.className}`]: true });

  }

  setDimensions() {
    this.setState({ height: this.props.height }, this.handleScroll);
  }

  _scrollAnimated(scrollStart, scrollEnd) {
    let me = this.refs.list,
    currentTime = 0,
    step,
    distance,
    duration = 1000,
    increment = 0;

    if (scrollStart < scrollEnd) {
      distance = scrollEnd - scrollStart;
      step = () => {
        currentTime += 1;
        increment = __WEBPACK_IMPORTED_MODULE_2__utils_util__["a" /* default */].easeInOutQuad(currentTime, 0, distance, duration) * distance;
        if (me.scrollTop + increment >= scrollEnd) {
          me.scrollTop = scrollEnd + (scrollEnd ? 10 : 0); // TODO:: Hack. fix this later
          this.handleScroll({ target: { scrollTop: scrollEnd } });
          return;
        }
        me.scrollTop += increment;
        this.handleScroll({ target: { scrollTop: me.scrollTop + increment } });
        window.requestAnimationFrame(step);
      };

      window.requestAnimationFrame(step);
    } else
    {
      distance = scrollStart - scrollEnd;
      step = () => {
        currentTime += 1;
        increment = __WEBPACK_IMPORTED_MODULE_2__utils_util__["a" /* default */].easeInOutQuad(currentTime, 0, distance, duration) * distance;
        if (me.scrollTop - increment <= scrollEnd) {
          me.scrollTop = scrollEnd + (scrollEnd ? 10 : 0); // TODO:: Hack. fix this later
          this.handleScroll({ target: { scrollTop: scrollEnd } });
          return;
        }
        me.scrollTop -= increment;
        this.handleScroll({ target: { scrollTop: me.scrollTop - increment } });
        window.requestAnimationFrame(step);
      };
    }

    window.requestAnimationFrame(step);
  }

  scroll({ itemIndex, scrollPosition }) {
    let endScroll,
    me = this.refs.list;

    endScroll = _.isUndefined(scrollPosition) ?
    _.reduce(_.range(0, itemIndex), (total, index) => {
      return total + this.props.listItemHeights[index];
    }, 0) :
    scrollPosition;

    if (this.props.animateScroll) {
      this._scrollAnimated(me.scrollTop, endScroll);
    } else
    {
      me.scrollTop = endScroll;
      this.handleScroll({ target: { scrollTop: endScroll } });
    }
  }

  handleScroll(e) {
    let {
      list,
      listItemHeights,
      height } =
    this.props;

    let scrollPosition = _.get(e, ['target', 'scrollTop'], 0),
    totalHeight = 0,
    firstVisibleListItem,
    lastVisibleListItem;

    _.some(list, (listItem, index) => {
      totalHeight += listItemHeights[index];

      if (totalHeight > scrollPosition) {
        firstVisibleListItem = _.isUndefined(firstVisibleListItem) ? index : firstVisibleListItem;
        if (totalHeight > this.props.height + scrollPosition) {
          lastVisibleListItem = index + 1;
          return true;
        }
      }
      return false;
    });

    // Buffers
    let averageItemHeight = _.max(_.slice(listItemHeights, firstVisibleListItem, lastVisibleListItem)) || this.props.height,
    bufferHeight = this.props.height * 0.5;

    firstVisibleListItem = _.isUndefined(firstVisibleListItem) ? 0 : firstVisibleListItem;
    lastVisibleListItem = _.isUndefined(lastVisibleListItem) ? firstVisibleListItem + Math.ceil(height / averageItemHeight) : lastVisibleListItem;

    let actualStart = Math.max(firstVisibleListItem - Math.ceil(bufferHeight / averageItemHeight), 0),
    actualEnd = Math.min(lastVisibleListItem + Math.ceil(bufferHeight / averageItemHeight), list.length);

    this.setState({
      actualStart: actualStart,
      startItem: firstVisibleListItem,
      actualEnd: actualEnd,
      endItem: lastVisibleListItem });

  }

  getPlaceholderHeights() {
    // These are the cumulative heights of the buffers at the top and bottom
    return {
      top: _.reduce(_.range(0, this.state.actualStart), (total, index) => {
        return total + this.props.listItemHeights[index];
      }, 0) || 0,
      bottom: _.reduce(_.range(this.state.actualEnd, this.props.list.length), (total, index) => {
        return total + this.props.listItemHeights[index];
      }, 0) || 0 // this.props.list.length
    };
  }

  render() {
    let placeholderHeights = this.getPlaceholderHeights();

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
          'data-iter': this.props['data-iter'],
          className: this.getClasses(),
          style: { height: this.props.height },
          ref: 'list',
          onScroll: this.handleScroll },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
          className: 'buffer-top',
          style: { height: placeholderHeights.top } }),


        _.map(_.range(this.state.actualStart, this.state.actualEnd), index => {
          return this.props.listItemTemplate(this.props.list[index], index);
        }),

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
          className: 'buffer-bottom',
          style: { height: placeholderHeights.bottom } })));



  }};


List.propTypes = {
  animateScroll: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.bool,
  autoScroll: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.bool,
  height: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.number.isRequired,
  list: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.array.isRequired,
  listItemTemplate: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.func.isRequired,
  listItemHeights: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.array.isRequired,
  onItemRender: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.func };
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1567:
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(169),
    PriorityQueue = __webpack_require__(1568);

module.exports = dijkstra;

var DEFAULT_WEIGHT_FUNC = _.constant(1);

function dijkstra(g, source, weightFn, edgeFn) {
  return runDijkstra(g, String(source),
                     weightFn || DEFAULT_WEIGHT_FUNC,
                     edgeFn || function(v) { return g.outEdges(v); });
}

function runDijkstra(g, source, weightFn, edgeFn) {
  var results = {},
      pq = new PriorityQueue(),
      v, vEntry;

  var updateNeighbors = function(edge) {
    var w = edge.v !== v ? edge.v : edge.w,
        wEntry = results[w],
        weight = weightFn(edge),
        distance = vEntry.distance + weight;

    if (weight < 0) {
      throw new Error("dijkstra does not allow negative edge weights. " +
                      "Bad edge: " + edge + " Weight: " + weight);
    }

    if (distance < wEntry.distance) {
      wEntry.distance = distance;
      wEntry.predecessor = v;
      pq.decrease(w, distance);
    }
  };

  g.nodes().forEach(function(v) {
    var distance = v === source ? 0 : Number.POSITIVE_INFINITY;
    results[v] = { distance: distance };
    pq.add(v, distance);
  });

  while (pq.size() > 0) {
    v = pq.removeMin();
    vEntry = results[v];
    if (vEntry.distance === Number.POSITIVE_INFINITY) {
      break;
    }

    edgeFn(v).forEach(updateNeighbors);
  }

  return results;
}


/***/ }),

/***/ 1568:
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(169);

module.exports = PriorityQueue;

/**
 * A min-priority queue data structure. This algorithm is derived from Cormen,
 * et al., "Introduction to Algorithms". The basic idea of a min-priority
 * queue is that you can efficiently (in O(1) time) get the smallest key in
 * the queue. Adding and removing elements takes O(log n) time. A key can
 * have its priority decreased in O(log n) time.
 */
function PriorityQueue() {
  this._arr = [];
  this._keyIndices = {};
}

/**
 * Returns the number of elements in the queue. Takes `O(1)` time.
 */
PriorityQueue.prototype.size = function() {
  return this._arr.length;
};

/**
 * Returns the keys that are in the queue. Takes `O(n)` time.
 */
PriorityQueue.prototype.keys = function() {
  return this._arr.map(function(x) { return x.key; });
};

/**
 * Returns `true` if **key** is in the queue and `false` if not.
 */
PriorityQueue.prototype.has = function(key) {
  return _.has(this._keyIndices, key);
};

/**
 * Returns the priority for **key**. If **key** is not present in the queue
 * then this function returns `undefined`. Takes `O(1)` time.
 *
 * @param {Object} key
 */
PriorityQueue.prototype.priority = function(key) {
  var index = this._keyIndices[key];
  if (index !== undefined) {
    return this._arr[index].priority;
  }
};

/**
 * Returns the key for the minimum element in this queue. If the queue is
 * empty this function throws an Error. Takes `O(1)` time.
 */
PriorityQueue.prototype.min = function() {
  if (this.size() === 0) {
    throw new Error("Queue underflow");
  }
  return this._arr[0].key;
};

/**
 * Inserts a new key into the priority queue. If the key already exists in
 * the queue this function returns `false`; otherwise it will return `true`.
 * Takes `O(n)` time.
 *
 * @param {Object} key the key to add
 * @param {Number} priority the initial priority for the key
 */
PriorityQueue.prototype.add = function(key, priority) {
  var keyIndices = this._keyIndices;
  key = String(key);
  if (!_.has(keyIndices, key)) {
    var arr = this._arr;
    var index = arr.length;
    keyIndices[key] = index;
    arr.push({key: key, priority: priority});
    this._decrease(index);
    return true;
  }
  return false;
};

/**
 * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
 */
PriorityQueue.prototype.removeMin = function() {
  this._swap(0, this._arr.length - 1);
  var min = this._arr.pop();
  delete this._keyIndices[min.key];
  this._heapify(0);
  return min.key;
};

/**
 * Decreases the priority for **key** to **priority**. If the new priority is
 * greater than the previous priority, this function will throw an Error.
 *
 * @param {Object} key the key for which to raise priority
 * @param {Number} priority the new priority for the key
 */
PriorityQueue.prototype.decrease = function(key, priority) {
  var index = this._keyIndices[key];
  if (priority > this._arr[index].priority) {
    throw new Error("New priority is greater than current priority. " +
        "Key: " + key + " Old: " + this._arr[index].priority + " New: " + priority);
  }
  this._arr[index].priority = priority;
  this._decrease(index);
};

PriorityQueue.prototype._heapify = function(i) {
  var arr = this._arr;
  var l = 2 * i,
      r = l + 1,
      largest = i;
  if (l < arr.length) {
    largest = arr[l].priority < arr[largest].priority ? l : largest;
    if (r < arr.length) {
      largest = arr[r].priority < arr[largest].priority ? r : largest;
    }
    if (largest !== i) {
      this._swap(i, largest);
      this._heapify(largest);
    }
  }
};

PriorityQueue.prototype._decrease = function(index) {
  var arr = this._arr;
  var priority = arr[index].priority;
  var parent;
  while (index !== 0) {
    parent = index >> 1;
    if (arr[parent].priority < priority) {
      break;
    }
    this._swap(index, parent);
    index = parent;
  }
};

PriorityQueue.prototype._swap = function(i, j) {
  var arr = this._arr;
  var keyIndices = this._keyIndices;
  var origArrI = arr[i];
  var origArrJ = arr[j];
  arr[i] = origArrJ;
  arr[j] = origArrI;
  keyIndices[origArrJ.key] = i;
  keyIndices[origArrI.key] = j;
};


/***/ }),

/***/ 1569:
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(169);

module.exports = tarjan;

function tarjan(g) {
  var index = 0,
      stack = [],
      visited = {}, // node id -> { onStack, lowlink, index }
      results = [];

  function dfs(v) {
    var entry = visited[v] = {
      onStack: true,
      lowlink: index,
      index: index++
    };
    stack.push(v);

    g.successors(v).forEach(function(w) {
      if (!_.has(visited, w)) {
        dfs(w);
        entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink);
      } else if (visited[w].onStack) {
        entry.lowlink = Math.min(entry.lowlink, visited[w].index);
      }
    });

    if (entry.lowlink === entry.index) {
      var cmpt = [],
          w;
      do {
        w = stack.pop();
        visited[w].onStack = false;
        cmpt.push(w);
      } while (v !== w);
      results.push(cmpt);
    }
  }

  g.nodes().forEach(function(v) {
    if (!_.has(visited, v)) {
      dfs(v);
    }
  });

  return results;
}


/***/ }),

/***/ 1570:
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(169);

module.exports = topsort;
topsort.CycleException = CycleException;

function topsort(g) {
  var visited = {},
      stack = {},
      results = [];

  function visit(node) {
    if (_.has(stack, node)) {
      throw new CycleException();
    }

    if (!_.has(visited, node)) {
      stack[node] = true;
      visited[node] = true;
      _.each(g.predecessors(node), visit);
      delete stack[node];
      results.push(node);
    }
  }

  _.each(g.sinks(), visit);

  if (_.size(visited) !== g.nodeCount()) {
    throw new CycleException();
  }

  return results;
}

function CycleException() {}
CycleException.prototype = new Error(); // must be an instance of Error to pass testing

/***/ }),

/***/ 1571:
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(169);

module.exports = dfs;

/*
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and returns the nodes in the order they were visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * Order must be one of "pre" or "post".
 */
function dfs(g, vs, order) {
  if (!_.isArray(vs)) {
    vs = [vs];
  }

  var navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);

  var acc = [],
      visited = {};
  _.each(vs, function(v) {
    if (!g.hasNode(v)) {
      throw new Error("Graph does not have node: " + v);
    }

    doDfs(g, v, order === "post", visited, navigation, acc);
  });
  return acc;
}

function doDfs(g, v, postorder, visited, navigation, acc) {
  if (!_.has(visited, v)) {
    visited[v] = true;

    if (!postorder) { acc.push(v); }
    _.each(navigation(v), function(w) {
      doDfs(g, w, postorder, visited, navigation, acc);
    });
    if (postorder) { acc.push(v); }
  }
}


/***/ }),

/***/ 1572:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerSummaryTimeline; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__RunnerSummaryTimelineKeyframe__ = __webpack_require__(3646);
var _class;





const ITEM_WIDTH = 26;let


RunnerSummaryTimeline = __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default()(_class = class RunnerSummaryTimeline extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = { visibleWidth: 0 };

    this.keyframeWidths = [];

    this._keyframe = this._keyframe.bind(this);
    this.setBounds = this.setBounds.bind(this);
    this.setKeyframeWidths = this.setKeyframeWidths.bind(this);
  }

  componentDidMount() {
    this.setBounds();
    this.setKeyframeWidths();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.scrollLeft !== nextProps.scrollLeft) {
      this.refs.timeline.scrollLeft = nextProps.scrollLeft;
    }
  }

  setBounds() {
    let me = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this);

    this.setState({ visibleWidth: me.clientWidth });
  }

  setKeyframeWidths() {
    this.keyframeWidths = _.map(this.props.iterations, iteration => {
      return ITEM_WIDTH;
    });
  }

  _keyframe(listItem, index) {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__RunnerSummaryTimelineKeyframe__["a" /* default */], {
        active: this.props.active,
        key: index,
        type: this.props.type,
        hoveredIteration: this.props.hoveredIteration,
        iterationId: index,
        iterations: this.props.iterations,
        requestId: this.props.requestId,
        testId: this.props.testId,
        onHover: this.props.onHover }));


  }

  render() {
    let keyframes = this.props.iterations;

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__body__timeline' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'pm-row', ref: 'timeline', onScroll: this.props.onScroll },

          _.map(this.props.iterations, (iteration, iterationId) => {
            return this._keyframe(iteration, iterationId);
          }))));




  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1573:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = parseCSV;
/* harmony export (immutable) */ __webpack_exports__["a"] = findNodePath;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_csv_parse__ = __webpack_require__(3664);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_csv_parse___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_csv_parse__);


/**
                                    * Parses given CSV data into array of objects.
                                    *
                                    * @param {*} data
                                    * @param {*} callback
                                    */
function parseCSV(data, callback) {
  // @note: options for csv parser should be same as they are used in Newman to ensure same
  //        behaviour between Newman and App.
  __WEBPACK_IMPORTED_MODULE_0_csv_parse___default()(data, {
    columns: true, // infer the columns names from the first row
    escape: '"', // escape character
    cast: csvAutoParse, // function to cast values of individual fields
    trim: true, // ignore whitespace immediately around the delimiter
    relax: true, // allow using quotes without escaping inside unquoted string
    relax_column_count: true // ignore inconsistent columns count
  }, callback);
}

/**
   * Finds the path to a node in the collection for runner
   *
   * @param {String} initName
   * @param {Object} item
   */
function findNodePath(initName, item, data) {
  let pathArr = [initName],
  { collection, folderMap } = data;

  getPath(pathArr, item, collection, folderMap);
  return pathArr.reverse().join(' / ');
}

/**
   * Recursively traverses and finds the path to the node
   *
   * @param {Array} pathArr
   * @param {Object} item
   */
function getPath(pathArr, item, collection, folderMap) {
  if (!folderMap[item.folder]) {
    pathArr.push(collection.name);
    return;
  }
  let folder = folderMap[item.folder];
  pathArr.push(folder.name);
  return getPath(pathArr, folder, collection, folderMap);
}

/**
   * Helper function to test if a given string is an integer.
   * Reference: [node-csv-parse]: https://github.com/adaltas/node-csv-parse/blob/v2.5.0/lib/index.js#L207
   *
   * @param {String} value - The string to test for.
   * @returns {Boolean}
   */
function isInt(value) {
  return (/^(-|\+)?([1-9]+[0-9]*)$/.test(value));
}

/**
   * Helper function to test if a given string is a float.
   * Reference: [node-csv-parse]: https://github.com/adaltas/node-csv-parse/blob/v2.5.0/lib/index.js#L210
   *
   * @param {String} value - The string to test for.
   * @returns {Boolean}
   */
function isFloat(value) {
  return value - parseFloat(value) + 1 >= 0;
}

/**
   * Custom method to auto parse CSV values
   *
   * @private
   * @param {String} value - CSV field value
   * @param {Object} context - Context of field value
   * @param {Boolean} context.quoting - A boolean indicating if the field was surrounded by quotes.
   * @returns {String|Number|Date}
   */
function csvAutoParse(value, context) {
  if (context.quoting) {
    // avoid parsing quoted values
    return value;
  }

  if (isInt(value)) {
    return parseInt(value, 10);
  }

  if (isFloat(value)) {
    return parseFloat(value);
  }

  return value;
}

/***/ }),

/***/ 1574:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_model_event__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_pipelines_user_action__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reducers_runner_BackboneReduxBridge__ = __webpack_require__(1025);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};




// Run iteration actions

const startRun = (runId, selection, name, retry = false) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Y" /* RUNNER_START_RUN */],
    runId,
    selection,
    name,
    retry };

};
/* harmony export (immutable) */ __webpack_exports__["startRun"] = startRun;


const errorRun = (runId, selection) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["u" /* RUNNER_ERROR_RUN */],
    runId,
    selection };

};
/* harmony export (immutable) */ __webpack_exports__["errorRun"] = errorRun;


const startIteration = (runId, iteration) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["W" /* RUNNER_START_ITERATION */],
    runId,
    iteration };

};
/* harmony export (immutable) */ __webpack_exports__["startIteration"] = startIteration;


const startRequest = (runId, iteration, request) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["X" /* RUNNER_START_REQUEST */],
    runId,
    iteration,
    request };

};
/* harmony export (immutable) */ __webpack_exports__["startRequest"] = startRequest;


const errorRequest = (runId, iteration, request, error) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["t" /* RUNNER_ERROR_REQUEST */],
    runId,
    iteration,
    request,
    error };

};
/* harmony export (immutable) */ __webpack_exports__["errorRequest"] = errorRequest;


const startTest = (runId, iteration, request) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Z" /* RUNNER_START_TEST */],
    runId,
    iteration,
    request };

};
/* harmony export (immutable) */ __webpack_exports__["startTest"] = startTest;


const errorTest = (runId, iteration, request, error) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["v" /* RUNNER_ERROR_TEST */],
    runId,
    iteration,
    request,
    error };

};
/* harmony export (immutable) */ __webpack_exports__["errorTest"] = errorTest;


const endTest = (runId, iteration, request, tests) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["s" /* RUNNER_END_TESTS */],
    runId,
    iteration,
    request,
    tests };

};
/* harmony export (immutable) */ __webpack_exports__["endTest"] = endTest;


const endRequest = (runId, iteration, request, response) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["q" /* RUNNER_END_REQUEST */],
    runId,
    iteration,
    request,
    response };

};
/* harmony export (immutable) */ __webpack_exports__["endRequest"] = endRequest;


const addResponseBody = (runId, iteration, request, response) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["a" /* RUNNER_ADD_RESPONSE_BODY */],
    runId,
    iteration,
    request,
    response };

};
/* harmony export (immutable) */ __webpack_exports__["addResponseBody"] = addResponseBody;


const endIteration = (runId, iteration) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["p" /* RUNNER_END_ITERATION */],
    runId,
    iteration };

};
/* harmony export (immutable) */ __webpack_exports__["endIteration"] = endIteration;


const endRun = runId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["r" /* RUNNER_END_RUN */],
    runId };

};
/* harmony export (immutable) */ __webpack_exports__["endRun"] = endRun;


// Run admin tasks

const pauseRun = runId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["G" /* RUNNER_PAUSE_RUN */],
    runId };

};
/* harmony export (immutable) */ __webpack_exports__["pauseRun"] = pauseRun;


const resumeRun = runId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["I" /* RUNNER_RESUME_RUN */],
    runId };

};
/* harmony export (immutable) */ __webpack_exports__["resumeRun"] = resumeRun;


const stoppingRun = runId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_0" /* RUNNER_STOPPING_RUN */],
    runId };

};
/* harmony export (immutable) */ __webpack_exports__["stoppingRun"] = stoppingRun;


const stopRun = runId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_1" /* RUNNER_STOP_RUN */],
    runId };

};
/* harmony export (immutable) */ __webpack_exports__["stopRun"] = stopRun;


const deleteRun = runId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["n" /* RUNNER_DELETE_RUN */],
    runId };

};
/* harmony export (immutable) */ __webpack_exports__["deleteRun"] = deleteRun;


const deleteAllRuns = runId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["h" /* RUNNER_DELETE_ALL_RUNS */],
    runId };

};
/* harmony export (immutable) */ __webpack_exports__["deleteAllRuns"] = deleteAllRuns;


const loadRuns = (runsJSON, importPartial = false) => {
  let runs = {};
  _.forEach(runsJSON, runJSON => {
    let run,
    runId = runJSON.id;

    try {
      if (runJSON.collection_id && runJSON.results) {
        // Backbone format
        run = Object(__WEBPACK_IMPORTED_MODULE_3__reducers_runner_BackboneReduxBridge__["a" /* BackboneToRedux */])(runJSON)[runId];
      } else
      {
        // already in redux format
        run = runJSON;
      }

      // If execution is here, I can guarantee that the run is in the Redux format now.
      if (importPartial) {
        // Import barebone run to display in the runs list. Actual run will be loaded if needed (if user requests explicitly)
        run = {
          id: run.id,
          name: run.name,
          status: run.status,
          environment: run.environment,
          createdAt: run.createdAt,
          totalTestCount: run.totalTestCount,
          failedTestCount: run.failedTestCount,
          workspace: run.workspace };

      }

      runs[runId] = run;
    }
    catch (e) {
      window.RELEASE_CHANNEL !== 'prod' && pm.logger.error(e);
    }
  });

  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["D" /* RUNNER_LOAD_RUNS */],
    runs };

};
/* harmony export (immutable) */ __webpack_exports__["loadRuns"] = loadRuns;


const loadRun = run => {
  if (!run) {
    return { type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["F" /* RUNNER_NOOP */] };
  }

  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["w" /* RUNNER_IMPORT_RUN */],
    runId: run.id,
    run };

};
/* harmony export (immutable) */ __webpack_exports__["loadRun"] = loadRun;


const importRun = (runJSON, importPartial = false) => {
  let run,
  runId = runJSON.id;

  try {
    run = Object(__WEBPACK_IMPORTED_MODULE_3__reducers_runner_BackboneReduxBridge__["a" /* BackboneToRedux */])(runJSON)[runId];
  }
  catch (e) {
    console.log(e);
    pm.toasts.getRef() && pm.toasts.error('Could not import test run. Please check the format of the file.');
    return { type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["F" /* RUNNER_NOOP */] };
  }

  let runToDB = _extends({},
  run, {
    id: runId,
    dataFile: !run.dataFile ? null : run.dataFile,
    owner: pm.runnerStore.getState().user.id }),

  importRunEvent = Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["a" /* createEvent */])('create', 'collectionrun', runToDB);

  Object(__WEBPACK_IMPORTED_MODULE_2__modules_pipelines_user_action__["a" /* default */])(importRunEvent).catch(() => {
    pm.toasts.getRef() && pm.toasts.error('Could not import test run.');
  });

  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["w" /* RUNNER_IMPORT_RUN */],
    runId,
    run };

};
/* harmony export (immutable) */ __webpack_exports__["importRun"] = importRun;



const cleanRun = runId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["b" /* RUNNER_CLEAN_RUN */],
    runId };

};
/* harmony export (immutable) */ __webpack_exports__["cleanRun"] = cleanRun;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1577:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = CollectionIcon;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Icon__ = __webpack_require__(29);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};


const icon =
__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('svg', { width: '16', height: '12', viewBox: '0 0 16 16' },
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('defs', null,
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('path', { id: 'collection', d: 'M.8 2h4.7L8 5.692h8V13.2a.8.8 0 0 1-.8.8H.8a.8.8 0 0 1-.8-.8V2.8A.8.8 0 0 1 .8 2zm6.7 0h7.7a.8.8 0 0 1 .8.8v1.508H9L7.5 2z' })),

  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('use', { fill: '#282828', fillRule: 'evenodd', xlinkHref: '#collection' }));



function CollectionIcon(props) {
  return (
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__Icon__["a" /* default */], _extends({},
    props, {
      icon: icon })));


}

/***/ }),

/***/ 1579:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = TeamIcon;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Icon__ = __webpack_require__(29);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};


const icon =
__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('svg', { width: '16', height: '13', viewBox: '0 0 16 13' },
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('defs', null,
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('path', { id: 'team', d: 'M5.077 6.867c-1.378 0-2.496-1.09-2.496-2.433C2.581 3.09 3.7 2 5.077 2c1.379 0 2.496 1.09 2.496 2.434S6.456 6.867 5.077 6.867zm-1.146 7.66v.437H0v-1.295c.003-2.732 2.275-4.945 5.077-4.945.438-.001.873.053 1.296.16-1.712 1.311-2.442 3.355-2.442 5.643zm6.992-5.772c2.802 0 5.074 2.213 5.077 4.945V15H5.867v-1.3c.003-2.724 2.262-4.934 5.056-4.945zm0-1.851c-1.379 0-2.496-1.09-2.496-2.434s1.117-2.434 2.496-2.434c1.378 0 2.496 1.09 2.496 2.434S12.3 6.904 10.923 6.904z' })),

  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('use', { fill: '#A9A9A9', fillRule: 'evenodd', transform: 'translate(0 -2)', xlinkHref: '#team' }));



function TeamIcon(props) {
  return (
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__Icon__["a" /* default */], _extends({},
    props, {
      icon: icon })));


}

/***/ }),

/***/ 1582:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stores_CollectionStore__ = __webpack_require__(742);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_Icons_TeamIcon__ = __webpack_require__(1579);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Icons_LockedIcon__ = __webpack_require__(1035);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__stores_get_store__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_mobx_react__ = __webpack_require__(12);
var _class;






let

CollectionMetaIcons = Object(__WEBPACK_IMPORTED_MODULE_6_mobx_react__["a" /* observer */])(_class = class CollectionMetaIcons extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  render() {
    const isCollectionEditable = Object(__WEBPACK_IMPORTED_MODULE_5__stores_get_store__["getStore"])('PermissionStore').can('edit', 'collection', this.props.collection.id);

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'collection-meta-icons' },
        this.props.collection.isShared && __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Icons_TeamIcon__["a" /* default */], { className: 'collection-meta-icon', size: 'xs', title: 'Shared with team' }),
        !isCollectionEditable && __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Icons_LockedIcon__["a" /* default */], { className: 'collection-meta-icon', size: 'xs', title: 'Read only' })));


  }}) || _class;


CollectionMetaIcons.propTypes = {
  collection: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.oneOfType([
  __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.instanceOf(__WEBPACK_IMPORTED_MODULE_2__stores_CollectionStore__["a" /* CollectionItemStore */]),
  __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object]) };



/* harmony default export */ __webpack_exports__["a"] = (CollectionMetaIcons);

/***/ }),

/***/ 1585:
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(1043);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ 1588:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Infobar; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Markdown__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants_InfobarConstants__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Icons_CloseIcon__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Icons_ExclamationIcon__ = __webpack_require__(744);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_UIEventService__ = __webpack_require__(99);








let

Infobar = class Infobar extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.dismissInfobar = this.dismissInfobar.bind(this);
    this.handlePrimaryAction = this.handlePrimaryAction.bind(this);
    this.handleSecondaryAction = this.handleSecondaryAction.bind(this);
  }

  componentDidMount() {
    this.props.onView && this.props.onView();
    this.unsubscribeHandler = this.props.dismissEvent && __WEBPACK_IMPORTED_MODULE_8__services_UIEventService__["a" /* default */].subscribe(this.props.dismissEvent, this.dismissInfobar);
  }

  componentWillUnmount() {
    this.unsubscribeHandler && this.unsubscribeHandler();
  }

  getTypeClass() {
    let typeClass = this.props.type ? `infobar-${this.props.type}` : 'infobar-info';
    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'infobar': true,
      [typeClass]: true });

  }

  handlePrimaryAction() {
    if (this.props.primaryAction && this.props.primaryAction.onClick) {
      this.props.primaryAction.onClick();
      this.props.onActionClick && this.props.onActionClick();
    }
  }

  handleSecondaryAction() {
    if (this.props.secondaryAction && this.props.secondaryAction.onClick) {
      this.props.secondaryAction.onClick();
      this.props.onActionClick && this.props.onActionClick();
    }
  }

  dismissInfobar() {
    this.props.onDismiss && this.props.onDismiss(this.props.uid);
  }

  getActions() {
    const { primaryAction = null, secondaryAction = null } = this.props;

    if (primaryAction || secondaryAction) {
      return (
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'infobar-actions' },

          primaryAction &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
              type: 'primary',
              size: 'small',
              disabled: primaryAction.disabled,
              onClick: this.handlePrimaryAction },

            primaryAction.label),



          secondaryAction &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
              type: 'text',
              disabled: secondaryAction.disabled,
              onClick: this.handleSecondaryAction },

            secondaryAction.label)));




    }
  }

  render() {
    let {
      message,
      actionLabel,
      noIcon,
      isDismissable,
      onMessageLinkClick } =
    this.props;

    if (_.isEmpty(message)) {
      return false;
    }

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getTypeClass() },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'infobar__msg_container' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'infobar__msg_text' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'infobar__icon-wrapper' },
              !this.props.noIcon && this.props.renderIcon()),

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'infobar__text-wrapper' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__Markdown__["a" /* default */], {
                source: message,
                onLinkClick: onMessageLinkClick }))),



          this.getActions()),


        isDismissable &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: 'infobar__dismiss_container',
            onClick: this.dismissInfobar },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__Icons_CloseIcon__["a" /* default */], {
            className: 'infobar__dismiss_icon',
            style: 'primary' }))));





  }};


Infobar.propTypes = {
  isDismissable: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  message: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  type: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOf([__WEBPACK_IMPORTED_MODULE_3__constants_InfobarConstants__["b" /* INFO */], __WEBPACK_IMPORTED_MODULE_3__constants_InfobarConstants__["d" /* WARN */], __WEBPACK_IMPORTED_MODULE_3__constants_InfobarConstants__["a" /* ERROR */], __WEBPACK_IMPORTED_MODULE_3__constants_InfobarConstants__["c" /* SUCCESS */]]) };


Infobar.defaultProps = {
  type: __WEBPACK_IMPORTED_MODULE_3__constants_InfobarConstants__["d" /* WARN */],
  isDismissable: true,
  noIcon: false,
  renderIcon: () => __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__Icons_ExclamationIcon__["a" /* default */], { className: 'infobar__icon' }) };
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1589:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = FolderIcon;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Icon__ = __webpack_require__(29);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};


const icon =
__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('svg', { width: '16', height: '12', viewBox: '0 0 16 16' },
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('defs', null,
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('path', { id: 'folder', d: 'M.8 2h4.8l1.6 1.5h8a.8.8 0 0 1 .8.8v8.9a.8.8 0 0 1-.8.8H.8a.8.8 0 0 1-.8-.8V2.8A.8.8 0 0 1 .8 2z' })),

  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('use', { fill: '#282828', fillRule: 'evenodd', xlinkHref: '#folder' }));



function FolderIcon(props) {
  return (
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__Icon__["a" /* default */], _extends({},
    props, {
      icon: icon })));


}

/***/ }),

/***/ 1593:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = DownloadIcon;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Icon__ = __webpack_require__(29);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};


const icon =
__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('svg', { width: '13', height: '16', viewBox: '0 0 16 16' },
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('defs', null,
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('path', { id: 'download', d: 'M11 5V0H6v5H2l6.5 6.735L15 5h-4zm-9 9v2h13v-2H2z' })),

  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('use', { fill: '#282828', fillRule: 'evenodd', xlinkHref: '#download' }));



function DownloadIcon(props) {
  return (
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__Icon__["a" /* default */], _extends({},
    props, {
      icon: icon })));


}

/***/ }),

/***/ 1594:
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(348),
    baseIteratee = __webpack_require__(581),
    baseMap = __webpack_require__(1668),
    isArray = __webpack_require__(52);

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;


/***/ }),

/***/ 1595:
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(591);

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;


/***/ }),

/***/ 1606:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WorkspaceActionDropdown; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__stores_get_store__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Icons_MoreIcon__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_uuid_helper__ = __webpack_require__(593);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_controllers_SyncWorkspaceController__ = __webpack_require__(716);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__modules_services_AnalyticsService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_UIEventService__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__constants_UIEventConstants__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_mobx_react__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__constants_MoreButtonTooltipConstant__ = __webpack_require__(339);
var _class;











let


WorkspaceActionDropdown = Object(__WEBPACK_IMPORTED_MODULE_10_mobx_react__["a" /* observer */])(_class = class WorkspaceActionDropdown extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = { isDefaultWorkspace: false };

    this.handleItemSelect = this.handleItemSelect.bind(this);
    this.handleShareWorkspace = this.handleShareWorkspace.bind(this);
  }

  componentWillMount() {
    this.setDefaultWorkspace();
  }

  setDefaultWorkspace() {
    let currentUser = Object(__WEBPACK_IMPORTED_MODULE_3__stores_get_store__["getStore"])('CurrentUserStore'),
    workspace = Object(__WEBPACK_IMPORTED_MODULE_3__stores_get_store__["getStore"])('WorkspaceStore').find(this.props.workspaceId),
    defaultUserWorkspaceId = Object(__WEBPACK_IMPORTED_MODULE_5__utils_uuid_helper__["a" /* deterministicUUID */])(`user:${currentUser.id}`),
    defaultTeamWorkspaceId = null;

    if (workspace && workspace.id === defaultUserWorkspaceId) {
      this.setState({ isDefaultWorkspace: true });
      return;
    }

    let teamId = _.get(currentUser, 'team.id', null);
    if (teamId) {
      defaultTeamWorkspaceId = Object(__WEBPACK_IMPORTED_MODULE_5__utils_uuid_helper__["a" /* deterministicUUID */])(`team:${teamId}`);

      if (this.props.workspaceId === defaultTeamWorkspaceId) {
        this.setState({ isDefaultWorkspace: true });
      }
    }
  }

  handleShareWorkspace() {
    let workspaceId = this.props.workspaceId,
    workspace = Object(__WEBPACK_IMPORTED_MODULE_3__stores_get_store__["getStore"])('WorkspaceStore').find(workspaceId),
    currentUser = Object(__WEBPACK_IMPORTED_MODULE_3__stores_get_store__["getStore"])('CurrentUserStore');

    if (workspace.type === 'personal' && (this.state.isDefaultWorkspace || currentUser.isFreeUser)) {
      __WEBPACK_IMPORTED_MODULE_8__services_UIEventService__["a" /* default */].publish(__WEBPACK_IMPORTED_MODULE_9__constants_UIEventConstants__["d" /* OPEN_INVITE_MODAL */], { workspaceId, source: 'share_ws' });
      return;
    }

    pm.mediator.trigger('openShareWorkspaceModal', workspaceId);
  }

  handleItemSelect(item) {
    let { workspaceId } = this.props,
    workspace = Object(__WEBPACK_IMPORTED_MODULE_3__stores_get_store__["getStore"])('WorkspaceStore').find(workspaceId);
    if (!workspace && item !== 'details') {
      pm.mediator.trigger('joinWorkspace', workspaceId);
      return;
    }
    switch (item) {
      case 'details':
        __WEBPACK_IMPORTED_MODULE_7__modules_services_AnalyticsService__["a" /* default */].addEvent('workspace', 'view_details');

        __WEBPACK_IMPORTED_MODULE_6__modules_controllers_SyncWorkspaceController__["a" /* default */].get({ id: workspaceId }, { populate: ['members'] }).
        then(workspace => {
          pm.mediator.trigger('openWorkspaceDetailsModal', workspace);
        });
        break;

      case 'manageMembers':
      case 'share':
        this.handleShareWorkspace(item);
        break;

      case 'rename':
      case 'addMembers':
      case 'description':
        pm.mediator.trigger('openEditWorkspaceModal', workspaceId);
        break;

      case 'delete':
        pm.mediator.trigger('showWorkspaceDeleteModal', workspaceId);
        break;
      case 'leave':
        pm.mediator.trigger('showWorkspaceLeaveModal', workspaceId);
        break;
      default:
        break;}

    this.props.onAction && this.props.onAction(item);
  }

  getDisabledState() {
    let isOffline = !Object(__WEBPACK_IMPORTED_MODULE_3__stores_get_store__["getStore"])('SyncStatusStore').isSocketConnected;
    if (isOffline) {
      return {
        active: true,
        text: 'You need to be online to perform these actions on the workspace.' };

    }

    return { active: false };
  }

  getShareDisabledStatus() {
    let disabledState = this.getDisabledState();
    if (disabledState.active) {
      return {
        isShareDisabled: true,
        shareDisableText: disabledState.text };

    }

    return { isShareDisabled: false, shareDisableText: '' };
  }

  getDeleteDisabledStatus() {
    let disabledState = this.getDisabledState();

    if (disabledState.active) {
      return {
        isDeleteDisabled: true,
        deleteDisableText: disabledState.text };

    }

    // Bootstrapped workspace cannot be deleted
    if (this.state.isDefaultWorkspace) {
      return {
        isDeleteDisabled: true,
        deleteDisableText: 'You cannot delete this workspace.' };

    }

    return { isDeleteDisabled: false, deleteDisableText: '' };
  }

  render() {
    let isOffline = !Object(__WEBPACK_IMPORTED_MODULE_3__stores_get_store__["getStore"])('SyncStatusStore').isSocketConnected,
    disabledState = this.getDisabledState(isOffline),
    workspace = Object(__WEBPACK_IMPORTED_MODULE_3__stores_get_store__["getStore"])('WorkspaceStore').find(this.props.workspaceId),
    { isShareDisabled, shareDisableText } = this.getShareDisabledStatus(),
    { isDeleteDisabled, deleteDisableText } = this.getDeleteDisabledStatus();

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["a" /* Dropdown */], {
          className: 'workspace-actions-dropdown',
          onSelect: this.handleItemSelect,
          onToggle: this.props.onToggle },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["b" /* DropdownButton */], {
            dropdownStyle: 'nocaret',
            type: 'custom' },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__base_Buttons__["a" /* Button */], {
              type: 'icon',
              className: 'workspace-actions-dropdown-button',
              tooltip: __WEBPACK_IMPORTED_MODULE_11__constants_MoreButtonTooltipConstant__["a" /* ACTION_TYPE_VIEW_MORE_ACTIONS_TOOLTIP */] },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Icons_MoreIcon__["a" /* default */], null))),


        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["c" /* DropdownMenu */], { 'align-right': true },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], { refKey: 'details' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, 'View Details')),


          workspace && workspace.type === 'personal' &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], {
              disabled: isShareDisabled,
              disabledText: shareDisableText,
              tooltipPlacement: this.props.tooltipPlacement,
              refKey: 'share' },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, 'Invite to Workspace')),


          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], {
              disabled: disabledState.active,
              disabledText: disabledState.text,
              refKey: 'rename' },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, 'Rename')),

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], {
              disabled: disabledState.active,
              disabledText: disabledState.text,
              refKey: 'description' },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, 'Edit Workspace')),


          workspace && workspace.type === 'team' &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], {
              disabled: disabledState.active,
              disabledText: disabledState.text,
              refKey: 'addMembers' },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, 'Add Members')),



          workspace && workspace.type !== 'personal' &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], {
              disabled: disabledState.active,
              disabledText: disabledState.text,
              refKey: 'manageMembers' },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, 'Invite to Workspace')),



          workspace && workspace.type !== 'personal' &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], {
              disabled: disabledState.active,
              disabledText: disabledState.text,
              refKey: 'leave' },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, 'Leave')),


          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], {
              disabled: isDeleteDisabled,
              disabledText: deleteDisableText,
              tooltipPlacement: this.props.tooltipPlacement,
              refKey: 'delete' },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, 'Delete')))));




  }}) || _class;


WorkspaceActionDropdown.defaultProps = { tooltipPlacement: 'right' };
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1607:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SyncOfflineStatusBarContainer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_sync_SyncOfflineStatusBar__ = __webpack_require__(1629);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stores_get_store__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_mobx_react__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__constants_RequesterTabConstants__ = __webpack_require__(235);
var _class;





const config = {
  switcher: {
    message: {
      offline: 'You need to have an active internet connection to be able to switch to or create a workspace.',
      connecting: 'Trying to reconnect to sync.' },

    teamCheck: false },

  builder: {
    message: {
      offline: 'You seem to be offline. Any changes made while offline might not sync properly with other members of this workspace.',
      connecting: 'Trying to reconnect to sync... Any changes made while offline will sync once you are back online..' },

    teamCheck: true } };let




SyncOfflineStatusBarContainer = Object(__WEBPACK_IMPORTED_MODULE_3_mobx_react__["a" /* observer */])(_class = class SyncOfflineStatusBarContainer extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  render() {
    let currentSyncStatus = Object(__WEBPACK_IMPORTED_MODULE_2__stores_get_store__["getStore"])('SyncStatusStore').currentSyncStatus,
    notInSync = !Object(__WEBPACK_IMPORTED_MODULE_2__stores_get_store__["getStore"])('SyncStatusStore').isSocketConnected,
    status;

    if (currentSyncStatus === 'connecting') {
      status = 'connecting';
    } else if (!_.includes('insync', 'syncing', 'idle'), currentSyncStatus) {
      status = 'offline';
    }

    let isOpen = notInSync && (
    config[this.props.position].teamCheck ? Object(__WEBPACK_IMPORTED_MODULE_2__stores_get_store__["getStore"])('ActiveWorkspaceStore').type === 'team' : true) &&
    !(Object(__WEBPACK_IMPORTED_MODULE_2__stores_get_store__["getStore"])('ActiveWorkspaceSessionStore').viewMode === __WEBPACK_IMPORTED_MODULE_4__constants_RequesterTabConstants__["a" /* WORKSPACE_BROWSER_VIEW */] && status === 'offline' && this.props.position === 'builder');

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__components_sync_SyncOfflineStatusBar__["a" /* default */], {
        isOpen: isOpen,
        status: status,
        message: config[this.props.position]['message'][status] }));


  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1608:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CollectionExplorer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_mobx_react__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Explorer__ = __webpack_require__(1637);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_CollectionTreeUtil__ = __webpack_require__(1042);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_util__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_pipelines_user_action__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__stores_get_store__ = __webpack_require__(5);
var _class;






let


CollectionExplorer = Object(__WEBPACK_IMPORTED_MODULE_1_mobx_react__["a" /* observer */])(_class = class CollectionExplorer extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = {
      selectedTarget: {},
      filter: '' };


    this.setInitialTargets = this.setInitialTargets.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.getCreateRowText = this.getCreateRowText.bind(this);

    /**
                                                               * hackkkkkk
                                                               * Reason - In CollectionExplorer, the target list is fetched from the props asynchronously
                                                               * due to which we do not know the exact point when we get the targets in this component,hence can't figure out the new target added
                                                               * this.newTargetId - holds the id of new collection/folder created
                                                               * newTargetId is passed down to the Explorer to set the created collection/folder as selected
                                                               */
    this.newTargetId = undefined;
  }

  componentDidMount() {
    this.setInitialTargets();
  }

  componentDidUpdate() {
    // unset the target id after the child component has updated
    this.newTargetId = undefined;
  }
  setInitialTargets(initialSelection = this.props.initialSelection) {
    if (!initialSelection) {
      return;
    }

    let item = null;
    if (_.get(initialSelection, 'folder')) {
      item = _.get(initialSelection, 'folder');
    } else
    if (_.get(initialSelection, 'collection')) {
      item = _.get(initialSelection, 'collection');
    }

    item && this.refs.explorer && this.refs.explorer.handleSelect(item);
  }

  handleSelect(target) {
    this.setState({
      selectedTarget: target,
      filter: '' });

    _.invoke(this.props, 'onSelect', target);
  }

  handleCreate(name, selectedTarget) {
    this.setState({ filter: '' });
    if (!selectedTarget) {
      return;
    }

    // This means it is the collection create
    if (_.isNull(selectedTarget.id) || !_.isEmpty(this.state.filter)) {
      let currentUser = Object(__WEBPACK_IMPORTED_MODULE_7__stores_get_store__["getStore"])('CurrentUserStore'),
      workspaceId = Object(__WEBPACK_IMPORTED_MODULE_7__stores_get_store__["getStore"])('ActiveWorkspaceStore').id;

      if (!Object(__WEBPACK_IMPORTED_MODULE_7__stores_get_store__["getStore"])('PermissionStore').can('addcollection', 'workspace', workspaceId)) {
        return pm.toasts.error('You do not have permissions required to add this collection.');
      }
      let collection = {
        id: __WEBPACK_IMPORTED_MODULE_5__utils_util__["a" /* default */].guid(),
        name: name,
        owner: currentUser.id },

      collectionAddEvent = {
        name: 'create_deep',
        namespace: 'collection',
        data: { collection },
        meta: { origin: this.props.origin } };


      Object(__WEBPACK_IMPORTED_MODULE_6__modules_pipelines_user_action__["a" /* default */])(collectionAddEvent).
      then(response => {
        this.newTargetId = _.get(response, 'response.data.collection.id');
        if (!_.isEmpty(_.get(response, 'error'))) {
          pm.logger.error('Error in creating collection', response.error);
          return;
        }
      }).
      catch(err => {
        pm.logger.error('Error in pipeline while creating collection', err);
      });
    }

    // Here it may be inside a collection or a folder selected
    else {
        let folder,
        collection,
        canEdit,
        folderCollectionId;

        if (selectedTarget.type === 'collection') {
          collection = _.find(this.props.collections, ['id', selectedTarget.id]);

          if (!collection) {
            return pm.toasts.error('We can\'t seem to find the collection.');
          }
          if (!Object(__WEBPACK_IMPORTED_MODULE_7__stores_get_store__["getStore"])('PermissionStore').can('addFolder', 'collection', selectedTarget.id)) {
            return pm.toasts.error('You do not have permissions required to edit this collection.');
          }

          let folderAddEvent = {
            name: 'create_deep',
            namespace: 'folder',
            data: {
              folder: {
                id: __WEBPACK_IMPORTED_MODULE_5__utils_util__["a" /* default */].guid(),
                name: name,
                collection: collection.id },

              target: {
                model: 'collection',
                modelId: collection.id } } };




          Object(__WEBPACK_IMPORTED_MODULE_6__modules_pipelines_user_action__["a" /* default */])(folderAddEvent).
          then(response => {
            this.newTargetId = _.get(response, 'response.data.folder.id');
            if (!_.isEmpty(_.get(response, 'error'))) {
              pm.logger.error('Error in creating folder', response.error);
              return;
            }
          }).
          catch(err => {
            pm.logger.error('Error in pipeline while creating folder', err);
          });
        } else
        if (selectedTarget.type === 'folder') {
          folder = _.find(this.props.folders, ['id', selectedTarget.id]);
          folderCollectionId = folder && folder.collection;
          collection = _.find(this.props.collections, ['id', folderCollectionId]);

          if (!collection) {
            return pm.toasts.error('We can\'t seem to find the collection.');
          }
          if (!Object(__WEBPACK_IMPORTED_MODULE_7__stores_get_store__["getStore"])('PermissionStore').can('addFolder', 'folder', selectedTarget.id)) {
            return pm.toasts.error('You do not have permissions required to edit this collection.');
          }

          let folderAddEvent = {
            name: 'create_deep',
            namespace: 'folder',
            data: {
              folder: {
                id: __WEBPACK_IMPORTED_MODULE_5__utils_util__["a" /* default */].guid(),
                name: name,
                collection: collection.id },

              target: {
                model: 'folder',
                modelId: selectedTarget.id } } };




          Object(__WEBPACK_IMPORTED_MODULE_6__modules_pipelines_user_action__["a" /* default */])(folderAddEvent).
          then(response => {
            this.newTargetId = _.get(response, 'response.data.folder.id');
            if (!_.isEmpty(_.get(response, 'error'))) {
              pm.logger.error('Error in creating folder', response.error);
              return;
            }
          }).
          catch(err => {
            pm.logger.error('Error in pipeline while creating folder', err);
          });
        }
      }
  }

  handleFilter(filter) {
    this.setState({ filter: filter });
    _.invoke(this.props, 'onFilter', filter);
  }

  handleBack(newTarget) {
    _.invoke(this.props, 'onSelect', newTarget);
  }

  getCreateRowText(selectedTarget) {
    return selectedTarget.depth === -1 || !_.isEmpty(this.state.filter) ?
    '+ Create Collection ' + (this.state.filter && `"${this.state.filter}"`) :
    '+ Create Folder ' + (this.state.filter && `"${this.state.filter}"`);
  }

  getCreateRowPlaceholder(selectedTarget) {
    return selectedTarget.depth === -1 ?
    'Name your collection' :
    'Name your folder';
  }

  getLeafIcon(node) {
    let method = node.method ? node.method.toUpperCase() : 'GET';
    let classes = `explorer-row__icon-leaf-icon request-method--${method}`;
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: classes },
        node.method));


  }

  render() {
    let collections = _.map(this.props.collections, collection => {
      return Object(__WEBPACK_IMPORTED_MODULE_4__utils_CollectionTreeUtil__["a" /* flattenCollection */])(collection, this.props.folders, this.props.requests);
    });
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'collection-explorer' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__Explorer__["a" /* default */], {
          createPlaceholder: this.getCreateRowPlaceholder,
          createText: this.getCreateRowText,
          disableCreate: this.props.disableCreate,
          isLeaf: target => {return target.type === 'request';},
          leafIcon: this.getLeafIcon,
          ref: 'explorer',
          targets: _.flatten(collections),
          onBack: this.handleBack,
          onCreate: this.handleCreate,
          onFilter: this.handleFilter,
          onSelect: this.handleSelect,
          newTargetId: this.newTargetId })));



  }}) || _class;


CollectionExplorer.propTypes = {
  disableCreate: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.bool,
  initialSelection: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.object,
  onCreate: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.func,
  onFilter: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.func,
  onSelect: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.func };
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1609:
/***/ (function(module, exports, __webpack_require__) {

var arrayReduce = __webpack_require__(1672),
    baseEach = __webpack_require__(584),
    baseIteratee = __webpack_require__(581),
    baseReduce = __webpack_require__(1673),
    isArray = __webpack_require__(52);

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

module.exports = reduce;


/***/ }),

/***/ 1610:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(116),
    isArray = __webpack_require__(52),
    isObjectLike = __webpack_require__(89);

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

module.exports = isString;


/***/ }),

/***/ 1611:
/***/ (function(module, exports, __webpack_require__) {

var arrayEach = __webpack_require__(731),
    baseEach = __webpack_require__(584),
    castFunction = __webpack_require__(1595),
    isArray = __webpack_require__(52);

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;


/***/ }),

/***/ 1612:
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),

/***/ 1613:
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(584);

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;


/***/ }),

/***/ 1625:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WorkspaceSwitcher; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_mobx_react__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__postman_react_click_outside__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__postman_react_click_outside___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__postman_react_click_outside__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_Tabs__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_Icons_WorkspaceIcon__ = __webpack_require__(1626);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__base_Icons_DownSolidIcon__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__WorkspaceSwitcherList__ = __webpack_require__(1627);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__containers_sync_SyncOfflineStatusContainer__ = __webpack_require__(1607);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__base_XPaths_XPath__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__base_LoadingIndicator__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__stores_get_store__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__utils_util__ = __webpack_require__(19);
var _dec, _class;













let



WorkspaceSwitcher = (_dec = __WEBPACK_IMPORTED_MODULE_2__postman_react_click_outside___default()({ eventCapturingPhase: false }), _dec(_class = Object(__WEBPACK_IMPORTED_MODULE_1_mobx_react__["a" /* observer */])(_class = class WorkspaceSwitcher extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.handleSwitchWorkspace = this.handleSwitchWorkspace.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleLearnMore = this.handleLearnMore.bind(this);
    this.handleProUpgrade = this.handleProUpgrade.bind(this);
  }

  handleProUpgrade() {
    this.props.onProUpgradeClick && this.props.onProUpgradeClick();
  }

  handleClickOutside(e) {
    this.props.onToggle && this.props.onToggle(false) || _.noop;
  }

  handleAction(action) {
    this.props.onWorkspaceAction && this.props.onWorkspaceAction(null, action);
  }

  handleSwitchWorkspace(id) {
    this.props.onSwitchWorkspace && this.props.onSwitchWorkspace(id);
  }

  handleSignIn() {
    this.props.onSignIn && this.props.onSignIn();
  }

  handleLearnMore() {
    this.props.onLearnMore && this.props.onLearnMore();
  }

  isButtonDisabled() {
    if (this.props.isOffline) {
      return true;
    }
    return false;
  }

  getToggle() {
    if (this.props.disable) {
      return _.noop;
    }

    return this.props.onToggle && this.props.onToggle.bind(this, !this.props.isOpen);
  }

  getSwitcherClasses() {
    return __WEBPACK_IMPORTED_MODULE_9_classnames___default()({
      'workspace-switcher__active': !this.props.disable,
      'workspace-switcher__disabled': this.props.disable });

  }

  render() {
    let isLoggedIn = this.props.isLoggedIn,
    disableButton = this.isButtonDisabled();

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: this.getSwitcherClasses(),
            onClick: this.getToggle() },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Icons_WorkspaceIcon__["a" /* default */], {
            className: 'workspace-switcher__icon',
            style: 'primary' }),

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
              className: 'workspace-switcher__name',
              title: this.props.activeWorkspace.name },

            _.truncate(this.props.activeWorkspace.name, { length: 40 }) || 'Loading..'),

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__base_Icons_DownSolidIcon__["a" /* default */], { style: 'primary' })),


        this.props.isOpen &&
        !isLoggedIn &&

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__selector' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__state' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__state__title' }, 'Sign in to create workspaces'),


            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__state__description' }, 'Workspaces help you organize your collections and environments.'),


            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__state__learn-more' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
                  type: 'text',
                  onClick: this.handleLearnMore }, 'Learn more about workspaces')),




            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__state__primary-btn' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
                  type: 'primary',
                  size: 'large',
                  onClick: this.handleSignIn }, 'Sign in to create workspaces')))),









        this.props.isOpen &&
        isLoggedIn &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__selector' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__header' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Tabs__["b" /* Tabs */], {
                activeRef: this.props.activeTab,
                className: 'workspace-switcher__tabs',
                defaultActive: 'personal',
                type: 'primary',
                onChange: this.props.onTabChange },

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_10__base_XPaths_XPath__["a" /* default */], { identifier: 'personal' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Tabs__["a" /* Tab */], { className: 'workspace-switcher__tab', refKey: 'personal' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', { className: 'workspace-switcher__tab__title' }, 'Personal'))),


              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_10__base_XPaths_XPath__["a" /* default */], { identifier: 'team' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Tabs__["a" /* Tab */], { className: 'workspace-switcher__tab', refKey: 'team' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', { className: 'workspace-switcher__tab__title' }, 'Team')))),




            !this.props.disableActions &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__actions' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_10__base_XPaths_XPath__["a" /* default */], { identifier: 'createNew' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
                    className:
                    __WEBPACK_IMPORTED_MODULE_9_classnames___default()({
                      'workspace-switcher__action workspace-switcher__action--create': true,
                      'disable-component': disableButton }),


                    type: 'text',
                    onClick: this.handleAction.bind(this, 'create') }, 'Create New')),




              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_10__base_XPaths_XPath__["a" /* default */], { identifier: 'allWorkspaces' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
                    className:
                    __WEBPACK_IMPORTED_MODULE_9_classnames___default()({
                      'workspace-switcher__action workspace-switcher__action--manage': true,
                      'disable-component': disableButton }),


                    type: 'text',
                    onClick: this.handleAction.bind(this, 'manage-all') }, 'All workspaces')))),








          this.props.activeTab === 'personal' &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__list' },

            this.props.isLoading &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_11__base_LoadingIndicator__["a" /* default */], null),

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__list__group' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__WorkspaceSwitcherList__["a" /* default */], {
                onSwitchWorkspace: this.handleSwitchWorkspace,
                workspaces: this.props.personalWorkspaces,
                activeWorkspace: this.props.activeWorkspace,
                onToggle: this.props.onToggle }))),





          this.props.activeTab === 'team' && !this.props.teamSyncEnabled &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__state workspace-switcher__upgrade_to_pro' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__state__title' }, 'Start collaborating in team workspaces'),


            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__state__description' }, 'Team workspaces allow you to share and work together on your API collections with your colleagues.'),


            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__state__primary-btn' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_10__base_XPaths_XPath__["a" /* default */], { identifier: 'createNewTeam' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
                    type: 'primary',
                    size: 'large',
                    onClick: this.handleAction.bind(this, 'create') }, 'Create a team workspace')))),








          this.props.activeTab === 'team' && this.props.teamSyncEnabled &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__list' },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__containers_sync_SyncOfflineStatusContainer__["a" /* default */], { position: 'switcher' }),


            this.props.isLoading &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_11__base_LoadingIndicator__["a" /* default */], null),


            !_.isEmpty(this.props.teamWorkspaces) &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__list__group' + (this.props.isOffline ? ' disable-component' : '') },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__list__group__header' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', { className: 'workspace-switcher__list__group__title' }, 'Workspaces you belong to')),



              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__WorkspaceSwitcherList__["a" /* default */], {
                onSwitchWorkspace: this.handleSwitchWorkspace,
                workspaces: this.props.teamWorkspaces,
                activeWorkspace: this.props.activeWorkspace,
                onToggle: this.props.onToggle })),




            !_.isEmpty(this.props.joinableWorkspaces) &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__list__group' + (this.props.isOffline ? ' disable-component' : '') },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__list__group__header' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', { className: 'workspace-switcher__list__group__title' }, 'Workspaces you can join')),



              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__WorkspaceSwitcherList__["a" /* default */], {
                onSwitchWorkspace: this.handleSwitchWorkspace,
                workspaces: this.props.joinableWorkspaces,
                activeWorkspace: this.props.activeWorkspace,
                onToggle: this.props.onToggle }))))));









  }}) || _class) || _class);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1626:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = WorkspaceIcon;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Icon__ = __webpack_require__(29);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};


const icon =
__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('svg', { width: '14', height: '14', viewBox: '0 0 16 16' },
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('defs', null,
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('path', { id: 'workspace-switcher', d: 'M2 9h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zm8 0h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zm0-8h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z' })),

  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('use', { fill: '#FFF', fillRule: 'evenodd', xlinkHref: '#workspace-switcher' }));



function WorkspaceIcon(props) {
  return (
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__Icon__["a" /* default */], _extends({},
    props, {
      icon: icon })));


}

/***/ }),

/***/ 1627:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WorkspaceSwitcherList; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__WorkspaceSwitcherListItem__ = __webpack_require__(1628);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_mobx_react__ = __webpack_require__(12);
var _class;


let


WorkspaceSwitcherList = Object(__WEBPACK_IMPORTED_MODULE_2_mobx_react__["a" /* observer */])(_class = class WorkspaceSwitcherList extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.handleSwitchWorkspace = this.handleSwitchWorkspace.bind(this);
  }

  handleSwitchWorkspace(id) {
    this.props.onSwitchWorkspace && this.props.onSwitchWorkspace(id);
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__list__group__list' },

        _.map(this.props.workspaces, workspace => {
          return (
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__WorkspaceSwitcherListItem__["a" /* default */], {
              onToggle: this.props.onToggle,
              onSelect: this.handleSwitchWorkspace,
              workspace: workspace,
              active: workspace.id === this.props.activeWorkspace.id,
              key: workspace.id }));


        })));



  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1628:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WorkspaceSwitcherListItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_mobx_react__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__WorkspaceActionDropdown__ = __webpack_require__(1606);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_Dropdowns__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__stores_get_store__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__modules_services_AnalyticsService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__base_Icons_SuccessIcon__ = __webpack_require__(579);
var _class;









let


WorkspaceSwitcherListItem = Object(__WEBPACK_IMPORTED_MODULE_1_mobx_react__["a" /* observer */])(_class = class WorkspaceSwitcherListItem extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = { isActionsDropdownOpen: false };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleDropdownToggle = this.handleDropdownToggle.bind(this);
    this.handleDropdownAction = this.handleDropdownAction.bind(this);
  }

  getClasses() {
    return __WEBPACK_IMPORTED_MODULE_2_classnames___default()({
      'workspace-switcher__list__group__list-item': true,
      'is-active': this.props.active,
      'is-hovered': this.state.isActionsDropdownOpen });

  }

  handleSelect() {
    this.props.onSelect && this.props.onSelect(this.props.workspace.id);
  }

  handleDropdownToggle(isOpen, e) {
    e && e.stopPropagation();
    e && e.preventDefault();

    this.setState({ isActionsDropdownOpen: isOpen });
  }

  handleDropdownAction() {
    this.props.onToggle && this.props.onToggle(false);
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getClasses(), onClick: this.handleSelect },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__list__group__list-item__enabled' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__base_Icons_SuccessIcon__["a" /* default */], {
            className: 'workspace-switcher__list__group__list-item__enabled__icon',
            size: 'xs' })),


        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'workspace-switcher__list__group__list-item__name' },
          this.props.workspace.name),

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__WorkspaceActionDropdown__["a" /* default */], {
          workspaceId: this.props.workspace.id,
          onAction: this.handleDropdownAction,
          onToggle: this.handleDropdownToggle })));



  }}) || _class;

/***/ }),

/***/ 1629:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_Infobar__ = __webpack_require__(1588);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants_InfobarConstants__ = __webpack_require__(397);




const infoBarType = {
  'connecting': __WEBPACK_IMPORTED_MODULE_2__constants_InfobarConstants__["d" /* WARN */],
  'offline': __WEBPACK_IMPORTED_MODULE_2__constants_InfobarConstants__["a" /* ERROR */] };let


SyncOfflineStatusBar = class SyncOfflineStatusBar extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  render() {
    return (
      this.props.isOpen &&
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__base_Infobar__["a" /* default */], {
        type: infoBarType[this.props.status],
        message: this.props.message,
        isDismissable: false,
        className: 'sync-offline-status-bar' }));


  }};


/* harmony default export */ __webpack_exports__["a"] = (SyncOfflineStatusBar);

/***/ }),

/***/ 1630:
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(1);
var createReactClass = __webpack_require__(721);
var PropTypes = __webpack_require__(11);
var merge = __webpack_require__(92);
var NotificationContainer = __webpack_require__(1632);
var Constants = __webpack_require__(722);
var Styles = __webpack_require__(1635);

var NotificationSystem = createReactClass({

  uid: 3400,

  _isMounted: false,

  _getStyles: {
    overrideStyle: {},

    overrideWidth: null,

    setOverrideStyle: function(style) {
      this.overrideStyle = style;
    },

    wrapper: function() {
      if (!this.overrideStyle) return {};
      return merge({}, Styles.Wrapper, this.overrideStyle.Wrapper);
    },

    container: function(position) {
      var override = this.overrideStyle.Containers || {};
      if (!this.overrideStyle) return {};

      this.overrideWidth = Styles.Containers.DefaultStyle.width;

      if (override.DefaultStyle && override.DefaultStyle.width) {
        this.overrideWidth = override.DefaultStyle.width;
      }

      if (override[position] && override[position].width) {
        this.overrideWidth = override[position].width;
      }

      return merge({}, Styles.Containers.DefaultStyle, Styles.Containers[position], override.DefaultStyle, override[position]);
    },

    elements: {
      notification: 'NotificationItem',
      title: 'Title',
      messageWrapper: 'MessageWrapper',
      dismiss: 'Dismiss',
      action: 'Action',
      actionWrapper: 'ActionWrapper'
    },

    byElement: function(element) {
      var self = this;
      return function(level) {
        var _element = self.elements[element];
        var override = self.overrideStyle[_element] || {};
        if (!self.overrideStyle) return {};
        return merge({}, Styles[_element].DefaultStyle, Styles[_element][level], override.DefaultStyle, override[level]);
      };
    }
  },

  _didNotificationRemoved: function(uid) {
    var notification;
    var notifications = this.state.notifications.filter(function(toCheck) {
      if (toCheck.uid === uid) {
        notification = toCheck;
        return false;
      }
      return true;
    });

    if (this._isMounted) {
      this.setState({ notifications: notifications });
    }

    if (notification && notification.onRemove) {
      notification.onRemove(notification);
    }
  },

  getInitialState: function() {
    return {
      notifications: []
    };
  },

  propTypes: {
    style: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]),
    noAnimation: PropTypes.bool,
    allowHTML: PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      style: {},
      noAnimation: false,
      allowHTML: false
    };
  },

  addNotification: function(notification) {
    var _notification = merge({}, Constants.notification, notification);
    var notifications = this.state.notifications;
    var i;

    if (!_notification.level) {
      throw new Error('notification level is required.');
    }

    if (Object.keys(Constants.levels).indexOf(_notification.level) === -1) {
      throw new Error('\'' + _notification.level + '\' is not a valid level.');
    }

    // eslint-disable-next-line
    if (isNaN(_notification.autoDismiss)) {
      throw new Error('\'autoDismiss\' must be a number.');
    }

    if (Object.keys(Constants.positions).indexOf(_notification.position) === -1) {
      throw new Error('\'' + _notification.position + '\' is not a valid position.');
    }

    // Some preparations
    _notification.position = _notification.position.toLowerCase();
    _notification.level = _notification.level.toLowerCase();
    _notification.autoDismiss = parseInt(_notification.autoDismiss, 10);

    _notification.uid = _notification.uid || this.uid;
    _notification.ref = 'notification-' + _notification.uid;
    this.uid += 1;

    // do not add if the notification already exists based on supplied uid
    for (i = 0; i < notifications.length; i += 1) {
      if (notifications[i].uid === _notification.uid) {
        return false;
      }
    }

    notifications.push(_notification);

    if (typeof _notification.onAdd === 'function') {
      notification.onAdd(_notification);
    }

    this.setState({
      notifications: notifications
    });

    return _notification;
  },

  getNotificationRef: function(notification) {
    var self = this;
    var foundNotification = null;

    Object.keys(this.refs).forEach(function(container) {
      if (container.indexOf('container') > -1) {
        Object.keys(self.refs[container].refs).forEach(function(_notification) {
          var uid = notification.uid ? notification.uid : notification;
          if (_notification === 'notification-' + uid) {
            // NOTE: Stop iterating further and return the found notification.
            // Since UIDs are uniques and there won't be another notification found.
            foundNotification = self.refs[container].refs[_notification];
          }
        });
      }
    });

    return foundNotification;
  },

  removeNotification: function(notification) {
    var foundNotification = this.getNotificationRef(notification);
    return foundNotification && foundNotification._hideNotification();
  },

  editNotification: function(notification, newNotification) {
    var foundNotification = null;
    // NOTE: Find state notification to update by using
    // `setState` and forcing React to re-render the component.
    var uid = notification.uid ? notification.uid : notification;

    var newNotifications = this.state.notifications.filter(function(stateNotification) {
      if (uid === stateNotification.uid) {
        foundNotification = stateNotification;
        return false;
      }

      return true;
    });


    if (!foundNotification) {
      return;
    }

    newNotifications.push(merge(
      {},
      foundNotification,
      newNotification
    ));

    this.setState({
      notifications: newNotifications
    });
  },

  clearNotifications: function() {
    var self = this;
    Object.keys(this.refs).forEach(function(container) {
      if (container.indexOf('container') > -1) {
        Object.keys(self.refs[container].refs).forEach(function(_notification) {
          self.refs[container].refs[_notification]._hideNotification();
        });
      }
    });
  },

  componentDidMount: function() {
    this._getStyles.setOverrideStyle(this.props.style);
    this._isMounted = true;
  },

  componentWillUnmount: function() {
    this._isMounted = false;
  },

  render: function() {
    var self = this;
    var containers = null;
    var notifications = this.state.notifications;

    if (notifications.length) {
      containers = Object.keys(Constants.positions).map(function(position) {
        var _notifications = notifications.filter(function(notification) {
          return position === notification.position;
        });

        if (!_notifications.length) {
          return null;
        }

        return (
          React.createElement(NotificationContainer, {
            ref:  'container-' + position, 
            key:  position, 
            position:  position, 
            notifications:  _notifications, 
            getStyles:  self._getStyles, 
            onRemove:  self._didNotificationRemoved, 
            noAnimation:  self.props.noAnimation, 
            allowHTML:  self.props.allowHTML}
          )
        );
      });
    }


    return (
      React.createElement("div", {className: "notifications-wrapper", style:  this._getStyles.wrapper() }, 
         containers 
      )
    );
  }
});

module.exports = NotificationSystem;


/***/ }),

/***/ 1631:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var _assign = __webpack_require__(92);

var emptyObject = __webpack_require__(736);
var _invariant = __webpack_require__(41);

if (false) {
  var warning = require('fbjs/lib/warning');
}

var MIXINS_KEY = 'mixins';

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity(fn) {
  return fn;
}

var ReactPropTypeLocationNames;
if (false) {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
} else {
  ReactPropTypeLocationNames = {};
}

function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
  /**
   * Policies that describe methods in `ReactClassInterface`.
   */

  var injectedMixins = [];

  /**
   * Composite components are higher-level components that compose other composite
   * or host components.
   *
   * To create a new type of `ReactClass`, pass a specification of
   * your new class to `React.createClass`. The only requirement of your class
   * specification is that you implement a `render` method.
   *
   *   var MyComponent = React.createClass({
   *     render: function() {
   *       return <div>Hello World</div>;
   *     }
   *   });
   *
   * The class specification supports a specific protocol of methods that have
   * special meaning (e.g. `render`). See `ReactClassInterface` for
   * more the comprehensive protocol. Any other properties and methods in the
   * class specification will be available on the prototype.
   *
   * @interface ReactClassInterface
   * @internal
   */
  var ReactClassInterface = {
    /**
     * An array of Mixin objects to include when defining your component.
     *
     * @type {array}
     * @optional
     */
    mixins: 'DEFINE_MANY',

    /**
     * An object containing properties and methods that should be defined on
     * the component's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: 'DEFINE_MANY',

    /**
     * Definition of prop types for this component.
     *
     * @type {object}
     * @optional
     */
    propTypes: 'DEFINE_MANY',

    /**
     * Definition of context types for this component.
     *
     * @type {object}
     * @optional
     */
    contextTypes: 'DEFINE_MANY',

    /**
     * Definition of context types this component sets for its children.
     *
     * @type {object}
     * @optional
     */
    childContextTypes: 'DEFINE_MANY',

    // ==== Definition methods ====

    /**
     * Invoked when the component is mounted. Values in the mapping will be set on
     * `this.props` if that prop is not specified (i.e. using an `in` check).
     *
     * This method is invoked before `getInitialState` and therefore cannot rely
     * on `this.state` or use `this.setState`.
     *
     * @return {object}
     * @optional
     */
    getDefaultProps: 'DEFINE_MANY_MERGED',

    /**
     * Invoked once before the component is mounted. The return value will be used
     * as the initial value of `this.state`.
     *
     *   getInitialState: function() {
     *     return {
     *       isOn: false,
     *       fooBaz: new BazFoo()
     *     }
     *   }
     *
     * @return {object}
     * @optional
     */
    getInitialState: 'DEFINE_MANY_MERGED',

    /**
     * @return {object}
     * @optional
     */
    getChildContext: 'DEFINE_MANY_MERGED',

    /**
     * Uses props from `this.props` and state from `this.state` to render the
     * structure of the component.
     *
     * No guarantees are made about when or how often this method is invoked, so
     * it must not have side effects.
     *
     *   render: function() {
     *     var name = this.props.name;
     *     return <div>Hello, {name}!</div>;
     *   }
     *
     * @return {ReactComponent}
     * @required
     */
    render: 'DEFINE_ONCE',

    // ==== Delegate methods ====

    /**
     * Invoked when the component is initially created and about to be mounted.
     * This may have side effects, but any external subscriptions or data created
     * by this method must be cleaned up in `componentWillUnmount`.
     *
     * @optional
     */
    componentWillMount: 'DEFINE_MANY',

    /**
     * Invoked when the component has been mounted and has a DOM representation.
     * However, there is no guarantee that the DOM node is in the document.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been mounted (initialized and rendered) for the first time.
     *
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidMount: 'DEFINE_MANY',

    /**
     * Invoked before the component receives new props.
     *
     * Use this as an opportunity to react to a prop transition by updating the
     * state using `this.setState`. Current props are accessed via `this.props`.
     *
     *   componentWillReceiveProps: function(nextProps, nextContext) {
     *     this.setState({
     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
     *     });
     *   }
     *
     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
     * transition may cause a state change, but the opposite is not true. If you
     * need it, you are probably looking for `componentWillUpdate`.
     *
     * @param {object} nextProps
     * @optional
     */
    componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Invoked while deciding if the component should be updated as a result of
     * receiving new props, state and/or context.
     *
     * Use this as an opportunity to `return false` when you're certain that the
     * transition to the new props/state/context will not require a component
     * update.
     *
     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
     *     return !equal(nextProps, this.props) ||
     *       !equal(nextState, this.state) ||
     *       !equal(nextContext, this.context);
     *   }
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @return {boolean} True if the component should update.
     * @optional
     */
    shouldComponentUpdate: 'DEFINE_ONCE',

    /**
     * Invoked when the component is about to update due to a transition from
     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
     * and `nextContext`.
     *
     * Use this as an opportunity to perform preparation before an update occurs.
     *
     * NOTE: You **cannot** use `this.setState()` in this method.
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @param {ReactReconcileTransaction} transaction
     * @optional
     */
    componentWillUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component's DOM representation has been updated.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     *
     * @param {object} prevProps
     * @param {?object} prevState
     * @param {?object} prevContext
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component is about to be removed from its parent and have
     * its DOM representation destroyed.
     *
     * Use this as an opportunity to deallocate any external resources.
     *
     * NOTE: There is no `componentDidUnmount` since your component will have been
     * destroyed by that point.
     *
     * @optional
     */
    componentWillUnmount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillMount`.
     *
     * @optional
     */
    UNSAFE_componentWillMount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillReceiveProps`.
     *
     * @optional
     */
    UNSAFE_componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillUpdate`.
     *
     * @optional
     */
    UNSAFE_componentWillUpdate: 'DEFINE_MANY',

    // ==== Advanced methods ====

    /**
     * Updates the component's currently mounted DOM representation.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     * @overridable
     */
    updateComponent: 'OVERRIDE_BASE'
  };

  /**
   * Similar to ReactClassInterface but for static methods.
   */
  var ReactClassStaticInterface = {
    /**
     * This method is invoked after a component is instantiated and when it
     * receives new props. Return an object to update state in response to
     * prop changes. Return null to indicate no change to state.
     *
     * If an object is returned, its keys will be merged into the existing state.
     *
     * @return {object || null}
     * @optional
     */
    getDerivedStateFromProps: 'DEFINE_MANY_MERGED'
  };

  /**
   * Mapping from class specification keys to special processing functions.
   *
   * Although these are declared like instance properties in the specification
   * when defining classes using `React.createClass`, they are actually static
   * and are accessible on the constructor instead of the prototype. Despite
   * being static, they must be defined outside of the "statics" key under
   * which all other static methods are defined.
   */
  var RESERVED_SPEC_KEYS = {
    displayName: function(Constructor, displayName) {
      Constructor.displayName = displayName;
    },
    mixins: function(Constructor, mixins) {
      if (mixins) {
        for (var i = 0; i < mixins.length; i++) {
          mixSpecIntoComponent(Constructor, mixins[i]);
        }
      }
    },
    childContextTypes: function(Constructor, childContextTypes) {
      if (false) {
        validateTypeDef(Constructor, childContextTypes, 'childContext');
      }
      Constructor.childContextTypes = _assign(
        {},
        Constructor.childContextTypes,
        childContextTypes
      );
    },
    contextTypes: function(Constructor, contextTypes) {
      if (false) {
        validateTypeDef(Constructor, contextTypes, 'context');
      }
      Constructor.contextTypes = _assign(
        {},
        Constructor.contextTypes,
        contextTypes
      );
    },
    /**
     * Special case getDefaultProps which should move into statics but requires
     * automatic merging.
     */
    getDefaultProps: function(Constructor, getDefaultProps) {
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps = createMergedResultFunction(
          Constructor.getDefaultProps,
          getDefaultProps
        );
      } else {
        Constructor.getDefaultProps = getDefaultProps;
      }
    },
    propTypes: function(Constructor, propTypes) {
      if (false) {
        validateTypeDef(Constructor, propTypes, 'prop');
      }
      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
    },
    statics: function(Constructor, statics) {
      mixStaticSpecIntoComponent(Constructor, statics);
    },
    autobind: function() {}
  };

  function validateTypeDef(Constructor, typeDef, location) {
    for (var propName in typeDef) {
      if (typeDef.hasOwnProperty(propName)) {
        // use a warning instead of an _invariant so components
        // don't show up in prod but only in __DEV__
        if (false) {
          warning(
            typeof typeDef[propName] === 'function',
            '%s: %s type `%s` is invalid; it must be a function, usually from ' +
              'React.PropTypes.',
            Constructor.displayName || 'ReactClass',
            ReactPropTypeLocationNames[location],
            propName
          );
        }
      }
    }
  }

  function validateMethodOverride(isAlreadyDefined, name) {
    var specPolicy = ReactClassInterface.hasOwnProperty(name)
      ? ReactClassInterface[name]
      : null;

    // Disallow overriding of base class methods unless explicitly allowed.
    if (ReactClassMixin.hasOwnProperty(name)) {
      _invariant(
        specPolicy === 'OVERRIDE_BASE',
        'ReactClassInterface: You are attempting to override ' +
          '`%s` from your class specification. Ensure that your method names ' +
          'do not overlap with React methods.',
        name
      );
    }

    // Disallow defining methods more than once unless explicitly allowed.
    if (isAlreadyDefined) {
      _invariant(
        specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED',
        'ReactClassInterface: You are attempting to define ' +
          '`%s` on your component more than once. This conflict may be due ' +
          'to a mixin.',
        name
      );
    }
  }

  /**
   * Mixin helper which handles policy validation and reserved
   * specification keys when building React classes.
   */
  function mixSpecIntoComponent(Constructor, spec) {
    if (!spec) {
      if (false) {
        var typeofSpec = typeof spec;
        var isMixinValid = typeofSpec === 'object' && spec !== null;

        if (process.env.NODE_ENV !== 'production') {
          warning(
            isMixinValid,
            "%s: You're attempting to include a mixin that is either null " +
              'or not an object. Check the mixins included by the component, ' +
              'as well as any mixins they include themselves. ' +
              'Expected object but got %s.',
            Constructor.displayName || 'ReactClass',
            spec === null ? null : typeofSpec
          );
        }
      }

      return;
    }

    _invariant(
      typeof spec !== 'function',
      "ReactClass: You're attempting to " +
        'use a component class or function as a mixin. Instead, just use a ' +
        'regular object.'
    );
    _invariant(
      !isValidElement(spec),
      "ReactClass: You're attempting to " +
        'use a component as a mixin. Instead, just use a regular object.'
    );

    var proto = Constructor.prototype;
    var autoBindPairs = proto.__reactAutoBindPairs;

    // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.
    if (spec.hasOwnProperty(MIXINS_KEY)) {
      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
    }

    for (var name in spec) {
      if (!spec.hasOwnProperty(name)) {
        continue;
      }

      if (name === MIXINS_KEY) {
        // We have already handled mixins in a special case above.
        continue;
      }

      var property = spec[name];
      var isAlreadyDefined = proto.hasOwnProperty(name);
      validateMethodOverride(isAlreadyDefined, name);

      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
        RESERVED_SPEC_KEYS[name](Constructor, property);
      } else {
        // Setup methods on prototype:
        // The following member methods should not be automatically bound:
        // 1. Expected ReactClass methods (in the "interface").
        // 2. Overridden methods (that were mixed in).
        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
        var isFunction = typeof property === 'function';
        var shouldAutoBind =
          isFunction &&
          !isReactClassMethod &&
          !isAlreadyDefined &&
          spec.autobind !== false;

        if (shouldAutoBind) {
          autoBindPairs.push(name, property);
          proto[name] = property;
        } else {
          if (isAlreadyDefined) {
            var specPolicy = ReactClassInterface[name];

            // These cases should already be caught by validateMethodOverride.
            _invariant(
              isReactClassMethod &&
                (specPolicy === 'DEFINE_MANY_MERGED' ||
                  specPolicy === 'DEFINE_MANY'),
              'ReactClass: Unexpected spec policy %s for key %s ' +
                'when mixing in component specs.',
              specPolicy,
              name
            );

            // For methods which are defined more than once, call the existing
            // methods before calling the new property, merging if appropriate.
            if (specPolicy === 'DEFINE_MANY_MERGED') {
              proto[name] = createMergedResultFunction(proto[name], property);
            } else if (specPolicy === 'DEFINE_MANY') {
              proto[name] = createChainedFunction(proto[name], property);
            }
          } else {
            proto[name] = property;
            if (false) {
              // Add verbose displayName to the function, which helps when looking
              // at profiling tools.
              if (typeof property === 'function' && spec.displayName) {
                proto[name].displayName = spec.displayName + '_' + name;
              }
            }
          }
        }
      }
    }
  }

  function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
      return;
    }

    for (var name in statics) {
      var property = statics[name];
      if (!statics.hasOwnProperty(name)) {
        continue;
      }

      var isReserved = name in RESERVED_SPEC_KEYS;
      _invariant(
        !isReserved,
        'ReactClass: You are attempting to define a reserved ' +
          'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
          'as an instance property instead; it will still be accessible on the ' +
          'constructor.',
        name
      );

      var isAlreadyDefined = name in Constructor;
      if (isAlreadyDefined) {
        var specPolicy = ReactClassStaticInterface.hasOwnProperty(name)
          ? ReactClassStaticInterface[name]
          : null;

        _invariant(
          specPolicy === 'DEFINE_MANY_MERGED',
          'ReactClass: You are attempting to define ' +
            '`%s` on your component more than once. This conflict may be ' +
            'due to a mixin.',
          name
        );

        Constructor[name] = createMergedResultFunction(Constructor[name], property);

        return;
      }

      Constructor[name] = property;
    }
  }

  /**
   * Merge two objects, but throw if both contain the same key.
   *
   * @param {object} one The first object, which is mutated.
   * @param {object} two The second object
   * @return {object} one after it has been mutated to contain everything in two.
   */
  function mergeIntoWithNoDuplicateKeys(one, two) {
    _invariant(
      one && two && typeof one === 'object' && typeof two === 'object',
      'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
    );

    for (var key in two) {
      if (two.hasOwnProperty(key)) {
        _invariant(
          one[key] === undefined,
          'mergeIntoWithNoDuplicateKeys(): ' +
            'Tried to merge two objects with the same key: `%s`. This conflict ' +
            'may be due to a mixin; in particular, this may be caused by two ' +
            'getInitialState() or getDefaultProps() methods returning objects ' +
            'with clashing keys.',
          key
        );
        one[key] = two[key];
      }
    }
    return one;
  }

  /**
   * Creates a function that invokes two functions and merges their return values.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createMergedResultFunction(one, two) {
    return function mergedResult() {
      var a = one.apply(this, arguments);
      var b = two.apply(this, arguments);
      if (a == null) {
        return b;
      } else if (b == null) {
        return a;
      }
      var c = {};
      mergeIntoWithNoDuplicateKeys(c, a);
      mergeIntoWithNoDuplicateKeys(c, b);
      return c;
    };
  }

  /**
   * Creates a function that invokes two functions and ignores their return vales.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createChainedFunction(one, two) {
    return function chainedFunction() {
      one.apply(this, arguments);
      two.apply(this, arguments);
    };
  }

  /**
   * Binds a method to the component.
   *
   * @param {object} component Component whose method is going to be bound.
   * @param {function} method Method to be bound.
   * @return {function} The bound method.
   */
  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);
    if (false) {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;
      boundMethod.bind = function(newThis) {
        for (
          var _len = arguments.length,
            args = Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          args[_key - 1] = arguments[_key];
        }

        // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.
        if (newThis !== component && newThis !== null) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              'bind(): React component methods may only be bound to the ' +
                'component instance. See %s',
              componentName
            );
          }
        } else if (!args.length) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              'bind(): You are binding a component method to the component. ' +
                'React does this for you automatically in a high-performance ' +
                'way, so you can safely remove this call. See %s',
              componentName
            );
          }
          return boundMethod;
        }
        var reboundMethod = _bind.apply(boundMethod, arguments);
        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }
    return boundMethod;
  }

  /**
   * Binds all auto-bound methods in a component.
   *
   * @param {object} component Component whose method is going to be bound.
   */
  function bindAutoBindMethods(component) {
    var pairs = component.__reactAutoBindPairs;
    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
      var method = pairs[i + 1];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }

  var IsMountedPreMixin = {
    componentDidMount: function() {
      this.__isMounted = true;
    }
  };

  var IsMountedPostMixin = {
    componentWillUnmount: function() {
      this.__isMounted = false;
    }
  };

  /**
   * Add more to the ReactClass base class. These are all legacy features and
   * therefore not already part of the modern ReactComponent.
   */
  var ReactClassMixin = {
    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function(newState, callback) {
      this.updater.enqueueReplaceState(this, newState, callback);
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function() {
      if (false) {
        warning(
          this.__didWarnIsMounted,
          '%s: isMounted is deprecated. Instead, make sure to clean up ' +
            'subscriptions and pending requests in componentWillUnmount to ' +
            'prevent memory leaks.',
          (this.constructor && this.constructor.displayName) ||
            this.name ||
            'Component'
        );
        this.__didWarnIsMounted = true;
      }
      return !!this.__isMounted;
    }
  };

  var ReactClassComponent = function() {};
  _assign(
    ReactClassComponent.prototype,
    ReactComponent.prototype,
    ReactClassMixin
  );

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  function createClass(spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity(function(props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if (false) {
        warning(
          this instanceof Constructor,
          'Something is calling a React component directly. Use a factory or ' +
            'JSX instead. See: https://fb.me/react-legacyfactory'
        );
      }

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if (false) {
        // We allow auto-mocks to proceed as if they're returning null.
        if (
          initialState === undefined &&
          this.getInitialState._isMockFunction
        ) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      _invariant(
        typeof initialState === 'object' && !Array.isArray(initialState),
        '%s.getInitialState(): must return an object or null',
        Constructor.displayName || 'ReactCompositeComponent'
      );

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
    mixSpecIntoComponent(Constructor, spec);
    mixSpecIntoComponent(Constructor, IsMountedPostMixin);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if (false) {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    _invariant(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    );

    if (false) {
      warning(
        !Constructor.prototype.componentShouldUpdate,
        '%s has a method called ' +
          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
          'The name is phrased as a question because the function is ' +
          'expected to return a value.',
        spec.displayName || 'A component'
      );
      warning(
        !Constructor.prototype.componentWillRecieveProps,
        '%s has a method called ' +
          'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
      warning(
        !Constructor.prototype.UNSAFE_componentWillRecieveProps,
        '%s has a method called UNSAFE_componentWillRecieveProps(). ' +
          'Did you mean UNSAFE_componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  }

  return createClass;
}

module.exports = factory;


/***/ }),

/***/ 1632:
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(1);
var createReactClass = __webpack_require__(721);
var PropTypes = __webpack_require__(11);
var NotificationItem = __webpack_require__(1633);
var Constants = __webpack_require__(722);

var NotificationContainer = createReactClass({

  propTypes: {
    position: PropTypes.string.isRequired,
    notifications: PropTypes.array.isRequired,
    getStyles: PropTypes.object
  },

  _style: {},

  componentWillMount: function() {
    // Fix position if width is overrided
    this._style = this.props.getStyles.container(this.props.position);

    if (this.props.getStyles.overrideWidth && (this.props.position === Constants.positions.tc || this.props.position === Constants.positions.bc)) {
      this._style.marginLeft = -(this.props.getStyles.overrideWidth / 2);
    }
  },

  render: function() {
    var self = this;
    var notifications;

    if ([Constants.positions.bl, Constants.positions.br, Constants.positions.bc].indexOf(this.props.position) > -1) {
      this.props.notifications.reverse();
    }

    notifications = this.props.notifications.map(function(notification) {
      return (
        React.createElement(NotificationItem, {
          ref:  'notification-' + notification.uid, 
          key:  notification.uid, 
          notification:  notification, 
          getStyles:  self.props.getStyles, 
          onRemove:  self.props.onRemove, 
          noAnimation:  self.props.noAnimation, 
          allowHTML:  self.props.allowHTML, 
          children:  self.props.children}
        )
      );
    });

    return (
      React.createElement("div", {className:  'notifications-' + this.props.position, style:  this._style}, 
         notifications 
      )
    );
  }
});


module.exports = NotificationContainer;


/***/ }),

/***/ 1633:
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(1);
var createReactClass = __webpack_require__(721);
var PropTypes = __webpack_require__(11);
var ReactDOM = __webpack_require__(26);
var Constants = __webpack_require__(722);
var Helpers = __webpack_require__(1634);
var merge = __webpack_require__(92);

/* From Modernizr */
var whichTransitionEvent = function() {
  var el = document.createElement('fakeelement');
  var transition;
  var transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  };

  Object.keys(transitions).forEach(function(transitionKey) {
    if (el.style[transitionKey] !== undefined) {
      transition = transitions[transitionKey];
    }
  });

  return transition;
};

var NotificationItem = createReactClass({
  propTypes: {
    notification: PropTypes.object,
    getStyles: PropTypes.object,
    onRemove: PropTypes.func,
    allowHTML: PropTypes.bool,
    noAnimation: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ])
  },

  getDefaultProps: function() {
    return {
      noAnimation: false,
      onRemove: function() {},
      allowHTML: false
    };
  },

  getInitialState: function() {
    return {
      visible: undefined,
      removed: false
    };
  },

  componentWillMount: function() {
    var getStyles = this.props.getStyles;
    var level = this.props.notification.level;
    var dismissible = this.props.notification.dismissible;

    this._noAnimation = this.props.noAnimation;

    this._styles = {
      notification: getStyles.byElement('notification')(level),
      title: getStyles.byElement('title')(level),
      dismiss: getStyles.byElement('dismiss')(level),
      messageWrapper: getStyles.byElement('messageWrapper')(level),
      actionWrapper: getStyles.byElement('actionWrapper')(level),
      action: getStyles.byElement('action')(level)
    };

    if (!dismissible || dismissible === 'none' || dismissible === 'button') {
      this._styles.notification.cursor = 'default';
    }
  },

  _styles: {},

  _notificationTimer: null,

  _height: 0,

  _noAnimation: null,

  _isMounted: false,

  _removeCount: 0,

  _getCssPropertyByPosition: function() {
    var position = this.props.notification.position;
    var css = {};

    switch (position) {
    case Constants.positions.tl:
    case Constants.positions.bl:
      css = {
        property: 'left',
        value: -200
      };
      break;

    case Constants.positions.tr:
    case Constants.positions.br:
      css = {
        property: 'right',
        value: -200
      };
      break;

    case Constants.positions.tc:
      css = {
        property: 'top',
        value: -100
      };
      break;

    case Constants.positions.bc:
      css = {
        property: 'bottom',
        value: -100
      };
      break;

    default:
    }

    return css;
  },

  _defaultAction: function(event) {
    var notification = this.props.notification;

    event.preventDefault();
    this._hideNotification();
    if (typeof notification.action.callback === 'function') {
      notification.action.callback();
    }
  },

  _hideNotification: function() {
    if (this._notificationTimer) {
      this._notificationTimer.clear();
    }

    if (this._isMounted) {
      this.setState({
        visible: false,
        removed: true
      });
    }

    if (this._noAnimation) {
      this._removeNotification();
    }
  },

  _removeNotification: function() {
    this.props.onRemove(this.props.notification.uid);
  },

  _dismiss: function() {
    if (!this.props.notification.dismissible) {
      return;
    }

    this._hideNotification();
  },

  _showNotification: function() {
    var self = this;
    setTimeout(function() {
      if (self._isMounted) {
        self.setState({
          visible: true
        });
      }
    }, 50);
  },

  _onTransitionEnd: function() {
    if (this._removeCount > 0) return;
    if (this.state.removed) {
      this._removeCount += 1;
      this._removeNotification();
    }
  },

  componentDidMount: function() {
    var self = this;
    var transitionEvent = whichTransitionEvent();
    var notification = this.props.notification;
    var element = ReactDOM.findDOMNode(this);

    this._height = element.offsetHeight;

    this._isMounted = true;

    // Watch for transition end
    if (!this._noAnimation) {
      if (transitionEvent) {
        element.addEventListener(transitionEvent, this._onTransitionEnd);
      } else {
        this._noAnimation = true;
      }
    }


    if (notification.autoDismiss) {
      this._notificationTimer = new Helpers.Timer(function() {
        self._hideNotification();
      }, notification.autoDismiss * 1000);
    }

    this._showNotification();
  },

  _handleMouseEnter: function() {
    var notification = this.props.notification;
    if (notification.autoDismiss) {
      this._notificationTimer.pause();
    }
  },

  _handleMouseLeave: function() {
    var notification = this.props.notification;
    if (notification.autoDismiss) {
      this._notificationTimer.resume();
    }
  },

  _handleNotificationClick: function() {
    var dismissible = this.props.notification.dismissible;
    if (dismissible === 'both' || dismissible === 'click' || dismissible === true) {
      this._dismiss();
    }
  },

  componentWillUnmount: function() {
    var element = ReactDOM.findDOMNode(this);
    var transitionEvent = whichTransitionEvent();
    element.removeEventListener(transitionEvent, this._onTransitionEnd);
    this._isMounted = false;
  },

  _allowHTML: function(string) {
    return { __html: string };
  },

  render: function() {
    var notification = this.props.notification;
    var className = 'notification notification-' + notification.level;
    var notificationStyle = merge({}, this._styles.notification);
    var cssByPos = this._getCssPropertyByPosition();
    var dismiss = null;
    var actionButton = null;
    var title = null;
    var message = null;

    if (this.state.visible) {
      className += ' notification-visible';
    } else if (this.state.visible === false) {
      className += ' notification-hidden';
    }

    if (notification.dismissible === 'none') {
      className += ' notification-not-dismissible';
    }

    if (this.props.getStyles.overrideStyle) {
      if (!this.state.visible && !this.state.removed) {
        notificationStyle[cssByPos.property] = cssByPos.value;
      }

      if (this.state.visible && !this.state.removed) {
        notificationStyle.height = this._height;
        notificationStyle[cssByPos.property] = 0;
      }

      if (this.state.removed) {
        notificationStyle.overlay = 'hidden';
        notificationStyle.height = 0;
        notificationStyle.marginTop = 0;
        notificationStyle.paddingTop = 0;
        notificationStyle.paddingBottom = 0;
      }
      notificationStyle.opacity = this.state.visible ? this._styles.notification.isVisible.opacity : this._styles.notification.isHidden.opacity;
    }

    if (notification.title) {
      title = React.createElement("h4", {className: "notification-title", style:  this._styles.title},  notification.title);
    }

    if (notification.message) {
      if (this.props.allowHTML) {
        message = (
          React.createElement("div", {className: "notification-message", style:  this._styles.messageWrapper, dangerouslySetInnerHTML:  this._allowHTML(notification.message) })
        );
      } else {
        message = (
          React.createElement("div", {className: "notification-message", style:  this._styles.messageWrapper},  notification.message)
        );
      }
    }
    if (notification.dismissible === 'both' || notification.dismissible === 'button' || notification.dismissible === true) {
      dismiss = React.createElement("span", {className: "notification-dismiss", onClick:  this._dismiss, style:  this._styles.dismiss}, "×");
    }

    if (notification.action) {
      actionButton = (
        React.createElement("div", {className: "notification-action-wrapper", style:  this._styles.actionWrapper}, 
          React.createElement("button", {className: "notification-action-button", 
            onClick:  this._defaultAction, 
            style:  this._styles.action}, 
             notification.action.label
          )
        )
      );
    }

    if (notification.children) {
      actionButton = notification.children;
    }

    return (
      React.createElement("div", {className:  className, onClick:  this._handleNotificationClick, onMouseEnter:  this._handleMouseEnter, onMouseLeave:  this._handleMouseLeave, style:  notificationStyle }, 
         title, 
         message, 
         dismiss, 
         actionButton 
      )
    );
  }

});

module.exports = NotificationItem;


/***/ }),

/***/ 1634:
/***/ (function(module, exports) {

var Helpers = {
  Timer: function(callback, delay) {
    var timerId;
    var start;
    var remaining = delay;

    this.pause = function() {
      clearTimeout(timerId);
      remaining -= new Date() - start;
    };

    this.resume = function() {
      start = new Date();
      clearTimeout(timerId);
      timerId = setTimeout(callback, remaining);
    };

    this.clear = function() {
      clearTimeout(timerId);
    };

    this.resume();
  }
};

module.exports = Helpers;


/***/ }),

/***/ 1635:
/***/ (function(module, exports) {

// Used for calculations
var defaultWidth = 320;
var defaultColors = {
  success: {
    rgb: '94, 164, 0',
    hex: '#5ea400'
  },
  error: {
    rgb: '236, 61, 61',
    hex: '#ec3d3d'
  },
  warning: {
    rgb: '235, 173, 23',
    hex: '#ebad1a'
  },
  info: {
    rgb: '54, 156, 199',
    hex: '#369cc7'
  }
};
var defaultShadowOpacity = '0.9';

var STYLES = {

  Wrapper: {},
  Containers: {
    DefaultStyle: {
      fontFamily: 'inherit',
      position: 'fixed',
      width: defaultWidth,
      padding: '0 10px 10px 10px',
      zIndex: 9998,
      WebkitBoxSizing: 'border-box',
      MozBoxSizing: 'border-box',
      boxSizing: 'border-box',
      height: 'auto'
    },

    tl: {
      top: '0px',
      bottom: 'auto',
      left: '0px',
      right: 'auto'
    },

    tr: {
      top: '0px',
      bottom: 'auto',
      left: 'auto',
      right: '0px'
    },

    tc: {
      top: '0px',
      bottom: 'auto',
      margin: '0 auto',
      left: '50%',
      marginLeft: -(defaultWidth / 2)
    },

    bl: {
      top: 'auto',
      bottom: '0px',
      left: '0px',
      right: 'auto'
    },

    br: {
      top: 'auto',
      bottom: '0px',
      left: 'auto',
      right: '0px'
    },

    bc: {
      top: 'auto',
      bottom: '0px',
      margin: '0 auto',
      left: '50%',
      marginLeft: -(defaultWidth / 2)
    }

  },

  NotificationItem: {
    DefaultStyle: {
      position: 'relative',
      width: '100%',
      cursor: 'pointer',
      borderRadius: '2px',
      fontSize: '13px',
      margin: '10px 0 0',
      padding: '10px',
      display: 'block',
      WebkitBoxSizing: 'border-box',
      MozBoxSizing: 'border-box',
      boxSizing: 'border-box',
      opacity: 0,
      transition: '0.3s ease-in-out',
      WebkitTransform: 'translate3d(0, 0, 0)',
      transform: 'translate3d(0, 0, 0)',
      willChange: 'transform, opacity',

      isHidden: {
        opacity: 0
      },

      isVisible: {
        opacity: 1
      }
    },

    success: {
      borderTop: '2px solid ' + defaultColors.success.hex,
      backgroundColor: '#f0f5ea',
      color: '#4b583a',
      WebkitBoxShadow: '0 0 1px rgba(' + defaultColors.success.rgb + ',' + defaultShadowOpacity + ')',
      MozBoxShadow: '0 0 1px rgba(' + defaultColors.success.rgb + ',' + defaultShadowOpacity + ')',
      boxShadow: '0 0 1px rgba(' + defaultColors.success.rgb + ',' + defaultShadowOpacity + ')'
    },

    error: {
      borderTop: '2px solid ' + defaultColors.error.hex,
      backgroundColor: '#f4e9e9',
      color: '#412f2f',
      WebkitBoxShadow: '0 0 1px rgba(' + defaultColors.error.rgb + ',' + defaultShadowOpacity + ')',
      MozBoxShadow: '0 0 1px rgba(' + defaultColors.error.rgb + ',' + defaultShadowOpacity + ')',
      boxShadow: '0 0 1px rgba(' + defaultColors.error.rgb + ',' + defaultShadowOpacity + ')'
    },

    warning: {
      borderTop: '2px solid ' + defaultColors.warning.hex,
      backgroundColor: '#f9f6f0',
      color: '#5a5343',
      WebkitBoxShadow: '0 0 1px rgba(' + defaultColors.warning.rgb + ',' + defaultShadowOpacity + ')',
      MozBoxShadow: '0 0 1px rgba(' + defaultColors.warning.rgb + ',' + defaultShadowOpacity + ')',
      boxShadow: '0 0 1px rgba(' + defaultColors.warning.rgb + ',' + defaultShadowOpacity + ')'
    },

    info: {
      borderTop: '2px solid ' + defaultColors.info.hex,
      backgroundColor: '#e8f0f4',
      color: '#41555d',
      WebkitBoxShadow: '0 0 1px rgba(' + defaultColors.info.rgb + ',' + defaultShadowOpacity + ')',
      MozBoxShadow: '0 0 1px rgba(' + defaultColors.info.rgb + ',' + defaultShadowOpacity + ')',
      boxShadow: '0 0 1px rgba(' + defaultColors.info.rgb + ',' + defaultShadowOpacity + ')'
    }
  },

  Title: {
    DefaultStyle: {
      fontSize: '14px',
      margin: '0 0 5px 0',
      padding: 0,
      fontWeight: 'bold'
    },

    success: {
      color: defaultColors.success.hex
    },

    error: {
      color: defaultColors.error.hex
    },

    warning: {
      color: defaultColors.warning.hex
    },

    info: {
      color: defaultColors.info.hex
    }

  },

  MessageWrapper: {
    DefaultStyle: {
      margin: 0,
      padding: 0
    }
  },

  Dismiss: {
    DefaultStyle: {
      cursor: 'pointer',
      fontFamily: 'Arial',
      fontSize: '17px',
      position: 'absolute',
      top: '4px',
      right: '5px',
      lineHeight: '15px',
      backgroundColor: '#dededf',
      color: '#ffffff',
      borderRadius: '50%',
      width: '14px',
      height: '14px',
      fontWeight: 'bold',
      textAlign: 'center'
    },

    success: {
      color: '#f0f5ea',
      backgroundColor: '#b0ca92'
    },

    error: {
      color: '#f4e9e9',
      backgroundColor: '#e4bebe'
    },

    warning: {
      color: '#f9f6f0',
      backgroundColor: '#e1cfac'
    },

    info: {
      color: '#e8f0f4',
      backgroundColor: '#a4becb'
    }
  },

  Action: {
    DefaultStyle: {
      background: '#ffffff',
      borderRadius: '2px',
      padding: '6px 20px',
      fontWeight: 'bold',
      margin: '10px 0 0 0',
      border: 0
    },

    success: {
      backgroundColor: defaultColors.success.hex,
      color: '#ffffff'
    },

    error: {
      backgroundColor: defaultColors.error.hex,
      color: '#ffffff'
    },

    warning: {
      backgroundColor: defaultColors.warning.hex,
      color: '#ffffff'
    },

    info: {
      backgroundColor: defaultColors.info.hex,
      color: '#ffffff'
    }
  },

  ActionWrapper: {
    DefaultStyle: {
      margin: 0,
      padding: 0
    }
  }
};

module.exports = STYLES;


/***/ }),

/***/ 1636:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const AppNotificationStyles = {
  Containers: {
    DefaultStyle: {
      zIndex: 110,
      width: 360 },

    tr: { bottom: '30px', top: 'unset' } },

  MessageWrapper: {
    DefaultStyle: {
      display: 'inline-block',
      paddingRight: '10px' } },


  NotificationItem: {
    DefaultStyle: {
      textAlign: 'inherit',
      wordBreak: 'break-word',
      margin: '0',
      overflowY: 'hidden',
      transition: 'all 0.3s ease-in-out',
      cursor: 'default' },


    success: {
      borderTop: 'none',
      backgroundColor: 'none',
      boxShadow: 'none' },


    error: {
      borderTop: 'none',
      backgroundColor: 'none',
      boxShadow: 'none' },


    warning: {
      borderTop: 'none',
      backgroundColor: 'none',
      boxShadow: 'none' },


    info: {
      borderTop: 'none',
      backgroundColor: 'none',
      boxShadow: 'none' } },


  ActionWrapper: { DefaultStyle: { display: 'inline-block' } },
  Action: {
    DefaultStyle: {
      backgroundColor: 'transparent',
      borderRadius: '0',
      padding: '0',
      fontWeight: 'bold',
      margin: '0 0 0 5px',
      border: 0,
      textDecoration: 'underline' },


    success: {
      backgroundColor: 'transparent',
      color: '#468847' },


    error: {
      backgroundColor: 'transparent',
      color: '#B94A48' },


    warning: {
      backgroundColor: 'transparent',
      color: '#C09853' },


    info: {
      backgroundColor: 'transparent',
      color: '#3A87AD' } },


  Dismiss: { DefaultStyle: { display: 'none' } } };


/* harmony default export */ __webpack_exports__["a"] = (AppNotificationStyles);

/***/ }),

/***/ 1637:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Explorer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ExplorerRow__ = __webpack_require__(1638);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ExplorerSearch__ = __webpack_require__(1639);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ExplorerResults__ = __webpack_require__(1640);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ExplorerCreateRow__ = __webpack_require__(1641);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_mobx_react__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__base_Icons_LeftSolidIcon__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__collections_CollectionForkLabel__ = __webpack_require__(714);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_prop_types__);
var _class;









let defaultSelection = {
  id: null,
  depth: -1 };let



Explorer = Object(__WEBPACK_IMPORTED_MODULE_5_mobx_react__["a" /* observer */])(_class = class Explorer extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = {
      targets: [],
      selected: defaultSelection,
      filter: '',
      isCreating: false };


    this.setTargets = this.setTargets.bind(this);
    this.setTargetsDebounced = _.debounce(this.setTargets, 300);
    this.isLeaf = this.isLeaf.bind(this);
    this.getNextTargets = this.getNextTargets.bind(this);
    this.setNextTargets = this.setNextTargets.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleStartCreate = this.handleStartCreate.bind(this);
    this.handleCancelCreate = this.handleCancelCreate.bind(this);
  }

  componentWillMount() {
    this.setTargets();
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props.targets, nextProps.targets)) {
      return;
    }

    // hackk implementation for new collection/folder added
    if (nextProps.newTargetId && this.props.newTargetId === undefined) {
      let selected = _.find(nextProps.targets, target => {
        return _.isEqual(target.id, nextProps.newTargetId);
      });

      this.props.onSelect && this.props.onSelect(selected);
      this.setState({ selected: selected });
      return this.setNextTargets(nextProps.targets, selected);
    }

    this.setNextTargets(nextProps.targets, this.state.selected);
  }

  /**
     * find parent of the currently selected parent when going back
     */
  getSelectionParent() {
    let selected = this.state.selected,
    targets = this.props.targets,
    selectedIndex = _.findIndex(targets, ['id', selected.id]);

    if (selectedIndex === -1) {
      return this.state.selected;
    }

    let parentIndex = _.chain(targets).
    slice(0, selectedIndex).
    findLastIndex(['depth', selected.depth - 1]).
    value();

    if (parentIndex === -1) {
      return defaultSelection;
    }

    return this.props.targets[parentIndex];
  }

  setTargets(targets = this.props.targets) {
    this.setNextTargets(targets);
  }

  isLeaf(targets, node) {
    if (this.props.isLeaf) {
      return this.props.isLeaf(node);
    } else
    {
      let nextTargets = this.getNextTargets(targets, node);
      return !_.size(nextTargets);
    }
  }

  /**
     * get the next list of collections/folders as per the selected collection/folder
     * @param {Array} currentTargets - list of flattened collections and folders
     * @param {Object} selectedTarget - selected collection/folder
     */
  getNextTargets(currentTargets, selectedTarget) {
    // find index of the selected target from the array of currentTargets
    let selectedTargetIndex = _.findIndex(currentTargets, ['id', selectedTarget.id]);

    // handle in case there is no selected collection(when we initially open the modal to save request)
    if (selectedTargetIndex === -1) {
      this.setState({ selected: defaultSelection });
      return currentTargets;
    }

    // find index of the next collection/folder at same depth as the selectedTarget
    let endIndex = _.findIndex(currentTargets, n => {return n.depth <= currentTargets[selectedTargetIndex].depth;}, selectedTargetIndex + 1);

    // handle in case there is no next collection/folder having same depth in the currentTargets
    if (endIndex === -1) {
      endIndex = _.size(currentTargets);
    }

    // return the list of selected target tree
    return _.slice(currentTargets, selectedTargetIndex + 1, endIndex);
  }

  /**
     * set the next list of collections/folders as per the selected collection/folder
     * @param {Array} currentTargets - list of flattened collections and folders
     * @param {Object} selectedTarget - selected collection/folder
     */
  setNextTargets(currentTargets, selectedTarget = defaultSelection) {
    let nextTargets = this.getNextTargets(currentTargets, selectedTarget);
    this.setState({ targets: nextTargets });
  }

  /**
     * get the next targets on select of any collection/folder
     * @param {Object} target
     * @param {*} isLeaf
     */

  handleSelect(target, isLeaf = false) {
    if (this.props.disableLeaves && isLeaf) {
      return;
    }
    let nextTargets = this.getNextTargets(this.props.targets, target);
    this.setState({
      selected: target,
      filter: '',
      targets: nextTargets });

    this.handleCancelCreate && this.handleCancelCreate();
    this.props.onSelect && this.props.onSelect(target);
  }

  /**
     * go back one level up in the directory tree,fetch the parent of the selected target along with the next targets
     */
  handleBack() {
    let selected = this.getSelectionParent(),
    nextTargets = this.getNextTargets(this.props.targets, selected);

    this.setState({
      selected,
      targets: nextTargets });

    this.handleCancelCreate && this.handleCancelCreate();
    _.invoke(this, 'props.onBack', selected);
  }

  /**
     * search results based on the filter value
     * @param  {string} filter - collection/folder searched
     */
  handleSearch(filter) {
    this.setState({ filter }, () => {
      this.props.onFilter && this.props.onFilter(filter);
    });
  }

  /**
     * start creating collection/folder
     */
  handleStartCreate() {
    // create new collection/folder if the searched filter named collection/folder does not exist
    if (!_.isEmpty(this.state.filter)) {
      this.handleCreate(this.state.filter);
      return;
    }
    this.setState({ isCreating: true });
  }

  handleCancelCreate() {
    this.setState({ isCreating: false });
  }

  /**
     * to create new collection/folder
     * @param {string} name - name of collection or folder created
     */
  handleCreate(name) {
    if (!_.isEmpty(name)) {
      this.setState({ isCreating: false, filter: '' });
      _.invoke(this.props, 'onCreate', name, this.state.selected);
    }
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer__header-wrapper' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__ExplorerSearch__["a" /* default */], {
            filter: this.state.filter,
            onSearch: this.handleSearch }),

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer__header__create-wrapper' },

            _.isEqual(this.state.selected, defaultSelection) ?
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer__header-title' },
              _.isEmpty(this.state.filter) ? 'All Collections' : 'Search Results') :

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                className: 'explorer-pop-btn',
                onClick: this.handleBack },

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__base_Icons_LeftSolidIcon__["a" /* default */], { className: 'explorer-pop-btn__icon' }),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-pop-btn__text' },
                this.state.selected.name),

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-pop-btn__meta' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__collections_CollectionForkLabel__["a" /* default */], { forkInfo: _.get(this.state.selected, 'forkInfo') }))),




            !this.props.disableCreate &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                className: 'explorer__header-create-btn',
                onClick: this.handleStartCreate },

              this.props.createText && this.props.createText(this.state.selected)))),





        this.state.isCreating &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__ExplorerCreateRow__["a" /* default */], {
          placeholder: _.invoke(this.props, 'createPlaceholder', this.state.selected),
          onCancel: this.handleCancelCreate,
          onCreate: this.handleCreate }),



        _.isEmpty(this.state.filter) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-rows' },

          _.map(this.state.targets, (target, index) => {
            let isLeaf = this.isLeaf(this.state.targets, target);

            return target.depth === this.state.selected.depth + 1 && (
            !this.props.hideLeaves || !isLeaf) &&
            !(this.props.hideNodes && this.props.hideNodes(target)) &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__ExplorerRow__["a" /* default */], {
              disableLeaves: this.props.disableLeaves,
              filter: this.state.filter,
              isLeaf: isLeaf,
              key: index,
              leafIcon: this.props.leafIcon,
              target: target,
              onSelect: this.handleSelect });


          })),




        !_.isEmpty(this.state.filter) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__ExplorerResults__["a" /* default */], {
          filter: this.state.filter,
          allTargets: this.props.targets,
          isLeaf: this.props.isLeaf,
          onSelect: this.handleSelect })));




  }}) || _class;


Explorer.propTypes = {
  createPlaceholder: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
  createText: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func, // The callback function that will be called to render the first row in every view
  disableCreate: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  disableLeaves: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool, // Indicates if leaves will be shown
  hideLeaves: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  hideNodes: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func, // The callback function that will be called so you can hide specific nodes if needed
  isLeaf: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func, // The callback function that will be called to check if a node is a leaf
  leafIcon: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func, // The callback called to render the leaf icon
  onBack: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
  onCreate: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
  onFilter: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
  onSelect: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
  targets: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.array };


Explorer.defaultProps = { disableLeaves: false };
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1638:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExplorerRow; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_Icons_CollectionIcon__ = __webpack_require__(1577);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_Icons_RightSolidIcon__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__collections_CollectionMetaIcons__ = __webpack_require__(1582);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__collections_CollectionForkLabel__ = __webpack_require__(714);






let

ExplorerRow = class ExplorerRow extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.getClasses = this.getClasses.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  getClasses(target) {
    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'explorer-row': true,
      'is-selected': target.id === _.get(this, 'props.selected.id'),
      'is-disabled': this.props.leafIcon && this.props.isLeaf },
    this.props.className);
  }

  /**
     * select a collection/folder
     * @param {Object} target
     */
  handleSelect(target, e) {
    e && e.stopPropagation();
    e && e.preventDefault();

    !this.props.isLeaf && _.invoke(this, 'props.onSelect', target, this.props.isLeaf);
  }

  render() {
    let { target } = this.props;

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
          className: this.getClasses(target),
          onClick: this.handleSelect.bind(this, target) },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-row__icon' },

          this.props.isLeaf && _.isFunction(this.props.leafIcon) ?
          this.props.leafIcon(target) :
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Icons_CollectionIcon__["a" /* default */], { className: 'explorer-row__icon-icon' })),


        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-row__name' },
          target.name),

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-row__icons' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__collections_CollectionMetaIcons__["a" /* default */], { collection: target })),

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-row__meta' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__collections_CollectionForkLabel__["a" /* default */], { forkInfo: _.get(target, 'forkInfo') })),


        !this.props.isLeaf &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Icons_RightSolidIcon__["a" /* default */], { className: 'explorer-row__forward' })));



  }};


ExplorerRow.propTypes = {
  depth: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.number,
  filter: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.string,
  isLeaf: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.bool,
  onSelect: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.func,
  selected: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.object,
  target: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.object };
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1639:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExplorerSearch; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_Inputs__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prop_types__);


let

ExplorerSearch = class ExplorerSearch extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-search' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__base_Inputs__["b" /* Input */], {
          inputStyle: 'search',
          placeholder: 'Search for a collection or folder',
          query: this.props.filter,
          onChange: this.props.onSearch })));



  }};


ExplorerSearch.propTypes = {
  filter: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.string.isRequired,
  onSearch: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.func.isRequired };

/***/ }),

/***/ 1640:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExplorerResults; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_SearchHighlighter__ = __webpack_require__(587);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_CollectionTreeUtil__ = __webpack_require__(1042);




let

ExplorerResults = class ExplorerResults extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = { filteredItems: this.filterTargets(props.allTargets, props.filter) };

    this.filterTargets = this.filterTargets.bind(this);
    this.getPath = this.getPath.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.setFilteredItems = this.setFilteredItems.bind(this);
    this.setFilteredItemsDebounced = _.debounce(this.setFilteredItems, 300, {
      leading: false,
      trailing: true });

  }

  componentWillReceiveProps(nextProps) {
    this.setFilteredItemsDebounced(nextProps);
  }

  getHighlightClasses(text) {
    return __WEBPACK_IMPORTED_MODULE_2_classnames___default()({ 'highlight': text.isHighlight });
  }

  filterTargets(targets = this.props.allTargets, filter = this.props.filter) {
    return _.filter(targets, target => {
      if (_.isFunction(this.props.isLeaf)) {
        return !this.props.isLeaf(target) && _.includes(_.toLower(target.name), _.toLower(filter));
      }
      return _.includes(_.toLower(target.name), _.toLower(filter));
    });
  }

  setFilteredItems(nextProps) {
    this.setState({ filteredItems: this.filterTargets(nextProps.allTargets, nextProps.filter) });
  }

  getPath(target, itemToFind) {
    return Object(__WEBPACK_IMPORTED_MODULE_4__utils_CollectionTreeUtil__["b" /* getNodePath */])(target, itemToFind);
  }

  handleSelect(item) {
    _.invoke(this, 'props.onSelect', item);
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-results' },

        _.map(this.state.filteredItems, (target, index) => {
          return (
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                className: 'explorer-row explorer-result',
                key: index,
                onClick: this.handleSelect.bind(this, target) },

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-row__icon' }),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-row__content' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-row__name' },
                  target.name),

                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-result__path' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_SearchHighlighter__["a" /* default */], {
                    source: this.getPath(this.props.allTargets, target),
                    query: this.props.filter })))));





        })));



  }};



ExplorerResults.propTypes = {
  filter: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
  onSelect: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
  targets: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.array };
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1641:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExplorerCreateRow; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_Inputs__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_Icons_SuccessIcon__ = __webpack_require__(579);



let

ExplorerCreateRow = class ExplorerCreateRow extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = { name: '' };

    this.handleCreate = this.handleCreate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.refs.input && this.refs.input.focus();
  }

  handleCreate(e) {
    e && e.preventDefault();
    e && e.stopPropagation();
    this.props.onCreate(this.state.name);
  }

  handleCancel(e) {
    this.setState({ name: '' });
    this.props.onCancel && this.props.onCancel();
  }

  handleChange(value) {
    this.setState({ name: value });
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
          className: 'explorer-create-row' },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-row__icon' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'explorer-row__icon-icon' })),

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Inputs__["b" /* Input */], {
          className: 'explorer-row__create',
          inputStyle: 'search',
          hideSearchGlass: true,
          placeholder: this.props.placeholder,
          ref: 'input',
          query: this.state.name,
          onCancel: this.handleCancel,
          onChange: this.handleChange,
          onSubmit: this.handleCreate,
          onEnter: this.handleCreate }),

        !_.isEmpty(_.isString(this.state.name) && this.state.name.trim()) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: 'explorer-row__save',
            onClick: this.handleCreate },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Icons_SuccessIcon__["a" /* default */], {
            className: 'explorer-row__save-icon',
            style: 'primary' }))));





  }};


ExplorerCreateRow.propTypes = {
  onCancel: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
  onCreate: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired,
  placeholder: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired };
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1643:
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(1644);

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),

/***/ 1644:
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(1077);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),

/***/ 1645:
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(1646);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),

/***/ 1646:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(155),
    arrayMap = __webpack_require__(348),
    isArray = __webpack_require__(52),
    isSymbol = __webpack_require__(719);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),

/***/ 1647:
/***/ (function(module, exports, __webpack_require__) {

var baseIsMatch = __webpack_require__(1648),
    getMatchData = __webpack_require__(1662),
    matchesStrictComparable = __webpack_require__(1051);

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;


/***/ }),

/***/ 1648:
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(724),
    baseIsEqual = __webpack_require__(1038);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;


/***/ }),

/***/ 1649:
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(588);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ 1650:
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ 1651:
/***/ (function(module, exports) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ 1652:
/***/ (function(module, exports) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ 1653:
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(588),
    Map = __webpack_require__(732),
    MapCache = __webpack_require__(745);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ 1654:
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(724),
    equalArrays = __webpack_require__(1045),
    equalByTag = __webpack_require__(1656),
    equalObjects = __webpack_require__(1658),
    getTag = __webpack_require__(341),
    isArray = __webpack_require__(52),
    isBuffer = __webpack_require__(211),
    isTypedArray = __webpack_require__(240);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),

/***/ 1655:
/***/ (function(module, exports) {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),

/***/ 1656:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(155),
    Uint8Array = __webpack_require__(1046),
    eq = __webpack_require__(399),
    equalArrays = __webpack_require__(1045),
    mapToArray = __webpack_require__(1657),
    setToArray = __webpack_require__(746);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),

/***/ 1657:
/***/ (function(module, exports) {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),

/***/ 1658:
/***/ (function(module, exports, __webpack_require__) {

var getAllKeys = __webpack_require__(1047);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),

/***/ 1659:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(301),
    root = __webpack_require__(109);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ 1660:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(301),
    root = __webpack_require__(109);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ 1661:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(301),
    root = __webpack_require__(109);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ 1662:
/***/ (function(module, exports, __webpack_require__) {

var isStrictComparable = __webpack_require__(1050),
    keys = __webpack_require__(153);

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;


/***/ }),

/***/ 1663:
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(1038),
    get = __webpack_require__(1585),
    hasIn = __webpack_require__(1664),
    isKey = __webpack_require__(723),
    isStrictComparable = __webpack_require__(1050),
    matchesStrictComparable = __webpack_require__(1051),
    toKey = __webpack_require__(583);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


/***/ }),

/***/ 1664:
/***/ (function(module, exports, __webpack_require__) {

var baseHasIn = __webpack_require__(1665),
    hasPath = __webpack_require__(1062);

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;


/***/ }),

/***/ 1665:
/***/ (function(module, exports) {

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;


/***/ }),

/***/ 1666:
/***/ (function(module, exports, __webpack_require__) {

var baseProperty = __webpack_require__(1052),
    basePropertyDeep = __webpack_require__(1667),
    isKey = __webpack_require__(723),
    toKey = __webpack_require__(583);

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;


/***/ }),

/***/ 1667:
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(1043);

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;


/***/ }),

/***/ 1668:
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(584),
    isArrayLike = __webpack_require__(72);

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;


/***/ }),

/***/ 1669:
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(1670);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),

/***/ 1670:
/***/ (function(module, exports) {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),

/***/ 1671:
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(72);

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;


/***/ }),

/***/ 1672:
/***/ (function(module, exports) {

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;


/***/ }),

/***/ 1673:
/***/ (function(module, exports) {

/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initAccum
      ? (initAccum = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = baseReduce;


/***/ }),

/***/ 1674:
/***/ (function(module, exports, __webpack_require__) {

var baseKeys = __webpack_require__(304),
    getTag = __webpack_require__(341),
    isArrayLike = __webpack_require__(72),
    isString = __webpack_require__(1610),
    stringSize = __webpack_require__(1675);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/**
 * Gets the size of `collection` by returning its length for array-like
 * values or the number of own enumerable string keyed properties for objects.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @returns {number} Returns the collection size.
 * @example
 *
 * _.size([1, 2, 3]);
 * // => 3
 *
 * _.size({ 'a': 1, 'b': 2 });
 * // => 2
 *
 * _.size('pebbles');
 * // => 7
 */
function size(collection) {
  if (collection == null) {
    return 0;
  }
  if (isArrayLike(collection)) {
    return isString(collection) ? stringSize(collection) : collection.length;
  }
  var tag = getTag(collection);
  if (tag == mapTag || tag == setTag) {
    return collection.size;
  }
  return baseKeys(collection).length;
}

module.exports = size;


/***/ }),

/***/ 1675:
/***/ (function(module, exports, __webpack_require__) {

var asciiSize = __webpack_require__(1676),
    hasUnicode = __webpack_require__(1677),
    unicodeSize = __webpack_require__(1678);

/**
 * Gets the number of symbols in `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the string size.
 */
function stringSize(string) {
  return hasUnicode(string)
    ? unicodeSize(string)
    : asciiSize(string);
}

module.exports = stringSize;


/***/ }),

/***/ 1676:
/***/ (function(module, exports, __webpack_require__) {

var baseProperty = __webpack_require__(1052);

/**
 * Gets the size of an ASCII `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
var asciiSize = baseProperty('length');

module.exports = asciiSize;


/***/ }),

/***/ 1677:
/***/ (function(module, exports) {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

module.exports = hasUnicode;


/***/ }),

/***/ 1678:
/***/ (function(module, exports) {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Gets the size of a Unicode `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
function unicodeSize(string) {
  var result = reUnicode.lastIndex = 0;
  while (reUnicode.test(string)) {
    ++result;
  }
  return result;
}

module.exports = unicodeSize;


/***/ }),

/***/ 1679:
/***/ (function(module, exports, __webpack_require__) {

var baseClone = __webpack_require__(1680);

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}

module.exports = clone;


/***/ }),

/***/ 1680:
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(724),
    arrayEach = __webpack_require__(731),
    assignValue = __webpack_require__(1039),
    baseAssign = __webpack_require__(1681),
    baseAssignIn = __webpack_require__(1682),
    cloneBuffer = __webpack_require__(1683),
    copyArray = __webpack_require__(1612),
    copySymbols = __webpack_require__(1684),
    copySymbolsIn = __webpack_require__(1685),
    getAllKeys = __webpack_require__(1047),
    getAllKeysIn = __webpack_require__(1686),
    getTag = __webpack_require__(341),
    initCloneArray = __webpack_require__(1687),
    initCloneByTag = __webpack_require__(1688),
    initCloneObject = __webpack_require__(1693),
    isArray = __webpack_require__(52),
    isBuffer = __webpack_require__(211),
    isMap = __webpack_require__(1694),
    isObject = __webpack_require__(110),
    isSet = __webpack_require__(1696),
    keys = __webpack_require__(153);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });

    return result;
  }

  if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });

    return result;
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),

/***/ 1681:
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(582),
    keys = __webpack_require__(153);

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),

/***/ 1682:
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(582),
    keysIn = __webpack_require__(734);

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),

/***/ 1683:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(109);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(39)(module)))

/***/ }),

/***/ 1684:
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(582),
    getSymbols = __webpack_require__(725);

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),

/***/ 1685:
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(582),
    getSymbolsIn = __webpack_require__(1055);

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),

/***/ 1686:
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(1048),
    getSymbolsIn = __webpack_require__(1055),
    keysIn = __webpack_require__(734);

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),

/***/ 1687:
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),

/***/ 1688:
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(726),
    cloneDataView = __webpack_require__(1689),
    cloneRegExp = __webpack_require__(1690),
    cloneSymbol = __webpack_require__(1691),
    cloneTypedArray = __webpack_require__(1692);

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),

/***/ 1689:
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(726);

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),

/***/ 169:
/***/ (function(module, exports, __webpack_require__) {

/* global window */

var lodash;

if (true) {
  try {
    lodash = {
      clone: __webpack_require__(1679),
      constant: __webpack_require__(1433),
      each: __webpack_require__(3623),
      filter: __webpack_require__(1699),
      has:  __webpack_require__(3624),
      isArray: __webpack_require__(52),
      isEmpty: __webpack_require__(1698),
      isFunction: __webpack_require__(245),
      isUndefined: __webpack_require__(3626),
      keys: __webpack_require__(153),
      map: __webpack_require__(1594),
      reduce: __webpack_require__(1609),
      size: __webpack_require__(1674),
      transform: __webpack_require__(3627),
      union: __webpack_require__(1508),
      values: __webpack_require__(3628)
    };
  } catch (e) {}
}

if (!lodash) {
  lodash = window._;
}

module.exports = lodash;


/***/ }),

/***/ 1690:
/***/ (function(module, exports) {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),

/***/ 1691:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(155);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),

/***/ 1692:
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(726);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),

/***/ 1693:
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(1063),
    getPrototype = __webpack_require__(590),
    isPrototype = __webpack_require__(238);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),

/***/ 1694:
/***/ (function(module, exports, __webpack_require__) {

var baseIsMap = __webpack_require__(1695),
    baseUnary = __webpack_require__(212),
    nodeUtil = __webpack_require__(303);

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;


/***/ }),

/***/ 1695:
/***/ (function(module, exports, __webpack_require__) {

var getTag = __webpack_require__(341),
    isObjectLike = __webpack_require__(89);

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;


/***/ }),

/***/ 1696:
/***/ (function(module, exports, __webpack_require__) {

var baseIsSet = __webpack_require__(1697),
    baseUnary = __webpack_require__(212),
    nodeUtil = __webpack_require__(303);

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;


/***/ }),

/***/ 1697:
/***/ (function(module, exports, __webpack_require__) {

var getTag = __webpack_require__(341),
    isObjectLike = __webpack_require__(89);

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;


/***/ }),

/***/ 1698:
/***/ (function(module, exports, __webpack_require__) {

var baseKeys = __webpack_require__(304),
    getTag = __webpack_require__(341),
    isArguments = __webpack_require__(239),
    isArray = __webpack_require__(52),
    isArrayLike = __webpack_require__(72),
    isBuffer = __webpack_require__(211),
    isPrototype = __webpack_require__(238),
    isTypedArray = __webpack_require__(240);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

module.exports = isEmpty;


/***/ }),

/***/ 1699:
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(728),
    baseFilter = __webpack_require__(1613),
    baseIteratee = __webpack_require__(581),
    isArray = __webpack_require__(52);

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;


/***/ }),

/***/ 1700:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MissingCurrentWorkspaceModalContainer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_workspaces_MissingCurrentWorkspaceModal__ = __webpack_require__(1701);



const defaultState = { isOpen: false };let

MissingCurrentWorkspaceModalContainer = class MissingCurrentWorkspaceModalContainer extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    pm.mediator.on('missingCurrentWorkspace', this.handleOpen);
  }

  componentWillUnmount() {
    pm.mediator.off('missingCurrentWorkspace', this.handleOpen);
  }

  handleOpen(workspace) {
    this.setState({
      isOpen: true,
      workspaceName: workspace.name });

  }

  handleClose() {
    this.setState(defaultState);
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__components_workspaces_MissingCurrentWorkspaceModal__["a" /* default */], {
        isOpen: this.state.isOpen,
        workspaceName: this.state.workspaceName,
        onRequestClose: this.handleClose }));


  }};

/***/ }),

/***/ 1701:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_Modals__ = __webpack_require__(395);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_Buttons__ = __webpack_require__(14);


let

MissingCurrentWorkspaceModal = class MissingCurrentWorkspaceModal extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__base_Modals__["a" /* Modal */], {
          className: 'missing-current-workspace-modal',
          isOpen: this.props.isOpen,
          onRequestClose: this.props.onRequestClose },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__base_Modals__["b" /* ModalContent */], null,
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'missing-current-workspace-modal__wrapper' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'modal-header-close-button', onClick: this.props.onRequestClose }),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'missing-current-workspace-thumbnail__container' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'missing-current-workspace-thumbnail' })),

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'missing-current-workspace-modal__content' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'missing-current-workspace-modal__header' }, 'We can\'t seem to find the ',
                this.props.workspaceName, ' workspace'),

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'missing-current-workspace-modal__subtext' }, 'The workspace might have been deleted by another user in your team. You have been switched to one of your personal workspaces.'),


              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'missing-current-workspace-modal__action' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Buttons__["a" /* Button */], {
                    type: 'primary',
                    onClick: this.props.onRequestClose }, 'Okay')))))));









  }};


/* harmony default export */ __webpack_exports__["a"] = (MissingCurrentWorkspaceModal);

/***/ }),

/***/ 20:
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(566);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__combineReducers__ = __webpack_require__(997);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__ = __webpack_require__(998);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__ = __webpack_require__(999);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__compose__ = __webpack_require__(570);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_warning__ = __webpack_require__(569);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "createStore", function() { return __WEBPACK_IMPORTED_MODULE_0__createStore__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "combineReducers", function() { return __WEBPACK_IMPORTED_MODULE_1__combineReducers__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "bindActionCreators", function() { return __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "applyMiddleware", function() { return __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "compose", function() { return __WEBPACK_IMPORTED_MODULE_4__compose__["a"]; });







/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (false) {
  warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}



/***/ }),

/***/ 24:
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ 259:
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BaseConfigurationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_events__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_events__);
let

BaseConfigurationService = class BaseConfigurationService extends __WEBPACK_IMPORTED_MODULE_0_events___default.a {
  _getLayerNamespaces() {
    return _.map(this.layers, layer => layer.namespace);
  }

  _getResolved(key) {
    if (this.resolvedConfiguration[key] === undefined) {
      return Promise.reject(new Error('ConfigurationService: Could not get config. Key does not exist'));
    }
    return Promise.resolve(this.resolvedConfiguration[key]);
  }

  // Single level access support
  get(key) {
    // cache hit
    if (this.resolvedConfiguration) {
      return this._getResolved(key);
    }

    // cache miss
    return this.
    resolveConfigurationLayers().
    then(resolvedConfiguration => {
      this.resolvedConfiguration = resolvedConfiguration;
      return this._getResolved(key);
    });
  }

  // @todo Lazy loading implementation
  //
  // NOTE: PREVENT MISUSE OF THIS METHOD.
  // USE THE GET METHOD TO GET SPECIFIED KEYS.
  _getAll() {
    // cache hit
    if (this.resolvedConfiguration) {
      return Promise.resolve(this.resolvedConfiguration);
    }

    // cache miss
    return this.
    resolveConfigurationLayers().
    then(resolvedConfiguration => {
      this.resolvedConfiguration = resolvedConfiguration;
      return this.resolvedConfiguration;
    });
  }

  /**
     * Resolves single level JSON
     */
  resolveConfigurationLayers() {
    return Promise.all(_.map(this.resolutionOrder, i => this.layers[i].controller.getAll())).
    then(configurations => {
      let resolvedConfiguration = {};
      _.forEach(configurations, configuration => {
        Object.assign(resolvedConfiguration, configuration);
      });
      return resolvedConfiguration;
    });
  }

  invalidateCache() {
    this.resolvedConfiguration = null;
    this.emit('changed');
  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 341:
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(1659),
    Map = __webpack_require__(732),
    Promise = __webpack_require__(1660),
    Set = __webpack_require__(1072),
    WeakMap = __webpack_require__(1661),
    baseGetTag = __webpack_require__(116),
    toSource = __webpack_require__(1069);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ 3595:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3596);


/***/ }),

/***/ 3596:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(563);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__containers_apps_runner_Runner__ = __webpack_require__(3597);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__init__ = __webpack_require__(3649);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__styles_runner_scss__ = __webpack_require__(3678);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__styles_runner_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__styles_runner_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_TelemetryHelpers__ = __webpack_require__(696);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__modules_services_AnalyticsService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_empty_states_CrashHandler__ = __webpack_require__(244);










if (false) {
  window.React = React;
} else
{
  window.onbeforeunload = () => {
    return false;
  };
}

const rootEl = document.getElementsByClassName('app-root')[0];

__WEBPACK_IMPORTED_MODULE_4__init__["a" /* default */].init(err => {

  if (err) {
    Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["render"])(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__components_empty_states_CrashHandler__["a" /* default */], { showError: true }), rootEl);
    return;
  }

  Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["render"])(
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__components_empty_states_CrashHandler__["a" /* default */], null,
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_redux__["Provider"], { store: __WEBPACK_IMPORTED_MODULE_4__init__["a" /* default */].runnerStore },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__containers_apps_runner_Runner__["a" /* default */], null))),


  rootEl,
  () => {
    let loadTime = Object(__WEBPACK_IMPORTED_MODULE_6__utils_TelemetryHelpers__["a" /* getWindowLoadTime */])();
    __WEBPACK_IMPORTED_MODULE_7__modules_services_AnalyticsService__["a" /* default */].addEvent('app_performance_metric', 'runner_window_loaded', null, null, { load_time: loadTime });
  });

});

/***/ }),

/***/ 3597:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Runner; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(563);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_notification_system__ = __webpack_require__(1630);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_notification_system___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_notification_system__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants_AppNotificationStylesForRunner__ = __webpack_require__(3598);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_base_keymaps_KeyMaps__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__RunnerHeaderContainer__ = __webpack_require__(3599);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__RunnerRunsContainer__ = __webpack_require__(3601);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__RunnerResultsContainer__ = __webpack_require__(3613);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__RunnerSummaryContainer__ = __webpack_require__(3642);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__RunnerMissingWorkspaceModalContainer__ = __webpack_require__(3648);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__modules_services_AnalyticsService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__ = __webpack_require__(1563);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__utils_uid_helper__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_base_XPaths_XPathProvider__ = __webpack_require__(735);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__external_navigation_ExternalNavigationService__ = __webpack_require__(70);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _dec, _class;














const keyMap = {
  openConsole: 'mod+alt+c',
  increaseUIZoom: 'mod+=',
  decreaseUIZoom: 'mod+-',
  resetUIZoom: 'mod+0' };

let

































Runner = (_dec = Object(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(state => {let user = state.user,selection = state.selection,runs = state.runs,activeWorkspaceId = selection.workspace.id,activeWorkspace = activeWorkspaceId && _.find(state.workspaces, ['id', activeWorkspaceId]) || {},populatedCollections = (state.collections || []).map((collection = {}) => {return _extends({}, collection, { forkInfo: _.get(state, ['forkedCollections', `${collection.owner}-${collection.id}`]) });});if (!_.isEmpty(activeWorkspace)) {runs = _.chain(runs).pickBy(run => _.isEqual(activeWorkspaceId, run.workspace)).value();}return { selection: state.selection, workspaces: state.workspaces, runs, collections: populatedCollections, archivedCollections: state.archivedCollections, environments: state.environments, requests: state.requests, folders: state.folders, user: state.user, activeWorkspace };}), _dec(_class = class Runner extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["b" /* RUNNER_TAB_RUNS */],
      activeRun: null,
      initializedTargets: false };


    this.model = pm.runner;
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleOpenResults = this.handleOpenResults.bind(this);
    this.handleOpenIteration = this.handleOpenIteration.bind(this);
    this.handleTargetInitialization = this.handleTargetInitialization.bind(this);
  }

  componentDidMount() {
    pm.toasts.setNotificationComponent(this.refs.notificationSystem);
  }

  componentWillReceiveProps(nextProps) {
    let activeWorkspace = this.props.selection.workspace.id,
    nextActiveWorkspace = nextProps.selection.workspace.id;

    if (activeWorkspace !== nextActiveWorkspace || !this.getActiveRun()) {
      this.setState({
        activeTab: __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["b" /* RUNNER_TAB_RUNS */],
        activeRun: null });

    }
  }

  getKeyMapHandlers() {
    return {
      increaseUIZoom: this.handleIncreaseUIZoom,
      decreaseUIZoom: this.handleDecreaseUIZoom,
      resetUIZoom: this.handleResetUIZoom };

  }

  getRunningStatus() {
    if (!this.props.runs) {
      return false;
    }
    let runningRuns = _.find(this.props.runs, run => {
      return run.status === 'running';
    });
    return Boolean(runningRuns);
  }

  handleTargetInitialization() {
    this.setState({ initializedTargets: true });
  }

  handleIncreaseUIZoom() {
    pm.uiZoom.increase();
  }

  handleDecreaseUIZoom() {
    pm.uiZoom.decrease();
  }

  handleResetUIZoom() {
    pm.uiZoom.reset();
  }

  handleLinkClick(link) {
    Object(__WEBPACK_IMPORTED_MODULE_14__external_navigation_ExternalNavigationService__["a" /* openExternalLink */])(link);
  }

  handleTabChange(tab) {
    this.setState({ activeTab: tab });
  }

  handleOpenResults(runId) {
    pm.runner.fetchRun(runId, () => {
      if (!this.props.runs[runId]) {
        this.setState({ activeRun: null });
      } else
      {
        this.setState({
          activeTab: __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["a" /* RUNNER_TAB_RESULTS */],
          activeRun: runId });

      }
    });
  }

  handleOpenIteration(runId, iteration) {
    this.setState({
      activeTab: __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["a" /* RUNNER_TAB_RESULTS */],
      activeRun: runId },
    () => {
      this.refs.results && this.refs.results.handleIterationJump(iteration);
    });
  }

  handleExport(source, runId) {
    switch (source) {
      case __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["b" /* RUNNER_TAB_RUNS */]:
        __WEBPACK_IMPORTED_MODULE_10__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'download', 'recent_runs');
        break;
      case __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["a" /* RUNNER_TAB_RESULTS */]:
        __WEBPACK_IMPORTED_MODULE_10__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'download', 'run_results');
        break;
      case __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["c" /* RUNNER_TAB_SUMMARY */]:
        __WEBPACK_IMPORTED_MODULE_10__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'download', 'run_summary');
        break;}

    pm.runner.exportRun(runId);
  }

  getActiveRun() {
    return this.props.runs[this.state.activeRun] || false;
  }

  render() {
    let activeRun = this.getActiveRun();

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_13__components_base_XPaths_XPathProvider__["a" /* default */], { identifier: 'runner' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__components_base_keymaps_KeyMaps__["a" /* default */], {
            handlers: this.getKeyMapHandlers(),
            keyMap: keyMap },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'app-runner' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { id: 'dropdown-root', style: { width: 0, height: 0 } }),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__RunnerHeaderContainer__["a" /* default */], {
              disableSwitcher: this.getRunningStatus(),
              dispatch: this.props.dispatch,
              activeTab: activeRun ? this.state.activeTab : __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["b" /* RUNNER_TAB_RUNS */],
              onLinkClick: this.handleLinkClick,
              onTabChange: this.handleTabChange,
              user: this.props.user,
              workspaces: this.props.workspaces,
              activeWorkspace: this.props.activeWorkspace,
              user: this.props.user }),

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-contents' },

              (this.state.activeTab === __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["b" /* RUNNER_TAB_RUNS */] || !activeRun) &&
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__RunnerRunsContainer__["a" /* default */], {
                collections: this.props.collections,
                archivedCollections: this.props.archivedCollections,
                environments: this.props.environments,
                dispatch: this.props.dispatch,
                runs: this.props.runs,
                selection: this.props.selection,
                onExport: this.handleExport.bind(this, __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["b" /* RUNNER_TAB_RUNS */]),
                onOpenRun: this.handleOpenResults,
                requests: this.props.requests,
                folders: this.props.folders,
                activeWorkspace: this.props.activeWorkspace,
                handleTargetInitialization: this.handleTargetInitialization,
                initializedTargets: this.state.initializedTargets }),



              this.state.activeTab === __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["a" /* RUNNER_TAB_RESULTS */] && activeRun &&
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__RunnerResultsContainer__["a" /* default */], {
                requests: this.props.requests,
                collections: this.props.collections,
                folders: this.props.folders,
                environments: this.props.environments,
                active: this.state.activeTab === __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["a" /* RUNNER_TAB_RESULTS */] && !_.isEmpty(this.state.activeRun),
                dispatch: this.props.dispatch,
                ref: 'results',
                run: activeRun,
                runId: activeRun.id,
                selection: this.props.selection,
                onExport: this.handleExport.bind(this, __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["a" /* RUNNER_TAB_RESULTS */]),
                onNewRun: this.handleTabChange.bind(this, __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["b" /* RUNNER_TAB_RUNS */]),
                onOpenRun: this.handleOpenResults,
                onOpenSummary: this.handleTabChange.bind(this, __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["c" /* RUNNER_TAB_SUMMARY */]),
                activeWorkspace: this.props.activeWorkspace }),



              this.state.activeTab === __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["c" /* RUNNER_TAB_SUMMARY */] &&
              activeRun &&
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__RunnerSummaryContainer__["a" /* default */], {
                active: this.state.activeTab === __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["c" /* RUNNER_TAB_SUMMARY */] && !_.isEmpty(this.state.activeRun),
                dispatch: this.props.dispatch,
                run: activeRun,
                runId: activeRun.id,
                onExport: this.handleExport.bind(this, __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["c" /* RUNNER_TAB_SUMMARY */]),
                onNewRun: this.handleTabChange.bind(this, __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["b" /* RUNNER_TAB_RUNS */]),
                onOpenIteration: this.handleOpenIteration,
                onOpenResults: this.handleTabChange.bind(this, __WEBPACK_IMPORTED_MODULE_11__constants_RunnerTabConstants__["a" /* RUNNER_TAB_RESULTS */]),
                onOpenRun: this.handleOpenResults,
                environments: this.props.environments,
                activeWorkspace: this.props.activeWorkspace })),



            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_notification_system___default.a, {
              allowHTML: true,
              ref: 'notificationSystem',
              style: __WEBPACK_IMPORTED_MODULE_3__constants_AppNotificationStylesForRunner__["a" /* default */] }),

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9__RunnerMissingWorkspaceModalContainer__["a" /* default */], null)))));




  }}) || _class);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3598:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AppNotificationStyles__ = __webpack_require__(1636);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};

/* harmony default export */ __webpack_exports__["a"] = (_extends({},
__WEBPACK_IMPORTED_MODULE_0__AppNotificationStyles__["a" /* default */], {
  Containers: {
    DefaultStyle: {
      zIndex: 110,
      width: 360 },

    tr: { bottom: '0px', top: 'unset' } } }));

/***/ }),

/***/ 3599:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerHeaderContainer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_runner_RunnerHeader__ = __webpack_require__(3600);
var _class;

let


RunnerHeaderContainer = __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default()(_class = class RunnerHeaderContainer extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      activeWorkspaceTab: 'personal' };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleSwitchWorkspace = this.handleSwitchWorkspace.bind(this);
  }

  handleToggle(isOpen = this.state.isOpen) {
    this.setState({ isOpen });
  }

  handleTabChange(activeWorkspaceTab) {
    this.setState({ activeWorkspaceTab });
  }

  handleSwitchWorkspace(id) {
    this.handleToggle(false);
    pm.runner.changeSelection('workspace', id);
  }

  getFilteredWorkspaces() {
    let personalWorkspaces = [];
    let teamWorkspaces = [];

    _.forEach(this.props.workspaces, workspace => {
      if (workspace.type === 'personal') {
        personalWorkspaces.push(workspace);
      } else
      if (workspace.type === 'team') {
        teamWorkspaces.push(workspace);
      }
    });

    return {
      personalWorkspaces: _.sortBy(personalWorkspaces, workspace => _.toLower(workspace.name)),
      teamWorkspaces: _.sortBy(teamWorkspaces, workspace => _.toLower(workspace.name)) };

  }

  isUserLoggedIn() {
    return this.props.user.id !== '0' ? true : false;
  }

  render() {
    let workspaces = this.getFilteredWorkspaces();
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__components_runner_RunnerHeader__["a" /* default */], {
        disableSwitcher: this.props.disableSwitcher,
        activeTab: this.props.activeTab,
        onLinkClick: this.props.onLinkClick,
        onTabChange: this.props.onTabChange,
        activeWorkspaceTab: this.state.activeWorkspaceTab,
        activeWorkspace: this.props.activeWorkspace,
        isOpen: this.state.isOpen,
        personalWorkspaces: workspaces.personalWorkspaces,
        teamWorkspaces: workspaces.teamWorkspaces,
        user: this.props.user,
        onToggle: this.handleToggle,
        onWorkspaceTabChange: this.handleTabChange,
        onSwitchWorkspace: this.handleSwitchWorkspace }));


  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3600:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerHeader; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__workspaces_WorkspaceSwitcher__ = __webpack_require__(1625);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__external_navigation_ExternalNavigationService__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__constants_RunnerTabConstants__ = __webpack_require__(1563);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__constants_AppUrlConstants__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modules_services_AnalyticsService__ = __webpack_require__(31);
var _class;









let


RunnerHeader = __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default()(_class = class RunnerHeader extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.handleNewmanLink = this.handleNewmanLink.bind(this);
    this.handleDocsLink = this.handleDocsLink.bind(this);
  }

  isSwitcherDisabled() {
    return this.props.disableSwitcher || this.props.activeTab !== 'runner';
  }

  handleNewmanLink() {
    this.props.onLinkClick && this.props.onLinkClick('https://www.npmjs.com/package/newman');
  }

  handleDocsLink() {
    this.props.onLinkClick && this.props.onLinkClick(__WEBPACK_IMPORTED_MODULE_6__constants_AppUrlConstants__["_0" /* RUNNER_DOCS */]);
  }

  handleAddMonitors() {
    Object(__WEBPACK_IMPORTED_MODULE_4__external_navigation_ExternalNavigationService__["a" /* openExternalLink */])(window.postman_monitors_url);
    __WEBPACK_IMPORTED_MODULE_8__modules_services_AnalyticsService__["a" /* default */].addEvent('monitor', 'initiate_create', 'runner');
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-header' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-header__section-left' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-header__section-left__tab runner-header__section-left__tab--runner' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                className: 'runner-header__section-left__runner',
                onClick: this.props.onTabChange.bind(this, __WEBPACK_IMPORTED_MODULE_5__constants_RunnerTabConstants__["b" /* RUNNER_TAB_RUNS */]) }, 'Collection Runner')),






          (this.props.activeTab === __WEBPACK_IMPORTED_MODULE_5__constants_RunnerTabConstants__["a" /* RUNNER_TAB_RESULTS */] || this.props.activeTab === __WEBPACK_IMPORTED_MODULE_5__constants_RunnerTabConstants__["c" /* RUNNER_TAB_SUMMARY */]) &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-header__section-left__tab runner-header__section-left__tab--results' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-header__section-left__arrow runner-header__section-left__results-pre-arrow' }),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                className: 'runner-header__section-left__results',
                onClick: this.props.onTabChange.bind(this, __WEBPACK_IMPORTED_MODULE_5__constants_RunnerTabConstants__["a" /* RUNNER_TAB_RESULTS */]) }, 'Run Results'),



            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-header__section-left__arrow runner-header__section-left__results-post-arrow' })),





          this.props.activeTab === __WEBPACK_IMPORTED_MODULE_5__constants_RunnerTabConstants__["c" /* RUNNER_TAB_SUMMARY */] &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-header__section-left__tab runner-header__section-left__tab--summary' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-header__section-left__arrow runner-header__section-left__summary-pre-arrow' }),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                className: 'runner-header__section-left__summary',
                onClick: this.props.onTabChange.bind(this, __WEBPACK_IMPORTED_MODULE_5__constants_RunnerTabConstants__["c" /* RUNNER_TAB_SUMMARY */]) }, 'Run Summary'),



            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-header__section-left__arrow runner-header__section-left__summary-post-arrow' }))),




        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-header__section-center' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__workspaces_WorkspaceSwitcher__["a" /* default */], {
            isSyncEnabled: true,
            teamSyncEnabled: true,
            activeTab: this.props.activeWorkspaceTab,
            activeWorkspace: this.props.activeWorkspace,
            isOpen: this.props.isOpen,
            personalWorkspaces: this.props.personalWorkspaces,
            teamWorkspaces: this.props.teamWorkspaces,
            onToggle: this.props.onToggle,
            onTabChange: this.props.onWorkspaceTabChange,
            onSwitchWorkspace: this.props.onSwitchWorkspace,
            disableActions: true,
            disable: this.props.disableSwitcher,
            isLoggedIn: !!this.props.user,
            disable: this.isSwitcherDisabled() })),


        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-header__section-right' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__base_Buttons__["a" /* Button */], {
              className: 'runner-header__section-right__newman',
              size: 'small',
              type: 'secondary',
              onClick: this.handleNewmanLink }, 'Run In Command Line'),



          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__base_Buttons__["a" /* Button */], {
              className: 'runner-header__section-right__docs',
              size: 'small',
              type: 'secondary',
              onClick: this.handleDocsLink }, 'Docs'))));






  }}) || _class;

/***/ }),

/***/ 3601:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerRunsContainer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_base_keymaps_KeyMaps__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_runner_RunnerRunsSelector__ = __webpack_require__(3602);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_runner_RunnerRecentRuns__ = __webpack_require__(3605);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_runner_RunnerRunsCustomizer__ = __webpack_require__(3609);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__ = __webpack_require__(31);
var _class;








const keyMap = { 'start': 'meta+enter' };let


RunnerRunsContainer = __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default()(_class = class RunnerRunsContainer extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = {
      runFilter: '',
      customizationData: this.generateDataMap(props),
      isSelectionInconsistent: false };


    // If collection is already selected that means we are coming from another view
    if (this.isCollectionSelected(props)) {
      // If the request selection is empty then somehow the selection has been lost, showing
      // inconsistency reload option by default
      _.isEmpty(props.selection.requestSelection) && (this.state.isSelectionInconsistent = true);
    }


    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.startRun = this.startRun.bind(this);
    this.handleImportRun = this.handleImportRun.bind(this);
    this.handleDeleteRun = this.handleDeleteRun.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleInconsistency = this.handleInconsistency.bind(this);
  }

  generateDataMap(nextProps) {
    // If no collection is selected, then create empty data
    if (!this.isCollectionSelected(nextProps)) {
      return {};
    }

    // Now that the collection selection has changed let's render the tree for the collection
    let collectionId = nextProps.selection.target.collection,
    folderMap = _.reduce(this.props.folders, (acc, folder) => {
      if (folder.collection !== collectionId) {
        return acc;
      }

      // At this point we know the folder belongs to the collection
      acc[folder.id] = folder;

      return acc;
    }, {}),
    requestMap = _.reduce(this.props.requests, (acc, request) => {
      if (request.collection !== collectionId) {
        return acc;
      }

      // At this point we know the folder belongs to the collection
      acc[request.id] = request;

      return acc;
    }, {}),

    // Injecting the lengths of the maps to the prototype of the customizationData state
    lengthPrototype = Object.create({
      _requestLength: Object.keys(requestMap).length,
      _folderLength: Object.keys(folderMap).length });


    return Object.assign(lengthPrototype, folderMap, requestMap);
  }

  computeStructure(props) {
    const { collection: collectionId, folder: folderId } = props.selection.target,
    expandTree = (itemGroup = {}, parents = []) => {
      const requestTree = [];

      // Iterate over each folder_order and insert them to the top level tree
      for (let folderId of itemGroup.folders_order) {

        // Find the folder from list of given folders
        // @todo: optimize the search of the folder
        const folder = _.find(props.folders, { id: folderId });

        // Add the folder the list of parents of requests.
        // This will help us construct the collection later
        requestTree.push(...expandTree(folder, [...parents, folderId]));
      }

      // Push all the request in the order
      for (let requestId of itemGroup.order) {
        requestTree.push({ id: requestId, type: 'request', parents, checked: true });
      }

      return requestTree;
    };

    let selectionTree = [];

    // If a folder is selected then compute the tree with the folder
    if (folderId) {
      selectionTree = expandTree(_.find(props.folders, { id: folderId }));
    } else if (collectionId) {
      selectionTree = expandTree(_.find(props.collections, { id: collectionId }));
    }

    return this.handleSelectionChange('requestSelection', selectionTree);

  }

  componentWillReceiveProps(nextProps) {
    // Collection selection transition from not-selected to selected
    if (!this.isCollectionSelected(this.props) && this.isCollectionSelected(nextProps)) {
      // Generate dataMap and setup the structure
      return this.handleDataReload(nextProps);
    }

    // Collection selection transition from selected to not selected
    if (this.isCollectionSelected(this.props) && !this.isCollectionSelected(nextProps)) {

      // Reset the selection here. This will disable the button. This will also trigger this
      // handler again
      return this.handleSelectionChange('requestSelection', []);
    }

    // If no collection is selected then don't bother doing anything, nothing at all
    if (!this.isCollectionSelected(nextProps)) {
      return;
    }

    // From this point on-ward we have a collection selected and the props are just updating for
    // some reason

    const { folder } = nextProps.selection.target,
    { folder: prevFolder } = this.props.selection.target;

    // Checking if there was a folder change, if yes then reset the selection accordingly
    if (folder !== prevFolder) {
      return this.handleSelectionReset(nextProps);
    }

    // Collection has not changed and data is already loaded then just detect if there is some
    // inconsistency being cause;
    this.detectInconsistency(nextProps);
  }

  detectInconsistency(nextProps) {
    // If already in inconsistent state then just bail
    if (this.state.isSelectionInconsistent) {
      return;
    }

    // If some request or folder was deleted then it goes into inconsistent state
    const { collection } = nextProps.selection.target,
    requestInCollection = _.filter(nextProps.requests, { collection });

    // If the new request list length is equal to our dataMap then no in inconsistency issues
    if (requestInCollection.length === this.state.customizationData._requestLength) {
      return;
    }

    // Else mark inconsistency
    this.setState({ isSelectionInconsistent: true });
  }

  handleInconsistency() {
    !this.state.isSelectionInconsistent && this.setState({ isSelectionInconsistent: true });
  }

  getKeyMapHandlers() {
    return { 'start': this.startRun };
  }

  scrollSelectedItemIntoView() {
    this.refs.selector &&
    this.refs.selector.scrollSelectedItemIntoView &&
    this.refs.selector.scrollSelectedItemIntoView();
  }

  handleSelectionChange(field, value) {
    pm.runner.changeSelection(field, value);
  }

  handleSelectionReset(props) {
    // If the reset button was selected then reset the structure
    this.isCollectionSelected(props) && this.computeStructure(props);
  }

  handleDataReload(props) {
    this.setState({
      isSelectionInconsistent: false,
      customizationData: this.generateDataMap(props) },
    () => {
      // Finally recompute the structure again
      this.computeStructure(props);
    });
  }

  startRun() {
    if (!this.isCollectionSelected(this.props)) {
      return;
    }

    pm.runner.startRun(this.props.selection, (error, runId) => {
      __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'initiate_run', 'first_time', _.parseInt(this.props.selection.iterations) || 0);
      if (error) {
        pm.logger.error(error);
      }
      this.props.onOpenRun && this.props.onOpenRun(runId);
    });
  }

  handleDeleteRun(runId) {
    pm.runner.deleteRun(runId);
  }

  handleImportRun(files) {
    pm.runner.importRun(files);
  }

  handleFilterChange(value) {
    this.setState({ runFilter: value });
  }

  isCollectionSelected(props) {
    return !!_.get(props, 'selection.target.collection');
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__components_base_keymaps_KeyMaps__["a" /* default */], {
          handlers: this.getKeyMapHandlers(),
          keyMap: keyMap },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__components_runner_RunnerRunsSelector__["a" /* default */], {
            ref: 'selector',
            selected: this.props.selection,
            onChange: this.handleSelectionChange,
            onStartRun: this.startRun,
            collections: this.props.collections,
            archivedCollections: this.props.archivedCollections,
            environments: this.props.environments,
            requests: this.props.requests,
            folders: this.props.folders,
            activeWorkspace: this.props.activeWorkspace,
            handleTargetInitialization: this.props.handleTargetInitialization,
            initializedTargets: this.props.initializedTargets }),

          this.isCollectionSelected(this.props) ?
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__components_runner_RunnerRunsCustomizer__["a" /* default */], {
            ref: 'customizer',
            data: this.state.customizationData,
            structure: this.props.selection.requestSelection,
            isInconsistent: this.state.isSelectionInconsistent,
            onChange: this.handleSelectionChange.bind(this, 'requestSelection'),
            onReset: this.handleSelectionReset.bind(this, this.props),
            onReload: this.handleDataReload.bind(this, this.props),
            onInconsistency: this.handleInconsistency }) :

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__components_runner_RunnerRecentRuns__["a" /* default */], {
            selected: this.props.selection,
            environments: this.props.environments,
            runFilter: this.state.runFilter,
            runs: this.props.runs,
            onDeleteRun: this.handleDeleteRun,
            onExportRun: this.props.onExport,
            onFilterChange: this.handleFilterChange,
            onImportRun: this.handleImportRun,
            onOpenRun: this.props.onOpenRun,
            activeWorkspace: this.props.activeWorkspace }))));





  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3602:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerRunsSelector; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__explorer_CollectionExplorer__ = __webpack_require__(1608);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_Tooltips__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_Inputs__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__base_InputSelect__ = __webpack_require__(3603);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__base_SearchHighlighter__ = __webpack_require__(587);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__base_Icons_CloseIcon__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__base_Icons_InformationIcon__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__constants_RunnerDataFileTypeConstants__ = __webpack_require__(1021);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__constants_RunnerSaveResponseConstants__ = __webpack_require__(1022);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__RunnerSelectorFilePreview__ = __webpack_require__(3604);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__utils_GetWorkspaceEntities__ = __webpack_require__(1023);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__utils_CollectionSorter__ = __webpack_require__(1058);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__stores_get_store__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_mobx_react__ = __webpack_require__(12);
var _class;















let


RunnerRunsSelector = Object(__WEBPACK_IMPORTED_MODULE_16_mobx_react__["a" /* observer */])(_class = class RunnerRunsSelector extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = {
      dataArray: [],
      isPreviewModalOpen: false,
      isLogResTooltipVisible: false,
      isVariableTooltipVisible: false,
      isSaveCookiesTooltipVisible: false };


    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleFilePreview = this.handleFilePreview.bind(this);
    this.handleCloseFilePreview = this.handleCloseFilePreview.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.handleEnvSelect = this.handleEnvSelect.bind(this);
  }

  getSelectedEnvironment() {
    let environments = this.getEnvironments(),
    environment = _.find(environments, ['id', this.props.selected.environment]),
    envName = environment ? environment.name : '';

    return envName;
  }

  getDataArray(callback) {
    if (!this.props.selected.dataFile) {
      return callback('No file selected');
    }

    return pm.runner.readFile(this.props.selected.dataFile, (err, data) => {
      if (err) {
        return callback(err);
      }
      return callback(null, data);
    });
  }

  handleFileSelect(fileList) {
    if (_.isEmpty(fileList)) {
      this.refs.dataFile && this.refs.dataFile.clear();
    }
    this.props.onChange && this.props.onChange('data', fileList);
  }

  handleFilePreview() {
    this.getDataArray((err, dataArray) => {
      if (!err) {
        this.setState({
          dataArray: dataArray,
          isPreviewModalOpen: true });

      }
    });
  }

  handleCloseFilePreview() {
    this.setState({ isPreviewModalOpen: false });
  }

  showTooltip(tooltipKey) {
    this.setState({ [tooltipKey]: true });
  }

  hideTooltip(tooltipKey) {
    this.setState({ [tooltipKey]: false });
  }

  handleEnvSelect(selectionIndex) {
    let selectedEnvId = null,
    environments = this.getEnvironments();
    if (selectionIndex > 0 && selectionIndex <= environments.length) {
      selectedEnvId = environments[selectionIndex - 1].id;
    }

    this.props.onChange && this.props.onChange('environment', selectedEnvId);
  }

  renderEnvItem(list, index, search) {
    let name = index === 0 ? 'No Environment' : list[index - 1].name;
    if (search) {
      if (!_.includes(name.toLowerCase(), search.toLowerCase())) {
        return null;
      }
      return (
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'input-select-item' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__base_SearchHighlighter__["a" /* default */], {
            source: name,
            query: search })));



    }
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'input-select-item' }, name);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.initializedTargets && !_.isEqual(
    this.getTargetData(this.props),
    this.getTargetData(nextProps)))
    {
      let target = this.getTargetData(nextProps);
      this.refs &&
      this.refs.collectionExplorer &&
      this.refs.collectionExplorer.setInitialTargets(target);
      this.props.handleTargetInitialization();
    }
  }

  getTargetData(props = this.props) {
    let targetData = {
      collection: null,
      folder: null,
      name: null };


    if (_.get(props, 'selected.target')) {
      let targetIds = _.get(props, 'selected.target');
      targetIds.collection && (
      targetData.collection = _.find(props.collections, ['id', targetIds.collection]) || null) && (
      targetData.name = targetData.collection.name);

      targetIds.folder && (
      targetData.folder = _.find(props.folders, ['id', targetIds.folder]) || null) && (
      targetData.name = targetData.folder.name);
    }

    return targetData;
  }

  getActiveWorkspaceCollectionEntities() {
    let collections = [],
    folders = [],
    requests = [];

    if (_.isEmpty(this.props.activeWorkspace)) {
      return [collections, folders, requests];
    }

    collections = this.getCollections();
    if (_.isEmpty(collections)) {
      return [collections, folders, requests];
    }

    folders = _.chain(this.props.folders).
    filter(folder => _.find(collections, ['id', folder.collection])).
    compact().
    value();

    requests = _.chain(this.props.requests).
    filter(request => _.find(collections, ['id', request.collection])).
    compact().
    value();

    return [collections, folders, requests];
  }

  getCollections() {
    let collections = Object(__WEBPACK_IMPORTED_MODULE_13__utils_GetWorkspaceEntities__["a" /* getWorkspaceEntities */])(this.props.activeWorkspace, this.props.collections, 'collections');
    return Object(__WEBPACK_IMPORTED_MODULE_14__utils_CollectionSorter__["a" /* getRunnableCollections */])(collections, this.props.archivedCollections);
  }

  getEnvironments() {
    let environments = Object(__WEBPACK_IMPORTED_MODULE_13__utils_GetWorkspaceEntities__["a" /* getWorkspaceEntities */])(this.props.activeWorkspace, this.props.environments, 'environments');
    return _.sortBy(environments, environment => _.toLower(environment.name));
  }

  getTooltipText(isDisabled) {
    if (isDisabled) {
      return 'You do not have permissions to perform this action.';
    }
  }

  render() {
    let [collections, folders, requests] = this.getActiveWorkspaceCollectionEntities(),
    selectedEnv = this.props.selected.environment,
    selectedEnvIndex = 0,
    target = this.getTargetData(),
    environments = this.getEnvironments();

    const workspaceId = Object(__WEBPACK_IMPORTED_MODULE_15__stores_get_store__["getStore"])('ActiveWorkspaceStore').id,
    permissionStore = Object(__WEBPACK_IMPORTED_MODULE_15__stores_get_store__["getStore"])('PermissionStore'),
    canAddCollection = permissionStore.can('addCollectionrun', 'workspace', workspaceId),
    someRequestSelected = _.some(this.props.selected.requestSelection, req => {return req.checked;});

    if (selectedEnv) {
      selectedEnvIndex = _.findIndex(environments, env => {return env.id === selectedEnv;}) + 1;
    }

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__item runner-runs-selector__item--target' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__meta runner-runs-selector__meta--target' }, 'Choose a collection or folder'),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__explorer_CollectionExplorer__["a" /* default */], {
            key: this.props.activeWorkspace.id,
            ref: 'collectionExplorer',
            initialSelection: target,
            disableCreate: true,
            onSelect: this.props.onChange.bind(this, 'target'),
            collections: collections,
            folders: folders,
            requests: requests })),



        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__item  runner-runs-selector__item--environment' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__meta runner-runs-selector__meta--environment' }, 'Environment'),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__base_InputSelect__["a" /* InputSelect */], {
            className: 'runner-runs-selector__environment',
            hideCancelOnBlur: true,
            selectAllOnFocus: true,
            showToggleButton: true,
            defaultIndex: selectedEnvIndex === -1 ? 0 : selectedEnvIndex,
            getInputValue: index => {
              return index === 0 ? 'No Environment' : _.get(environments[index - 1], 'name', '');
            },
            isSearchable: index => {
              return index > 0;
            },
            optionCount: _.size(environments) + 1,
            optionRenderer: (index, search) => {
              return this.renderEnvItem(environments, index, search);
            },
            onSelect: this.handleEnvSelect })),



        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__item runner-runs-selector__item--iterations' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__meta runner-runs-selector__meta--iterations' }, 'Iterations'),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Inputs__["b" /* Input */], {
            className: 'runner-runs-selector__item__value runner-runs-selector__item__value--iterations',
            inputStyle: 'box',
            type: 'text',
            value: this.props.selected.iterations,
            onChange: this.props.onChange.bind(this, 'iterations') })),



        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__item runner-runs-selector__item--delay' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__meta runner-runs-selector__meta--delay' }, 'Delay'),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Inputs__["b" /* Input */], {
            className: 'runner-runs-selector__item__value runner-runs-selector__item__value--delay',
            inputStyle: 'box',
            type: 'text',
            value: this.props.selected.delay,
            onChange: this.props.onChange.bind(this, 'delay') }),

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__postfix runner-runs-selector__postfix--delay' }, 'ms')),


        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__item runner-runs-selector__item--response' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__meta runner-runs-selector__meta--response' }, 'Log Responses'),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["a" /* Dropdown */], {
              className: 'runner-runs-selector__response',
              onSelect: this.props.onChange.bind(this, 'saveResponse') },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["b" /* DropdownButton */], {
                size: 'small',
                type: 'secondary' },

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], { className: 'runner-runs-selector-selected-save-response-label' },

                __WEBPACK_IMPORTED_MODULE_11__constants_RunnerSaveResponseConstants__["d" /* RUNNER_SAVE_RESPONSES_LABELS */][this.props.selected.saveResponse])),



            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["c" /* DropdownMenu */], { fluid: true },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], { refKey: __WEBPACK_IMPORTED_MODULE_11__constants_RunnerSaveResponseConstants__["a" /* RUNNER_SAVE_ALL_RESPONSES */] }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, 'For all requests')),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], { refKey: __WEBPACK_IMPORTED_MODULE_11__constants_RunnerSaveResponseConstants__["b" /* RUNNER_SAVE_FAILED_RESPONSES */] }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, 'For failed requests')),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], { refKey: __WEBPACK_IMPORTED_MODULE_11__constants_RunnerSaveResponseConstants__["c" /* RUNNER_SAVE_NO_RESPONSES */] }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, 'For no requests')))),


          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__postfix runner-runs-selector__postfix--response' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                className: 'runner-runs-selector__postfix-icon runner-runs-selector__postfix-icon--response',
                ref: 'logResTooltipTarget',
                onMouseEnter: this.showTooltip.bind(this, 'isLogResTooltipVisible'),
                onMouseLeave: this.hideTooltip.bind(this, 'isLogResTooltipVisible') },

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9__base_Icons_InformationIcon__["a" /* default */], {
                className: 'runner-runs-selector__postfix-icon' })),


            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Tooltips__["a" /* Tooltip */], {
                show: this.state.isLogResTooltipVisible,
                target: this.refs.logResTooltipTarget,
                placement: 'right',
                className: 'runner-runs-selector__postfix-tooltip',
                immediate: true },

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Tooltips__["b" /* TooltipBody */], null, 'Logging responses allows you to view response headers and bodies for the request. This might impact performance on larger collection runs.')))),






        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__item runner-runs-selector__item--data-file' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__meta runner-runs-selector__meta--data-file' }, 'Data'),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
              className: 'runner-runs-selector__item__value runner-runs-selector__item__value--data-file',
              size: 'small',
              type: 'secondary' }, 'Select File'),



          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Inputs__["b" /* Input */], {
            className: 'runner-runs-selector__item__value runner-runs-selector__item__value--data-file',
            type: 'file',
            ref: 'dataFile',
            onChange: this.handleFileSelect }),

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__postfix runner-runs-selector__postfix--data-file' },
            this.props.selected.fileName || ''),


          this.props.selected.dataFile &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
              className: 'runner-runs-selector__postfix--data-file-remove',
              type: 'icon',
              onClick: this.handleFileSelect.bind(this, []),
              tooltip: 'Remove selected file' },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__base_Icons_CloseIcon__["a" /* default */], { className: 'runner-runs-selector__postfix--data-file-remove-icon' }))),





        this.props.selected.dataFile &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__item runner-runs-selector__item--data-file-type' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__meta runner-runs-selector__meta--data-file-type' }, 'Data File Type'),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["a" /* Dropdown */], {
              className: 'runner-runs-selector__item__value runner-runs-selector__item__value--data-file-type',
              onSelect: this.props.onChange.bind(this, 'dataType') },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["b" /* DropdownButton */], {
                size: 'small',
                type: 'secondary' },

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], { className: 'runner-runs-selector__item__value--data-file-type__selected' },
                this.props.selected.fileType || __WEBPACK_IMPORTED_MODULE_10__constants_RunnerDataFileTypeConstants__["c" /* RUNNER_DATA_FILE_TYPE_UNDETERMINED */])),


            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["c" /* DropdownMenu */], null,
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], { refKey: __WEBPACK_IMPORTED_MODULE_10__constants_RunnerDataFileTypeConstants__["b" /* RUNNER_DATA_FILE_TYPE_JSON */], className: 'dropdown-menu-item--JSON' }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, __WEBPACK_IMPORTED_MODULE_10__constants_RunnerDataFileTypeConstants__["b" /* RUNNER_DATA_FILE_TYPE_JSON */])),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], { refKey: __WEBPACK_IMPORTED_MODULE_10__constants_RunnerDataFileTypeConstants__["a" /* RUNNER_DATA_FILE_TYPE_CSV */], className: 'dropdown-menu-item--CSV' }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, __WEBPACK_IMPORTED_MODULE_10__constants_RunnerDataFileTypeConstants__["a" /* RUNNER_DATA_FILE_TYPE_CSV */])),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Dropdowns__["d" /* MenuItem */], { refKey: __WEBPACK_IMPORTED_MODULE_10__constants_RunnerDataFileTypeConstants__["c" /* RUNNER_DATA_FILE_TYPE_UNDETERMINED */], className: 'dropdown-menu-item--Undetermined' }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, __WEBPACK_IMPORTED_MODULE_10__constants_RunnerDataFileTypeConstants__["c" /* RUNNER_DATA_FILE_TYPE_UNDETERMINED */])))),


          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
              className: 'runner-runs-selector__item__value--data-file-preview',
              size: 'small',
              type: 'secondary',
              onClick: this.handleFilePreview }, 'Preview')),






        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_12__RunnerSelectorFilePreview__["a" /* default */], {
          dataArray: this.state.dataArray,
          isOpen: this.state.isPreviewModalOpen,
          handleClose: this.handleCloseFilePreview }),


        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__item  runner-runs-selector__item--persist' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__meta runner-runs-selector__meta--persist' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Inputs__["a" /* Checkbox */], {
              checked: this.props.selected.persist,
              onChange: this.props.onChange.bind(this, 'persist') })),


          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
              className: 'runner-runs-selector__item__value runner-runs-selector__item__value--persist',
              onClick: this.props.onChange.bind(this, 'persist', !this.props.selected.persist) }, 'Keep variable values'),



          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__postfix runner-runs-selector__postfix--persist' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                className: 'runner-runs-selector__postfix-icon runner-runs-selector__postfix-icon--persist',
                ref: 'variableTooltipTarget',
                onMouseEnter: this.showTooltip.bind(this, 'isVariableTooltipVisible'),
                onMouseLeave: this.hideTooltip.bind(this, 'isVariableTooltipVisible') },

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9__base_Icons_InformationIcon__["a" /* default */], {
                className: 'runner-runs-selector__postfix-icon' })),


            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Tooltips__["a" /* Tooltip */], {
                show: this.state.isVariableTooltipVisible,
                target: this.refs.variableTooltipTarget,
                placement: 'right',
                className: 'runner-runs-selector__postfix-tooltip',
                immediate: true },

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Tooltips__["b" /* TooltipBody */], null, 'Enabling this will write the value of the variables at the end of the run to its current value in the session.')))),






        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__item  runner-runs-selector__item--initial-cookies' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__meta runner-runs-selector__meta--initial-cookies' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Inputs__["a" /* Checkbox */], {
              checked: this.props.selected.runWithEmptyCookieJar,
              onChange: this.props.onChange.bind(this, 'runWithEmptyCookieJar') })),


          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
              className: 'runner-runs-selector__item__value runner-runs-selector__item__value--initial-cookies',
              onClick: this.props.onChange.bind(this, 'runWithEmptyCookieJar', !this.props.selected.runWithEmptyCookieJar) }, 'Run collection without using stored cookies')),





        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__item  runner-runs-selector__item--save-cookies' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__meta runner-runs-selector__meta--save-cookies' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Inputs__["a" /* Checkbox */], {
              checked: this.props.selected.saveCookiesAfterRun,
              onChange: this.props.onChange.bind(this, 'saveCookiesAfterRun') })),


          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
              className: 'runner-runs-selector__item__value runner-runs-selector__item__value--save-cookies',
              onClick: this.props.onChange.bind(this, 'saveCookiesAfterRun', !this.props.selected.saveCookiesAfterRun) }, 'Save cookies after collection run'),



          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-selector__postfix runner-runs-selector__postfix--save-cookies' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                className: 'runner-runs-selector__postfix-icon runner-runs-selector__postfix-icon--save-cookies',
                ref: 'saveCookiesTooltipTarget',
                onMouseEnter: this.showTooltip.bind(this, 'isSaveCookiesTooltipVisible'),
                onMouseLeave: this.hideTooltip.bind(this, 'isSaveCookiesTooltipVisible') },

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9__base_Icons_InformationIcon__["a" /* default */], {
                className: 'runner-runs-selector__postfix-icon' })),


            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Tooltips__["a" /* Tooltip */], {
                show: this.state.isSaveCookiesTooltipVisible,
                target: this.refs.saveCookiesTooltipTarget,
                placement: 'right',
                className: 'runner-runs-selector__postfix-tooltip',
                immediate: true },

              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Tooltips__["b" /* TooltipBody */], null, 'Update the cookies stored in this session and save them to your cookie manager.')))),






        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
            className: 'runner-runs-selector__start-test',
            disabled: !(target.collection && canAddCollection && someRequestSelected),
            type: 'primary',
            onClick: this.props.onStartRun,
            tooltip: this.getTooltipText(!canAddCollection) },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, target && target.name ? `Run ${target.name}` : 'Start Run'))));



  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3603:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InputSelect; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_Inputs__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__base_Icons_DownSolidIcon__ = __webpack_require__(88);








/**
                                                          * @private
                                                          * A Select component that supports input filtering, options.
                                                          * Supports:
                                                          * Standard select features with custom-rendered options.
                                                          * Displays input field to filter out the options.
                                                          * Usage:
                                                          * <InputSelect
                                                          *  placeholder={'Filter Colors'}
                                                          *  defaultIndex={1}
                                                          *  optionCount={10}
                                                          *  optionRenderer={
                                                          *   ({ index, search }) => list[index] //Could be a DOM element
                                                          *  }
                                                          *  closeOnSelect={'false'}
                                                          *  onSelect={() => {}}
                                                          *  />
                                                          */

let InputSelect = class InputSelect extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {

  constructor(props) {
    super(props);
    this.state = {
      focusedIndex: 0,
      highlight: false,
      isOpen: false,
      inputValue: props.getInputValue(props.defaultIndex),
      selectedIndex: props.defaultIndex };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.focusOption = this.focusOption.bind(this);
    this.focusAdjacentOption = this.focusAdjacentOption.bind(this);
    this.selectFocusedOption = this.selectFocusedOption.bind(this);
    this.handleToggleList = this.handleToggleList.bind(this);
    this.handleCloseListOnEscape = this.handleCloseListOnEscape.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleMouseDownOnList = this.handleMouseDownOnList.bind(this);
  }

  renderOptions() {
    const { optionCount, optionRenderer, isSearchable } = this.props,
    { inputValue, selectedIndex, focusedIndex } = this.state,
    options = [];

    this._visibleIndexes = [];

    for (let i = 0; i < optionCount; i++) {
      const search = !this._toggleList && !this._inputFocus && inputValue;

      if (!search || search && isSearchable(i)) {
        const option = optionRenderer(i, search, focusedIndex);
        if (option) {
          this._visibleIndexes.push(i);
          options.push(
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('li', {
              className: __WEBPACK_IMPORTED_MODULE_4_classnames___default()({
                'item': true,
                'is-focused': i === focusedIndex,
                'is-selected': i === selectedIndex }),

              key: 'option-' + i,
              ref: i === focusedIndex ? 'focused' : null,
              onMouseDown: e => {
                this.handleMouseDown(e, i);
              },
              onMouseEnter: e => {
                this.handleMouseEnter(e, i);
              },
              onMouseLeave: e => {
                this.handleMouseLeave(e, i);
              } },

            option));

        }
      }
    }
    return options;
  }

  handleMouseDown(event, index) {
    event.preventDefault();
    event.stopPropagation();
    this.selectFocusedOption(index);
  }

  handleMouseEnter(event, index) {
    this.focusOption(index);
  }

  handleMouseLeave() {
    this.focusOption(this.state.selectedIndex);
  }

  handleCancel() {
    this._cancel = true;
    this.focus();
  }

  focus() {
    if (!this.refs.input) {
      return;
    }
    this.refs.input.focus();
  }

  blur() {
    if (!this.refs.input) {
      return;
    }
    this.refs.input.blur();
  }

  setFocusOnToggleButton() {
    if (!this.refs.button) {
      return;
    }
    this.refs.button.focus();
  }

  handleCloseListOnEscape() {
    this.blur();
    this.setState({
      isOpen: false,
      focusedIndex: this.state.selectedIndex });

  }

  handleToggleList() {
    this._toggleList = true;
    this.setState({ isOpen: !this.state.isOpen }, () => {
      if (this.state.isOpen) {
        this.focus();
      }
    });
  }

  // To allow scrollbar usage
  handleMouseDownOnList(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowDown':{
          e.preventDefault();
          this.focusAdjacentOption('next');
          break;
        }
      case 'ArrowUp':{
          e.preventDefault();
          this.focusAdjacentOption('previous');
          break;
        }
      case 'Enter':{
          e.preventDefault();
          this.selectFocusedOption();
          break;
        }
      case 'Escape':{
          // Important: as it empties out the input field
          e.preventDefault();
          this.handleCloseListOnEscape();
          break;
        }
      default:{
          break;
        }}

  }

  handleFocus() {
    if (this.props.openOnFocus) {
      this._inputFocus = true;
      this.setState({ isOpen: true });
    }
    this.props.onFocus && this.props.onFocus();
  }

  handleBlur() {
    const { selectedIndex } = this.state;
    const { getInputValue } = this.props;

    if (this._toggleList && this.state.isOpen) {
      this._toggleList = false;
      this.focus();
      return;
    }

    if (this.props.closeOnSelect && this._optionSelected) {
      this._optionSelected = false;
      this.props.onBlur && this.props.onBlur();
      return;
    }

    if (this._cancel) {
      this._cancel = false;
      this.focus();
      return;
    }

    this.setState({
      isOpen: !this.props.closeOnBlur,
      inputValue: getInputValue(selectedIndex) });


    this.props.onBlur && this.props.onBlur();
  }

  getNextVisibleIndex(list, index) {
    if (index >= 0 && index + 1 <= list.length - 1) {
      return list[index + 1];
    }
    return list[0];
  }

  getPreviousVisibleIndex(list, index) {
    if (index > 0) {
      return list[index - 1];
    }
    return list[list.length - 1];
  }

  focusOption(index) {
    this.setState({ focusedIndex: index });
  }

  focusAdjacentOption(dir) {
    let focusedIndex = this.state.focusedIndex,
    visibleIndexes = this._visibleIndexes;

    if (dir === 'next' && focusedIndex !== -1) {
      focusedIndex = this.getNextVisibleIndex(visibleIndexes, visibleIndexes.indexOf(focusedIndex));
    } else
    if (dir === 'previous') {
      focusedIndex = this.getPreviousVisibleIndex(visibleIndexes, visibleIndexes.indexOf(focusedIndex));
    }

    this._scrollToFocusedOption = true;
    this.setState({ focusedIndex: focusedIndex });
  }

  selectFocusedOption(index) {
    const { getInputValue, blurOnSelect } = this.props;
    const focusedIndex = index >= 0 ? index : this.state.focusedIndex;

    // If no value selected, then reset
    if (focusedIndex === this.state.selectedIndex) {
      this.setState({ inputValue: getInputValue(focusedIndex) }, () => {
        if (blurOnSelect) {
          this.blur();
        }
      });
      return;
    }

    this._optionSelected = true;

    const inputValue = getInputValue(index);
    if (inputValue) {
      this.setState({
        inputValue: inputValue,
        focusedIndex: focusedIndex,
        selectedIndex: focusedIndex,
        isOpen: !this.props.closeOnSelect },
      () => {
        if (blurOnSelect) {
          this.blur();
        }
      });
    } else
    {
      this.setState({
        focusedIndex: focusedIndex,
        selectedIndex: focusedIndex,
        isOpen: !this.props.closeOnSelect },
      () => {
        if (blurOnSelect) {
          this.blur();
        }
      });
    }

    this.props.onSelect(focusedIndex);
  }

  handleChange(inputValue) {
    this._toggleList = false;
    this._inputFocus = false;
    this.setState({
      inputValue: inputValue,
      isOpen: true });

  }

  componentDidUpdate() {
    const { focused, list } = this.refs;

    // disable scrolling to focused option on mouse events
    if (this._scrollToFocusedOption && focused && list) {

      this._scrollToFocusedOption = false;

      const focusedDOM = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(focused);
      const listDOM = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(list);
      const focusedRect = focusedDOM.getBoundingClientRect();
      const menuRect = listDOM.getBoundingClientRect();
      if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
        listDOM.scrollTop = focusedDOM.offsetTop + focusedDOM.clientHeight - listDOM.offsetHeight;
      }
    }

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultIndex !== nextProps.defaultIndex ||
    nextProps.getInputValue(nextProps.defaultIndex) !== this.state.inputValue) {
      this.setState({
        selectedIndex: nextProps.defaultIndex,
        inputValue: nextProps.getInputValue(nextProps.defaultIndex) });

    }
  }

  highlight() {
    this.setState({ highlight: true }, () => {
      setTimeout(() => {
        this.setState({ highlight: false });
      }, this.props.highlightTimeout);
    });
  }

  getWrapperClasses() {
    return __WEBPACK_IMPORTED_MODULE_4_classnames___default()({
      [this.props.className]: true,
      'input-select-wrapper': true,
      'highlight': this.state.highlight,
      'is-open': this.state.isOpen });

  }

  render() {
    const {
      placeholder,
      hideSearchGlass,
      hideCancelOnBlur,
      showToggleButton,
      selectAllOnFocus,
      width } =
    this.props;

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
          className: this.getWrapperClasses(),
          style: { width: width } },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Inputs__["b" /* Input */], {
          hideCancelOnBlur: hideCancelOnBlur,
          hideSearchGlass: hideSearchGlass,
          inputStyle: 'search',
          placeholder: placeholder || 'Type to filter',
          query: this.state.inputValue,
          ref: 'input',
          selectAllOnFocus: selectAllOnFocus,
          onBlur: this.handleBlur,
          onCancel: this.handleCancel,
          onChange: this.handleChange,
          onFocus: this.handleFocus,
          onKeyDown: this.handleKeyDown }),

        showToggleButton &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Buttons__["a" /* Button */], {
            className: 'dropdown-button',
            ref: 'button',
            onMouseDown: this.handleToggleList },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__base_Icons_DownSolidIcon__["a" /* default */], { className: 'dropdown-caret' })),

        this.state.isOpen &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('ul', {
            className: 'input-select-list',
            ref: 'list',
            onMouseDown: this.handleMouseDownOnList },

          this.renderOptions())));



  }};


InputSelect.defaultProps = {
  blurOnSelect: true,
  closeOnBlur: true,
  closeOnSelect: true,
  defaultIndex: 0,
  hideCancelOnBlur: false,
  hideSearchGlass: true,
  highlightTimeout: 1000,
  openOnFocus: true };


InputSelect.propTypes = {
  blurOnSelect: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  closeOnBlur: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  closeOnSelect: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  hideCancelOnBlur: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  hideSearchGlass: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  highlightTimeout: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number,
  onBlur: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  onFocus: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  openOnFocus: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool };

/***/ }),

/***/ 3604:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerPreviewDataModalContainer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_Modals__ = __webpack_require__(395);
var _class;

let


RunnerPreviewDataModalContainer = __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default()(_class = class RunnerPreviewDataModalContainer extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.handleClose && this.props.handleClose();
  }

  getCustomStyles() {
    return {
      marginTop: '10vh',
      height: '80vh',
      width: '700px' };

  }

  computeKeysArray() {
    let dataArray = this.props.dataArray,
    keys = ['Iteration'];
    if (_.isEmpty(dataArray)) {
      return keys;
    }

    for (var key in dataArray[0]) {
      if (dataArray[0].hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys;
  }

  stringifyParsedValue(value) {
    // wrap the parsed value in double quotes if it is string
    return value && typeof value === 'string' ? `"${value}"` : String(value);
  }

  render() {
    let keys = this.computeKeysArray();
    let dataArray = this.props.dataArray;

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Modals__["a" /* Modal */], {
          isOpen: this.props.isOpen,
          onRequestClose: this.handleClose,
          customStyles: this.getCustomStyles() },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Modals__["d" /* ModalHeader */], null, 'PREVIEW DATA'),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Modals__["b" /* ModalContent */], null,
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'preview-data-modal-content-wrapper' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'preview-data-header-wrapper' },

              _.map(keys, (key, index) => {
                return (
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                      className: 'preview-data-header',
                      key: String(key) + index },

                    key));


              })),



            dataArray && dataArray.length > 0 &&
            _.map(dataArray, (data, dataIndex) => {
              return (
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                    className: 'preview-data-header-wrapper',
                    key: 'header' + dataIndex },


                  _.map(keys, (key, index) => {
                    return (
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                          className: 'preview-data-value',
                          key: String(key) + index + dataIndex },


                        index === 0 ?
                        dataIndex + 1 :
                        this.stringifyParsedValue(data[key])));



                  })));



            })))));





  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3605:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerRecentRuns; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RunnerRecentRunsHeader__ = __webpack_require__(3606);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__RunnerRecentRunsList__ = __webpack_require__(3607);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_GetWorkspaceEntities__ = __webpack_require__(1023);



let

RunnerRecentRuns = class RunnerRecentRuns extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  getEnvironments() {
    return Object(__WEBPACK_IMPORTED_MODULE_3__utils_GetWorkspaceEntities__["a" /* getWorkspaceEntities */])(this.props.activeWorkspace, this.props.environments, 'environments');
  }

  render() {
    let environments = this.getEnvironments();
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__RunnerRecentRunsHeader__["a" /* default */], {
          runFilter: this.props.runFilter,
          onFilterChange: this.props.onFilterChange,
          onImportRun: this.props.onImportRun }),

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__RunnerRecentRunsList__["a" /* default */], {
          environments: environments,
          runFilter: this.props.runFilter,
          runs: this.props.runs,
          onDeleteRun: this.props.onDeleteRun,
          onExportRun: this.props.onExportRun,
          onOpenRun: this.props.onOpenRun })));



  }};

/***/ }),

/***/ 3606:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerRecentRunsHeader; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_Inputs__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_Buttons__ = __webpack_require__(14);


let

RunnerRecentRunsHeader = class RunnerRecentRunsHeader extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.handleImport = this.handleImport.bind(this);
  }

  handleImport(files) {
    this.props.onImportRun && this.props.onImportRun(files);
    this.refs.input && this.refs.input.clear();
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__header' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__header__section-left' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__header__tabs' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__header__tab' }, 'Recent Runs'))),





        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__header__section-right' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__base_Inputs__["b" /* Input */], {
            className: 'runner-recent-runs__header__search',
            inputStyle: 'search',
            placeholder: 'Type to Filter',
            query: this.props.runFilter,
            onCancel: this.props.onFilterChange,
            onChange: this.props.onFilterChange }),

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Buttons__["a" /* Button */], {
              className: 'runner-recent-runs__header__import',
              size: 'small',
              type: 'primary' }, 'Import Test Run'),



          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__base_Inputs__["b" /* Input */], {
            className: 'runner-recent-runs__header__import-selector',
            ref: 'input',
            type: 'file',
            onChange: this.handleImport }))));




  }};

/***/ }),

/***/ 3607:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerRecentRunsList; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RunnerRecentRunsListItem__ = __webpack_require__(3608);

let

RunnerRecentRunsList = class RunnerRecentRunsList extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  getOrderedRuns(runs) {
    return _.orderBy(runs, run => {
      return run.createdAt;
    }, 'desc');
  }

  getFilteredRuns(runs, filter) {
    return _.filter(runs, run => {
      try {
        return _.includes(run.name.toLowerCase(), filter.toLowerCase());
      }
      catch (e) {
        return false;
      }
    });
  }

  getEnvironmentName(envId) {
    let environment = _.find(this.props.environments, ['id', envId]);
    if (!environment) {
      return 'No Environment';
    }
    return environment.name;
  }

  render() {
    const runs = this.props.runs;
    const orderedRuns = this.getOrderedRuns(runs);
    const filteredRuns = this.getFilteredRuns(orderedRuns, this.props.runFilter);

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__runs-list' },

        _.map(filteredRuns, run => {
          let environment = this.getEnvironmentName(run.environment);
          return (
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__RunnerRecentRunsListItem__["a" /* default */], {
              key: run.id,
              run: run,
              environment: environment,
              onDeleteRun: this.props.onDeleteRun,
              onExportRun: this.props.onExportRun,
              onOpenRun: this.props.onOpenRun }));


        }),


        !_.isEmpty(orderedRuns) &&
        _.isEmpty(filteredRuns) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__runs-empty-list-item' }, 'No runs with that name.'),




        _.isEmpty(orderedRuns) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__runs-empty-list-item' }, 'You don\u2019t have any runs yet. Select a collection or folder to start a run.')));





  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3608:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerRecentRunsListItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__postman_date_helper__ = __webpack_require__(577);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__postman_date_helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__postman_date_helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Icons_DownloadIcon__ = __webpack_require__(1593);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_Icons_DeleteIcon__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__stores_get_store__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_mobx_react__ = __webpack_require__(12);
var _class;







let


RunnerRecentRunsListItem = Object(__WEBPACK_IMPORTED_MODULE_8_mobx_react__["a" /* observer */])(_class = class RunnerRecentRunsListItem extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  getIndicatorClasses() {
    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'runner-recent-runs__runs-list-item__indicator': true,
      'is-running': this.props.run.status === 'running',
      'is-stopped': this.props.run.status === 'stopped',
      'is-failed': this.props.run.status === 'finished' && this.props.run.failedTestCount > 0,
      'is-passed': this.props.run.status === 'finished' && this.props.run.failedTestCount === 0 });

  }

  getStatusClasses() {
    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'runner-recent-runs__runs-list-item__status': true,
      'is-running': this.props.run.status === 'running',
      'is-stopped': this.props.run.status === 'stopped',
      'is-failed': this.props.run.status === 'finished' && this.props.run.failedTestCount > 0,
      'is-passed': this.props.run.status === 'finished' && this.props.run.failedTestCount === 0 });

  }

  getRunStatus() {
    let run = this.props.run;
    switch (run.status) {
      case 'paused':
      case 'running':
      case 'stopped':
        return run.status.toUpperCase();
      case 'finished':
        return run.failedTestCount === 0 ? 'PASSED' : run.failedTestCount + ' FAILED';
      default:
        return '';}

  }

  handleAction(action, e) {
    e.stopPropagation && e.stopPropagation();
    switch (action) {
      case 'export':
        __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'download', 'recent_runs');
        this.props.onExportRun && this.props.onExportRun(this.props.run.id);
        break;
      case 'delete':
        __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'delete');
        this.props.onDeleteRun && this.props.onDeleteRun(this.props.run.id);
        break;
      default:
        break;}

  }

  getTooltipText(isDisabled) {
    if (isDisabled) {
      return 'You do not have permissions to perform this action.';
    } else
    {
      return 'Delete run';
    }
  }

  render() {
    const run = this.props.run,
    permissionStore = Object(__WEBPACK_IMPORTED_MODULE_7__stores_get_store__["getStore"])('PermissionStore'),
    canDeleteCollectionrun = permissionStore.can('delete', 'collectionrun', run.id);

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
          className: 'runner-recent-runs__runs-list-item',
          onClick: this.props.onOpenRun.bind(this, run.id) },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__runs-list-item__indicator-wrapper' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getIndicatorClasses() })),


        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__runs-list-item__section-left' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__runs-list-item__collection' },
            run.name),

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__runs-list-item__environment' },
            this.props.environment)),



        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__runs-list-item__section-right' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getStatusClasses() },
            this.getRunStatus()),


          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__runs-list-item__date' },
            __WEBPACK_IMPORTED_MODULE_2__postman_date_helper___default.a.getFormattedDateAndTime(run.createdAt))),



        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-recent-runs__runs-list-item__actions' },

          !_.includes(['running', 'paused'], this.props.run.status) &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Buttons__["a" /* Button */], {
              className: 'runner-recent-runs__runs-list-item__action runner-recent-runs__runs-list-item__action--export',
              onClick: this.handleAction.bind(this, 'export'),
              tooltip: 'Export results' },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Icons_DownloadIcon__["a" /* default */], {
              className: 'runner-recent-runs__runs-list-item__action--export-icon',
              size: 'xs' })),



          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Buttons__["a" /* Button */], {
              className: 'runner-recent-runs__runs-list-item__action runner-recent-runs__runs-list-item__action--delete',
              onClick: this.handleAction.bind(this, 'delete'),
              tooltip: this.getTooltipText(!canDeleteCollectionrun),
              disabled: !canDeleteCollectionrun },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Icons_DeleteIcon__["a" /* default */], {
              className: 'runner-recent-runs__runs-list-item__action--delete-icon',
              size: 'xs' })))));





  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3609:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerRunsCustomizer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dnd__ = __webpack_require__(580);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dnd___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dnd__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__postman_react_dnd_html5_backend__ = __webpack_require__(1076);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__postman_react_dnd_html5_backend___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__postman_react_dnd_html5_backend__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__RunnerRunsCustomizerList__ = __webpack_require__(3610);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__base_Icons_CloseIcon__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_classnames__);
var _dec, _class;






let


RunnerRunsCustomizer = (_dec = Object(__WEBPACK_IMPORTED_MODULE_1_react_dnd__["DragDropContext"])(__WEBPACK_IMPORTED_MODULE_2__postman_react_dnd_html5_backend___default.a), _dec(_class = class RunnerRunsCustomizer extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.handleDragDrop = this.handleDragDrop.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(index) {
    const requestTree = [...this.props.structure];

    requestTree[index].checked = !requestTree[index].checked;

    this.props.onChange(requestTree);
  }

  handleDragDrop(from, to, position) {
    const requestTree = [...this.props.structure],
    item = requestTree[from];

    // Add marker to item that it has been reordered. This will help later to select a strategy
    item.reordered = true;

    // Delete the request from the tree
    requestTree.splice(from, 1);

    // If from is less than to then, shift the to
    from < to && to--;

    requestTree.splice(to + (position === 'after'), 0, item);

    this.props.onChange(requestTree);
  }

  setAllChecked(value) {
    let requestTree = [...this.props.structure];

    requestTree = _.map(requestTree, item => {
      item.checked = value;

      return item;
    });

    this.props.onChange(requestTree);
  }

  getClasses() {
    return __WEBPACK_IMPORTED_MODULE_7_classnames___default()({
      'runner-runs-customizer__container': true,
      'is-disabled': this.props.isInconsistent });

  }

  render() {
    const noStructure = _.isEmpty(this.props.structure);

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-customizer' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-customizer__header' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', { className: 'runner-runs-customizer__header-title' }, 'RUN ORDER'),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-customizer__header-buttons' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Buttons__["a" /* Button */], {
                className: 'button',
                type: 'text',
                onClick: this.setAllChecked.bind(this, false),
                disabled: noStructure }, 'Deselect All'),



            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'separator' }),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Buttons__["a" /* Button */], {
                className: 'button',
                type: 'text',
                onClick: this.setAllChecked.bind(this, true),
                disabled: noStructure }, 'Select All'),



            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'separator' }),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Buttons__["a" /* Button */], {
                className: 'button',
                type: 'text',
                onClick: this.props.onReset,
                disabled: noStructure }, 'Reset'),





            this.props.onClose &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__base_Icons_CloseIcon__["a" /* default */], {
              className: 'close',
              size: 'xs',
              onClick: this.props.onClose }))),




        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getClasses() },

          !_.isEmpty(this.props.data) && !_.isEmpty(this.props.structure) &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__RunnerRunsCustomizerList__["a" /* default */], {
            data: this.props.data,
            itemList: this.props.structure,
            onItemToggle: this.handleToggle,
            onDragDrop: this.handleDragDrop,
            disabled: this.props.isInconsistent,
            onInconsistency: this.props.onInconsistency })),



        this.props.isInconsistent &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-customizer__disable-overlay' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'content' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'title' }, 'Reload to continue'),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'description' }, 'Some of the requests you\'ve selected have been modified. ',
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('br', null), 'Please reload the requests to continue.'),


            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Buttons__["a" /* Button */], {
                className: 'button',
                type: 'secondary',
                className: 'button',
                onClick: this.props.onReload }, 'Reload')))));







  }}) || _class);



RunnerRunsCustomizer.defaultProps = {
  data: {},
  structure: [],
  onClose: undefined,
  isInconsistent: false };


RunnerRunsCustomizer.propTypes = {
  data: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.object,
  structure: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.array,
  onClose: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.func,
  onChange: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.func.isRequired,
  onReload: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.func.isRequired,
  isInconsistent: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.bool,
  onInconsistency: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.func.isRequired };
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3610:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerRunsCustomizerList; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RunnerRunsCustomizerListItem__ = __webpack_require__(3611);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};
let

RunnerRunsCustomizerList = class RunnerRunsCustomizerList extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  enrichItem(item) {
    // Enrich parents will their respective data
    item.parents = _.map(item.parents, parent => {return this.props.data[parent] || {};});

    // Enrich item itself. Adding item after so that keys conflict is not a problem
    const data = this.props.data[item.id];

    return data ? _extends({}, data, item) : null;
  }

  render() {
    const itemList = this.props.itemList || [];

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-customizer__list' },

        _.map(itemList, (item, index) => {
          return (
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__RunnerRunsCustomizerListItem__["a" /* default */], {
              key: index,
              index: index,
              item: this.enrichItem(item),
              onItemToggle: this.props.onItemToggle,
              onDragDrop: this.props.onDragDrop,
              data: this.props.data,
              disabled: this.props.disabled,
              onInconsistency: this.props.onInconsistency }));


        })));



  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3611:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerRunsCustomizerListItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dnd__ = __webpack_require__(580);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dnd___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dnd__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Inputs__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_RequestMethodHelper__ = __webpack_require__(1496);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__base_Icons_MenuIcon__ = __webpack_require__(1073);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__base_Icons_RightSolidIcon__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__base_FolderButton__ = __webpack_require__(3612);
var _dec, _dec2, _class;











const flattenRequest = itemGroup => {
  return _.flatMap(itemGroup, item => {
    if (item.type === 'request') {
      return item.id;
    }

    if (item.type === 'folder') {
      return flattenRequest(item.children);
    }

    return [];
  });
};

const itemSource = {
  canDrag(props) {
    return !props.disabled;
  },

  beginDrag(props) {
    return {
      index: props.index,
      id: props.item.id,
      type: props.item.type };

  },

  endDrag(props, monitor) {
    const dragIndex = monitor.getItem().index,
    { dropIndex, position } = monitor.getDropResult() || {};

    if (dragIndex === dropIndex || _.isUndefined(dropIndex)) {
      return;
    }

    props.onDragDrop(dragIndex, dropIndex, position);
  } };


const getMiddleY = component => {
  const elementRect = Object(__WEBPACK_IMPORTED_MODULE_2_react_dom__["findDOMNode"])(component).getBoundingClientRect();
  return elementRect.top + elementRect.height / 2;
};

const itemTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    if (monitor.getClientOffset().y > getMiddleY(component)) {
      component.getDecoratedComponentInstance().scheduleHoverUpdate('bottom');
    } else
    {
      component.getDecoratedComponentInstance().scheduleHoverUpdate('top');
    }
  },

  drop(props, monitor, component) {
    return {
      dropIndex: props.index,
      position: monitor.getClientOffset().y > getMiddleY(component) ? 'after' : 'before' };

  } };let















RunnerRunsCustomizerListItem = (_dec = Object(__WEBPACK_IMPORTED_MODULE_1_react_dnd__["DropTarget"])('runner-customizer-list-request', itemTarget, (connect, monitor) => {return { connectDropTarget: connect.dropTarget(), isDragOver: monitor.isOver({ shallow: true }) };}), _dec2 = Object(__WEBPACK_IMPORTED_MODULE_1_react_dnd__["DragSource"])('runner-customizer-list-request', itemSource, (connect, monitor) => {return { connectDragSource: connect.dragSource(), connectDragPreview: connect.dragPreview(), isDragging: monitor.isDragging() };}), _dec(_class = _dec2(_class = class RunnerRunsCustomizerListItem extends __WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"] {
  constructor(props) {
    super(props);

    this.state = {
      dropHoverBottom: false,
      dropHoverTop: false };


    this.handleToggle = this.handleToggle.bind(this);
    this.setDropHoverTop = this.setDropHoverTop.bind(this);
    this.setDropHoverBottom = this.setDropHoverBottom.bind(this);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.requestedFrame);
  }

  componentDidMount() {
    // If the cannot be resolved and disabled in false then emit inconsistency
    !this.props.item & !this.props.disabled && this.props.onInconsistency();
  }

  scheduleHoverUpdate(type) {
    let func = type === 'bottom' ? this.setDropHoverBottom : this.setDropHoverTop;

    if (!this.requestedFrame) {
      this.requestedFrame = requestAnimationFrame(() => {
        try {
          func && func();
        }
        catch (e) {} finally
        {
          this.requestedFrame = null;
        }
      });
    }
  }

  handleToggle() {
    this.props.onItemToggle(this.props.index);
  }

  setDropHoverTop() {
    !this.state.dropHoverTop &&
    this.setState({
      dropHoverBottom: false,
      dropHoverTop: true });

  }

  setDropHoverBottom() {
    !this.state.dropHoverBottom &&
    this.setState({
      dropHoverBottom: true,
      dropHoverTop: false });

  }

  getMethodIcon(method = 'GET') {
    method = method.toUpperCase();

    let classes = `customizer__row_request-icon request-method--${method}`;

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: classes },
        __WEBPACK_IMPORTED_MODULE_5__utils_RequestMethodHelper__["a" /* default */].getMethodAbbreviation(method)));


  }

  getClasses(type) {
    return __WEBPACK_IMPORTED_MODULE_3_classnames___default()({
      'runner-runs-customizer__list-item__row': true,
      'is-dragged': this.props.isDragging,
      'is-drop-hovered-top': this.state.dropHoverTop && this.props.isDragOver,
      'is-drop-hovered-bottom': this.state.dropHoverBottom && this.props.isDragOver });

  }

  render() {
    const {
      connectDragSource,
      connectDragPreview,
      connectDropTarget,
      item } =
    this.props;

    return item && connectDragPreview(connectDropTarget(
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-runs-customizer__list-item' },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getClasses() },
        connectDragSource(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'customizer__sort-icon' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__base_Icons_MenuIcon__["a" /* default */], { size: 'xs' }))),

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Inputs__["a" /* Checkbox */], {
          className: 'customizer__row_check',
          checked: item.checked,
          onChange: this.handleToggle }),

        !_.isEmpty(item.parents) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'customizer__row__parents' },

          _.map(item.parents, (folder, index) => {
            return (
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                  key: index,
                  className: 'customizer__row_icons' },

                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__base_FolderButton__["a" /* default */], {
                  className: 'customizer__row_folder-icon',
                  placement: 'bottom',
                  tooltip: folder.name,
                  disabled: this.props.disabled }),

                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__base_Icons_RightSolidIcon__["a" /* default */], null)));


          })),



        this.getMethodIcon(item.method),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', { className: 'customizer__row_name' }, ' ', item.name)))));



  }}) || _class) || _class);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3612:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FolderButton; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Tooltips__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Icons_FolderIcon__ = __webpack_require__(1589);



let

FolderButton = class FolderButton extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = { isTooltipVisible: false };

    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  showTooltip(isVisible = this.state.isTooltipVisible) {
    this.setState({ isTooltipVisible: true });
  }

  hideTooltip(isVisible) {
    this.setState({ isTooltipVisible: false });
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'folder-button' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: 'folder-button__icon',
            ref: 'tooltipTarget',
            onMouseOver: this.showTooltip,
            onMouseOut: this.hideTooltip },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__Icons_FolderIcon__["a" /* default */], this.props)),

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__Tooltips__["a" /* Tooltip */], {
            show: this.state.isTooltipVisible && !this.props.disabled,
            target: this.refs.tooltipTarget,
            placement: this.props.placement,
            immediate: true },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__Tooltips__["b" /* TooltipBody */], null,
            this.props.tooltip))));




  }};


FolderButton.propTypes = { tooltip: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.node };

FolderButton.defaultProps = {
  tooltip: 'Folder',
  placement: 'right',
  disabled: false };

/***/ }),

/***/ 3613:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerResultsContainer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_base_keymaps_KeyMaps__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_runner_RunnerResultsHeader__ = __webpack_require__(1564);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_runner_RunnerResultsIterationBar__ = __webpack_require__(3615);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_runner_RunnerResultsSidebar__ = __webpack_require__(1565);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_runner_RunnerResults__ = __webpack_require__(3616);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modules_services_AnalyticsService__ = __webpack_require__(31);
var _class;










const keyMap = {
  'scrollLeft': 'left',
  'scrollRight': 'right',
  'goBack': ['del', 'backspace'] };let



RunnerResultsContainer = __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default()(_class = class RunnerResultsContainer extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = {
      selectedIteration: 0,
      selectedFilter: 'all',
      filteredRun: [] };


    this.handleChangeIteration = this.handleChangeIteration.bind(this);
    this.handleIterationJump = this.handleIterationJump.bind(this);
    this.handleRunAction = this.handleRunAction.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  getKeyMapHandlers() {
    return {
      'scrollLeft': this.handleChangeIteration.bind(this, this.state.selectedIteration - 1),
      'scrollRight': this.handleChangeIteration.bind(this, this.state.selectedIteration + 1),
      'goBack': this.props.onNewRun };

  }

  getClasses() {
    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'runner-results': true,
      'is-hidden': !this.props.active });

  }

  handleChangeIteration(iteration) {
    let run = this.props.run;
    if (iteration > run.currentIteration || iteration < 0) {
      return;
    }

    this.setState({ selectedIteration: iteration });
  }

  handleIterationJump(iteration) {
    this.handleChangeIteration(iteration);
    this.refs.body && this.refs.body.scroll(iteration);
  }

  handleRunAction(action) {
    switch (action) {
      case 'pause':
      case 'resume':
      case 'stop':
        if (action === 'stop') {
          __WEBPACK_IMPORTED_MODULE_8__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'create', 'stop_run', pm.runner.getTotalRequests(this.props.runId));
        } else {
          __WEBPACK_IMPORTED_MODULE_8__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', action);
        }

        pm.runner.setRunAction(this.props.runId, action);
        break;
      case 'retry':
        __WEBPACK_IMPORTED_MODULE_8__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'initiate_run', 'retry_run', this.props.run.iterations.length);
        pm.runner.setRunAction(this.props.runId, action, (err, runId) => {
          !err && this.props.onOpenRun && this.props.onOpenRun(runId);
          !err && this.setState({
            selectedIteration: 0,
            selectedFilter: 'all' });

        });
        break;}

  }

  handleOpenConsole() {
    pm.mediator.trigger('newConsoleWindow');
  }

  handleFilterChange(filter) {
    __WEBPACK_IMPORTED_MODULE_8__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'filter', null, filter);
    this.setState({ selectedFilter: filter });
  }

  render() {
    const run = this.props.run;

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__components_base_keymaps_KeyMaps__["a" /* default */], {
          handlers: this.getKeyMapHandlers(),
          keyMap: keyMap },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: this.getClasses(),
            ref: results => {return results && results.focus();} },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__section-top' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__components_runner_RunnerResultsHeader__["a" /* default */], {
              requests: this.props.requests,
              collections: this.props.collections,
              folders: this.props.folders,
              environments: this.props.environments,
              showSummaryLink: true,
              run: run,
              onExport: this.props.onExport,
              onNewRun: this.props.onNewRun,
              onRunAction: this.handleRunAction,
              onOpenSummary: this.props.onOpenSummary,
              activeWorkspace: this.props.activeWorkspace })),


          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__section-bottom' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__components_runner_RunnerResultsSidebar__["a" /* default */], {
              status: _.get(this.props.run, 'status'),
              selectedFilter: this.state.selectedFilter,
              onFilterChange: this.handleFilterChange }),

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__components_runner_RunnerResults__["a" /* default */], {
              filter: this.state.selectedFilter,
              ref: 'body',
              run: run,
              selectedIteration: this.state.selectedIteration,
              onIterationChange: this.handleChangeIteration,
              onIterationJump: this.handleIterationJump,
              onOpenConsole: this.handleOpenConsole }),

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__components_runner_RunnerResultsIterationBar__["a" /* default */], {
              run: run,
              selectedIteration: this.state.selectedIteration,
              onIterationChange: this.handleIterationJump })))));





  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3614:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RadialProgress; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_prop_types__);
var _class;


let


RadialProgress = __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default()(_class = class RadialProgress extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  getClasses() {
    let progress = parseInt(this.props.progress);

    return __WEBPACK_IMPORTED_MODULE_2_classnames___default()({
      'radial-progress': true,
      'is-running': progress < 100,
      'is-finished': progress >= 100,
      [this.props.className]: true });

  }

  getMeasures() {
    let radius = this.props.radius,
    borderWidth = this.props.borderWidth,
    progress = this.props.progress,
    circumference = 2 * Math.PI * radius;

    return {
      svgWidth: 2 * (radius + borderWidth),
      svgHeight: 2 * (radius + borderWidth),
      cx: radius + borderWidth,
      cy: radius + borderWidth,
      radius: radius,
      dashArray: circumference,
      progress: (100 - progress) / 100 * circumference };

  }

  render() {
    let measures = this.getMeasures(),
    style = { strokeDashoffset: measures.progress };
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getClasses(), 'data-progress': this.props.progress + ' %' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('svg', { className: 'progress', width: measures.svgWidth, height: measures.svgHeight },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('circle', {
            className: 'radial-progress__background',
            cx: measures.cx,
            cy: measures.cy, r: measures.radius,
            fill: 'transparent' }),

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('circle', {
            className: 'radial-progress__progress',
            cx: measures.cx,
            cy: measures.cy, r: measures.radius,
            fill: 'transparent',
            strokeDasharray: measures.dashArray,
            style: style }))));




  }}) || _class;


RadialProgress.propTypes = {
  radius: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.number,
  borderWidth: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.number };


RadialProgress.defaultProps = {
  radius: 50,
  borderWidth: 3 };

/***/ }),

/***/ 3615:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerResultsIterationBar; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_services_AnalyticsService__ = __webpack_require__(31);
var _class;






const ITEM_HEIGHT = 30;let


RunnerResultsIterationBar = __WEBPACK_IMPORTED_MODULE_4_pure_render_decorator___default()(_class = class RunnerResultsIterationBar extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = { visibleHeight: 0 };

    this.scrollPosition = 0;

    this.setBounds = this.setBounds.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.setBounds();
    window.addEventListener('resize', this.setBounds);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setBounds);
  }

  componentWillReceiveProps(nextProps) {
    let me = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this);
    let nextScroll = nextProps.selectedIteration * ITEM_HEIGHT;

    if (nextScroll > this.scrollPosition + this.state.visibleHeight) {
      me.scrollTop = this.scrollPosition + this.state.visibleHeight;
      this.handleScroll({ target: { scrollTop: me.scrollTop } });
    } else
    if (nextScroll < this.scrollPosition) {
      me.scrollTop = nextScroll;
      this.handleScroll({ target: { scrollTop: me.scrollTop } });
    }
  }


  isFailed(iteration) {
    return _.some(iteration, request => {
      if (request.error) {
        return true;
      }
      return _.some(request.tests, test => {
        return test.status === 'fail';
      });
    });
  }

  getTabClasses(iteration) {
    let run = this.props.run;

    return __WEBPACK_IMPORTED_MODULE_3_classnames___default()({
      'runner-results__iterations__tab': true,
      'is-failed': this.isFailed(run.iterations[iteration]),
      'is-active': this.props.selectedIteration === iteration,
      'is-running': run.status !== 'finished' && run.currentIteration === iteration,
      'is-pending': run.currentIteration < iteration,
      'is-done': run.currentIteration > iteration });

  }

  setBounds() {
    let me = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this);

    this.setState({ visibleHeight: me.clientHeight });
  }

  handleScroll(e) {
    let scrollPosition = e.target.scrollTop;
    this.scrollPosition = scrollPosition;
  }

  handleIterationChange(iteration) {
    if (this.props.run.currentIteration < iteration) {
      return;
    }
    __WEBPACK_IMPORTED_MODULE_5__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'navigate_iteration');
    this.props.onIterationChange && this.props.onIterationChange(iteration);
  }

  render() {
    const run = this.props.run,
    selectedIteration = this.props.selectedIteration;
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
          className: 'runner-results__iterations__tabs',
          onScroll: this.handleScroll },


        _.map(run.iterations, (iteration, iterationId) => {
          return (
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                className: this.getTabClasses(iterationId),
                ref: iterationId,
                key: iterationId,
                onClick: this.handleIterationChange.bind(this, iterationId) },

              iterationId + 1));


        })));



  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3616:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerResults; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_util__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_List__ = __webpack_require__(1566);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__RunnerResultsIterationListItem__ = __webpack_require__(3617);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__RunnerResultsActivityIndicator__ = __webpack_require__(3641);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};








const ITEM_HEIGHT = 40;
const ITERATION_HEADER_HEIGHT = 20;let

RunnerResults = class RunnerResults extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = {
      animateScroll: false,
      visibleHeight: 0,
      filteredIterations: [],
      iterationHeights: [] };


    this.setBounds = this.setBounds.bind(this);
    this.setIterationHeights = this.setIterationHeights.bind(this);
    this.updateIterationHeights = this.updateIterationHeights.bind(this);
    this._listItem = this._listItem.bind(this);
    this.handleIterationChange = this.handleIterationChange.bind(this);
    this.scroll = this.scroll.bind(this);
    this.handleIterationsReady = this.handleIterationsReady.bind(this);
  }

  componentDidMount() {
    this.setBounds();
    this.filterIterations(this.props.run.iterations, this.props.filter);
    window.addEventListener('resize', this.setBounds);
    pm.uiZoom.on('change', this.setBounds);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setBounds);
    pm.uiZoom.off('change', this.setBounds);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.run.status === 'running') {
      this.setIterationHeights(nextProps.run.iterations);
    }
    if (nextProps.filter !== this.props.filter) {
      this.filterIterations(nextProps.run.iterations, nextProps.filter);
      this.iterations.scroll({ scrollPosition: 0 });
    }
  }

  filterIterations(iterations, filter) {
    let filtered;
    if (filter === 'all') {
      filtered = iterations;
    } else
    {
      filtered = _.map(iterations, iteration => {
        return this.getFilteredIteration(iteration, filter);
      });
    }

    this.setState({ filteredIterations: filtered }, () => {
      this.setIterationHeights(this.state.filteredIterations);
    });
  }

  getFilteredIteration(iteration, filter) {
    let mappedIteration,
    mappedRequest;

    if (filter === 'all') {
      return iteration;
    }

    mappedIteration = _.map(iteration, request => {
      let tests = _.filter(request.tests, test => {
        return test.status === filter;
      });

      if (_.isEmpty(tests)) {
        return false;
      }

      return _extends({},
      request, {
        tests });

    });

    return _.compact(mappedIteration);
  }

  setBounds() {
    let me = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this);

    this.setState({ visibleHeight: me.clientHeight });
  }

  setIterationHeights(iterations) {
    let iterationHeights;

    iterationHeights = _.map(iterations, iteration => {
      if (_.isEmpty(iteration)) {
        return 0;
      }
      return _.reduce(iteration, (height, request) => {
        return height +
        (
        _.size(request.tests) + (
        request.error || _.isEmpty(request.tests) ? 1 : 0)) *
        ITEM_HEIGHT + // Test heights. At least one item is always present (the error / empty message)
        ITEM_HEIGHT; // Request height
      }, 0) + ITERATION_HEADER_HEIGHT;
    });

    this.setState({
      iterationHeights: iterationHeights,
      filteredIterations: iterations });

  }

  updateIterationHeights(iteration, testCount, isOpen) {
    let iterationHeights = this.state.iterationHeights;
    if (isOpen) {
      // variable data type mismatch (iteration is object above, number here)
      iterationHeights[iteration] += testCount * ITEM_HEIGHT;
    } else
    {
      iterationHeights[iteration] -= testCount * ITEM_HEIGHT;
    }

    this.setState({ iterationHeights: iterationHeights });
  }

  handleIterationChange(nextStart) {
    this.props.onIterationChange && this.props.onIterationChange(nextStart);
  }

  handleIterationsReady(list) {
    if (list) {
      list.scroll({ itemIndex: 0 });
      this.iterations = list;
    }
  }

  scroll(iteration) {
    this.iterations.scroll({ itemIndex: iteration });
  }

  _listItem(listItem, index) {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__RunnerResultsIterationListItem__["a" /* default */], {
        filter: this.props.filter,
        items: listItem,
        iterationId: index,
        key: index,
        parent: this,
        onIterationChange: this.props.onIterationChange,
        onOpenConsole: this.props.onOpenConsole,
        onToggleRequest: this.updateIterationHeights }));


  }

  render() {
    let run = this.props.run;
    let selectedIteration = run.iterations[this.props.selectedIteration];

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__body' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_List__["a" /* default */], {
          animateScroll: true,
          autoScroll: true,
          className: 'runner-results__body__iteration-list',
          'data-iter': 'Iteration ' + (this.props.selectedIteration + 1),
          height: this.state.visibleHeight,
          list: this.state.filteredIterations,
          listItemHeights: this.state.iterationHeights,
          listItemTemplate: this._listItem,
          ref: this.handleIterationsReady,
          onItemRender: this.handleIterationChange }),


        _.includes(['running', 'paused', 'stopped'], run.status) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__RunnerResultsActivityIndicator__["a" /* default */], { run: run }),


        _.includes(['finished', 'stopped'], run.status) &&
        _.isEmpty(this.state.filteredIterations) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__body__empty' }, 'No tests found for the selected filter')));





  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3617:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerResultsIterationListItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__RunnerResultsRequestListItem__ = __webpack_require__(3618);
var _class;



let


RunnerResultsIterationListItem = __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default()(_class = class RunnerResultsIterationListItem extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = { stuck: false };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this.props.parent).addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this.props.parent).removeEventListener('scroll', this.handleScroll);
  }

  getHeaderClasses() {
    return __WEBPACK_IMPORTED_MODULE_3_classnames___default()({
      'runner-results__body__iteration': true,
      'is-stuck': this.state.stuck });

  }

  handleScroll() {
    let me = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this).getBoundingClientRect(),
    parent = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this.props.parent);

    if (me.top <= 160 && me.top >= 160 - me.height) {
      this.props.onIterationChange && this.props.onIterationChange(this.props.iterationId);
      !this.state.stuck && this.setState({ stuck: true });
    } else
    {
      this.state.stuck && this.setState({ stuck: false });
    }
  }

  render() {
    let iterationId = this.props.iterationId;

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
          className: this.getHeaderClasses(),
          'data-iter': `Iteration ${iterationId + 1}` },


        !_.isEmpty(this.props.items) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__body__iteration-header' }, `Iteration ${iterationId + 1}`),


        _.map(this.props.items, (request, index) => {
          return (
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__RunnerResultsRequestListItem__["a" /* default */], {
              key: request.id + '-' + index,
              filter: this.props.filter,
              request: request,
              iterationId: this.props.iterationId,
              onOpenConsole: this.props.onOpenConsole,
              onToggle: this.props.onToggleRequest }));


        })));



  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3618:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerResultsRequestListItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_ExpandableTooltip__ = __webpack_require__(3619);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_Icons_DownSolidIcon__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__base_Icons_UpSolidIcon__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__RunnerResultsTestListItem__ = __webpack_require__(3620);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_util__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__modules_services_AnalyticsService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_graphlib__ = __webpack_require__(3621);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_graphlib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_graphlib__);
var _class;










let


RunnerResultsRequestListItem = __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default()(_class = class RunnerResultsRequestListItem extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
      response: false };


    this.toggleRequest = this.toggleRequest.bind(this);
    this.toggleResponse = this.toggleResponse.bind(this);
  }

  isFailed(tests) {
    return _.some(tests, test => {
      return test.status === 'fail';
    });
  }

  getHeaderClasses() {
    return __WEBPACK_IMPORTED_MODULE_8_classnames___default()({
      'runner-results__request__header': true,
      'is-failed': this.isFailed(this.props.request.tests),
      'is-filtered': this.props.filter !== 'all' });

  }

  getStatusClasses() {
    const overallStatus = this.isFailed(this.props.request.tests);
    return __WEBPACK_IMPORTED_MODULE_8_classnames___default()({
      'runner-results__request__status': true,
      'is-passed': !overallStatus,
      'is-failed': overallStatus });

  }

  getMethodClasses() {
    return __WEBPACK_IMPORTED_MODULE_8_classnames___default()({
      'runner-results__request__method': true,
      [`runner-results__request__method--${this.props.request.request.method.toUpperCase()}`]: true });

  }

  getToggleButtonClasses() {
    return __WEBPACK_IMPORTED_MODULE_8_classnames___default()({
      'runner-results__request__expand': true,
      'is-open': this.state.isOpen });

  }

  toggleRequest(e) {
    e && e.stopPropagation();
    __WEBPACK_IMPORTED_MODULE_10__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', this.state.isOpen ? 'collapse' : 'expand', 'run_results');
    this.setState({ isOpen: !this.state.isOpen }, () => {
      this.props.onToggle && this.props.onToggle(this.props.iterationId, _.size(this.props.request.tests), this.state.isOpen);
    });
  }

  getTooltipData() {
    let request = this.props.request,
    requestHeaders,
    responseHeaders,
    requestBody,
    responseBody;

    requestHeaders = !_.isEmpty(request.request.headers) ? _.reduce(_.keys(request.request.headers), (headers, header) => {
      headers[header] = request.request.headers[header];
      return headers;
    }, {}) : 'Request Headers unavailable';

    responseHeaders = !_.isEmpty(request.response) ? _.reduce(request.response.headers, (headers, header) => {
      headers[header.key] = header.value;
      return headers;
    }, {}) : 'Response Headers unavailable';

    requestBody = !_.isEmpty(request.request.body) ? __WEBPACK_IMPORTED_MODULE_9__utils_util__["a" /* default */].stringify(request.request.body) : 'Request body unavailable';

    if (request.response && request.response.size) {
      if (request.response.size < 300000) {
        responseBody = request.response && __WEBPACK_IMPORTED_MODULE_9__utils_util__["a" /* default */].beautifyJs(request.response.body);
      } else
      {
        responseBody = 'Response body is too large';
      }
    } else
    {
      responseBody = 'Response body unavailable';
    }

    return [{
      title: 'Request URL',
      body: request.request.url },
    {
      title: 'Request Headers',
      body: requestHeaders },
    {
      title: 'Request Body',
      body: requestBody },
    {
      title: 'Response Headers',
      body: responseHeaders },
    {
      title: 'Response Body',
      body: responseBody }];

  }

  getTooltipPosition() {
    let me = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this).getBoundingClientRect();

    return window.innerHeight > me.top + 230 ? 'bottom' : 'top';
  }

  toggleResponse(e) {
    e && e.stopPropagation();
    this.setState({ response: !this.state.response });
    !this.state.response && __WEBPACK_IMPORTED_MODULE_10__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'view_response');
  }

  render() {
    const request = this.props.request;

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__request' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getHeaderClasses() },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__request__details' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getStatusClasses() }),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getMethodClasses() }, request.request.method.toUpperCase()),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                className: 'runner-results__request__name',
                onClick: this.toggleResponse },

              request.name),

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__request__url' }, request.request.url),

            request.request.path &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { title: request.request.path, className: 'runner-results__request__path' }, request.request.path),


            this.state.response &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_ExpandableTooltip__["a" /* default */], {
              data: this.getTooltipData(),
              position: this.getTooltipPosition.bind(this),
              onClose: this.toggleResponse })),





          request.response &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__response__details' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__response__details__detail' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__response__icon' }),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__response__code' }, request.response.code, ' ', request.response.name)),

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__response__details__detail' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__response__icon' }),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__response__time' }, request.response.time, ' ms')),


            request.response.size &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__response__details__detail' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__response__icon' }),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__response__size' },

                request.response.size < 1000 ?
                request.response.size + ' B' :
                request.response.size / 1000 + ' KB'))),







          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
              className: 'runner-results__request__expand-button',
              onClick: this.toggleRequest },


            this.state.isOpen ?
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__base_Icons_UpSolidIcon__["a" /* default */], { className: 'runner-results__request__expand is-open' }) :
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Icons_DownSolidIcon__["a" /* default */], { className: 'runner-results__request__expand' }))),




        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__request__body' },

          request.error &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__test is-failed' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__test__name' },
              request.errorReason,






              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', null, '\xA0Open DevTools for more info.'))),






          !request.error && this.state.isOpen && request.response && _.isEmpty(request.tests) &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__test__empty' }, 'This request does not have any tests.'),




          !request.error && this.state.isOpen && _.map(request.tests, (test, index) => {
            return (
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__RunnerResultsTestListItem__["a" /* default */], {
                filter: this.props.filter,
                key: index,
                test: test }));


          }))));




  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3619:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExpandableTooltip; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__postman_react_click_outside__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__postman_react_click_outside___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__postman_react_click_outside__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Icons_UpSolidIcon__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Icons_DownSolidIcon__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_prop_types__);
var _class;




let

ExpandableTooltipJSONItemBody = class ExpandableTooltipJSONItemBody extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  handleBodyClick(e) {
    e && e.stopPropagation();
    e && e.preventDefault();
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
          className: 'expandable-tooltip__item__body expandable-tooltip__item__body--json',
          onClick: this.handleBodyClick },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', { className: 'expandable-tooltip__item__body__key' },
          this.props.kvKey),

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', { className: 'expandable-tooltip__item__body__value' },
          this.props.kvValue)));



  }};let


ExpandableTooltipJSONItem = class ExpandableTooltipJSONItem extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = { isOpen: Boolean(props.isOpen) };

    this.toggleOpen = this.toggleOpen.bind(this);
  }

  getClasses() {
    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'expandable-tooltip__item': true,
      'is-open': this.state.isOpen });

  }

  toggleOpen(e) {
    this.handleBodyClick(e);
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleBodyClick(e) {
    e && e.stopPropagation();
    e && e.preventDefault();
  }

  render() {
    let body = this.props.body,
    sortedBody = _.sortBy(_.keys(body), key => {
      return key.toLowerCase();
    });

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
          className: this.getClasses(),
          onClick: this.handleBodyClick },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: 'expandable-tooltip__item__header',
            onClick: this.toggleOpen },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'expandable-tooltip__item__title' },
            this.props.title,
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'expandable-tooltip__item__length' },
              `(${sortedBody.length})`)),


          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'expandable-tooltip__item__expand' },
            this.state.isOpen ?
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__Icons_UpSolidIcon__["a" /* default */], { className: 'expandable-tooltip__item__expand-icon' }) :
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__Icons_DownSolidIcon__["a" /* default */], { className: 'expandable-tooltip__item__expand-icon' }))),




        this.state.isOpen && _.map(sortedBody, key => {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(ExpandableTooltipJSONItemBody, {
            key: key,
            kvKey: key,
            kvValue: body[key] });

        }),


        this.state.isOpen && _.isEmpty(sortedBody) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'expandable-tooltip__item__body expandable-tooltip__item__body--string' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'expandable-tooltip__item__body__unavailable' }, 'Data unavailable (Only data about the top ',
            ' ' + pm.runner.maxRunCount + ' ', ' historical runs is stored)'))));





  }};let


ExpandableTooltipStringItem = class ExpandableTooltipStringItem extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = { isOpen: Boolean(props.isOpen) };

    this.toggleOpen = this.toggleOpen.bind(this);
  }

  getClasses() {
    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'expandable-tooltip__item': true,
      'is-open': this.state.isOpen });

  }

  toggleOpen(e) {
    e.stopPropagation();
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleBodyClick(e) {
    e && e.stopPropagation();
    e && e.preventDefault();
  }

  render() {
    let item = this.props.item;
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getClasses() },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: 'expandable-tooltip__item__header',
            onClick: this.toggleOpen },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'expandable-tooltip__item__title' },
            this.props.title),

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'expandable-tooltip__item__expand' },
            this.state.isOpen ?
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__Icons_UpSolidIcon__["a" /* default */], { className: 'expandable-tooltip__item__expand-icon' }) :
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__Icons_DownSolidIcon__["a" /* default */], { className: 'expandable-tooltip__item__expand-icon' }))),




        this.state.isOpen &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: 'expandable-tooltip__item__body expandable-tooltip__item__body--string',
            onClick: this.handleBodyClick },


          this.props.body ?
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('pre', null, this.props.body) :
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'expandable-tooltip__item__body__unavailable' },
            'Data unavailable (Only data about the top ' + pm.runner.maxRunCount + ' historical runs is stored)'))));






  }};let



ExpandableTooltip = __WEBPACK_IMPORTED_MODULE_2__postman_react_click_outside___default()(_class = class ExpandableTooltip extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.handleClickOutside = this.props.onClose.bind(this);
  }

  componentWillUpdate() {
    this.position = this.props.position();
  }

  getClasses() {
    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'expandable-tooltip': true,
      'bottom': this.position === 'bottom',
      'top': this.position === 'top' });

  }

  getBodyClasses() {
    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'expandable-tooltip__body': true,
      'bottom': this.position === 'bottom',
      'top': this.position === 'top' });

  }

  handleScroll(e) {
    e && e.stopPropagation();
    e && e.preventDefault();
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getClasses() },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getBodyClasses(), onScroll: this.handleScroll },

          _.map(this.props.data, (datum, index) => {
            if (_.isString(datum.body)) {
              return (
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(ExpandableTooltipStringItem, {
                  key: index,
                  title: datum.title,
                  body: datum.body }));


            } else
            if (_.isObject(datum.body)) {
              return (
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(ExpandableTooltipJSONItem, {
                  key: index,
                  isOpen: !index,
                  title: datum.title,
                  body: datum.body }));


            }
          }))));




  }}) || _class;


ExpandableTooltip.propTypes = { position: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func.isRequired };
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3620:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerResultsTestListItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_classnames__);
var _class;

let


RunnerResultsTestListItem = __WEBPACK_IMPORTED_MODULE_1_pure_render_decorator___default()(_class = class RunnerResultsTestListItem extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  getClasses() {
    return __WEBPACK_IMPORTED_MODULE_2_classnames___default()({
      'runner-results__test': true,
      'is-passed': this.props.test.status === 'pass',
      'is-skipped': this.props.test.status === 'skipped',
      'is-failed': this.props.test.status === 'fail',
      'is-filtered': this.props.filter !== 'all' });

  }

  getStatusClasses() {
    return __WEBPACK_IMPORTED_MODULE_2_classnames___default()({
      'runner-results__test__status': true,
      'is-passed': this.props.test.status === 'pass',
      'is-skipped': this.props.test.status === 'skipped',
      'is-failed': this.props.test.status === 'fail' });

  }

  render() {
    const test = this.props.test;
    let testItemResult = test.name;

    if (!_.isEmpty(test.error)) {
      testItemResult += ` | ${_.get(test, 'error.name', '')}: ${_.get(test, 'error.message', '')}`;
    }

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getClasses() },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getStatusClasses() }),

        test.status &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__test__status__text' }, test.status.toUpperCase()),

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            title: testItemResult,
            className: 'runner-results__test__name' },

          testItemResult)));



  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3621:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014, Chris Pettitt
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var lib = __webpack_require__(3622);

module.exports = {
  Graph: lib.Graph,
  json: __webpack_require__(3631),
  alg: __webpack_require__(3632),
  version: lib.version
};


/***/ }),

/***/ 3622:
/***/ (function(module, exports, __webpack_require__) {

// Includes only the "core" of graphlib
module.exports = {
  Graph: __webpack_require__(1024),
  version: __webpack_require__(3630)
};


/***/ }),

/***/ 3623:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1611);


/***/ }),

/***/ 3624:
/***/ (function(module, exports, __webpack_require__) {

var baseHas = __webpack_require__(3625),
    hasPath = __webpack_require__(1062);

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;


/***/ }),

/***/ 3625:
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

module.exports = baseHas;


/***/ }),

/***/ 3626:
/***/ (function(module, exports) {

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;


/***/ }),

/***/ 3627:
/***/ (function(module, exports, __webpack_require__) {

var arrayEach = __webpack_require__(731),
    baseCreate = __webpack_require__(1063),
    baseForOwn = __webpack_require__(1053),
    baseIteratee = __webpack_require__(581),
    getPrototype = __webpack_require__(590),
    isArray = __webpack_require__(52),
    isBuffer = __webpack_require__(211),
    isFunction = __webpack_require__(245),
    isObject = __webpack_require__(110),
    isTypedArray = __webpack_require__(240);

/**
 * An alternative to `_.reduce`; this method transforms `object` to a new
 * `accumulator` object which is the result of running each of its own
 * enumerable string keyed properties thru `iteratee`, with each invocation
 * potentially mutating the `accumulator` object. If `accumulator` is not
 * provided, a new object with the same `[[Prototype]]` will be used. The
 * iteratee is invoked with four arguments: (accumulator, value, key, object).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 1.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The custom accumulator value.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * _.transform([2, 3, 4], function(result, n) {
 *   result.push(n *= n);
 *   return n % 2 == 0;
 * }, []);
 * // => [4, 9]
 *
 * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] }
 */
function transform(object, iteratee, accumulator) {
  var isArr = isArray(object),
      isArrLike = isArr || isBuffer(object) || isTypedArray(object);

  iteratee = baseIteratee(iteratee, 4);
  if (accumulator == null) {
    var Ctor = object && object.constructor;
    if (isArrLike) {
      accumulator = isArr ? new Ctor : [];
    }
    else if (isObject(object)) {
      accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
    }
    else {
      accumulator = {};
    }
  }
  (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
    return iteratee(accumulator, value, index, object);
  });
  return accumulator;
}

module.exports = transform;


/***/ }),

/***/ 3628:
/***/ (function(module, exports, __webpack_require__) {

var baseValues = __webpack_require__(3629),
    keys = __webpack_require__(153);

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;


/***/ }),

/***/ 3629:
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(348);

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;


/***/ }),

/***/ 3630:
/***/ (function(module, exports) {

module.exports = '2.1.7';


/***/ }),

/***/ 3631:
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(169),
    Graph = __webpack_require__(1024);

module.exports = {
  write: write,
  read: read
};

function write(g) {
  var json = {
    options: {
      directed: g.isDirected(),
      multigraph: g.isMultigraph(),
      compound: g.isCompound()
    },
    nodes: writeNodes(g),
    edges: writeEdges(g)
  };
  if (!_.isUndefined(g.graph())) {
    json.value = _.clone(g.graph());
  }
  return json;
}

function writeNodes(g) {
  return _.map(g.nodes(), function(v) {
    var nodeValue = g.node(v),
        parent = g.parent(v),
        node = { v: v };
    if (!_.isUndefined(nodeValue)) {
      node.value = nodeValue;
    }
    if (!_.isUndefined(parent)) {
      node.parent = parent;
    }
    return node;
  });
}

function writeEdges(g) {
  return _.map(g.edges(), function(e) {
    var edgeValue = g.edge(e),
        edge = { v: e.v, w: e.w };
    if (!_.isUndefined(e.name)) {
      edge.name = e.name;
    }
    if (!_.isUndefined(edgeValue)) {
      edge.value = edgeValue;
    }
    return edge;
  });
}

function read(json) {
  var g = new Graph(json.options).setGraph(json.value);
  _.each(json.nodes, function(entry) {
    g.setNode(entry.v, entry.value);
    if (entry.parent) {
      g.setParent(entry.v, entry.parent);
    }
  });
  _.each(json.edges, function(entry) {
    g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
  });
  return g;
}


/***/ }),

/***/ 3632:
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  components: __webpack_require__(3633),
  dijkstra: __webpack_require__(1567),
  dijkstraAll: __webpack_require__(3634),
  findCycles: __webpack_require__(3635),
  floydWarshall: __webpack_require__(3636),
  isAcyclic: __webpack_require__(3637),
  postorder: __webpack_require__(3638),
  preorder: __webpack_require__(3639),
  prim: __webpack_require__(3640),
  tarjan: __webpack_require__(1569),
  topsort: __webpack_require__(1570)
};


/***/ }),

/***/ 3633:
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(169);

module.exports = components;

function components(g) {
  var visited = {},
      cmpts = [],
      cmpt;

  function dfs(v) {
    if (_.has(visited, v)) return;
    visited[v] = true;
    cmpt.push(v);
    _.each(g.successors(v), dfs);
    _.each(g.predecessors(v), dfs);
  }

  _.each(g.nodes(), function(v) {
    cmpt = [];
    dfs(v);
    if (cmpt.length) {
      cmpts.push(cmpt);
    }
  });

  return cmpts;
}


/***/ }),

/***/ 3634:
/***/ (function(module, exports, __webpack_require__) {

var dijkstra = __webpack_require__(1567),
    _ = __webpack_require__(169);

module.exports = dijkstraAll;

function dijkstraAll(g, weightFunc, edgeFunc) {
  return _.transform(g.nodes(), function(acc, v) {
    acc[v] = dijkstra(g, v, weightFunc, edgeFunc);
  }, {});
}


/***/ }),

/***/ 3635:
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(169),
    tarjan = __webpack_require__(1569);

module.exports = findCycles;

function findCycles(g) {
  return _.filter(tarjan(g), function(cmpt) {
    return cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]));
  });
}


/***/ }),

/***/ 3636:
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(169);

module.exports = floydWarshall;

var DEFAULT_WEIGHT_FUNC = _.constant(1);

function floydWarshall(g, weightFn, edgeFn) {
  return runFloydWarshall(g,
                          weightFn || DEFAULT_WEIGHT_FUNC,
                          edgeFn || function(v) { return g.outEdges(v); });
}

function runFloydWarshall(g, weightFn, edgeFn) {
  var results = {},
      nodes = g.nodes();

  nodes.forEach(function(v) {
    results[v] = {};
    results[v][v] = { distance: 0 };
    nodes.forEach(function(w) {
      if (v !== w) {
        results[v][w] = { distance: Number.POSITIVE_INFINITY };
      }
    });
    edgeFn(v).forEach(function(edge) {
      var w = edge.v === v ? edge.w : edge.v,
          d = weightFn(edge);
      results[v][w] = { distance: d, predecessor: v };
    });
  });

  nodes.forEach(function(k) {
    var rowK = results[k];
    nodes.forEach(function(i) {
      var rowI = results[i];
      nodes.forEach(function(j) {
        var ik = rowI[k];
        var kj = rowK[j];
        var ij = rowI[j];
        var altDistance = ik.distance + kj.distance;
        if (altDistance < ij.distance) {
          ij.distance = altDistance;
          ij.predecessor = kj.predecessor;
        }
      });
    });
  });

  return results;
}


/***/ }),

/***/ 3637:
/***/ (function(module, exports, __webpack_require__) {

var topsort = __webpack_require__(1570);

module.exports = isAcyclic;

function isAcyclic(g) {
  try {
    topsort(g);
  } catch (e) {
    if (e instanceof topsort.CycleException) {
      return false;
    }
    throw e;
  }
  return true;
}


/***/ }),

/***/ 3638:
/***/ (function(module, exports, __webpack_require__) {

var dfs = __webpack_require__(1571);

module.exports = postorder;

function postorder(g, vs) {
  return dfs(g, vs, "post");
}


/***/ }),

/***/ 3639:
/***/ (function(module, exports, __webpack_require__) {

var dfs = __webpack_require__(1571);

module.exports = preorder;

function preorder(g, vs) {
  return dfs(g, vs, "pre");
}


/***/ }),

/***/ 3640:
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(169),
    Graph = __webpack_require__(1024),
    PriorityQueue = __webpack_require__(1568);

module.exports = prim;

function prim(g, weightFunc) {
  var result = new Graph(),
      parents = {},
      pq = new PriorityQueue(),
      v;

  function updateNeighbors(edge) {
    var w = edge.v === v ? edge.w : edge.v,
        pri = pq.priority(w);
    if (pri !== undefined) {
      var edgeWeight = weightFunc(edge);
      if (edgeWeight < pri) {
        parents[w] = v;
        pq.decrease(w, edgeWeight);
      }
    }
  }

  if (g.nodeCount() === 0) {
    return result;
  }

  _.each(g.nodes(), function(v) {
    pq.add(v, Number.POSITIVE_INFINITY);
    result.setNode(v);
  });

  // Start from an arbitrary node
  pq.decrease(g.nodes()[0], 0);

  var init = false;
  while (pq.size() > 0) {
    v = pq.removeMin();
    if (_.has(parents, v)) {
      result.setEdge(v, parents[v]);
    } else if (init) {
      throw new Error("Input graph is not connected: " + g);
    } else {
      init = true;
    }

    g.nodeEdges(v).forEach(updateNeighbors);
  }

  return result;
}


/***/ }),

/***/ 3641:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerResultsActivityIndicator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
let

RunnerResultsActivityIndicator = class RunnerResultsActivityIndicator extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  render() {
    let run = this.props.run,
    currentRequest = _.last(run.iterations[run.currentIteration]);

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-results__body__activity' },

        run.status === 'paused' &&
        'Paused',


        run.status === 'running' &&
        currentRequest &&
        !currentRequest.request &&
        'Running Pre-request Scripts',


        run.status === 'running' &&
        currentRequest &&
        currentRequest.request &&
        !currentRequest.response &&
        'Sending Request',


        run.status === 'running' &&
        currentRequest &&
        currentRequest.response &&
        'Running Tests',


        run.status === 'stopped' &&
        'Run Aborted'));



  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3642:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerSummaryContainer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_base_keymaps_KeyMaps__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_runner_RunnerResultsHeader__ = __webpack_require__(1564);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_runner_RunnerResultsSidebar__ = __webpack_require__(1565);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_runner_RunnerSummaryBody__ = __webpack_require__(3643);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_runner_RunnerSummaryHeaderIterations__ = __webpack_require__(3647);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modules_services_AnalyticsService__ = __webpack_require__(31);
var _class;










const keyMap = { 'goBack': ['del', 'backspace'] };let


RunnerSummaryContainer = __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default()(_class = class RunnerSummaryContainer extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = {
      selectedFilter: 'all',
      hoveredIteration: 0,
      scrollLeft: 0 };


    this.handleRunAction = this.handleRunAction.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleIterationHover = this.handleIterationHover.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  getKeyMapHandlers() {
    return { 'goBack': this.props.onOpenResults };
  }

  getClasses() {
    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'runner-summary': true,
      'is-hidden': !this.props.active });

  }

  handleRunAction(action) {
    switch (action) {
      case 'retry':
        pm.runner.setRunAction(this.props.runId, action, (err, runId) => {
          !err && this.setState({ selectedIteration: 0 }, () => {
            this.props.onOpenRun && this.props.onOpenRun(runId);
          });
        });
        break;
      default:
        break;}

  }

  handleFilterChange(filter) {
    __WEBPACK_IMPORTED_MODULE_8__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'filter', null, filter);
    this.setState({ selectedFilter: filter });
  }

  handleIterationHover(iterationId) {
    this.setState({ hoveredIteration: iterationId });
  }

  handleScroll(e) {
    e && this.setState({ scrollLeft: e.target.scrollLeft });
  }

  render() {
    const run = this.props.run;
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__components_base_keymaps_KeyMaps__["a" /* default */], {
          handlers: this.getKeyMapHandlers(),
          keyMap: keyMap },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: this.getClasses(),
            ref: summary => {return summary && summary.focus();} },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__section-top' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__components_runner_RunnerResultsHeader__["a" /* default */], {
              run: run,
              onExport: this.props.onExport,
              onNewRun: this.props.onNewRun,
              onRunAction: this.handleRunAction,
              environments: this.props.environments,
              activeWorkspace: this.props.activeWorkspace }),

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__components_runner_RunnerSummaryHeaderIterations__["a" /* default */], {
              hoveredIteration: this.state.hoveredIteration,
              run: run,
              scrollLeft: this.state.scrollLeft,
              onIterationHover: this.handleIterationHover,
              onOpenIteration: this.props.onOpenIteration,
              onOpenResults: this.props.onOpenResults,
              onScroll: this.handleScroll })),


          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__section-bottom' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__components_runner_RunnerResultsSidebar__["a" /* default */], {
              selectedFilter: this.state.selectedFilter,
              onFilterChange: this.handleFilterChange }),

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__components_runner_RunnerSummaryBody__["a" /* default */], {
              filter: this.state.selectedFilter,
              hoveredIteration: this.state.hoveredIteration,
              run: run,
              scrollLeft: this.state.scrollLeft,
              onIterationHover: this.handleIterationHover,
              onScroll: this.handleScroll })))));





  }}) || _class;

/***/ }),

/***/ 3643:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerSummaryBody; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_List__ = __webpack_require__(1566);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__RunnerSummaryRequestListItem__ = __webpack_require__(3644);
var _class;





const ITEM_HEIGHT = 40;let


RunnerSummaryBody = __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default()(_class = class RunnerSummaryBody extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = {
      visibleHeight: 0,
      requestHeights: [] };


    this.requests = [];

    this._listItem = this._listItem.bind(this);
    this.setBounds = this.setBounds.bind(this);
    this.setRequestHeights = this.setRequestHeights.bind(this);
    this.updateRequestHeights = this.updateRequestHeights.bind(this);
  }

  componentDidMount() {
    this.requests = this.getRequests(this.props.run.iterations);
    this.setRequestHeights();
  }

  /* not used */
  setBounds() {
    let me = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this);

    this.setState({ visibleHeight: me.clientHeight });
  }

  /* not used */
  setRequestHeights() {
    let requestHeights;

    requestHeights = _.map(this.requests, request => {
      if (_.isEmpty(request)) {
        return 0;
      }
      return ITEM_HEIGHT * (_.size(request.tests) + 1);
    });

    this.setState({ requestHeights: requestHeights });
  }

  /* not used */
  updateRequestHeights(request, testCount, isOpen) {
    let requestHeights = this.state.requestHeights;

    if (isOpen) {
      requestHeights[request] += testCount * ITEM_HEIGHT;
    } else
    {
      requestHeights[request] -= testCount * ITEM_HEIGHT;
    }

    this.setState({ requestHeights: requestHeights });
  }

  getRequests(iterations) {
    let items = _.reduce(iterations, (union, iteration) => {
      return _.unionBy(union, iteration, request => {
        return request.id;
      });
    });
    return items;
  }

  _listItem(request, index) {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__RunnerSummaryRequestListItem__["a" /* default */], {
        filter: this.props.filter,
        hoveredIteration: this.props.hoveredIteration,
        iterations: this.props.run.iterations,
        key: index,
        request: request,
        requestIndex: index,
        scrollLeft: this.props.scrollLeft,
        onIterationHover: this.props.onIterationHover,
        onScroll: this.props.onScroll }));


  }

  render() {
    let run = this.props.run;

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__body' },

        _.map(this.requests, (request, index) => {
          return (
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__RunnerSummaryRequestListItem__["a" /* default */], {
              filter: this.props.filter,
              hoveredIteration: this.props.hoveredIteration,
              iterations: this.props.run.iterations,
              key: index,
              request: request,
              requestIndex: index,
              scrollLeft: this.props.scrollLeft,
              onIterationHover: this.props.onIterationHover,
              onScroll: this.props.onScroll,
              onToggle: this.updateRequestHeights }));


        }),


        _.isEmpty(this.requests) &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__body__empty' }, 'No tests found for the selected filter')));





  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3644:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerSummaryRequestListItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_Icons_UpSolidIcon__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__base_Icons_DownSolidIcon__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__RunnerSummaryTestListItem__ = __webpack_require__(3645);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__RunnerSummaryTimeline__ = __webpack_require__(1572);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__modules_services_AnalyticsService__ = __webpack_require__(31);
var _class;








let


RunnerSummaryRequestListItem = __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default()(_class = class RunnerSummaryRequestListItem extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);

    this.state = { isOpen: true };

    this.toggleRequest = this.toggleRequest.bind(this);
  }

  componentWillMount() {
    this.isFailedResult = this.isFailed();
  }

  componentDidMount() {
    if (!this.isFailedResult) {
      this.toggleRequest();
    }
  }

  componentWillUpdate(nextProps) {
    let me = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this.refs.timeline);
    if (me) {
      me.scrollLeft = nextProps.scrollLeft;
    }
  }

  isFailed() {
    return _.some(this.props.iterations, iteration => {
      if (!iteration[this.props.requestIndex] || !iteration[this.props.requestIndex].tests) {
        return true;
      }
      return _.some(iteration[this.props.requestIndex].tests, test => {
        return test.status === 'fail';
      });
    });
  }

  getStatusClasses() {
    const isFailed = this.isFailedResult;
    return __WEBPACK_IMPORTED_MODULE_3_classnames___default()({
      'runner-summary__request-list-item__status': true,
      'is-failed': isFailed,
      'is-passed': !isFailed });

  }

  getMethodClasses() {
    return __WEBPACK_IMPORTED_MODULE_3_classnames___default()({
      'runner-summary__request-list-item__method': true,
      [`runner-summary__request-list-item__method--${this.props.request.request.method.toUpperCase()}`]: true });

  }

  toggleRequest() {
    __WEBPACK_IMPORTED_MODULE_9__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', this.state.isOpen ? 'collapse' : 'expand', 'run_summary');
    this.setState({ isOpen: !this.state.isOpen }, () => {
      this.props.onToggle && this.props.onToggle(this.props.requestIndex, _.size(this.props.request.tests), this.state.isOpen);
    });
  }

  render() {
    const request = this.props.request;
    const filter = this.props.filter;

    if (filter === 'pass' && this.isFailedResult) {
      return false;
    }

    if (filter === 'fail' && !this.isFailedResult) {
      return false;
    }

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__request-list-item' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__request-list-item__header' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__request-list-item__meta' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getStatusClasses() }),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getMethodClasses() },
              _.get(request, ['request', 'method'], '').toUpperCase()),

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__request-list-item__name' },
              request.name)),



          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__request-list-item__timeline' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__RunnerSummaryTimeline__["a" /* default */], {
              active: !this.state.isOpen,
              hoveredIteration: this.props.hoveredIteration,
              iterations: this.props.iterations,
              ref: 'timeline',
              requestId: this.props.requestIndex,
              scrollLeft: this.props.scrollLeft,
              type: 'request',
              onHover: this.props.onIterationHover,
              onScroll: this.props.onScroll })),



          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Buttons__["a" /* Button */], {
              className: 'runner-summary__request__expand-button',
              onClick: this.toggleRequest },


            this.state.isOpen ?
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Icons_UpSolidIcon__["a" /* default */], { className: 'runner-summary__request__expand is-open' }) :
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__base_Icons_DownSolidIcon__["a" /* default */], { className: 'runner-summary__request__expand' }))),




        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__request-list-item__body' },

          this.state.isOpen && _.map(request.tests, (test, index) => {
            return (
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__RunnerSummaryTestListItem__["a" /* default */], {
                filter: this.props.filter,
                hoveredIteration: this.props.hoveredIteration,
                iterations: this.props.iterations,
                key: test.name,
                requestId: this.props.requestIndex,
                scrollLeft: this.props.scrollLeft,
                test: test,
                testId: index,
                onIterationHover: this.props.onIterationHover,
                onScroll: this.props.onScroll }));


          }))));




  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3645:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerSummaryTestListItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__RunnerSummaryTimeline__ = __webpack_require__(1572);
var _class;



let


RunnerSummaryTestListItem = __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default()(_class = class RunnerSummaryTestListItem extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.isPassedResult = this.isPassed(this.props.iterations, this.props.requestId, this.props.testId);
  }

  componentDidUpdate() {
    let me = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this.refs.timeline);
    if (me) {
      me.scrollLeft = this.props.scrollLeft;
    }
  }

  isPassed(iterations, requestId, testId) {
    return _.some(iterations, iteration => {
      return _.get(iteration, `[${requestId}].tests[${testId}].status`, 'fail') === 'fail';
    });
  }

  getClasses() {
    let isPassed = !this.isPassedResult;
    return __WEBPACK_IMPORTED_MODULE_3_classnames___default()({
      'runner-summary__test-list-item': true,
      'is-failed': !isPassed });

  }

  getStatusClasses() {
    let isPassed = !this.isPassedResult;
    return __WEBPACK_IMPORTED_MODULE_3_classnames___default()({
      'runner-summary__test-list-item__status': true,
      'is-passed': isPassed,
      'is-failed': !isPassed });

  }

  render() {
    let test = this.props.test;
    if (this.isPassedResult && this.props.filter === 'pass') {
      return false;
    }

    if (!this.isPassedResult && this.props.filter === 'fail') {
      return false;
    }

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getClasses() },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__test-list-item__meta' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getStatusClasses() }),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__test-list-item__status__text' }, this.isPassedResult ? 'FAIL' : 'PASS'),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__test-list-item__name' },
            test.name)),


        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            ref: 'timeline',
            className: 'runner-summary__test-list-item__timeline' },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__RunnerSummaryTimeline__["a" /* default */], {
            hoveredIteration: this.props.hoveredIteration,
            iterations: this.props.iterations,
            requestId: this.props.requestId,
            scrollLeft: this.props.scrollLeft,
            testId: this.props.testId,
            type: 'test',
            onHover: this.props.onIterationHover,
            onScroll: this.props.onScroll }))));




  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3646:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerSummaryTimelineKeyframe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_Icons_SuccessIcon__ = __webpack_require__(579);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_Icons_CloseIcon__ = __webpack_require__(114);



let

RunnerSummaryTimelineKeyframe = class RunnerSummaryTimelineKeyframe extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.active !== nextProps.active) {
      return true;
    }
    return nextProps.hoveredIteration === this.props.iterationId || this.props.hoveredIteration === this.props.iterationId;
  }

  getTestKeyframes() {
    let iterationId = this.props.iterationId,
    test = _.get(this.props, ['iterations', iterationId, this.props.requestId, 'tests', this.props.testId], {});

    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'runner-summary__body__timeline__keyframe': true,
      'is-grey': _.isEmpty(test),
      'is-green': !_.isEmpty(test) && test.status === 'pass',
      'is-red': !_.isEmpty(test) && test.status === 'fail',
      'is-hovered': this.props.hoveredIteration === iterationId });

  }

  getRequestKeyframes() {
    let iterationId = this.props.iterationId,
    request = _.get(this.props, ['iterations', iterationId, this.props.requestId], {}),
    requestStatus = _.isEmpty(request) ?
    -1 :
    _.reduce(request.tests, (total, test) => {
      return total + (test.status === 'fail' ? 1 : 0);
    }, 0);

    return __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
      'runner-summary__body__timeline__keyframe': true,
      'is-grey': this.props.active && requestStatus === -1,
      'is-green': this.props.active && requestStatus === 0,
      'is-red': this.props.active && requestStatus > 0,
      'is-hovered': this.props.hoveredIteration === iterationId });

  }

  render() {
    let className = this.props.type === 'test' ? this.getTestKeyframes() : this.getRequestKeyframes(),
    isPassing = _.includes(className, 'is-green'),
    isFailing = _.includes(className, 'is-red');

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
          className: 'runner-summary__body__timeline__keyframe-wrapper',
          onMouseOver: this.props.onHover.bind(this, this.props.iterationId) },

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: className },
          isPassing && __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__base_Icons_SuccessIcon__["a" /* default */], { style: 'primary', size: 'xs' }),
          isFailing && __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Icons_CloseIcon__["a" /* default */], { style: 'primary', size: 'xs' }))));



  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3647:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerSummaryHeaderIterations; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_pure_render_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Icons_LeftSolidIcon__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_classnames__);
var _class;




let


RunnerSummaryHeaderIterations = __WEBPACK_IMPORTED_MODULE_2_pure_render_decorator___default()(_class = class RunnerSummaryHeaderIterations extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    let me = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this.refs.tabs);
    if (me) {
      me.scrollLeft = this.props.scrollLeft;
    }
  }

  getIterationTabClasses(iterationId) {
    return __WEBPACK_IMPORTED_MODULE_5_classnames___default()({
      'runner-summary__header-iteration__tab': true,
      'is-hovered': this.props.hoveredIteration === iterationId });

  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__header-iterations' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'runner-summary__header__actions' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__base_Buttons__["a" /* Button */], {
              className: 'runner-summary__header__back',
              size: 'small',
              type: 'secondary',
              onClick: this.props.onOpenResults },

            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Icons_LeftSolidIcon__["a" /* default */], { className: 'runner-summary__back-icon' }), 'Back')),



        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            ref: 'tabs',
            className: 'runner-summary__header-iteration__tabs',
            onScroll: this.props.onScroll },


          _.map(this.props.run.iterations, (iteration, iterationId) => {
            return (
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                  className: this.getIterationTabClasses(iterationId),
                  key: iterationId,
                  onMouseEnter: this.props.onIterationHover.bind(this, iterationId) },

                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                    className: 'runner-summary__header-iteration__tab__count',
                    onClick: this.props.onOpenIteration.bind(this, this.props.run.id, iterationId) },

                  iterationId + 1)));



          }))));




  }}) || _class;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3648:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerMissingWorkspaceModalContainer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__workspaces_MissingCurrentWorkspaceModalContainer__ = __webpack_require__(1700);

let

RunnerMissingWorkspaceModalContainer = class RunnerMissingWorkspaceModalContainer extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__workspaces_MissingCurrentWorkspaceModalContainer__["a" /* default */], null));

  }};

/***/ }),

/***/ 3649:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async_series__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async_series___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_async_series__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__boot_bootConfig__ = __webpack_require__(604);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__boot_bootConfig___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__boot_bootConfig__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__boot_bootLogger__ = __webpack_require__(605);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__boot_bootMessaging__ = __webpack_require__(606);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__boot_bootWLModels__ = __webpack_require__(607);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__boot_bootAppModels__ = __webpack_require__(625);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__boot_bootSettings__ = __webpack_require__(689);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__boot_bootTelemetry__ = __webpack_require__(690);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__boot_bootSession__ = __webpack_require__(935);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__boot_bootRunner__ = __webpack_require__(3650);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__boot_bootCrashReporter__ = __webpack_require__(691);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__boot_booted__ = __webpack_require__(695);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__boot_bootThemeManager__ = __webpack_require__(977);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__boot_bootConfigurations__ = __webpack_require__(555);
















const windowConfig = {
  process: 'runner',
  ui: true };


window.pm = {};

pm.init = done => {
  __WEBPACK_IMPORTED_MODULE_0_async_series___default()([
  __WEBPACK_IMPORTED_MODULE_1__boot_bootConfig___default.a.init(windowConfig),
  __WEBPACK_IMPORTED_MODULE_2__boot_bootLogger__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_3__boot_bootMessaging__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_10__boot_bootCrashReporter__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_7__boot_bootTelemetry__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_13__boot_bootConfigurations__["a" /* initializeConfigurations */],
  __WEBPACK_IMPORTED_MODULE_6__boot_bootSettings__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_4__boot_bootWLModels__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_5__boot_bootAppModels__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_8__boot_bootSession__["a" /* bootSession */],
  __WEBPACK_IMPORTED_MODULE_12__boot_bootThemeManager__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_9__boot_bootRunner__["a" /* default */]],
  err => {
    Object(__WEBPACK_IMPORTED_MODULE_11__boot_booted__["a" /* default */])(err);
    if (err) {
      pm.logger.error('Error in the app boot sequence', err);
    }
    done && done(err);
  });
};

/* harmony default export */ __webpack_exports__["a"] = (pm);

/***/ }),

/***/ 3650:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async_series__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async_series___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_async_series__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_redux_thunk__ = __webpack_require__(3651);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_redux_thunk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_redux_thunk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reducers_runner__ = __webpack_require__(3652);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__controllers_RunnerController__ = __webpack_require__(3663);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__bootShortcuts__ = __webpack_require__(936);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__bootSyncProxy__ = __webpack_require__(937);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_PmConsole__ = __webpack_require__(931);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__controllers_UIZoom__ = __webpack_require__(939);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_ToastManager__ = __webpack_require__(932);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__controllers_ProxyListManager__ = __webpack_require__(940);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__models_requests_CertificateManager__ = __webpack_require__(941);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__models_Toasts__ = __webpack_require__(933);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__modules_runner_bus_event_handler__ = __webpack_require__(3677);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__controllers_GenericContextMenu__ = __webpack_require__(1020);

















/**
                                                                        *
                                                                        * @param {*} cb
                                                                        */
function bootRunner(cb) {
  let modelEventChannel = pm.eventBus.channel('model-events');
  modelEventChannel.subscribe(__WEBPACK_IMPORTED_MODULE_13__modules_runner_bus_event_handler__["a" /* handleModelEventOnStore */]);

  _.assign(window.pm, {
    toasts: __WEBPACK_IMPORTED_MODULE_12__models_Toasts__,
    toastManager: new __WEBPACK_IMPORTED_MODULE_9__models_ToastManager__["a" /* default */]() });

  __WEBPACK_IMPORTED_MODULE_0_async_series___default()([
  __WEBPACK_IMPORTED_MODULE_5__bootShortcuts__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_6__bootSyncProxy__["a" /* default */]],
  err => {
    // @todo move to series
    window.pm.runnerStore = Object(__WEBPACK_IMPORTED_MODULE_1_redux__["createStore"])(__WEBPACK_IMPORTED_MODULE_3__reducers_runner__["a" /* default */], Object(__WEBPACK_IMPORTED_MODULE_1_redux__["applyMiddleware"])(__WEBPACK_IMPORTED_MODULE_2_redux_thunk___default.a)),
    _.assign(window.pm, {
      proxyListManager: new __WEBPACK_IMPORTED_MODULE_10__controllers_ProxyListManager__["a" /* default */](), // [settings]
      certificateManager: new __WEBPACK_IMPORTED_MODULE_11__models_requests_CertificateManager__["a" /* default */](), // [settings]
      console: new __WEBPACK_IMPORTED_MODULE_7__models_PmConsole__["a" /* default */]('runner'),
      runner: new __WEBPACK_IMPORTED_MODULE_4__controllers_RunnerController__["a" /* default */](),
      uiZoom: new __WEBPACK_IMPORTED_MODULE_8__controllers_UIZoom__["a" /* default */](), // [settings]
      contextMenuManager: new __WEBPACK_IMPORTED_MODULE_14__controllers_GenericContextMenu__["a" /* default */]() });

    if (err) {
      pm.logger.error('Runner~boot - Failed', err);
      return cb && cb(err);
    }
    pm.logger.info('Runner~boot - Success');
    return pm.runner.initialize(cb);
  });
}

/* harmony default export */ __webpack_exports__["a"] = (bootRunner);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3651:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch;
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;

/***/ }),

/***/ 3652:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RunnerSelectionReducer__ = __webpack_require__(3653);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__RunnerRunsReducer__ = __webpack_require__(3654);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__RunnerWorkspaceReducer__ = __webpack_require__(3655);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__RunnerCollectionReducer__ = __webpack_require__(3656);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__RunnerEnvironmentReducer__ = __webpack_require__(3657);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__RunnerFolderReducer__ = __webpack_require__(3658);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__RunnerRequestReducer__ = __webpack_require__(3659);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__RunnerUserReducer__ = __webpack_require__(3660);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__RunnerArchivedCollectionReducer__ = __webpack_require__(3661);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__RunnerForkedCollectionReducer__ = __webpack_require__(3662);












const runnerReducers = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
  selection: __WEBPACK_IMPORTED_MODULE_1__RunnerSelectionReducer__["a" /* default */],
  runs: __WEBPACK_IMPORTED_MODULE_2__RunnerRunsReducer__["a" /* default */],
  workspaces: __WEBPACK_IMPORTED_MODULE_3__RunnerWorkspaceReducer__["a" /* default */],
  collections: __WEBPACK_IMPORTED_MODULE_4__RunnerCollectionReducer__["a" /* default */],
  folders: __WEBPACK_IMPORTED_MODULE_6__RunnerFolderReducer__["a" /* default */],
  environments: __WEBPACK_IMPORTED_MODULE_5__RunnerEnvironmentReducer__["a" /* default */],
  requests: __WEBPACK_IMPORTED_MODULE_7__RunnerRequestReducer__["a" /* default */],
  user: __WEBPACK_IMPORTED_MODULE_8__RunnerUserReducer__["a" /* default */],
  archivedCollections: __WEBPACK_IMPORTED_MODULE_9__RunnerArchivedCollectionReducer__["a" /* default */],
  forkedCollections: __WEBPACK_IMPORTED_MODULE_10__RunnerForkedCollectionReducer__["a" /* default */] });


/* harmony default export */ __webpack_exports__["a"] = (runnerReducers);

/***/ }),

/***/ 3653:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants_RunnerSaveResponseConstants__ = __webpack_require__(1022);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};



const initialState = {
  target: {
    collection: null,
    folder: null },

  environment: null,
  iterations: 1,
  delay: 0,
  data: null,
  persist: false,
  runWithEmptyCookieJar: false,
  saveCookiesAfterRun: true,
  saveResponse: __WEBPACK_IMPORTED_MODULE_1__constants_RunnerSaveResponseConstants__["a" /* RUNNER_SAVE_ALL_RESPONSES */],
  requestSelection: [],
  workspace: {} };


const target = (state = {}, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["J" /* RUNNER_SET_COLLECTION */]:
      return _extends({},
      state, {
        collection: action.id,
        folder: null });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["O" /* RUNNER_SET_FOLDER */]:
      return _extends({},
      state, {
        collection: action.collection,
        folder: action.id });

    default:
      return state;}

};

const RunnerSelectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["J" /* RUNNER_SET_COLLECTION */]:
      return _extends({},
      state, {
        target: target(state.target, action) });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["O" /* RUNNER_SET_FOLDER */]:
      return _extends({},
      state, {
        target: target(state.target, action) });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["N" /* RUNNER_SET_ENV */]:
      return _extends({},
      state, {
        environment: action.id });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Q" /* RUNNER_SET_ITERATIONS */]:
      return _extends({},
      state, {
        iterations: action.value });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["M" /* RUNNER_SET_DELAY */]:
      return _extends({},
      state, {
        delay: action.value });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["K" /* RUNNER_SET_DATA_FILE */]:
      return _extends({},
      state, {
        data: action.data || null,
        dataFile: action.file,
        fileName: _.get(action, 'file.name', state.fileName),
        fileType: _.get(action, 'fileType', state.fileType) });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["H" /* RUNNER_REMOVE_DATA_FILE */]:
      return _extends({},
      state, {
        data: null,
        dataFile: null,
        fileName: undefined,
        fileType: undefined });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["L" /* RUNNER_SET_DATA_FILE_TYPE */]:
      return _extends({},
      state, {
        fileType: action.fileType });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["R" /* RUNNER_SET_PERSIST_VARS */]:
      return _extends({},
      state, {
        persist: action.value });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["P" /* RUNNER_SET_INITIAL_COOKIES */]:
      return _extends({},
      state, {
        runWithEmptyCookieJar: action.value });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["T" /* RUNNER_SET_SAVE_COOKIES_AFTER_RUN */]:
      return _extends({},
      state, {
        saveCookiesAfterRun: action.value });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["U" /* RUNNER_SET_SAVE_RESPONSES */]:
      return _extends({},
      state, {
        saveResponse: action.value });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["S" /* RUNNER_SET_REQUEST_SELECTION */]:
      return _extends({},
      state, {
        requestSelection: action.value });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_2" /* RUNNER_SWITCH_WORKSPACE */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["V" /* RUNNER_SET_WORKSPACE */]:
      return _extends({},
      initialState, {
        workspace: action.value });

    default:
      return state;}

};

/* harmony default export */ __webpack_exports__["a"] = (RunnerSelectionReducer);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3654:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};


const findRequestInIteration = (iteration, requestToFind) => {
  return _.findIndex(iteration, request => {
    return request.ref === requestToFind.ref;
  });
};

const tests = (state = [], action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Z" /* RUNNER_START_TEST */]:
      return state;
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["s" /* RUNNER_END_TESTS */]:
      return _.concat(state, _.map(action.tests, function (test) {
        return _.pick(test, ['name', 'status', 'error']);
      }));
    default:
      return state;}

};

const response = (state = {}, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["q" /* RUNNER_END_REQUEST */]:
      return {
        size: action.response.size,
        code: action.response.code,
        name: action.response.name,
        time: action.response.time,
        headers: action.response.headers

        // body: action.response.body
      };
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["a" /* RUNNER_ADD_RESPONSE_BODY */]:
      return _extends({},
      state, {
        body: action.response.body });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["b" /* RUNNER_CLEAN_RUN */]:
      return _extends({},
      state, {
        headers: [],
        body: '' });

    default:
      return state;}

};

const request = (state = {}, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["X" /* RUNNER_START_REQUEST */]:
      return {
        id: action.request.id,
        ref: action.request.ref,
        error: false,
        name: action.request.name,
        request: {
          url: action.request.url,
          unresolvedUrl: action.request.unresolvedUrl,
          method: action.request.method,
          path: action.request.path,
          body: action.request.body } };


    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["t" /* RUNNER_ERROR_REQUEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["v" /* RUNNER_ERROR_TEST */]:
      return _extends({},
      state, {
        error: true,
        errorReason: action.error });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Z" /* RUNNER_START_TEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["s" /* RUNNER_END_TESTS */]:
      return _extends({},
      state, {
        tests: tests(state.tests, action) });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["q" /* RUNNER_END_REQUEST */]:
      return _extends({},
      state, {
        request: _extends({},
        state.request, {
          headers: action.request.headers }),

        response: response(state.reponse, action) });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["a" /* RUNNER_ADD_RESPONSE_BODY */]:
      return _extends({},
      state, {
        response: response(state.response, action) });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["b" /* RUNNER_CLEAN_RUN */]:
      return _extends({},
      state, {
        request: _extends({},
        state.request, {
          headers: [],
          body: '' }),

        response: response(state.response, action) });

    default:
      return state;}

};

const iteration = (state = [], action) => {
  let requestPosition;

  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["X" /* RUNNER_START_REQUEST */]:
      // the start of this request in iteration was already recorded
      requestPosition = findRequestInIteration(state, action.request);

      // this is the first time we are recording this request, add request to state
      if (requestPosition === -1) {
        return [
        ...state,
        request(undefined, action)];

      }

      // this is a retry of a request, update the same
      return _.map(state, (req, index) => {
        if (index !== requestPosition) {
          return req;
        }
        return request(req, action);
      });
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["t" /* RUNNER_ERROR_REQUEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Z" /* RUNNER_START_TEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["v" /* RUNNER_ERROR_TEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["s" /* RUNNER_END_TESTS */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["q" /* RUNNER_END_REQUEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["a" /* RUNNER_ADD_RESPONSE_BODY */]:
      requestPosition = findRequestInIteration(state, action.request);
      return _.map(state, (req, index) => {
        if (index !== requestPosition) {
          return req;
        }
        return request(req, action);
      });
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["b" /* RUNNER_CLEAN_RUN */]:
      return _.map(state, req => {
        return request(req, action);
      });
    default:
      return state;}

};

const iterations = (state = [], action) => {
  let newState;
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Y" /* RUNNER_START_RUN */]:
      newState = [];
      _.map(_.range(action.selection.iterations), i => {
        newState[i] = [];
      });
      return newState;
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["W" /* RUNNER_START_ITERATION */]:
      return state;
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["X" /* RUNNER_START_REQUEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["t" /* RUNNER_ERROR_REQUEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["q" /* RUNNER_END_REQUEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["a" /* RUNNER_ADD_RESPONSE_BODY */]:
      return [
      ...state.slice(0, action.iteration),
      iteration(state[action.iteration], action),
      ...state.slice(action.iteration + 1)];

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Z" /* RUNNER_START_TEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["v" /* RUNNER_ERROR_TEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["s" /* RUNNER_END_TESTS */]:
      return [
      ...state.slice(0, action.iteration),
      iteration(state[action.iteration], action),
      ...state.slice(action.iteration + 1)];

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["b" /* RUNNER_CLEAN_RUN */]:
      return _.map(state, iter => {
        return iteration(iter, action);
      });
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["p" /* RUNNER_END_ITERATION */]:
    default:
      return state;}

};

const target = (state = {}, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Y" /* RUNNER_START_RUN */]:
      return _extends({},
      state, {
        collection: action.selection.target.collection,
        folder: action.selection.target.folder });

    default:
      return state;}

};

const run = (state = {}, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Y" /* RUNNER_START_RUN */]:
      return _extends({},
      state, {
        id: action.runId,
        name: action.name,
        error: false,
        retry: action.retry,
        status: 'running',
        dataFile: action.selection.dataFile,
        delay: action.selection.delay,
        persist: action.selection.persist,
        requestSelection: action.selection.requestSelection,
        runWithEmptyCookieJar: action.selection.runWithEmptyCookieJar,
        saveCookiesAfterRun: action.selection.saveCookiesAfterRun,
        saveResponse: action.selection.saveResponse,
        currentIteration: 0,
        failedTestCount: 0,
        totalTestCount: 0,
        target: target(action.selection.target, action),
        createdAt: new Date().toISOString(),
        environment: action.selection.environment,
        iterations: iterations(state.iterations, action),
        workspace: pm.runnerStore.getState().selection.workspace.id });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["u" /* RUNNER_ERROR_RUN */]:
      return _extends({},
      state, {
        error: true });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["G" /* RUNNER_PAUSE_RUN */]:
      return _extends({},
      state, {
        status: 'paused' });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["I" /* RUNNER_RESUME_RUN */]:
      return _extends({},
      state, {
        status: 'running' });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_0" /* RUNNER_STOPPING_RUN */]:
      return _extends({},
      state, {
        status: 'stopping' });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_1" /* RUNNER_STOP_RUN */]:
      return _extends({},
      state, {
        status: 'stopped' });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["W" /* RUNNER_START_ITERATION */]:
      return _extends({},
      state, {
        currentIteration: action.iteration,
        iterations: iterations(state.iterations, action) });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["X" /* RUNNER_START_REQUEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["t" /* RUNNER_ERROR_REQUEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["q" /* RUNNER_END_REQUEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["a" /* RUNNER_ADD_RESPONSE_BODY */]:
      return _extends({},
      state, {
        iterations: iterations(state.iterations, action) });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Z" /* RUNNER_START_TEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["v" /* RUNNER_ERROR_TEST */]:
      return _extends({},
      state, {
        iterations: iterations(state.iterations, action) });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["s" /* RUNNER_END_TESTS */]:
      let requestFailedTestCount = _.countBy(action.tests, 'status').fail || 0;

      return _extends({},
      state, {

        failedTestCount: state.failedTestCount + requestFailedTestCount,
        totalTestCount: state.totalTestCount + action.tests.length,
        iterations: iterations(state.iterations, action) });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["p" /* RUNNER_END_ITERATION */]:
      return _extends({},
      state, {
        currentIteration: state.currentIteration + 1,
        iterations: iterations(state.iterations, action) });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["r" /* RUNNER_END_RUN */]:
      return _extends({},
      state, {
        status: 'finished' });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["b" /* RUNNER_CLEAN_RUN */]:
      let retVal = _extends({},
      state, {
        iterations: iterations(state.iterations, action) });

      return retVal;
    default:
      return state;}

};

const RunnerRunsReducer = (state = {}, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Y" /* RUNNER_START_RUN */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["u" /* RUNNER_ERROR_RUN */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["G" /* RUNNER_PAUSE_RUN */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["I" /* RUNNER_RESUME_RUN */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_1" /* RUNNER_STOP_RUN */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_0" /* RUNNER_STOPPING_RUN */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["b" /* RUNNER_CLEAN_RUN */]:
      return _extends({},
      state, {
        [action.runId]: run(state[action.runId], action) });


    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["W" /* RUNNER_START_ITERATION */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["X" /* RUNNER_START_REQUEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["t" /* RUNNER_ERROR_REQUEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Z" /* RUNNER_START_TEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["v" /* RUNNER_ERROR_TEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["s" /* RUNNER_END_TESTS */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["q" /* RUNNER_END_REQUEST */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["a" /* RUNNER_ADD_RESPONSE_BODY */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["p" /* RUNNER_END_ITERATION */]:
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["r" /* RUNNER_END_RUN */]:
      return _extends({},
      state, {
        [action.runId]: run(state[action.runId], action) });


    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["D" /* RUNNER_LOAD_RUNS */]:
      return _extends({},
      state,
      action.runs);


    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["w" /* RUNNER_IMPORT_RUN */]:
      return _extends({},
      state, {
        [action.runId]: action.run });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["n" /* RUNNER_DELETE_RUN */]:
      return _.omitBy(state, stateRun => {
        return stateRun.id === action.runId;
      });
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["h" /* RUNNER_DELETE_ALL_RUNS */]:
      return {};
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["F" /* RUNNER_NOOP */]:
    default:
      return state;}

};

/* harmony default export */ __webpack_exports__["a"] = (RunnerRunsReducer);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3655:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const RunnerWorkspaceReducer = (state = [], action) => {
  let workspaceIndex;
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["E" /* RUNNER_LOAD_WORKSPACE */]:
      return action.workspaces;
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["g" /* RUNNER_CREATE_WORKSPACE */]:
      return [
      ...state,
      action.workspace];

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_6" /* RUNNER_UPDATE_WORKSPACE */]:
      workspaceIndex = _.findIndex(state, ['id', action.workspace.id]);
      if (workspaceIndex === -1) {
        return state;
      }
      return [
      ..._.slice(state, 0, workspaceIndex),
      action.workspace,
      ..._.slice(state, workspaceIndex + 1)];

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["o" /* RUNNER_DELETE_WORKSPACE */]:
      workspaceIndex = _.findIndex(state, ['id', action.workspaceId]);
      if (workspaceIndex === -1) {
        return state;
      }
      return [
      ..._.slice(state, 0, workspaceIndex),
      ..._.slice(state, workspaceIndex + 1)];

    default:
      return state;}

};

/* harmony default export */ __webpack_exports__["a"] = (RunnerWorkspaceReducer);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3656:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const RunnerCollectionReducer = (state = [], action) => {
  let collectionIndex;
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["y" /* RUNNER_LOAD_COLLECTIONS */]:
      return action.collections;
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["d" /* RUNNER_CREATE_COLLECTION */]:
      return [
      ...state,
      action.collection];

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_3" /* RUNNER_UPDATE_COLLECTION */]:
      collectionIndex = _.findIndex(state, ['id', action.collection.id]);
      if (collectionIndex === -1) {
        return state;
      }
      return [
      ..._.slice(state, 0, collectionIndex),
      action.collection,
      ..._.slice(state, collectionIndex + 1)];

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["j" /* RUNNER_DELETE_COLLECTION */]:
      collectionIndex = _.findIndex(state, ['id', action.collectionId]);
      if (collectionIndex === -1) {
        return state;
      }
      return [
      ..._.slice(state, 0, collectionIndex),
      ..._.slice(state, collectionIndex + 1)];

    default:
      return state;}

};

/* harmony default export */ __webpack_exports__["a"] = (RunnerCollectionReducer);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3657:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const RunnerEnvironmentReducer = (state = [], action) => {
  let envIndex;
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["z" /* RUNNER_LOAD_ENVIRONMENTS */]:
      return action.environments;
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["e" /* RUNNER_CREATE_ENVIRONMENT */]:
      return [
      ...state,
      action.environment];

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_4" /* RUNNER_UPDATE_ENVIRONMENT */]:
      envIndex = _.findIndex(state, ['id', action.environment.id]);
      if (envIndex === -1) {
        return state;
      }
      return [
      ..._.slice(state, 0, envIndex),
      action.environment,
      ..._.slice(state, envIndex + 1)];

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["k" /* RUNNER_DELETE_ENVIRONMENT */]:
      envIndex = _.findIndex(state, ['id', action.environmentId]);
      if (envIndex === -1) {
        return state;
      }
      return [
      ..._.slice(state, 0, envIndex),
      ..._.slice(state, envIndex + 1)];

    default:
      return state;}

};

/* harmony default export */ __webpack_exports__["a"] = (RunnerEnvironmentReducer);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3658:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const RunnerFolderReducer = (state = [], action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["A" /* RUNNER_LOAD_FOLDERS */]:
      return action.folders;
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["l" /* RUNNER_DELETE_FOLDER */]:
      let folderIndex = _.findIndex(state, ['id', action.folderId]);
      if (folderIndex === -1) {
        return state;
      }
      return [
      ..._.slice(state, 0, folderIndex),
      ..._.slice(state, folderIndex + 1)];

    default:
      return state;}

};

/* harmony default export */ __webpack_exports__["a"] = (RunnerFolderReducer);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3659:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const RunnerRequestReducer = (state = [], action) => {
  let reqIndex;
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["C" /* RUNNER_LOAD_REQUESTS */]:
      return action.requests;
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_5" /* RUNNER_UPDATE_REQUEST */]:
      reqIndex = _.findIndex(state, ['id', action.request.id]);
      if (reqIndex === -1) {
        return state;
      }
      return [
      ..._.slice(state, 0, reqIndex),
      _.merge(state[reqIndex], action.request),
      ..._.slice(state, reqIndex + 1)];

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["m" /* RUNNER_DELETE_REQUEST */]:
      reqIndex = _.findIndex(state, ['id', action.requestId]);
      if (reqIndex === -1) {
        return state;
      }
      return [
      ..._.slice(state, 0, reqIndex),
      ..._.slice(state, reqIndex + 1)];

    default:
      return state;}

};

/* harmony default export */ __webpack_exports__["a"] = (RunnerRequestReducer);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3660:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const RunnerUserReducer = (state = {}, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_7" /* RUNNER_USER_LOGIN */]:
      return action.user;
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_8" /* RUNNER_USER_LOGOUT */]:
      return {};
    default:
      return state;}

};

/* harmony default export */ __webpack_exports__["a"] = (RunnerUserReducer);

/***/ }),

/***/ 3661:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};

let id;
const RunnerArchivedCollectionReducer = (state = {}, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["x" /* RUNNER_LOAD_ARCHIVED_COLLECTIONS */]:
      // Converting archivedCollections array to hash map
      // as an optimization for filtering collections
      let archivedCollectionHash = _.transform(action.archivedCollections, (acc, c) => {
        c.model === 'collection' && (acc[c.modelId] = true);
      }, {});
      return archivedCollectionHash;
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["c" /* RUNNER_CREATE_ARCHIVED_COLLECTION */]:
      id = _.get(action, 'archivedCollection.modelId');
      if (!id) {
        return state;
      }

      return _extends({},
      state, {
        [id]: true });

    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["i" /* RUNNER_DELETE_ARCHIVED_COLLECTION */]:
      id = _.get(action, 'archivedCollection.modelId');
      if (!id) {
        return state;
      }

      return _.omit(state, id);
    default:
      return state;}

};

/* harmony default export */ __webpack_exports__["a"] = (RunnerArchivedCollectionReducer);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3662:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};

/**
                                           * Reducer to populate forked collection in redux store
                                           *
                                           * @param {Object} state - state of the reducer to be populated in redux store
                                           * @param {Object} action - redux action
                                           */
const RunnerForkedCollectionReducer = (state = {}, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["B" /* RUNNER_LOAD_FORKED_COLLECTIONS */]:
      // Converting forked collection hashMap
      // as an optimization for filtering collections
      return _.transform(action.forkedCollections, (acc, c) => {
        acc[c.id] = c;
      }, {});
    case __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["f" /* RUNNER_CREATE_FORKED_COLLECTION */]:
      return _extends({},
      state, {
        [_.get(action, 'forkedCollection.id')]: action.forkedCollection });

    default:
      return state;}

};

/* harmony default export */ __webpack_exports__["a"] = (RunnerForkedCollectionReducer);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3663:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RunnerController; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__controllers_runner_utils__ = __webpack_require__(1573);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_services_filesystem__ = __webpack_require__(594);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_runner_RunnerSelectionActions__ = __webpack_require__(3666);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_runner_RunnerRunsActions__ = __webpack_require__(1574);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions_runner_RunnerWorkspaceActions__ = __webpack_require__(3667);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__actions_runner_RunnerCollectionActions__ = __webpack_require__(3668);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__actions_runner_RunnerFolderActions__ = __webpack_require__(3669);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__actions_runner_RunnerRequestActions__ = __webpack_require__(3670);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__actions_runner_RunnerEnvironmentActions__ = __webpack_require__(3671);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__actions_runner_RunnerUserActions__ = __webpack_require__(3672);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__actions_runner_RunnerArchivedCollectionActions__ = __webpack_require__(3673);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__actions_runner_RunnerForkedCollectionActions__ = __webpack_require__(3674);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__modules_pipelines_user_action__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__modules_model_event__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__modules_services_AnalyticsService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__RuntimeRunner__ = __webpack_require__(3675);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__constants_RunnerDataFileTypeConstants__ = __webpack_require__(1021);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__modules_controllers_WorkspaceController__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__modules_controllers_EnvironmentController__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__modules_controllers_CollectionController__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__modules_controllers_CollectionRunController__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__modules_controllers_WorkspaceSessionController__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__common_controllers_WindowController__ = __webpack_require__(174);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__common_controllers_WindowController___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_23__common_controllers_WindowController__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__modules_controllers_UserController__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__modules_controllers_ArchivedResourceController__ = __webpack_require__(813);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__modules_controllers_FavoritedCollectionController__ = __webpack_require__(632);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__reducers_runner_BackboneReduxBridge__ = __webpack_require__(1025);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__modules_controllers_ForkController__ = __webpack_require__(830);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};





























const MAX_RUN_COUNT = 10,
TAB = '\t';

/**
             * Controls runner actions and maintains Runs.
             *
             * @class RunnerController
             *
             * @property {Number} maxRunCount Maximum Runs that should be loaded. Set to 10.
             * @property {RuntimeRunner[]} runs A cache of all runs
             */let
RunnerController = class RunnerController {
  constructor() {
    this.runs = {};
    this.maxRunCount = MAX_RUN_COUNT;

    this.selectActions = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(__WEBPACK_IMPORTED_MODULE_3__actions_runner_RunnerSelectionActions__, pm.runnerStore.dispatch);
    this.actions = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(__WEBPACK_IMPORTED_MODULE_4__actions_runner_RunnerRunsActions__, pm.runnerStore.dispatch);
    this.workspaceActions = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(__WEBPACK_IMPORTED_MODULE_5__actions_runner_RunnerWorkspaceActions__, pm.runnerStore.dispatch);
    this.collectionActions = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(__WEBPACK_IMPORTED_MODULE_6__actions_runner_RunnerCollectionActions__, pm.runnerStore.dispatch);
    this.archivedCollectionActions = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(__WEBPACK_IMPORTED_MODULE_11__actions_runner_RunnerArchivedCollectionActions__, pm.runnerStore.dispatch);
    this.forkedCollectionActions = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(__WEBPACK_IMPORTED_MODULE_12__actions_runner_RunnerForkedCollectionActions__, pm.runnerStore.dispatch);
    this.folderActions = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(__WEBPACK_IMPORTED_MODULE_7__actions_runner_RunnerFolderActions__, pm.runnerStore.dispatch);
    this.requestActions = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(__WEBPACK_IMPORTED_MODULE_8__actions_runner_RunnerRequestActions__, pm.runnerStore.dispatch);
    this.environmentActions = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(__WEBPACK_IMPORTED_MODULE_9__actions_runner_RunnerEnvironmentActions__, pm.runnerStore.dispatch);
    this.userActions = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(__WEBPACK_IMPORTED_MODULE_10__actions_runner_RunnerUserActions__, pm.runnerStore.dispatch);
  }

  initialize(callback) {
    let workspaceSession = {};
    this.loadWorkspacesFromDB().
    then(() => this.loadRunsFromDB()).
    then(() => __WEBPACK_IMPORTED_MODULE_24__modules_controllers_UserController__["a" /* default */].get()).
    then(user => Promise.resolve(this.userActions.login(user))).
    then(() => __WEBPACK_IMPORTED_MODULE_23__common_controllers_WindowController___default.a.get({ id: pm.window.id })).
    then(window => __WEBPACK_IMPORTED_MODULE_22__modules_controllers_WorkspaceSessionController__["a" /* default */].get({ id: window.activeSession })).
    then(session => {workspaceSession = session;}).
    then(() => this.populateCollections(workspaceSession.workspace)).
    then(() => {
      this.populateArchivedCollections(workspaceSession.workspace);
      this.populateForkedCollections(workspaceSession.workspace);
      this.changeSelection('persist', pm.settings.getSetting('persistRunnerVariables') || false);
      this.changeSelection('runWithEmptyCookieJar', false);
      this.changeSelection('saveCookiesAfterRun', false);
      this.selectActions.setWorkspace(workspaceSession.workspace);
      this.populateEnvironments(workspaceSession.workspace);
      __WEBPACK_IMPORTED_MODULE_15__modules_services_AnalyticsService__["a" /* default */].addEvent('collection_runner', 'open');
      pm.logger.info('Runner~initialize - Success');
      return callback && callback();
    });
  }

  /**
     * Handles a change of selection for any entity.
     * The entity can be any of the input parameters for a Run like 'target', 'environment' etc.
     *
     * @param {String} field - The field to change selection. One of 'target', 'environment', 'iterations', 'delay', 'data', 'dataType', 'persist', 'runWithEmptyCookieJar', 'saveCookiesAfterRun' or 'saveResponse'
     * @param {*} value - The value to set to the field. The type of the value depends on the field being changed.
     *
     * @function RunnerController#changeSelection
     *
     * @example
     * // Sets the `folderId` within `collectionId` as the selection for a Run
     * pm.runner.changeSelection('target', {
     *   id: 'folderId',
     *   parentId: 'collectionId',
     *   type: 'folder'
     * });
     */
  changeSelection(field, value) {
    switch (field) {
      case 'target':
        if (_.isEmpty(value) || _.isEmpty(value.id)) {
          // Selected nothing
          this.selectActions.selectCollection(null);
        } else
        if (value.type === 'folder') {
          // Selected a folder
          this.selectActions.selectFolder(value.id, value.collection);
        } else
        if (value.type === 'collection') {
          // Selected a collection
          this.selectActions.selectCollection(value.id);
        }
        break;
      case 'environment':
        this.selectActions.selectEnvironment(value);
        break;
      case 'iterations':
        this.selectActions.setIterations(value);
        break;
      case 'delay':
        this.selectActions.setDelay(value);
        break;
      case 'data':
        _.isEmpty(value) ?
        this.selectActions.removeDataFile() :
        this.selectActions.readDataFile(value[0]);
        break;
      case 'dataType':
        this.selectActions.setDataFileType(value);
        break;
      case 'persist':
        this.selectActions.setPersistence(value);
        pm.settings.setSetting('persistRunnerVariables', value);
        break;
      case 'runWithEmptyCookieJar':
        this.selectActions.setRunWithEmptyCookieJar(value);
        break;
      case 'saveCookiesAfterRun':
        this.selectActions.setSaveCookiesAfterRun(value);
        break;
      case 'saveResponse':
        this.selectActions.setSaveResponse(value);
        break;
      case 'requestSelection':
        this.selectActions.setRequestSelection(value);
        break;
      case 'workspace':
        this.switchWorkspace(value);
        break;
      default:
        break;}

  }

  switchWorkspace(workspaceId) {
    __WEBPACK_IMPORTED_MODULE_22__modules_controllers_WorkspaceSessionController__["a" /* default */].getSessionFor(
    pm.window.id,
    workspaceId).
    then(session => {
      __WEBPACK_IMPORTED_MODULE_23__common_controllers_WindowController___default.a.update({
        id: pm.window.id,
        activeSession: session.id }).
      then(() => {
        this.selectActions.switchWorkspace(workspaceId);
      });
    });
  }

  async fetchCollection(collectionId) {
    return await __WEBPACK_IMPORTED_MODULE_20__modules_controllers_CollectionController__["a" /* default */].getCollection({ id: collectionId }, { populate: true });
  }


  /**
     * Starts a Run with RuntimeRunner. Also stores the run in its cache {@link RunnerController#runs}.
     *
     * @param {RunSelection} params - parameters for starting a Run
     * @param {Function} callback - Callback to execute after starting a Run
     *
     * @returns {undefined}
     *
     * @function RunnerController#startRun
     *
     * @see {RuntimeRunner}
     */
  async startRun(params, callback) {
    let collection = await this.fetchCollection(params.target.collection);
    if (!collection) {
      pm.toasts.error('Something went wrong when running the collection. Check that the collection still exists.');
      return;
    }

    if (!params.delay) {
      params.delay = 0;
    }

    let runner = new __WEBPACK_IMPORTED_MODULE_16__RuntimeRunner__["a" /* default */]();
    runner.initialize(params, () => {
      runner.start(params.retry, (err, runId) => {
        if (err) {
          return _.isFunction(callback) && callback(err);
        }

        this.runs = _extends({},
        this.runs, {
          [runId]: runner });


        runner.on('finish', this.onFinishRun.bind(this));
        return _.isFunction(callback) && callback(null, runId);
      });
    });
  }

  /**
     * Sets a lifecycle action on a Run. The lifecycle actions can be 'pause', 'start', 'stop' or 'retry'.
     *
     * @param {UUID} runId - id of the Run to change
     * @param {String} status - The lifecycle action to change. One of 'pause', 'start', 'stop' or 'retry'.
     * @param {String} callback - callback to execute when the action completes
     * @function RunnerController#setRunAction
     */
  setRunAction(runId, status, callback) {
    let run = this.runs[runId];

    switch (status) {
      case 'pause':
        run && run.pause();
        break;
      case 'resume':
        run && run.resume();
        break;
      case 'stop':
        run && run.stop();
        break;
      case 'retry':
        run = pm.runnerStore.getState().runs[runId];
        this.startRun({
          target: run.target,
          environment: run.environment,
          iterations: run.iterations.length,
          delay: run.delay,
          dataFile: run.dataFile,
          persist: run.persist,
          runWithEmptyCookieJar: run.runWithEmptyCookieJar,
          saveCookiesAfterRun: run.saveCookiesAfterRun,
          retry: true,
          saveResponse: run.saveResponse,
          requestSelection: run.requestSelection },
        callback);
        break;
      default:
        break;}

  }

  /**
     * Determines the file type based on the file type.
     *
     * @param {String} file - File name
     *
     * @returns {String} A file type string. One of 'text/csv', 'application/json', 'Undetermined'
     *
     * @function RunnerController#getFileType
     */
  getFileType(file) {
    if (_.includes(file.type, 'csv') || _.includes(file.type, 'excel') || _.includes(file.type, 'comma-separated-values')) {
      return __WEBPACK_IMPORTED_MODULE_17__constants_RunnerDataFileTypeConstants__["a" /* RUNNER_DATA_FILE_TYPE_CSV */];
    } else
    if (_.includes(file.type, 'json')) {
      return __WEBPACK_IMPORTED_MODULE_17__constants_RunnerDataFileTypeConstants__["b" /* RUNNER_DATA_FILE_TYPE_JSON */];
    } else
    {
      return __WEBPACK_IMPORTED_MODULE_17__constants_RunnerDataFileTypeConstants__["c" /* RUNNER_DATA_FILE_TYPE_UNDETERMINED */];
    }
  }

  /**
     * Reads the contents of a given file and processes it as a data file for the Run.
     *
     * @param {String} file - path to a file
     * @param {Function} callback Callback executed with the contents of the input file
     *
     * @returns {undefined}
     *
     * @function RunnerController#readFile
     */
  readFile(file, callback) {
    if (!file) {
      return _.isFunction(callback) && callback(null, []);
    }

    let autoDetectedFileType = this.getFileType(file);
    let fileDataType = _.get(pm.runnerStore.getState(), 'selection.fileType') || autoDetectedFileType;

    try {
      let reader = new FileReader();
      reader.onload = e => {
        this.processFile(e.target.result, fileDataType, callback);
      };
      reader.readAsText(file);
    }
    catch (e) {
      let data = _.get(pm.runnerStore.getState(), 'selection.data', []);
      this.processFile(JSON.stringify(data), fileDataType, callback);
    }
  }

  /**
     * Parses the contents of a given file based on the type passed.
     *
     * @param {String} data - contents of the data file
     * @param {String} fileDataType - file type
     * @param {Function} callback - callback executed with data parsed as an Object from the raw contents
     *
     * @returns {undefined}
     *
     * @function RunnerController#processFile
     */
  processFile(data, fileDataType, callback) {
    if (_.isEmpty(data)) {
      return callback(null, [], fileDataType);
    }
    try {
      if (fileDataType === __WEBPACK_IMPORTED_MODULE_17__constants_RunnerDataFileTypeConstants__["b" /* RUNNER_DATA_FILE_TYPE_JSON */]) {
        let object = JSON.parse(data);
        if (!_.isArray(object)) {
          throw new Error('The JSON must be an array.');
        }

        return _.isFunction(callback) && callback(null, object, fileDataType);
      } else
      if (fileDataType === __WEBPACK_IMPORTED_MODULE_17__constants_RunnerDataFileTypeConstants__["a" /* RUNNER_DATA_FILE_TYPE_CSV */]) {
        Object(__WEBPACK_IMPORTED_MODULE_1__controllers_runner_utils__["b" /* parseCSV */])(data, (err, parsedData) => {
          if (err) {
            pm.toasts.error('Error while parsing data file: ' + err);
            return _.isFunction(callback) && callback('Error while parsing data file', data, fileDataType);
          }

          return _.isFunction(callback) && callback(null, parsedData, fileDataType);
        });
      } else
      {
        return _.isFunction(callback) && callback('Could not determine format of data file', data, fileDataType);

        // throw new Error('Could not determine format of file.');
      }
    }
    catch (err) {
      pm.toasts.error('Error reading data file: ' + err);
      return _.isFunction(callback) && callback(err);
    }
  }

  /**
     * Filters the iterations to be stored in the DB
     *
     * Removes the header and body property from request
     * and response.
     *
     * @param  {Object} iterations [Run iterations to be filtered]
     * @return {Object}            [Filtered iterations]
     */

  /**
         * Stores the results of a Run to IndexedDB.
         *
         * @param {UUID} runId - id of the Run that finished
         *
         * @function RunnerController#onFinishRun
         *
         * @fires AppWindow#runAdded
         */
  onFinishRun(runId) {
    this.runs[runId].dispose();
    let runnerState = pm.runnerStore.getState(),
    run = runnerState.runs[runId];

    if (!run) {
      return;
    }

    let runToDB = _extends({},
    run, {
      id: runId,
      collection: _.get(run, 'target.collection', null),
      owner: runnerState.user.id }),

    createRunEvent = Object(__WEBPACK_IMPORTED_MODULE_14__modules_model_event__["a" /* createEvent */])('create', 'collectionrun', runToDB);

    Object(__WEBPACK_IMPORTED_MODULE_13__modules_pipelines_user_action__["a" /* default */])(createRunEvent).
    catch(e => {
      console.log('Error in IndexDB while writing Run', e);
    });
    pm.appWindow.trigger('sendMessageObject', 'runAdded', run);
    this.cleanRuns();
    __WEBPACK_IMPORTED_MODULE_15__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'create', run.retry ? 'retry_run' : 'start_run', this.getTotalRequests(runId));
  }

  /**
     * Get total number of requests that were sent out in a Run(identified by the given id). Sums up individual requests from iterations.
     *
     * @param {UUID} runId - id of the run to get request count
     *
     * @returns {Number} number of requests in the Run
     *
     * @function RunnerController#getTotalRequests
     */
  getTotalRequests(runId) {
    let run = pm.runnerStore.getState().runs[runId];
    return _.reduce(run.iterations, (total, iteration) => {
      return total + iteration.length;
    }, 0);
  }

  /**
     * Removes a Run, from memory and IndexedDB. Updates the UI as well.
     *
     * @param {UUID} runId - id of the Run to remove
     *
     * @function RunnerController#deleteRun
     *
     * @fires AppWindow#runDeleted
     */
  deleteRun(runId) {
    this.actions.deleteRun(runId);
    let deleteRunEvent = Object(__WEBPACK_IMPORTED_MODULE_14__modules_model_event__["a" /* createEvent */])('delete', 'collectionrun', { id: runId });
    Object(__WEBPACK_IMPORTED_MODULE_13__modules_pipelines_user_action__["a" /* default */])(deleteRunEvent).
    catch(e => {
      console.log(e);
    });
    pm.appWindow.trigger('sendMessageObject', 'runDeleted', runId);
  }

  /**
     * Removes all Runs from memory.
     *
     * @function RunnerController#deleteAllRuns
     *
     * @listens AppWindow#allRunsDeleted
     */
  deleteAllRuns() {
    this.actions.deleteAllRuns();
  }

  /**
     * Exports the results of a Run to a JSON file.
     *
     * @param {UUID} runId - id of the run to export
     * @param {RuntimeRunner} run - instance of the run
     *
     * @function RunnerController#exportRun
     */
  exportRun(runId) {
    this.fetchRun(runId, run => {
      Object(__WEBPACK_IMPORTED_MODULE_27__reducers_runner_BackboneReduxBridge__["b" /* ReduxToBackbone */])(runId, run, (err, exportRun) => {
        if (!err && exportRun) {
          let name = exportRun.name + '.postman_test_run.json',
          type = 'application/json';
          Object(__WEBPACK_IMPORTED_MODULE_2__models_services_filesystem__["b" /* saveAndOpenFile */])(name, JSON.stringify(exportRun, null, TAB), type, (err, state) => {
            if (err) {
              console.warn('Error while exporting run', err);
            } else
            if (state === __WEBPACK_IMPORTED_MODULE_2__models_services_filesystem__["a" /* STATE */].SUCCESS) {
              pm.toasts.success('Saved test run to disk');
            }
          });
        }
      });
    });
  }

  /**
     * Returns the active workspace
     */
  getActiveWorkspace() {
    return pm.runnerStore.getState().selection.workspace.id;
  }

  /**
     * Import a list of JSON files as a Run results.
     *
     * @param {File[]} runs - list of files to import as Runs
     *
     * @function RunnerController#importRun
     */
  importRun(runs) {
    let reader,
    data,
    importJSON,
    runId,
    isExisting,
    workspace,
    state = pm.runnerStore.getState();

    _.forEach(runs, run => {
      reader = new FileReader();

      reader.onload = e => {
        data = e.target.result;
        try {
          importJSON = JSON.parse(data.toString());
          runId = importJSON.id;
          if (state.runs[runId] && state.runs[runId].workspace === this.getActiveWorkspace()) {
            pm.toasts.error('The run you are trying to import already exists.');
            return false;
          }
        }
        catch (err) {
          pm.logger.error(err);
          pm.toasts.error('Collection runs must be valid JSON objects');
          return false;
        }

        this.actions.importRun(importJSON, false);
        __WEBPACK_IMPORTED_MODULE_15__modules_services_AnalyticsService__["a" /* default */].addEvent('collectionrun', 'create', 'import', this.getTotalRequests(runId));
      };

      reader.readAsText(run);
    });
  }

  fetchRun(runId, callback) {
    let loadedRuns = pm.runnerStore.getState();
    if (loadedRuns.runs[runId].iterations) {
      return _.isFunction(callback) && callback(loadedRuns.runs[runId]);
    }

    __WEBPACK_IMPORTED_MODULE_21__modules_controllers_CollectionRunController__["a" /* default */].get({ id: runId }).then(run => {
      this.actions.loadRun(run);
      _.isFunction(callback) && callback(run);
    });
  }

  /**
     * Loads Runs from IndexedDB to memory.
     *
     * Note: This function is debounced by 2000ms.
     *
     * @function RunnerController#loadRunsFromDB
     *
     * @param {Function} callback - callback executed after loading the Runs.
     *
     * @listens AppWindow#reloadRuns
     */
  loadRunsFromDB() {
    __WEBPACK_IMPORTED_MODULE_21__modules_controllers_CollectionRunController__["a" /* default */].getAll().then(runs => {
      this.actions.loadRuns(runs, true);
      return Promise.resolve(runs);
    }).
    catch(e => {
      return Promise.reject(e);
    });
  }

  /**
     * Makes sure only results for last N Runs are stored. The number of results is determined by {@link RunnerController#maxRunCount}
     *
     * @function RunnerController#cleanRuns
     */
  cleanRuns() {
    // Check total numbers of runs in db, clean runs accordingly
    let state = pm.runnerStore.getState().runs,
    totalRuns = _.size(state);
    if (totalRuns > this.maxRunCount) {
      let sortedRuns = _.sortBy(state, run => {
        return run.createdAt;
      });

      // Sorted in ascending order of creation date
      _.each(sortedRuns, (run, index) => {
        this.actions.cleanRun(run.id);
        return index - 1 < totalRuns - this.maxRunCount;
      });
    }
  }

  loadWorkspacesFromDB(callback) {
    return __WEBPACK_IMPORTED_MODULE_18__modules_controllers_WorkspaceController__["a" /* default */].getAll({}).then(workspaces => {
      this.workspaceActions.loadWorkspaces(workspaces);
      return Promise.resolve(workspaces);
    });
  }

  populateArchivedCollections() {
    __WEBPACK_IMPORTED_MODULE_25__modules_controllers_ArchivedResourceController__["a" /* default */].getAll().then(archiveList => {
      this.archivedCollectionActions.loadArchivedCollections(archiveList);
    });
  }

  populateCollections(workspaceId) {
    let folders = [],
    requests = [],
    collections = [],
    collectionActions = this.collectionActions,
    folderActions = this.folderActions,
    requestActions = this.requestActions;

    return __WEBPACK_IMPORTED_MODULE_18__modules_controllers_WorkspaceController__["a" /* default */].get({ id: workspaceId }).
    then(function (workspace) {
      let criteria = {},
      collectionsArray = [];

      if (workspace) {
        criteria = { id: workspace.collections };
      }
      return __WEBPACK_IMPORTED_MODULE_20__modules_controllers_CollectionController__["a" /* default */].getCollections(criteria).then(flatCollections => {
        collections = flatCollections;
        return Promise.all(_.map(flatCollections, collection => {
          return __WEBPACK_IMPORTED_MODULE_20__modules_controllers_CollectionController__["a" /* default */].getCollection({ id: collection.id }, { populate: true });
        }));

      }).
      then(collections => {
        collectionsArray = collections;

        return __WEBPACK_IMPORTED_MODULE_26__modules_controllers_FavoritedCollectionController__["a" /* default */].getAll();
      }).
      then(favoritedCollections => {
        let favoriteResourceIds = new Set(_.map(favoritedCollections, favorite => favorite.id));

        _.forEach(collections, collection => {
          // also need to set favorite as true which is not derived from the favorites table
          if (favoriteResourceIds.has(collection.id)) {
            collection.isFavorite = true;
          }
        });

        _.forEach(collectionsArray, collectionFromDb => {
          folders = _.concat(folders, collectionFromDb.folders);
          requests = _.concat(requests, collectionFromDb.requests);
        });
        collectionActions.loadCollections(collections);
        folderActions.loadFolders(folders);
        requestActions.loadRequests(requests);
      }).catch(e => {
        console.log(e);
      });
    });
  }

  /**
     * Fetch all the forked collections from neDB storage and populate the redux store with it
     */
  populateForkedCollections() {
    const forkedCollectionActions = this.forkedCollectionActions;

    return __WEBPACK_IMPORTED_MODULE_28__modules_controllers_ForkController__["a" /* default */].getAll().then(forkedCollections => {
      forkedCollectionActions.loadForkedCollections(forkedCollections);
    }).catch(e => {
      console.log(e);
    });
  }

  repopulateCollections() {
    return __WEBPACK_IMPORTED_MODULE_23__common_controllers_WindowController___default.a.get({ id: pm.window.id }).
    then(window => __WEBPACK_IMPORTED_MODULE_22__modules_controllers_WorkspaceSessionController__["a" /* default */].get({ id: window.activeSession })).
    then(session => this.populateCollections(session.workspace));
  }

  populateCollection(collectionId) {
    let folders = [],
    requests = [],
    folderActions = this.folderActions,
    requestActions = this.requestActions;

    __WEBPACK_IMPORTED_MODULE_20__modules_controllers_CollectionController__["a" /* default */].getCollection({ id: collectionId }, { populate: true }).
    then(collectionFromDb => {
      folders = _.concat(folders, collectionFromDb.folders);
      requests = _.concat(requests, collectionFromDb.requests);

      folderActions.loadFolders(folders);
      requestActions.loadRequests(requests);
    }).catch(e => {
      console.log(e);
    });
  }

  populateEnvironments(workspaceId) {
    let environmentActions = this.environmentActions;
    __WEBPACK_IMPORTED_MODULE_18__modules_controllers_WorkspaceController__["a" /* default */].get({ id: workspaceId }).
    then(function (workspace) {
      let criteria = {};
      if (workspace) {
        criteria = { id: workspace.environments };
      }
      __WEBPACK_IMPORTED_MODULE_19__modules_controllers_EnvironmentController__["a" /* default */].getAll(criteria).then(environments => {
        environments = _.sortBy(environments, ['name']);
        environmentActions.loadEnvironments(environments);
      });
    });
  }

  /**
     * Triggers an event for the missing current workspace modal to show up
     * Also switches the active workspace
     * @param  {[String]} workspaceId [Workspace ID which is deleted]
     */
  handleWorkspaceDelete(workspaceId) {
    let runnerState = pm.runnerStore.getState(),
    activeWorkspace = runnerState.selection.workspace,
    workspaces = _.filter(runnerState.workspaces, workspace => {
      return workspace.id !== workspaceId;
    });

    // This should never happen
    if (_.isEmpty(workspaces)) {
      pm.toasts.error('FATAL ERROR: No personal workspaces. Please reload the app.');
      return;
    }

    if (workspaceId === activeWorkspace.id) {
      pm.mediator.trigger('missingCurrentWorkspace', { name: activeWorkspace.name });
      this.changeSelection('workspace', workspaces[0].id);
    }
  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3664:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {
const { Transform } = __webpack_require__(198)
const ResizeableBuffer = __webpack_require__(3665)

const default_options = {
  // cast: false,
  // cast_date: false,
  columns: null,
  delimiter: Buffer.from(','),
  escape: Buffer.from('"'),
  from: 1,
  from_line: 1,
  objname: undefined,
  // ltrim: false,
  // quote: Buffer.from('"'),
  // TODO create a max_comment_size
  max_record_size: 0,
  relax: false,
  relax_column_count: false,
  // rtrim: false,
  skip_empty_lines: false,
  skip_lines_with_empty_values: false,
  skip_lines_with_error: false,
  to_line: -1,
  to: -1,
  trim: false
}

const cr = 13
const nl = 10
const space = 32

class Parser extends Transform {
  constructor(opts = {}){
    const options = {}
    for(let i in opts){
      options[i] = opts[i]
    }
    options.readableObjectMode = true
    super(options)
    // Import default options
    for(let k in default_options){
      if(options[k] === undefined){
        options[k] = default_options[k]
      }
    }
    // Normalize option `cast`
    let fnCastField = null
    if(options.cast === undefined || options.cast === null || options.cast === false || options.cast === ''){
      options.cast = undefined
    }else if(typeof options.cast === 'function'){
      fnCastField = options.cast
      options.cast = true
    }else if(options.cast !== true){
      throw new Error('Invalid Option: cast must be true or a function')
    }
    // Normize option `cast_date`
    if(options.cast_date === undefined || options.cast_date === null || options.cast_date === false || options.cast_date === ''){
      options.cast_date = false
    }else if(options.cast_date === true){
      options.cast_date = function(value){
        const date = Date.parse(value)
        return !isNaN(date) ? new Date(date) : value
      }
    }else if(typeof options.cast_date !== 'function'){
      throw new Error('Invalid Option: cast_date must be true or a function')
    }
    // Normalize option `comment`
    if(options.comment === undefined || options.comment === null || options.comment === false || options.comment === ''){
      options.comment = null
    }else{
      if(typeof options.comment === 'string'){
        options.comment = Buffer.from(options.comment)
      }
      if(!Buffer.isBuffer(options.comment)){
        throw new Error(`Invalid Option: comment must be a buffer or a string, got ${JSON.stringify(options.comment)}`)
      }
    }
    // Normalize option `delimiter`
    if(typeof options.delimiter === 'string'){
      options.delimiter = Buffer.from(options.delimiter)
    }
    // Normalize option `columns`
    let fnFirstLineToHeaders = null
    if(options.columns === true){
      fnFirstLineToHeaders = firstLineToHeadersDefault
    }else if(typeof options.columns === 'function'){
      fnFirstLineToHeaders = options.columns
      options.columns = true
    }else if(Array.isArray(options.columns)){
      normalizeColumnsArray(options.columns)
    }else if(options.columns === undefined || options.columns === null || options.columns === false){
      options.columns = false
    }else{
      throw new Error(`Invalid Option columns: expect an object or true, got ${JSON.stringify(options.columns)}`)
    }
    // Normalize option `escape`
    if(typeof options.escape === 'string'){
      options.escape = Buffer.from(options.escape)
    }
    if(!Buffer.isBuffer(options.escape)){
      throw new Error(`Invalid Option: escape must be a buffer or a string, got ${JSON.stringify(options.escape)}`)
    }else if(options.escape.length !== 1){
      throw new Error(`Invalid Option Length: escape must be one character, got ${options.escape.length}`)
    }else{
      options.escape = options.escape[0]
    }
    // Normalize option `info`
    if(options.info === undefined || options.info === null || options.info === false){
      options.info = false
    }else if(options.info !== true){
      throw new Error(`Invalid Option: info must be true, got ${JSON.stringify(options.info)}`)
    }
    // Normalize option `quote`
    if(options.quote === null || options.quote === false || options.quote === ''){
      options.quote = null
    }else{
      if(options.quote === undefined || options.quote === true){
        options.quote = Buffer.from('"')
      }else if(typeof options.quote === 'string'){
        options.quote = Buffer.from(options.quote)
      }
      if(!Buffer.isBuffer(options.quote)){
        throw new Error(`Invalid Option: quote must be a buffer or a string, got ${JSON.stringify(options.quote)}`)
      }else if(options.quote.length !== 1){
        throw new Error(`Invalid Option Length: quote must be one character, got ${options.quote.length}`)
      }else{
        options.quote = options.quote[0]
      }
    }
    // Normalize options `raw`
    if(options.raw === undefined || options.raw === null || options.raw === false){
      options.raw = false
    }else if(options.raw !== true){
      throw new Error(`Invalid Option: raw must be true, got ${JSON.stringify(options.raw)}`)
    }
    // Normalize option `record_delimiter`
    if(!options.record_delimiter){
      options.record_delimiter = []
    }else if(!Array.isArray(options.record_delimiter)){
      options.record_delimiter = [options.record_delimiter]
    }
    options.record_delimiter = options.record_delimiter.map( function(rd){
      if(typeof rd === 'string'){
        rd = Buffer.from(rd)
      }
      return rd
    })
    // Normalize options `trim`, `ltrim` and `rtrim`
    if(options.trim === true && options.ltrim !== false){
      options.ltrim = true
    }else if(options.ltrim !== true){
      options.ltrim = false
    }
    if(options.trim === true && options.rtrim !== false){
      options.rtrim = true
    }else if(options.rtrim !== true){
      options.rtrim = false
    }
    this.info = {
      comment_lines: 0,
      empty_lines: 0,
      invalid_field_length: 0,
      lines: 1,
      records: 0
    }
    this.options = options
    this.state = {
      castField: fnCastField,
      commenting: false,
      enabled: options.from_line === 1,
      escaping: false,
      escapeIsQuote: options.escape === options.quote,
      expectedRecordLength: options.columns === null ? 0 : options.columns.length,
      field: new ResizeableBuffer(20),
      firstLineToHeaders: fnFirstLineToHeaders,
      info: Object.assign({}, this.info),
      previousBuf: undefined,
      quoting: false,
      stop: false,
      rawBuffer: new ResizeableBuffer(100),
      record: [],
      recordHasError: false,
      record_length: 0,
      recordDelimiterMaxLength: options.record_delimiter.length === 0 ? 2 : Math.max(...options.record_delimiter.map( (v) => v.length)),
      trimChars: [Buffer.from(' ')[0], Buffer.from('\t')[0]],
      wasQuoting: false,
      wasRowDelimiter: false
    }
  }
  _transform(buf, encoding, callback){
    if(this.state.stop === true){
      return
    }
    const err = this.__parse(buf, false)
    if(err !== undefined){
      this.state.stop = true
    }
    callback(err)
  }
  _flush(callback){
    if(this.state.stop === true){
      return
    }
    const err = this.__parse(undefined, true)
    callback(err)
  }
  __parse(nextBuf, end){
    const {comment, escape, from, from_line, info, ltrim, max_record_size, quote, raw, relax, rtrim, skip_empty_lines, to, to_line} = this.options
    let {record_delimiter} = this.options
    const {previousBuf, rawBuffer, escapeIsQuote, trimChars} = this.state
    let buf
    if(previousBuf === undefined && nextBuf !== undefined){
      buf = nextBuf
    }else if(previousBuf !== undefined && nextBuf === undefined){
      buf = previousBuf
    }else{
      buf = Buffer.concat([previousBuf, nextBuf])
    }
    const bufLen = buf.length
    let pos
    // let escaping = this.
    for(pos = 0; pos < bufLen; pos++){
      // Ensure we get enough space to look ahead
      // There should be a way to move this out of the loop
      if(this.__needMoreData(pos, bufLen, end)){
        break
      }
      if(this.state.wasRowDelimiter === true){
        this.info.lines++
        if(info === true && this.state.record.length === 0 && this.state.field.length === 0 && this.state.wasQuoting === false){
          this.state.info = Object.assign({}, this.info)
        }
        this.state.wasRowDelimiter = false
      }
      if(to_line !== -1 && this.info.lines > to_line){
        this.state.stop = true
        this.push(null)
        return
      }
      // Auto discovery of record_delimiter, unix, mac and windows supported
      if(this.state.quoting === false && record_delimiter.length === 0){
        const recordDelimiterCount = this.__autoDiscoverRowDelimiter(buf, pos)
        if(recordDelimiterCount){
          record_delimiter = this.options.record_delimiter
        }
      }
      const chr = buf[pos]
      if(raw === true){
        rawBuffer.append(chr)
      }
      if((chr === cr || chr === nl) && this.state.wasRowDelimiter === false ){
        this.state.wasRowDelimiter = true
      }
      // Previous char was a valid escape char
      // treat the current char as a regular char
      if(this.state.escaping === true){
        this.state.escaping = false
      }else{
        // Escape is only active inside quoted fields
        if(this.state.quoting === true && chr === escape && pos + 1 < bufLen){
          // We are quoting, the char is an escape chr and there is a chr to escape
          if(escapeIsQuote){
            if(buf[pos+1] === quote){
              this.state.escaping = true
              continue
            }
          }else{
            this.state.escaping = true
            continue
          }
        }
        // Not currently escaping and chr is a quote
        // TODO: need to compare bytes instead of single char
        if(this.state.commenting === false && chr === quote){
          if(this.state.quoting === true){
            const nextChr = buf[pos+1]
            const isNextChrTrimable = rtrim && this.__isCharTrimable(nextChr)
            // const isNextChrComment = nextChr === comment
            const isNextChrComment = comment !== null && this.__compareBytes(comment, buf, pos+1, nextChr)
            const isNextChrDelimiter = this.__isDelimiter(nextChr, buf, pos+1)
            const isNextChrRowDelimiter = record_delimiter.length === 0 ? this.__autoDiscoverRowDelimiter(buf, pos+1) : this.__isRecordDelimiter(nextChr, buf, pos+1)
            // Escape a quote
            // Treat next char as a regular character
            // TODO: need to compare bytes instead of single char
            if(chr === escape && nextChr === quote){
              pos++
            }else if(!nextChr || isNextChrDelimiter || isNextChrRowDelimiter || isNextChrComment || isNextChrTrimable){
              this.state.quoting = false
              this.state.wasQuoting = true
              continue
            }else if(relax === false){
              const err = this.__error(`Invalid Closing Quote: got "${String.fromCharCode(nextChr)}" at line ${this.info.lines} instead of delimiter, row delimiter, trimable character (if activated) or comment`)
              if(err !== undefined) return err
            }else{
              this.state.quoting = false
              this.state.wasQuoting = true
              // continue
              this.state.field.prepend(quote)
            }
          }else{
            if(this.state.field.length !== 0){
              // In relax mode, treat opening quote preceded by chrs as regular
              if( relax === false ){
                const err = this.__error(`Invalid opening quote at line ${this.info.lines}`)
                if(err !== undefined) return err
              }
            }else{
              this.state.quoting = true
              continue
            }
          }
        }
        if(this.state.quoting === false){
          let recordDelimiterLength = this.__isRecordDelimiter(chr, buf, pos)
          if(recordDelimiterLength !== 0){
            // Do not emit comments which take a full line
            const skipCommentLine = this.state.commenting && (this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0)
            if(skipCommentLine){
              this.info.comment_lines++
              // Skip full comment line
            }else{
              // Skip if line is empty and skip_empty_lines activated
              if(skip_empty_lines === true && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0){
                this.info.empty_lines++
                continue
              }
              // Activate records emition if above from_line
              if(this.state.enabled === false && this.info.lines + (this.state.wasRowDelimiter === true ? 1: 0 ) >= from_line){
                this.state.enabled = true
                this.__resetField()
                this.__resetRow()
                continue
              }else{
                const errField = this.__onField()
                if(errField !== undefined) return errField
                const errRecord = this.__onRow()
                if(errRecord !== undefined) return errRecord
              }
              if(to !== -1 && this.info.records >= to){
                this.state.stop = true
                this.push(null)
                return
              }
            }
            this.state.commenting = false
            pos += recordDelimiterLength - 1
            continue
          }
          if(this.state.commenting){
            continue
          }
          const commentCount = comment === null ? 0 : this.__compareBytes(comment, buf, pos, chr)
          if(commentCount !== 0){
            this.state.commenting = true
            continue
          }
          let delimiterLength = this.__isDelimiter(chr, buf, pos)
          if(delimiterLength !== 0){
            const errField = this.__onField()
            if(errField !== undefined) return errField
            pos += delimiterLength - 1
            continue
          }
        }
      }
      if(this.state.commenting === false){
        if(max_record_size !== 0 && this.state.record_length + this.state.field.length > max_record_size){
          const err = this.__error(`Max Record Size: record exceed the maximum number of tolerated bytes of ${max_record_size} on line ${this.info.lines}`)
          if(err !== undefined) return err
        }
      }
      
      const lappend = ltrim === false || this.state.quoting === true || this.state.field.length !== 0 || !this.__isCharTrimable(chr)
      // rtrim in non quoting is handle in __onField
      const rappend = rtrim === false || this.state.wasQuoting === false
      if( lappend === true && rappend === true ){
        this.state.field.append(chr)
      }else if(rtrim === true && !this.__isCharTrimable(chr)){
        const err = this.__error(`Invalid Closing Quote: found non trimable byte after quote at line ${this.info.lines}`)
        if(err !== undefined) return err
      }
    }
    if(end === true){
      if(this.state.quoting === true){
        const err = this.__error(`Invalid Closing Quote: quote is not closed at line ${this.info.lines}`)
        if(err !== undefined) return err
      }else{
        // Skip last line if it has no characters
        if(this.state.wasQuoting === true || this.state.record.length !== 0 || this.state.field.length !== 0){
          const errField = this.__onField()
          if(errField !== undefined) return errField
          const errRecord = this.__onRow()
          if(errRecord !== undefined) return errRecord
        }else if(this.state.wasRowDelimiter === true){
          this.info.empty_lines++
        }else if(this.state.commenting === true){
          this.info.comment_lines++
        }
      }
    }else{
      this.state.previousBuf = buf.slice(pos)
    }
    if(this.state.wasRowDelimiter === true){
      this.info.lines++
      this.state.wasRowDelimiter = false
    }
  }
  __isCharTrimable(chr){
    return chr === space || chr === cr || chr === nl
  }
  __onRow(){
    const {columns, info, from, relax_column_count, raw, skip_lines_with_empty_values} = this.options
    const {enabled, record} = this.state
    // Validate column length
    if(columns === true && this.state.firstLineToHeaders){
      return this.__firstLineToColumns(record)
    }
    const recordLength = record.length
    if(columns === false && this.info.records === 0){
      this.state.expectedRecordLength = recordLength
    }else if(enabled === true){
      if(recordLength !== this.state.expectedRecordLength){
        if(relax_column_count === true){
          this.info.invalid_field_length++
        }else{
          if(columns === false){
            const err = this.__error(`Invalid Record Length: expect ${this.state.expectedRecordLength}, got ${recordLength} on line ${this.info.lines}`)
            if(err !== undefined) return err
          }else{
            const err = this.__error(`Invalid Record Length: header length is ${columns.length}, got ${recordLength} on line ${this.info.lines}`)
            if(err !== undefined) return err
          }
        }
      }
    }
    if(enabled === false){
      return this.__resetRow()
    }
    if( skip_lines_with_empty_values === true){
      if(record.map( (field) => field.trim() ).join('') === ''){
        this.__resetRow()
        return
      }
    }
    if(this.state.recordHasError === true){
      this.__resetRow()
      this.state.recordHasError = false
      return
    }
    this.info.records++
    if(from === 1 || this.info.records >= from){
      if(columns !== false){
        const obj = {}
        // Transform record array to an object
        for(let i in record){
          if(columns[i] === undefined || columns[i].disabled) continue
          obj[columns[i].name] = record[i]
        }
        const {objname} = this.options
        if(objname === undefined){
          if(raw === true || info === true){
            this.push(Object.assign(
              {record: obj},
              (raw === true ? {raw: this.state.rawBuffer.toString()}: {}),
              (info === true ? {info: this.state.info}: {})
            ))
          }else{
            this.push(obj)
          }
        }else{
          if(raw === true || info === true){
            this.push(Object.assign(
              {record: [obj[objname], obj]},
              raw === true ? {raw: this.state.rawBuffer.toString()}: {},
              info === true ? {info: this.state.info}: {}
            ))
          }else{
            this.push([obj[objname], obj])
          }
        }
      }else{
        if(raw === true || info === true){
          this.push(Object.assign(
            {record: record},
            raw === true ? {raw: this.state.rawBuffer.toString()}: {},
            info === true ? {info: this.state.info}: {}
          ))
        }else{
          this.push(record)
        }
      }
    }
    this.__resetRow()
  }
  __firstLineToColumns(record){
    try{
      const headers = this.state.firstLineToHeaders.call(null, record)
      if(!Array.isArray(headers)){
        return this.__error(`Invalid Header Mapping: expect an array, got ${JSON.stringify(headers)}`)
      }
      normalizeColumnsArray(headers)
      this.state.expectedRecordLength = headers.length
      this.options.columns = headers
      this.__resetRow()
      return
    }catch(err){
      return err
    }
  }
  __resetRow(){
    const {info} = this.options
    if(this.options.raw === true){
      this.state.rawBuffer.reset()
    }
    this.state.record = []
    this.state.record_length = 0
  }
  __onField(){
    const {cast, rtrim} = this.options
    const {enabled, wasQuoting} = this.state
    // Deal with from_to options
    if(this.options.columns !== true && enabled === false){
      return this.__resetField()
    }
    let field = this.state.field.toString()
    if(rtrim === true && wasQuoting === false){
      field = field.trimRight()
    }
    if(cast === true){
      const [err, f] = this.__cast(field)
      if(err !== undefined) return err
      field = f
    }
    this.state.record.push(field)
    this.state.record_length += field.length
    this.__resetField()
  }
  __resetField(){
    this.state.field.reset()
    this.state.wasQuoting = false
  }
  __cast(field){
    const context = {
      column: Array.isArray(this.options.columns) === true ? this.options.columns[this.state.record.length] : this.state.record.length,
      empty_lines: this.info.empty_lines,
      header: this.options.columns === true,
      index: this.state.record.length,
      invalid_field_length: this.info.invalid_field_length,
      quoting: this.state.wasQuoting,
      lines: this.info.lines,
      records: this.info.records
    }
    if(this.state.castField !== null){
      try{
        return [undefined, this.state.castField.call(null, field, context)]
      }catch(err){
        return [err]
      }
    }
    if(this.__isInt(field) === true){
      return [undefined, parseInt(field)]
    }else if(this.__isFloat(field)){
      return [undefined, parseFloat(field)]
    }else if(this.options.cast_date !== false){
      return [undefined, this.options.cast_date.call(null, field, context)]
    }
    return [undefined, field]
  }
  __isInt(value){
    return /^(\-|\+)?([1-9]+[0-9]*)$/.test(value)
  }
  __isFloat(value){
    return (value - parseFloat( value ) + 1) >= 0 // Borrowed from jquery
  }
  __compareBytes(sourceBuf, targetBuf, pos, firtByte){
    if(sourceBuf[0] !== firtByte) return 0
    const sourceLength = sourceBuf.length
    for(let i = 1; i < sourceLength; i++){
      if(sourceBuf[i] !== targetBuf[pos+i]) return 0
    }
    return sourceLength
  }
  __needMoreData(i, bufLen, end){
    if(end){
      return false
    }
    const {comment, delimiter, escape} = this.options
    const {quoting, recordDelimiterMaxLength} = this.state
    const numOfCharLeft = bufLen - i - 1
    const requiredLength = Math.max(
      // Skip if the remaining buffer smaller than comment
      comment ? comment.length : 0, 
      // Skip if the remaining buffer smaller than row delimiter
      recordDelimiterMaxLength,
      // Skip if the remaining buffer can be row delimiter following the closing quote
      // 1 is for quote.length
      quoting ? (1 + recordDelimiterMaxLength) : 0,
      // Skip if the remaining buffer can be delimiter
      delimiter.length,
      // Skip if the remaining buffer can be escape sequence
      // 1 is for escape.length
      1
    )
    return numOfCharLeft < requiredLength
  }
  __isDelimiter(chr, buf, pos){
    const {delimiter} = this.options
    const delLength = delimiter.length
    if(delimiter[0] !== chr) return 0
    for(let i = 1; i < delLength; i++){
      if(delimiter[i] !== buf[pos+i]) return 0
    }
    return delimiter.length
  }
  __isRecordDelimiter(chr, buf, pos){
    const {record_delimiter} = this.options
    const recordDelimiterLength = record_delimiter.length
    loop1: for(let i = 0; i < recordDelimiterLength; i++){
      const rd = record_delimiter[i]
      const rdLength = rd.length
      if(rd[0] !== chr){
        continue
      }
      for(let j = 1; j < rdLength; j++){
        if(rd[j] !== buf[pos+j]){
          continue loop1
        }
      }
      return rd.length
    }
    return 0
  }
  __autoDiscoverRowDelimiter(buf, pos){
    const chr = buf[pos]
    if(chr === cr){
      if(buf[pos+1] === nl){
        this.options.record_delimiter.push(Buffer.from('\r\n'))
        this.state.recordDelimiterMaxLength = 2
        return 2
      }else{
        this.options.record_delimiter.push(Buffer.from('\r'))
        this.state.recordDelimiterMaxLength = 1
        return 1
      }
    }else if(chr === nl){
      this.options.record_delimiter.push(Buffer.from('\n'))
      this.state.recordDelimiterMaxLength = 1
      return 1
    }
    return 0
  }
  __error(msg){
    const {skip_lines_with_error} = this.options
    const err = new Error(msg)
    if(skip_lines_with_error){
      this.state.recordHasError = true
      this.emit('skip', err)
      return undefined
    }else{
      return err
    }
  }
}

const parse = function(){
  let data, options, callback
  for(let i in arguments){
    const argument = arguments[i]
    const type = typeof argument
    if(data === undefined && (typeof argument === 'string' || Buffer.isBuffer(argument))){
      data = argument
    }else if(options === undefined && isObject(argument)){
      options = argument
    }else if(callback === undefined && type === 'function'){
      callback = argument
    }else{
      throw new Error(`Invalid argument: got ${JSON.stringify(argument)} at index ${i}`)
    }
  }
  const parser = new Parser(options)
  if(callback){
    const records = options === undefined || options.objname === undefined ? [] : {}
    parser.on('readable', function(){
      let record
      while(record = this.read()){
        if(options === undefined || options.objname === undefined){
          records.push(record)
        }else{
          records[record[0]] = record[1]
        }
      }
    })
    parser.on('error', function(err){
      callback(err, undefined, parser.info)
    })
    parser.on('end', function(){
      callback(undefined, records, parser.info)
    })
  }
  if(data !== undefined){
    parser.write(data)
    parser.end()
  }
  return parser
}

parse.Parser = Parser

module.exports = parse

const isObject = function(obj){
  return (typeof obj === 'object' && obj !== null && !Array.isArray(obj))
}

const firstLineToHeadersDefault = function(record){
  return record.map(function(field){
    return {
      header: field,
      name: field
    }
  })
}

const normalizeColumnsArray = function(columns){
  for(let i=0; i< columns.length; i++){
    const column = columns[i]
    if(column === undefined || column === null || column === false){
      columns[i] = { disabled: true }
    }else if(typeof column === 'string'){
      columns[i] = { name: column }
    }else if(isObject(column)){
      if(typeof column.name !== 'string'){
        throw new Error(`Invalid Option columns: property "name" is required at position ${i}`)
      }
      columns[i] = column
    }else{
      throw new Error(`Invalid Option columns: expect a string or an object, got ${JSON.stringify(column)} at position ${i}`)
    }
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ }),

/***/ 3665:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {

class ResizeableBuffer{
  constructor(size=100){
    this.size = size
    this.length = 0
    this.buf = Buffer.alloc(size)
  }
  prepend(val){
    const length = this.length++
    if(length === this.size){
      this.resize()
    }
    const buf = this.clone()
    this.buf[0] = val
    buf.copy(this.buf,1, 0, length)
  }
  append(val){
    const length = this.length++
    if(length === this.size){
      this.resize()
    }
    this.buf[length] = val
  }
  clone(){
    return Buffer.from(this.buf.slice(0, this.length))
  }
  resize(){
    const length = this.length
    this.size = this.size * 2
    const buf = Buffer.alloc(this.size)
    this.buf.copy(buf,0, 0, length)
    this.buf = buf
  }
  toString(){
    return this.buf.slice(0, this.length).toString()
  }
  reset(){
    this.length = 0
  }
}

module.exports = ResizeableBuffer

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ }),

/***/ 3666:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants_RunnerDataFileTypeConstants__ = __webpack_require__(1021);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_controllers_WorkspaceController__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_controllers_WindowController__ = __webpack_require__(174);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_controllers_WindowController___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__common_controllers_WindowController__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_default_workspace__ = __webpack_require__(172);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__electron_ElectronService__ = __webpack_require__(199);








const selectCollection = id => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["J" /* RUNNER_SET_COLLECTION */],
    id: id };

};
/* harmony export (immutable) */ __webpack_exports__["selectCollection"] = selectCollection;


const selectFolder = (id, collectionId) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["O" /* RUNNER_SET_FOLDER */],
    id,
    collection: collectionId };

};
/* harmony export (immutable) */ __webpack_exports__["selectFolder"] = selectFolder;


const selectEnvironment = id => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["N" /* RUNNER_SET_ENV */],
    id };

};
/* harmony export (immutable) */ __webpack_exports__["selectEnvironment"] = selectEnvironment;


const setIterations = value => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["Q" /* RUNNER_SET_ITERATIONS */],
    value };

};
/* harmony export (immutable) */ __webpack_exports__["setIterations"] = setIterations;


const setDelay = value => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["M" /* RUNNER_SET_DELAY */],
    value };

};
/* harmony export (immutable) */ __webpack_exports__["setDelay"] = setDelay;


const readDataFile = file => {
  return function (dispatch) {
    dispatch(removeDataFile());
    pm.runner.readFile(file, (err, result, fileDataType) => {
      dispatch(setDataFile(file, result));
      if (!_.isEqual(fileDataType, __WEBPACK_IMPORTED_MODULE_1__constants_RunnerDataFileTypeConstants__["c" /* RUNNER_DATA_FILE_TYPE_UNDETERMINED */])) {
        dispatch(setIterations(_.size(result)));
      }
    });
  };
};
/* harmony export (immutable) */ __webpack_exports__["readDataFile"] = readDataFile;


const setDataFile = (file, data = null) => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["K" /* RUNNER_SET_DATA_FILE */],
    file,
    fileType: pm.runner.getFileType(file),
    data };

};
/* harmony export (immutable) */ __webpack_exports__["setDataFile"] = setDataFile;


const removeDataFile = () => {
  return { type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["H" /* RUNNER_REMOVE_DATA_FILE */] };
};
/* harmony export (immutable) */ __webpack_exports__["removeDataFile"] = removeDataFile;


const setDataFileType = fileType => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["L" /* RUNNER_SET_DATA_FILE_TYPE */],
    fileType };

};
/* harmony export (immutable) */ __webpack_exports__["setDataFileType"] = setDataFileType;


const setPersistence = value => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["R" /* RUNNER_SET_PERSIST_VARS */],
    value };

};
/* harmony export (immutable) */ __webpack_exports__["setPersistence"] = setPersistence;


const setRunWithEmptyCookieJar = value => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["P" /* RUNNER_SET_INITIAL_COOKIES */],
    value };

};
/* harmony export (immutable) */ __webpack_exports__["setRunWithEmptyCookieJar"] = setRunWithEmptyCookieJar;


const setSaveCookiesAfterRun = value => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["T" /* RUNNER_SET_SAVE_COOKIES_AFTER_RUN */],
    value };

};
/* harmony export (immutable) */ __webpack_exports__["setSaveCookiesAfterRun"] = setSaveCookiesAfterRun;


const setSaveResponse = value => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["U" /* RUNNER_SET_SAVE_RESPONSES */],
    value };

};
/* harmony export (immutable) */ __webpack_exports__["setSaveResponse"] = setSaveResponse;


const setRequestSelection = value => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["S" /* RUNNER_SET_REQUEST_SELECTION */],
    value };

};
/* harmony export (immutable) */ __webpack_exports__["setRequestSelection"] = setRequestSelection;


const switchWorkspace = value => {
  return dispatch => {
    return __WEBPACK_IMPORTED_MODULE_2__modules_controllers_WorkspaceController__["a" /* default */].get({ id: value }).
    then(workspace => {
      if (!workspace) {
        return Object(__WEBPACK_IMPORTED_MODULE_4__utils_default_workspace__["c" /* defaultUserWorkspaceId */])().
        then(defaultWorkspaceId => __WEBPACK_IMPORTED_MODULE_2__modules_controllers_WorkspaceController__["a" /* default */].get({ id: defaultWorkspaceId }));
      }

      return workspace;
    }).
    then(workspace => {
      return dispatch({
        type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_2" /* RUNNER_SWITCH_WORKSPACE */],
        value: workspace });

    });
  };
};
/* harmony export (immutable) */ __webpack_exports__["switchWorkspace"] = switchWorkspace;


const setWorkspace = value => {
  return dispatch => {
    return __WEBPACK_IMPORTED_MODULE_2__modules_controllers_WorkspaceController__["a" /* default */].get({ id: value }).
    then(workspace => {
      if (!workspace) {
        return Object(__WEBPACK_IMPORTED_MODULE_4__utils_default_workspace__["c" /* defaultUserWorkspaceId */])().
        then(defaultWorkspaceId => __WEBPACK_IMPORTED_MODULE_2__modules_controllers_WorkspaceController__["a" /* default */].get({ id: defaultWorkspaceId }));
      }

      return workspace;
    }).
    then(workspace => {
      dispatch({
        type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["V" /* RUNNER_SET_WORKSPACE */],
        value: workspace });


      return Object(__WEBPACK_IMPORTED_MODULE_5__electron_ElectronService__["d" /* getLaunchParams */])();
    }).
    then(([window, params]) => {
      let sessionState = _.get(params.session, 'state', {});
      if (sessionState.folder) {
        dispatch(selectFolder(sessionState.folder, sessionState.collection));
      } else
      {
        dispatch(selectCollection(sessionState.collection));
      }

      if (sessionState.environment) {
        dispatch(selectEnvironment(sessionState.environment));
      }
    });
  };
};
/* harmony export (immutable) */ __webpack_exports__["setWorkspace"] = setWorkspace;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3667:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);



const loadWorkspaces = workspaces => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["E" /* RUNNER_LOAD_WORKSPACE */],
    workspaces };

};
/* harmony export (immutable) */ __webpack_exports__["loadWorkspaces"] = loadWorkspaces;


const createWorkspace = workspace => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["g" /* RUNNER_CREATE_WORKSPACE */],
    workspace };

};
/* harmony export (immutable) */ __webpack_exports__["createWorkspace"] = createWorkspace;


const updateWorkspace = workspace => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_6" /* RUNNER_UPDATE_WORKSPACE */],
    workspace };

};
/* harmony export (immutable) */ __webpack_exports__["updateWorkspace"] = updateWorkspace;


const deleteWorkspace = workspaceId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["o" /* RUNNER_DELETE_WORKSPACE */],
    workspaceId };

};
/* harmony export (immutable) */ __webpack_exports__["deleteWorkspace"] = deleteWorkspace;


/***/ }),

/***/ 3668:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const loadCollections = collections => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["y" /* RUNNER_LOAD_COLLECTIONS */],
    collections };

};
/* harmony export (immutable) */ __webpack_exports__["loadCollections"] = loadCollections;


const createCollection = collection => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["d" /* RUNNER_CREATE_COLLECTION */],
    collection };

};
/* harmony export (immutable) */ __webpack_exports__["createCollection"] = createCollection;


const updateCollection = collection => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_3" /* RUNNER_UPDATE_COLLECTION */],
    collection };

};
/* harmony export (immutable) */ __webpack_exports__["updateCollection"] = updateCollection;


const deleteCollection = collectionId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["j" /* RUNNER_DELETE_COLLECTION */],
    collectionId };

};
/* harmony export (immutable) */ __webpack_exports__["deleteCollection"] = deleteCollection;


/***/ }),

/***/ 3669:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const loadFolders = folders => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["A" /* RUNNER_LOAD_FOLDERS */],
    folders };

};
/* harmony export (immutable) */ __webpack_exports__["loadFolders"] = loadFolders;


const deleteFolder = folderId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["l" /* RUNNER_DELETE_FOLDER */],
    folderId };

};
/* harmony export (immutable) */ __webpack_exports__["deleteFolder"] = deleteFolder;


/***/ }),

/***/ 3670:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const loadRequests = requests => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["C" /* RUNNER_LOAD_REQUESTS */],
    requests };

};
/* harmony export (immutable) */ __webpack_exports__["loadRequests"] = loadRequests;


const updateRequest = request => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_5" /* RUNNER_UPDATE_REQUEST */],
    request };

};
/* harmony export (immutable) */ __webpack_exports__["updateRequest"] = updateRequest;


const deleteRequest = requestId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["m" /* RUNNER_DELETE_REQUEST */],
    requestId };

};
/* harmony export (immutable) */ __webpack_exports__["deleteRequest"] = deleteRequest;


/***/ }),

/***/ 3671:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const loadEnvironments = environments => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["z" /* RUNNER_LOAD_ENVIRONMENTS */],
    environments };

};
/* harmony export (immutable) */ __webpack_exports__["loadEnvironments"] = loadEnvironments;


const createEnvironment = environment => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["e" /* RUNNER_CREATE_ENVIRONMENT */],
    environment };

};
/* harmony export (immutable) */ __webpack_exports__["createEnvironment"] = createEnvironment;


const updateEnvironment = environment => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_4" /* RUNNER_UPDATE_ENVIRONMENT */],
    environment };

};
/* harmony export (immutable) */ __webpack_exports__["updateEnvironment"] = updateEnvironment;


const deleteEnvironment = environmentId => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["k" /* RUNNER_DELETE_ENVIRONMENT */],
    environmentId };

};
/* harmony export (immutable) */ __webpack_exports__["deleteEnvironment"] = deleteEnvironment;


/***/ }),

/***/ 3672:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const login = user => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_7" /* RUNNER_USER_LOGIN */],
    user };

};
/* harmony export (immutable) */ __webpack_exports__["login"] = login;


const logout = () => {
  return { type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["_8" /* RUNNER_USER_LOGOUT */] };
};
/* harmony export (immutable) */ __webpack_exports__["logout"] = logout;


/***/ }),

/***/ 3673:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const loadArchivedCollections = archivedCollections => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["x" /* RUNNER_LOAD_ARCHIVED_COLLECTIONS */],
    archivedCollections };

};
/* harmony export (immutable) */ __webpack_exports__["loadArchivedCollections"] = loadArchivedCollections;


const deleteArchivedCollection = archivedCollection => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["i" /* RUNNER_DELETE_ARCHIVED_COLLECTION */],
    archivedCollection };

};
/* harmony export (immutable) */ __webpack_exports__["deleteArchivedCollection"] = deleteArchivedCollection;


const createArchivedCollection = archivedCollection => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["c" /* RUNNER_CREATE_ARCHIVED_COLLECTION */],
    archivedCollection };

};
/* harmony export (immutable) */ __webpack_exports__["createArchivedCollection"] = createArchivedCollection;


/***/ }),

/***/ 3674:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__ = __webpack_require__(82);


const loadForkedCollections = forkedCollections => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["B" /* RUNNER_LOAD_FORKED_COLLECTIONS */],
    forkedCollections };

};
/* harmony export (immutable) */ __webpack_exports__["loadForkedCollections"] = loadForkedCollections;


const createForkedCollection = forkedCollection => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_RunnerActionsConstants__["f" /* RUNNER_CREATE_FORKED_COLLECTION */],
    forkedCollection };

};
/* harmony export (immutable) */ __webpack_exports__["createForkedCollection"] = createForkedCollection;


/***/ }),

/***/ 3675:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RuntimeRunner; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions_runner_RunnerRunsActions__ = __webpack_require__(1574);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_events__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_events__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_postman_collection_transformer__ = __webpack_require__(299);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_postman_collection_transformer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_postman_collection_transformer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_util_js__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_ModelToSdkTransformer__ = __webpack_require__(882);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__controllers_RuntimeBridge__ = __webpack_require__(3676);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_postman_collection__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_postman_collection___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_postman_collection__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modules_controllers_CollectionController__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__modules_controllers_EnvironmentController__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__modules_controllers_GlobalsController__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__reducers_runner_BackboneReduxBridge__ = __webpack_require__(1025);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__constants_RunnerSaveResponseConstants__ = __webpack_require__(1022);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__modules_services_VariableSessionService__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__utils_VariableSessionHelper__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__runner_utils__ = __webpack_require__(1573);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__utils_RequestUtil__ = __webpack_require__(984);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__utils_FsHelper__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__constants_RequestBodyTypeConstants__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__constants_RequestDataModeConstants__ = __webpack_require__(241);






















const MAX_RESPONSE_SIZE = 300000;

/**
                                   * Transforms request based on dataMode
                                   * @param {Object} request
                                   */
function sanitiseRequestFileBody(request) {
  if (request.dataMode === __WEBPACK_IMPORTED_MODULE_18__constants_RequestBodyTypeConstants__["c" /* REQUEST_BODY_TYPE_FORM_DATA */]) {
    let formData = request.data;

    // flatten list of files for each row by creating a new row for each
    // i.e. [{ key: 'foo', value: ['/a', '/b'] }] is converted to
    // [{ key: 'foo', value: '/a' } { key: 'foo', '/b'] }]
    formData = _.flatMap(formData, dataRow => {
      if (!dataRow || dataRow.type !== 'file') {
        return [dataRow];
      }


      return _.map(dataRow.value, file => {
        let clonedRow = _.omit(dataRow, ['value']);

        clonedRow.value = file;

        return clonedRow;
      });
    });

    request.data = formData;
  }

  if (request.dataMode === __WEBPACK_IMPORTED_MODULE_18__constants_RequestBodyTypeConstants__["b" /* REQUEST_BODY_TYPE_BINARY */]) {
    request.rawModeData = request.data;
  }

  if (request.dataMode === __WEBPACK_IMPORTED_MODULE_19__constants_RequestDataModeConstants__["d" /* REQUEST_DATA_MODE_GRAPHQL */]) {
    request.graphqlModeData = request.data;
    request.data = [];
  }

  return request;
}

/**
   * This is a Proxy class for the `postman-runtime`'s run. Handles lifecylcle and results of a Run.
   *
   * @class RuntimeRunner
   * @extends {EventEmitter}
   */let
RuntimeRunner = class RuntimeRunner extends __WEBPACK_IMPORTED_MODULE_2_events___default.a {

  initialize(selection, callback) {
    let {
      target,
      environment,
      persist } =
    selection;

    __WEBPACK_IMPORTED_MODULE_8__modules_controllers_CollectionController__["a" /* default */].getCollection({ id: target.collection }, { populate: true }).
    then(async collection => {
      let activeWorkspaceId = pm.runnerStore.getState().selection.workspace.id,
      environmentVarSession = await this.fetchEnvironmentSession(selection.environment, activeWorkspaceId),
      globals = await this.fetchGlobals(activeWorkspaceId),
      globalsVarSession = await this.fetchGlobalsSession(globals.id, activeWorkspaceId),
      transformedCollection;

      persist && pm.settings.setSetting('persistRunnerVariables', true); // For legacy reasons (VariableProcessor uses this)
      this.selection = selection;
      this.actions = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(__WEBPACK_IMPORTED_MODULE_1__actions_runner_RunnerRunsActions__, pm.runnerStore.dispatch);
      this.collection = collection;
      this.folders = collection.folders;
      this.requests = collection.requests;
      this.folderMap = [];
      this.requestMap = [];
      this.activeGlobalsId = globals.id;
      this.activeEnvSessionId = environmentVarSession && environmentVarSession.id;
      this.activeGlobalsSessionId = globalsVarSession && globalsVarSession.id;

      this.localFiles = [];

      // Strip out bodies for GET and other methods, CLIENTAPP#2144
      // @todo Remove the disabled variables, needs to be handled in runtime #RUNTIME-450
      if (!_.isEmpty(__WEBPACK_IMPORTED_MODULE_4__utils_util_js__["a" /* default */].getEnabledValues(collection.variables))) {
        let sessionId = Object(__WEBPACK_IMPORTED_MODULE_14__utils_VariableSessionHelper__["b" /* getSessionId */])('collection', collection.id, activeWorkspaceId),
        variableSession = await Object(__WEBPACK_IMPORTED_MODULE_13__modules_services_VariableSessionService__["d" /* getSessionFor */])(sessionId, collection);
        _.assign(collection, { variables: variableSession.values });
      }

      collection.requests = _.map(collection.requests, request => {
        // Do not send queryParams to transformer, CLIENTAPP#3799
        request = _.omit(request, 'queryParams');

        // Get all the localfile references if they exist
        this.localFiles = _.union(this.localFiles, request._postman_local_files || []);

        request = sanitiseRequestFileBody(request);

        return request;
      });

      try {
        transformedCollection = __WEBPACK_IMPORTED_MODULE_3_postman_collection_transformer___default.a.convert(collection, {
          inputVersion: '1.0.0',
          outputVersion: '2.0.0',
          retainIds: true });

      }
      catch (e) {
        pm.toasts.error('Something went wrong when running the collection:' + e.toString());
        return;
      }

      // Map the values
      _.map(this.folders, folder => {
        this.folderMap[folder.id] = folder;
      });
      _.map(this.requests, request => {
        this.requestMap[request.id] = request;
      });

      this.sdkCollection = new __WEBPACK_IMPORTED_MODULE_7_postman_collection___default.a.Collection(transformedCollection);

      environmentVarSession && environmentVarSession.values && (environmentVarSession.values = _.reject(environmentVarSession.values, { enabled: false })) || [];

      this.initialEnv = environmentVarSession;
      this.initialGlobals = globalsVarSession && globalsVarSession.values && _.reject(globalsVarSession.values, { enabled: false }) || [];

      this.options = {
        runnerOptions: {
          run: {
            timeout: {
              global: 0, // infinity
              request: parseInt(pm.settings.getSetting('xhrTimeout')) || 0,

              // @todo: expose a setting to configure script timeout
              script: 0 // infinity
            },
            requester: {
              strictSSL: pm.settings.getSetting('SSLCertVerify'),
              followRedirects: pm.settings.getSetting('interceptorRedirect'),
              extendedRootCA: pm.settings.getSetting('isCACertEnabled') && pm.settings.getSetting('CACertPath') || undefined,
              implicitCacheControl: pm.settings.getSetting('sendNoCacheHeader'),
              implicitTraceHeader: pm.settings.getSetting('sendPostmanTokenHeader') } },


          host: {
            requires: ['lodash', 'crypto-all', 'tv4', 'xml2js', 'atob', 'btoa'],
            requirePath: '/js/libs/' } },


        fileResolver: {
          workingDir: Object(__WEBPACK_IMPORTED_MODULE_17__utils_FsHelper__["a" /* getWorkingDir */])(),
          insecureFileRead: Object(__WEBPACK_IMPORTED_MODULE_17__utils_FsHelper__["b" /* insecureFileRead */])(),
          fileWhitelist: this.localFiles } };



      this.showExceptionAlert = _.once(this.showExceptionAlert);
      _.isFunction(callback) && callback();
    }).
    catch(err => {
      pm.logger.error('Error while initializing runner', err);
    });
  }

  async fetchGlobals(activeWorkspaceId) {
    if (!activeWorkspaceId) {
      return null;
    }

    return await __WEBPACK_IMPORTED_MODULE_10__modules_controllers_GlobalsController__["a" /* default */].get({ workspace: activeWorkspaceId });
  }

  async fetchEnvironments(environmentId) {
    if (!environmentId) {
      return null;
    }

    return await __WEBPACK_IMPORTED_MODULE_9__modules_controllers_EnvironmentController__["a" /* default */].get({ id: environmentId });
  }

  async fetchGlobalsSession(activeGlobalsId, activeWorkspaceId) {
    if (!activeGlobalsId || !activeWorkspaceId) {
      return null;
    }

    let sessionId = Object(__WEBPACK_IMPORTED_MODULE_14__utils_VariableSessionHelper__["b" /* getSessionId */])('globals', activeGlobalsId, activeWorkspaceId);

    return Object(__WEBPACK_IMPORTED_MODULE_13__modules_services_VariableSessionService__["d" /* getSessionFor */])(sessionId).
    catch(err => {
      pm.logger.warn(`Could not get session for sessionId: ${sessionId}, ${err && err.message}`);
    });
  }

  async fetchEnvironmentSession(environmentId, activeWorkspaceId) {
    if (!environmentId) {
      return null;
    }

    let environment = await this.fetchEnvironments(environmentId),
    sessionId = Object(__WEBPACK_IMPORTED_MODULE_14__utils_VariableSessionHelper__["b" /* getSessionId */])('environment', environmentId, activeWorkspaceId);

    return Object(__WEBPACK_IMPORTED_MODULE_13__modules_services_VariableSessionService__["d" /* getSessionFor */])(sessionId).
    then(session => {
      environment && session && (session.name = environment.name);

      return session;
    }).
    catch(err => {
      pm.logger.warn(`Could not get session for environmentId: ${environmentId}, sessionId: ${sessionId}, ${err && err.message}`);
    });
  }

  /**
     * Starts the Run.
     *
     * @param {Boolean} retry - Is this run a retry
     * @param {Function} callback - callback executed after the Run is started
     *
     * @function RuntimeRunner#start
     */
  start(retry, callback) {
    let {
      target,
      data,
      dataFile,
      delay,
      iterations,
      runWithEmptyCookieJar,
      saveCookiesAfterRun,
      requestSelection = [] } =
    this.selection;

    this.retry = retry;

    pm.runner.readFile(dataFile, (err, fileData) => {
      if (err) {
        pm.toasts.error('Could not start run: ' + err);
        return;
      }

      if (!_.isNumber(delay)) {
        let converted = _.toNumber(delay);
        delay = Number.isNaN(converted) ? 0 : converted;
      }

      if (!_.isNumber(iterations)) {
        let converted = _.toNumber(iterations);
        iterations = Number.isNaN(converted) ? 1 : converted;
      }

      const runOptions = {
        environment: _.pick(this.initialEnv, ['id', 'name', 'values']),
        globals: { values: this.initialGlobals },
        iterationCount: parseInt(iterations),
        delay: { item: delay },
        data: fileData,
        stopOnError: true,
        useSystemProxy: pm.settings.getSetting('useSystemProxy'),
        proxies: pm.proxyListManager.globalProxies.toJSON() },


      // If some request in the selection is not checked or has been re-ordered then the default
      // strategy cannot be used. Setting the lookupStrategy and executing using the selected request order
      // Note: In all general case the performance is worst-case performance as there is no clear intention
      // of strategy pre-selected.
      // @future: Bubble up the intended strategy from the UX and not rely on logic
      useSelection = _.some(requestSelection, req => {return !req.checked || req.reordered;});

      if (useSelection) {
        runOptions.entrypoint = {
          execute: _(requestSelection).
          filter({ checked: true }).
          map('id').valueOf(),
          lookupStrategy: 'followOrder' };

      } else {
        // If nothing has been changed then fallback to default strategy
        // Checking if folder has been selected and selecting the appropriate path strategy
        if (target.folder) {
          let collectionJSON = this.collection,
          folderPath = __WEBPACK_IMPORTED_MODULE_4__utils_util_js__["a" /* default */].getFoldersPath(collectionJSON, target.folder);

          runOptions.entrypoint = { execute: target.folder };
          folderPath && _.assign(runOptions.entrypoint, { lookupStrategy: 'path', path: folderPath.path });
        }
      }

      // TODO investigate on effects of async
      this.envVars = null;
      this.globalVars = null;

      let runMetaData = {
        certificates: __WEBPACK_IMPORTED_MODULE_5__utils_ModelToSdkTransformer__["a" /* default */].getClientSslCerts(pm.certificateManager),
        cookiePartitionId: __WEBPACK_IMPORTED_MODULE_4__utils_util_js__["a" /* default */].getCookiePartition(),
        runWithEmptyCookieJar: runWithEmptyCookieJar,
        saveCookiesAfterRun: saveCookiesAfterRun };



      __WEBPACK_IMPORTED_MODULE_6__controllers_RuntimeBridge__["a" /* default */].startRun(this.options, runOptions, runMetaData, this.sdkCollection, {
        console: pm.console.log.bind(pm.console),
        io: this.onIOEvent.bind(this),
        error: pm.console.log.bind(pm.console, 'error'),
        exception: this.onException.bind(this),
        start: this.onStartRun.bind(this, callback),
        pause: this.onPauseRun.bind(this),
        resume: this.onResumeRun.bind(this),
        stop: this.onStopRun.bind(this),
        abort: this.onStopRun.bind(this),
        beforeIteration: this.onStartIteration.bind(this),
        beforeRequest: this.onStartRequest.bind(this),
        beforePrerequest: this.onStartPreRequestScript.bind(this),
        prerequest: this.onPreRequestScript.bind(this),
        beforeTest: this.onStartTest.bind(this),
        assertion: this.onAssertion.bind(this),
        test: this.onEndTest.bind(this),
        response: this.onEndRequest.bind(this),
        iteration: this.onEndIteration.bind(this),
        done: this.onEndRun.bind(this) }).
      then(id => {
        this.runLinkID = id;
      });
    });
  }

  /**
     * Pause this run.
     *
     * @function RuntimeRunner#pause
     */
  pause() {
    this.runLinkID && __WEBPACK_IMPORTED_MODULE_6__controllers_RuntimeBridge__["a" /* default */].pauseRun(this.runLinkID);
  }

  /**
     * Resume this run.
     *
     * @function RuntimeRunner#resume
     */
  resume() {
    this.runLinkID && __WEBPACK_IMPORTED_MODULE_6__controllers_RuntimeBridge__["a" /* default */].resumeRun(this.runLinkID);
  }

  /**
     * Stops this run.
     *
     * @function RuntimeRunner#stop
     */
  stop() {
    this.actions.stoppingRun(this.runId);
    this.runLinkID && __WEBPACK_IMPORTED_MODULE_6__controllers_RuntimeBridge__["a" /* default */].stopRun(this.runLinkID);
  }

  /**
     * Handles an IO event from runtime.
     *
     * Note: Bound to `io` callback from postman-runtime.
     *
     * @param {?Error} err Error if any passed down from postman-runtime
     * @param {RunCursor} cursor current cursor position passed down from postman-runtime
     * @param {Object} trace meta data including the source and type of this event
     * @param {?SDKResponse} response response passed down from postman-runtime
     * @param {?SDKRequest} request request passed down from postman-runtime
     *
     * @returns {undefined}
     *
     * @callback RuntimeRunner#io
     */
  onIOEvent(err, cursor, trace, response, request) {
    let consolePayload = {};

    if (trace.type !== 'http' || !request) {
      return;
    }

    consolePayload.request = {
      url: _.invoke(request, 'url.toString'),
      method: request.method,
      headers: _.invoke(request, 'headers.toJSON'),
      body: request.body,
      certificate: request.certificate,
      proxy: request.proxy };


    if (response) {
      consolePayload.response = {
        responseTime: response.responseTime,
        code: response.code,
        headers: _.invoke(response, 'headers.toJSON'),
        body: response.size().body / 1024 > 1024 ? 'Responses larger than 1MB are not shown' : response.text() };

    }

    if (err) {
      pm.console.netErr(cursor.httpRequestId, err.message, consolePayload);
    } else
    {
      pm.console.net(cursor.httpRequestId, consolePayload);
    }
  }

  /**
     * Shows an alert when an exception occurs in the run
     *
     * @return {undefined}
     */
  showExceptionAlert() {
    pm.toasts.error('Something went wrong while running your scripts. Check Postman Console for more info.');
  }

  /**
     * Handles exception event from runtime
     *
     * @param {RunCursor} cursor Current cursor position passed down from postman-runtime
     * @param {Error} exception The exception
     *
     * @return {undefined}
     */
  onException(cursor, exception) {
    // This is a separate function so that multiple errors do not stack, and only once alert is shown per run.
    this.showExceptionAlert();
    pm.console.error('exception', { message: `${exception.name} | ${exception.message}` });
    console.warn(`Error running scripts: ${exception.name} | ${exception.message}`, exception);
  }

  /**
     * Updates the UI that this run was started.
     *
     * Note: Bound to `start` callback from postman-runtime.
     *
     * @param {Function} callback callback for start passed down from postman-runtime
     * @param {?Error} err Error if any passed down from postman-runtime
     * @param {RunCursor} cursor current cursor position passed down from postman-runtime
     *
     * @returns {undefined}
     *
     * @callback RuntimeRunner#onStartRun
     */
  onStartRun(callback, err, cursor) {
    if (err) {
      return callback(err);
    }

    this.runId = cursor.ref;
    let runName;

    if (this.selection.target.folder) {
      runName = this.getFolderName(this.selection.target.collection, this.selection.target.folder);
    } else
    {
      runName = this.getCollectionName(this.selection.target.collection);
    }

    this.actions.startRun(
    this.runId,
    this.selection,
    runName,
    this.retry);

    return _.isFunction(callback) && callback(err, this.runId);
  }

  /**
     * Updates the UI for the start of an iteration.
     *
     * Note: Bound to `beforeIteration` callback of postman-runtime
     *
     * @param {?Error} err - Error if any passed down from postman-runtime
     * @param {RunCursor} cursor - current cursor position passed down from postman-runtime
     *
     * @returns {undefined}
     *
     * @callback RuntimeRunner#onStartIteration
     */
  onStartIteration(err, cursor) {
    if (err) {
      console.warn(err);
      return;
    }
    this.actions.startIteration(
    this.runId,
    cursor.iteration);

  }

  /**
     * Resets the request's assertions to an empty array so that assertions along the lifetime of this request may be captured.
     *
     * Note: Bound to `beforePrerequest` callback of postman-runtime.
     *
     * @param {?Error} err - Error if any passed down from postman-runtime
     * @param {RunCursor} cursor - current cursor position passed down from postman-runtime
     * @param {Object} events -  results of pre request script execution
     * @param {SDKItem} item - item passed down from postman-runtime
     *
     * @callback RuntimeRunner#onStartPreRequestScript
     */
  onStartPreRequestScript(err, cursor, events, item) {
    this.assertions = [];
  }

  /**
     * Updates the UI for errors/test results.
     *
     * Note: Bound to `prerequest` callback of postman-runtime.
     *
     * @param {?Error} err - Error if any passed down from postman-runtime
     * @param {RunCursor} cursor - current cursor position passed down from postman-runtime
     * @param {Object} prResults-  results of pre request script execution
     * @param {SDKItem} item - item passed down from postman-runtime
     *
     * @callback RuntimeRunner#onPreRequestScript
     */
  onPreRequestScript(err, cursor, prResults, item) {
    var { error: errorObj } = _.find(prResults, prResult => prResult.error) || {};
    let scriptError = err || errorObj;
    if (scriptError) {
      console.warn(`Error executing pre-request scripts for ${item.name}: ${scriptError.name}: ${scriptError.message}`);
      pm.toasts.error(`Error executing pre-request scripts for ${item.name}: Check DevTools for more info`);

      // Needs to be removed:  https://postmanlabs.atlassian.net/browse/CLIENTAPP-2256
      pm.console.error('exception', { message: `${item.name}: ${scriptError.name}: ${scriptError.message}` });

      this.actions.errorRequest(
      this.runId,
      cursor.iteration,
      {
        id: item.toJSON().id,
        ref: cursor.ref },

      'An error occurred while running pre-request scripts for this request.');

    }

    if (this.selection.persist) {
      if (_.isArray(prResults) && !_.isEmpty(prResults)) {
        if (!this.envVars) {
          this.envVars = new __WEBPACK_IMPORTED_MODULE_7_postman_collection___default.a.VariableScope({ mutations: {} });
        }
        if (!this.globalVars) {
          this.globalVars = new __WEBPACK_IMPORTED_MODULE_7_postman_collection___default.a.VariableScope({ mutations: {} });
        }

        _.forEach(prResults, result => {
          Object(__WEBPACK_IMPORTED_MODULE_16__utils_RequestUtil__["a" /* mergeMutations */])(this.envVars.mutations, _.get(result, 'result.environment.mutations'));
          Object(__WEBPACK_IMPORTED_MODULE_16__utils_RequestUtil__["a" /* mergeMutations */])(this.globalVars.mutations, _.get(result, 'result.globals.mutations'));
        });
      }
    }
  }

  /**
     * Updates the UI for sending a request.
     *
     * Note: Bound to `beforeRequest` callback of postman-runtime.
     *
     * @param {?Error} err - Error if any passed down from postman-runtime
     * @param {RunCursor} cursor - current cursor position passed down from postman-runtime
     * @param {SDKRequest} req - SDK request passed down from postman-runtime
     * @param {SDKItem} item - SDK item passed down from postman-runtime
     *
     * @returns {undefined}
     *
     * @callback RuntimeRunner#onStartRequest
     */
  onStartRequest(err, cursor, req, item) {
    if (err) {
      console.warn(`Error sending request ${item.name}: ${err.name}: ${err.message}`);
      pm.toasts.error(`Error sending request ${item.name}: Check DevTools for more info`);
      this.actions.errorRequest(
      this.runId,
      cursor.iteration,
      {
        id: item.toJSON().id,
        ref: cursor.ref },

      'An error occurred while running this request.');

      return;
    }

    let requestUrl = req.url && req.url.toString(),
    requestJson = req.toJSON(),
    itemJson = item.toJSON();

    pm.console.net(cursor.httpRequestId, {
      request: {
        url: requestUrl,
        method: requestJson.method,
        headers: requestJson.headers } });



    let requestBody,
    itemMeta = this.requestMap[item.toJSON().id];

    // this request was not part of the collection, i.e an intermediate request
    if (!itemMeta) {
      return;
    }

    if (requestJson.body) {
      requestBody = _.isArray(requestJson.body[requestJson.body.mode]) ?
      _.reduce(requestJson.body[requestJson.body.mode], (body, data) => {
        !data.disabled && (body[data.key] = data.value);
        return body;
      }, {}) : requestJson.body[requestJson.body.mode];
    }

    let data = { collection: this.collection, folderMap: this.folderMap },
    nodePath = Object(__WEBPACK_IMPORTED_MODULE_15__runner_utils__["a" /* findNodePath */])(itemMeta.name, itemMeta, data);

    this.actions.startRequest(
    this.runId,
    cursor.iteration,
    {
      name: item.name,
      id: item.id,
      ref: cursor.ref,
      url: requestUrl,
      unresolvedUrl: _.invoke(item, 'request.url.toString') || '',
      method: requestJson.method,
      path: nodePath,
      body: requestBody });


  }

  /**
     * Updates the UI for the start of a test script.
     *
     * Note: Bound to `beforeTest` callback of postman-runtime.
     *
     * @param {?Error} err - Error if any passed down from postman-runtime
     * @param {RunCursor} cursor - current cursor position passed down from postman-runtime
     * @param {Object} events - events passed down from postman-runtime
     * @param {SDKItem} item - SDK Item passed down from postman-runtime
     *
     * @returns {undefined}
     *
     * @callback RuntimeRunner#onStartTest
     */
  onStartTest(err, cursor, events, item) {
    if (err) {
      console.warn(err);
      this.actions.errorRequest(
      this.runId,
      cursor.iteration,
      {
        id: item.toJSON().id,
        ref: cursor.ref },

      'An error occurred while running tests for this request.');

      return;
    }

    this.actions.startTest(
    this.runId,
    cursor.iteration,
    {
      id: item.toJSON().id,
      ref: cursor.ref });


  }

  /**
     * Updates the UI for an assertion in the test script.
     *
     * Note: Bound to `assertion` callback of postman-runtime.
     *
     * @param {RunCursor} cursor - Current cursor position passed down from postman-runtime
     * @param {Object} assertions - The assertion that was made
     *
     * @returns {undefined}
     *
     * @callback RuntimeRunner#onAssertion
     */
  onAssertion(cursor, assertions) {
    let status;

    _.forEach(assertions, assertion => {
      if (assertion.error) {
        console.log(`Assertion ${assertion.name} failed: ${assertion.error.message}`);
      }

      if (assertion.skipped) {
        status = 'skipped';
      } else
      if (assertion.passed) {
        status = 'pass';
      } else
      {
        status = 'fail';
      }

      assertion.status = status;

      this.assertions.push(assertion);
    });
  }

  /**
     * Updates the UI for end of a test script.
     *
     * Also updates the environment from postman-runtime to App if `persist` options is selected.
     *
     * Note: Bound to `test` callback of postman-runtime.
     *
     * @param {?Error} err - Error if any passed down from postman-runtime
     * @param {RunCursor} cursor - current cursor position passed down from postman-runtime
     * @param {Object} testResults - results from test script passed down from postman-runtime
     * @param {SDKItem} item - SDK Item passed down from postman-runtime
     *
     * @returns {undefined}
     *
     * @callback RuntimeRunner#onEndTest
     */
  onEndTest(err, cursor, testResults, item) {
    if (err) {
      console.warn(`Error running tests for ${item.name}: ${err}`);
      pm.toasts.error(`Error executing test scripts for ${item.name}: Check DevTools for more info`);
      this.actions.errorRequest(
      this.runId,
      cursor.iteration,
      {
        id: item.toJSON().id,
        ref: cursor.ref },

      'An error occurred while running tests for this request.');

      return;
    }

    let allTestsPass = true;

    // Try calculating test results only if there were tests
    if (_.isArray(testResults) && _.isArray(this.assertions) && (!_.isEmpty(this.assertions) || !_.isEmpty(testResults))) {
      var { error: errorObj } = _.find(testResults, testResult => testResult.error) || {};
      let scriptError = err || errorObj;
      if (scriptError) {
        console.warn(`Error running tests for ${item.name}: ${scriptError.name}: ${scriptError.message}`);
        this.actions.errorTest(
        this.runId,
        cursor.iteration,
        {
          id: item.toJSON().id,
          ref: cursor.ref });



        // Needs to be removed:  https://postmanlabs.atlassian.net/browse/CLIENTAPP-2256
        pm.console.error('exception', { message: `${item.name}: ${scriptError.name}: ${scriptError.message}` });

        return;
      }

      allTestsPass = _.every(this.assertions, assertion => {
        return assertion.status === 'pass';
      });

      this.actions.endTest(
      this.runId,
      cursor.iteration,
      {
        id: cursor.ref,
        ref: cursor.ref },

      this.assertions);


      this.assertions = [];

      if (this.selection.persist) {
        if (_.isArray(testResults) && !_.isEmpty(testResults)) {
          if (!this.envVars) {
            this.envVars = new __WEBPACK_IMPORTED_MODULE_7_postman_collection___default.a.VariableScope({ mutations: {} });
          }
          if (!this.globalVars) {
            this.globalVars = new __WEBPACK_IMPORTED_MODULE_7_postman_collection___default.a.VariableScope({ mutations: {} });
          }

          _.forEach(testResults, result => {
            Object(__WEBPACK_IMPORTED_MODULE_16__utils_RequestUtil__["a" /* mergeMutations */])(this.envVars.mutations, _.get(result, 'result.environment.mutations'));
            Object(__WEBPACK_IMPORTED_MODULE_16__utils_RequestUtil__["a" /* mergeMutations */])(this.globalVars.mutations, _.get(result, 'result.globals.mutations'));
          });
        }
      }
    }

    // Persist Runner variables if the setting is set
    this.selection.persist && pm.settings.setSetting('persistRunnerVariables', true); // For legacy reasons (VariableProcessor uses this)

    let { saveResponse } = this.selection;
    let responseBody;

    // First, check if the response size is less than 300Kb
    if (this.response.size < MAX_RESPONSE_SIZE) {
      // Then, check saveResponse parameter
      switch (saveResponse) {
        case __WEBPACK_IMPORTED_MODULE_12__constants_RunnerSaveResponseConstants__["a" /* RUNNER_SAVE_ALL_RESPONSES */]:
          // If all, add body
          responseBody = this.response.body;
          break;
        case __WEBPACK_IMPORTED_MODULE_12__constants_RunnerSaveResponseConstants__["b" /* RUNNER_SAVE_FAILED_RESPONSES */]:
          // If failed, check if any test failed, if yes, then add body
          if (allTestsPass) {
            responseBody = 'Response body was not logged';
          } else
          {
            responseBody = this.response.body;
          }
          break;
        case __WEBPACK_IMPORTED_MODULE_12__constants_RunnerSaveResponseConstants__["c" /* RUNNER_SAVE_NO_RESPONSES */]:
          // If none, don't add body
          responseBody = 'Response body was not logged';}

    } else
    {
      responseBody = 'Response body is too large';
    }

    this.actions.addResponseBody(
    this.runId,
    cursor.iteration,
    {
      id: item.toJSON().id,
      ref: cursor.ref },

    { body: responseBody });

  }

  /**
     * Updates the UI for the completion of sending a request.
     *
     * Note: Bound to `request` callback of postman-runtime.
     *
     * @param {?Error} err - Error if any passed down from postman-runtime
     * @param {RunCursor} cursor - current cursor position passed down from postman-runtime
     * @param {SDKResponse} response - SDK response passed down from postman-runtime
     * @param {SDKResponse} request - SDK request passed down from postman-runtime
     * @param {SDKItem} item - SDK Item passed down from postman-runtime
     *
     * @returns {undefined}
     *
     * @callback RuntimeRunner#onEndRequest
     */
  onEndRequest(err, cursor, response, request, item) {
    // in some cases where request did not complete, runtime would not send a response argument
    response = response || new __WEBPACK_IMPORTED_MODULE_7_postman_collection___default.a.Response();

    if (err) {
      console.warn(err);
      this.actions.errorRequest(
      this.runId,
      cursor.iteration,
      {
        id: item.toJSON().id,
        ref: cursor.ref },

      'An error occurred while running this request.');

      pm.toasts.error('There was an error running your collection: ' + (err.message || err.status || err));
      return;
    }

    let responseJSON = response.toJSON(),
    responseBody = response.text();

    let {
      header,
      responseSize,
      responseTime,
      code,
      status } =
    responseJSON;

    this.actions.endRequest(
    this.runId,
    cursor.iteration,
    {
      id: item.id,
      ref: cursor.ref,
      headers: request.getHeaders({ enabled: true }) },

    {
      headers: header,

      // body: responseBody,
      size: responseSize,
      time: responseTime.toString(),
      code: code,
      name: status });



    // For use later in endTest hook. This is to populate body if required. This is because we need info about test results.
    this.response = {
      size: responseSize,
      body: responseSize < MAX_RESPONSE_SIZE ? responseBody : null };

  }

  /**
     * Updates the UI for end of an iteration.
     *
     * Note: Bound to `iteration` callback of postman-runtime
     *
     * @param {?Error} err Error if any passed down from postman-runtime
     * @param {RunCursor} cursor current cursor position passed down from postman-runtime
     *
     * @returns {undefined}
     *
     * @callback RuntimeRunner#onEndIteration
     */
  onEndIteration(err, cursor) {
    if (err) {
      console.warn(err);
      return;
    }
    this.actions.endIteration(
    this.runId,
    cursor.iteration);

  }

  /**
     * Updates UI for completion of a run.
     *
     * Note: Bound to `done` callback of postman-runtime.
     *
     * @param {?Error} err Error if any passed down from postman-runtime
     *
     * @returns {undefined}
     *
     * @callback RuntimeRunner#onEndRun
     */
  async onEndRun(err) {

    if (err) {
      console.warn('Errors were encountered running your collection:', err);
      pm.toasts.error('There was an error running your collection. Check DevTools for more info.');
      return;
    }

    if (this.stopped) {
      this.actions.stopRun(
      this.runId);

    } else
    {
      this.actions.endRun(
      this.runId);

    }

    this.response = undefined;

    // RunnerController will dispose this runner
    this.emit('finish', this.runId);

    if (this.cookieJar) {




    } // todo: we're using a private object here (hence the crazy number of checks),
    // because the API provided by the cookieJar is not good enough. Need to submit a PR
    // to the upstream "request" module to expose this functionality.
    // Persist Runner variables if the setting is set
    if (this.selection.persist) {this.activeEnvSessionId &&
      Object(__WEBPACK_IMPORTED_MODULE_13__modules_services_VariableSessionService__["f" /* updateEntityWithSession */])(this.activeEnvSessionId, this.envVars);

      this.activeGlobalsId &&
      Object(__WEBPACK_IMPORTED_MODULE_13__modules_services_VariableSessionService__["f" /* updateEntityWithSession */])(this.activeGlobalsSessionId, this.globalVars);
    }
  }

  /**
     * Updates the UI for a paused run.
     *
     * Note: Bound to `pause` callback of postman-runtime.
     *
     * @callback RuntimeRunner#onPauseRun
     */
  onPauseRun() {
    !this.stopped && this.actions.pauseRun(this.runId);
  }

  /**
     * Updates the UI for the resume of a run.
     *
     * Note: Bound to `resume` callback of postman-runtime.
     *
     * @callback RuntimeRunner#onResumeRun
     */
  onResumeRun() {
    this.actions.resumeRun(this.runId);
  }

  /**
     * Updates the UI for stop/abort of a run.
     *
     * Note: Bound to `stop` and `abort` callback of postman-runtime.
     *
     * @callback RuntimeRunner#onStopRun
     */
  onStopRun() {
    this.stopped = true;
    this.actions.stopRun(this.runId);
  }

  /**
     * Returns a Backbone representation of this run to be exported.
     *
     * @returns {Backbone.Model} a Backbone.Model from wrapping the run
     *
     * @function RuntimeRunner#ReduxToBackbone
     */
  export() {
    return Object(__WEBPACK_IMPORTED_MODULE_11__reducers_runner_BackboneReduxBridge__["b" /* ReduxToBackbone */])(this.runId, this.run);
  }

  /**
     * Dispose the Run instance from postman-runtime.
     *
     * @function RuntimeRunner#dispose
     */
  dispose() {
    this.runLinkID && __WEBPACK_IMPORTED_MODULE_6__controllers_RuntimeBridge__["a" /* default */].disposeRun(this.runLinkID);
  }

  /**
     * Returns the name of the collection for a given collection id.
     *
     * @param {UUID} id - id of the collection
     *
     * @returns {String} Name of the collection
     *
     * @function RuntimeRunner#getCollectionName
     */
  getCollectionName(id) {
    let collection = this.collection;
    if (!collection) {
      return '';
    }
    return collection.name;
  }

  /**
     * Returns the name of the folder for a given folder id and a collection id.
     *
     * @param {UUID} collId - collection id
     * @param {UUID} folderId - folder id
     *
     * @returns {String} Name of the folder identified by the folder id collection id pair.
     *
     * @function RuntimeRunner#getFolderName
     */
  getFolderName(collId, folderId) {
    let collection = this.collection;
    if (!collection) {
      return '';
    }
    let folder = _.find(collection.folders, collFolder => {
      return collFolder.id === folderId;
    });

    if (!folder) {
      return '';
    }
    return folder.name;
  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3676:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_util__ = __webpack_require__(19);


let _ = __webpack_require__(0);
let { ipcRenderer } = __webpack_require__(20);
let { Item, Request, Response, VariableScope } = __webpack_require__(76);

/**
                                                                                 * Pool of all existing runs
                                                                                 *
                                                                                 * @var {Object} RendererRuntimeBridge~runPool
                                                                                 */
let runPool = {},
authManifestCache = new Map();

/**
                                * A list of callbacks that runtime fires over the lifetime of a collection run
                                *
                                * @type {String[]}
                                *
                                * @see https://github.com/postmanlabs/postman-runtime/blob/develop/README.md
                                */
const runtimeRunCallbacks = [
'start',
'io',
'beforeIteration',
'beforeItem',
'beforePrerequest',
'prerequest',
'beforeRequest',
'request',
'response',
'assertion',
'beforeTest',
'test',
'cookies', // custom callback
'item',
'iteration',
'exception',
'console',
'pause',
'resume',
'error',
'done',
'stop',
'abort'];


/**
           * Disposes a Runtime run object.
           * Also makes sure there are no pending callbacks before removing its instance from `runPool`.
           *
           * @function RendererRuntimeBridge~disposeRun
           *
           * @param {UUID} runId - ID of the run instance
           */
function disposeRun(runId) {
  var runCache = runPool[runId];
  if (!runCache) {
    return;
  }

  if (runCache.pendingCallbacks === 0) {
    ipcRenderer.send('RUNTIME_RUN_DISPOSE', runId);
    delete runPool[runId];
    return;
  }

  setTimeout(disposeRun, 1000, runId);
}

// The collection of callback reducers
// Each reducer takes in serialised params and
// returns an array of deserialized params
let callbackArgumentReducers = {
  start(err, cursor) {
    return [JSON.parse(err), cursor];
  },

  io(err, cursor, trace, response, request, cookies) {
    return [JSON.parse(err), cursor, trace, response && new Response(response), request && new Request(request), cookies];
  },

  exception(cursor, exception) {
    return [cursor, JSON.parse(exception)];
  },

  beforeIteration(err, cursor) {
    return [JSON.parse(err), cursor];
  },

  beforeItem(err, cursor, item) {
    return [JSON.parse(err), cursor, item && new Item(item)];
  },

  beforePrerequest(err, cursor, events, item) {
    return [JSON.parse(err), cursor, JSON.parse(events), item && new Item(item)];
  },

  prerequest(err, cursor, prResults, item) {
    let results = JSON.parse(prResults);
    _.forEach(results, test => {
      test.result.globals = new VariableScope(test.result.globals);
      test.result.environment = new VariableScope(test.result.environment);
    });
    return [JSON.parse(err), cursor, results, item && new Item(item)];
  },

  beforeRequest(err, cursor, request, item, aborter) {
    return [JSON.parse(err), cursor, request && new Request(request), item && new Item(item), aborter];
  },

  request(err, cursor, response, request, item, cookies) {
    return [JSON.parse(err), cursor, response && new Response(response), request && new Request(request), item && new Item(item), cookies];
  },

  response(err, cursor, response, request, item, cookies) {
    return [JSON.parse(err), cursor, response && new Response(response), request && new Request(request), item && new Item(item), cookies];
  },

  assertion(cursor, assertion) {
    return [cursor, JSON.parse(assertion)];
  },

  beforeTest(err, cursor, events, item) {
    return [JSON.parse(err), cursor, JSON.parse(events), item && new Item(item)];
  },

  test(err, cursor, testResults, item) {
    let results = JSON.parse(testResults);
    _.forEach(results, test => {
      test.result.globals = new VariableScope(test.result.globals);
      test.result.environment = new VariableScope(test.result.environment);
    });
    return [JSON.parse(err), cursor, results, item && new Item(item)];
  },

  cookies(err, cookies) {
    return [JSON.parse(err), cookies];
  },

  item(err, cursor, item) {
    return [JSON.parse(err), cursor, item && new Item(item)];
  },

  iteration(err, cursor) {
    return [JSON.parse(err), cursor];
  },

  pause(err, cursor) {
    return [JSON.parse(err), cursor];
  },

  resume(err, cursor) {
    return [JSON.parse(err), cursor];
  },

  done(err, cursor) {
    return [JSON.parse(err), cursor];
  },

  error(err) {
    return [JSON.parse(err)];
  },

  stop(err, ...args) {
    return [JSON.parse(err), ...args];
  },

  abort(err, ...args) {
    return [JSON.parse(err), ...args];
  } };


/**
        * Invokes a callback on the run with arguments safely.
        *
        * @function RendererRuntimeBridge~invokeCallbackSafely
        *
        * @param {UUID} id       - ID of the run
        * @param {String} callback - Name of the callback that will be invoked
        * @param {...*} args          - An array of arguments that need to be sent to the callback
       */
function invokeCallbackSafely(id, callback, ...args) {
  return runPool[id] && runPool[id].callbackMap && _.isFunction(runPool[id].callbackMap[callback]) && runPool[id].callbackMap[callback](...args);
}

/**
   * Adds an IPC listener to a callback
   *
   * @function RendererRuntimeBridge~assignListenersToCallbacks
   *
   * @param {String} callbackName - Name of the callback to attach the listener to
   */
function assignListenersToCallbacks(callbackName) {
  let listenerName = `RUNTIME_CALLBACK_${callbackName.toUpperCase()}`;
  ipcRenderer.on(listenerName, (event, id, ...rawArgs) => {
    // See if this callback has a reducer
    // If it has one apply the params to the reducer and then
    // send them to the callback
    let argumentsReducer = callbackArgumentReducers[callbackName];
    let reducedAguments = _.isFunction(argumentsReducer) ? argumentsReducer(...rawArgs) : rawArgs;

    if (callbackName === 'test') {
      runPool[id] && runPool[id].pendingCallbacks++;
    }

    if (callbackName === 'cookies') {
      runPool[id] && runPool[id].pendingCallbacks--;
    }
    invokeCallbackSafely(id, callbackName, ...reducedAguments);
  });
}

// Adds listeners for each callback.
_.forEach(runtimeRunCallbacks, assignListenersToCallbacks);

/**
                                                             * The bridge on the renderer process
                                                             *
                                                             * @class RendererRuntimeBridge
                                                             *
                                                             * RuntimeBridge is a pipeline through which main process and renderer process
                                                             * send and receive `run` related data.
                                                             *
                                                             * When the app wants to create a run, it asks the RuntimeBridge on
                                                             * renderer process to create one, with the set of options.
                                                             *
                                                             * This RuntimeBridge then sends a signal to its counterpart on the main process
                                                             * passing along the options and a new id.
                                                             *
                                                             * The main process is where postman-runtime instance is created. This instance is
                                                             * stored against the id on the main process for future references.
                                                             * All future communications between the two are based on this id.
                                                             *
                                                             * Each callback on the main process sends a signal with the tracking id
                                                             * and serialized params.
                                                             *
                                                             * The bridge on renderer process deserializes the params and uses the tracking id
                                                             * to pass it on to the caller.
                                                             *
                                                             * In the same way, if the app wants to pause, resume or stop a run it tells the
                                                             * RuntimeBridge, which then converts it to a signal and
                                                             * then sends it to the main process.
                                                             *
                                                             * Now there are only 2 instances of RuntimeBridge talking to each other
                                                             * over a finite set of listeners(one per callback).
                                                             *
                                                             * This approach has advantages over `electron.remote.require()`.
                                                             * The number of inter process communications is reduced to one per callback,
                                                             * where it used to be one per each property access.
                                                             *
                                                             * NOTE: A signal here refers to an IPC call. All IPC calls here are async.
                                                             */let
RendererRuntimeBridge = class RendererRuntimeBridge {
  /**
                                                      * Sends an IPC call out to start a run
                                                      *
                                                      * @function RendererRuntimeBridge#startRun
                                                      *
                                                      * @param {Object} options                   - Options for new Runner
                                                      * @param {Object} runOptions                - Options for runtime's run function
                                                      * @param {Object} runMetaData               - Miscellaneous run related data, certificates etc.
                                                      * @param {Collection~definition} collection - The collection to run
                                                      * @param {Object} runCallbackMap            - Callbacks for each run
                                                      *
                                                      * @returns {Promise} - Fulfills when the run is created
                                                      */
  startRun(options, runOptions, runMetaData, collection, runCallbackMap) {
    const id = __WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].guid();

    let runCreatePromise = new Promise((resolve, reject) => {
      // resolve promise with the id when the success event is received
      ipcRenderer.once(`RUNTIME_RUN_CREATE_${id}`, (event, receivedRunId) => {
        runPool[receivedRunId] = {
          callbackMap: runCallbackMap,
          pendingCallbacks: 0 };

        resolve(receivedRunId);
      });

      // reject promise with error when error event is received
      ipcRenderer.once(`RUNTIME_RUN_CREATE_ERROR_${id}`, (event, error) => {
        reject(JSON.parse(error));
      });
    });

    // send a call event out to the RuntimeBridge on main process
    ipcRenderer.send('RUNTIME_RUN_CREATE', id, options, runOptions, runMetaData, collection.toJSON());

    return runCreatePromise;
  }

  /**
     * Sends a pause call for the run to main process
     *
     * @function RendererRuntimeBridge#pauseRun
     *
     * @param {UUID} id - ID of the run to pause
     */
  pauseRun(id) {
    ipcRenderer.send('RUNTIME_RUN_PAUSE', id);
  }

  /**
     * Sends a resume call for the run to main process
     *
     * @function RendererRuntimeBridge#resumeRun
     *
     * @param {UUID} id - ID of the run to resume
     */
  resumeRun(id) {
    ipcRenderer.send('RUNTIME_RUN_RESUME', id);
  }

  /**
     * Sends a stop call for the run to main process
     *
     * @function RendererRuntimeBridge#stopRun
     *
     * @param {string} id - ID of the run to stop
     */
  stopRun(id) {
    ipcRenderer.send('RUNTIME_RUN_STOP', id);
  }

  /**
     * Sends a call to stop the current in progress request on a run and stop the run
     *
     * @function RendererRuntimeBridge#stopRunRequest
     *
     * @param {UUID} id - The run id with the request to stop
     */
  stopRunRequest(id) {
    ipcRenderer.send('RUNTIME_RUN_STOP_REQUEST', id);
  }

  /**
     * Disposes a run
     *
     * @function RendererRuntimeBridge#disposeRun
     *
     * @param {UUID} id - ID of the run to dispose
     *
     * @see disposeRun
     */
  disposeRun(id) {
    disposeRun(id);
  }

  /**
     * Authorizes a request.
     *
     * @param {Object} request - Postman SDK Request
     * @param {Function} callback - Callback that handles the authorized request.
     */
  authorizeRequest(request, callback) {
    const id = __WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].guid();

    ipcRenderer.once(`RUNTIME_AUTHORIZE_REQUEST_${id}`, (event, err, receivedRequest) => {
      let authorizedRequest;

      if (err) {
        let error;
        try {
          error = JSON.parse(err);
        }
        catch (parseError) {
          error = parseError;
        }
        return callback(error, null);
      }

      try {
        authorizedRequest = JSON.parse(receivedRequest);
      }
      catch (error) {
        return callback(error, null);
      }

      callback(null, new Request(authorizedRequest));
    });

    ipcRenderer.send('RUNTIME_AUTHORIZE_REQUEST', id, JSON.stringify(request.toJSON()));
  }

  /**
     * Fetches the manifest for the given authorization type.
     *
     * @param {String} authType
     * @param {Function} callback
     */
  getAuthHandlerManifest(authType, callback) {
    if (authManifestCache.has(authType)) {
      return callback(null, authManifestCache.get(authType));
    }
    const id = __WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].guid();

    ipcRenderer.once(`RUNTIME_GET_AUTH_HANDLER_${id}`, (event, err, authHandlerManifest) => {
      let authManifest;

      if (err) {
        let error;
        try {
          error = JSON.parse(err);
        }
        catch (parseError) {
          error = parseError;
        }
        return callback(error, null);
      }

      try {
        authManifest = JSON.parse(authHandlerManifest);
      }
      catch (error) {
        return callback(error, null);
      }

      authManifestCache.set(authType, authManifest);

      callback(null, authManifest);
    });

    ipcRenderer.send('RUNTIME_GET_AUTH_HANDLER', id, authType);
  }};


/* harmony default export */ __webpack_exports__["a"] = (new RendererRuntimeBridge());

/***/ }),

/***/ 3677:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return handleModelEventOnStore; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__model_event__ = __webpack_require__(2);

const namespaces = [
'collection',
'folder',
'request',
'environment',
'workspace',
'collectionrun',
'archivedresource',
'favoritedcollections',
'forkedcollection'];

const actions = ['created', 'updated', 'deleted'];
const actionMap = {
  created: 'create',
  updated: 'update',
  deleted: 'delete' };


const runActionMap = {
  created: 'loadRun',
  deleted: 'deleteRun' };


function dataProperty(data, eventName, eventNamespace) {
  let excludeNamespaces = ['environment', 'workspace'];
  if (actionMap[eventName] === 'create' && !_.includes(excludeNamespaces, eventNamespace)) {
    return null;
  } else
  if (actionMap[eventName] === 'delete') {
    return data.id;
  }
  return data;
}

function handleCollectionRun(data, eventName) {
  let params = data;
  if (actionMap[eventName] === 'delete') {
    params = data.id;
  }

  _.isFunction(pm.runner['actions'][runActionMap[eventName]]) &&
  pm.runner['actions'][runActionMap[eventName]](params);
}

/**
   * Handles archived resource events
   *
   * @param {Object} data
   * @param {String} eventName
   */
function handleArchivedResource(data, eventName) {
  // Only need archive collection updates
  if (data.model !== 'collection') {
    return;
  }

  let actionName = `${actionMap[eventName]}ArchivedCollection`,
  action = pm.runner['archivedCollectionActions'][actionName];
  _.isFunction(action) && action(data);
}

/**
   * Handles favorited collection event
   *
   * @param {Object} data
   * @param {String} eventName
   */
function handleFavoritedCollection() {
  pm.runner.repopulateCollections();
}

/**
   * Handle forked collection events
   *
   * @param {Object} data
   * @param {String} eventName
   */
function handleForkedCollection(data, eventName) {
  const actionName = `${actionMap[eventName]}ForkedCollection`,
  action = pm.runner['forkedCollectionActions'][actionName];

  _.isFunction(action) && action(data);
}

/**
   * Handles all the events on the bus and fires
   * actions accordingly for the runner
   *
   * @param {Object} event
   */
function handleModelEventOnStore(event) {
  let eventNamespace = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["g" /* getEventNamespace */])(event);

  if (!_.includes(namespaces, eventNamespace)) {
    return;
  }

  return Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["i" /* processEvent */])(event, actions, function (event, cb) {
    let eventNamespace = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["g" /* getEventNamespace */])(event),
    eventName = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["f" /* getEventName */])(event);

    if (!_.includes(namespaces, eventNamespace)) {
      return cb();
    }

    if (!_.includes(actions, eventName)) {
      return cb();
    }

    if (eventNamespace === 'collectionrun') {
      handleCollectionRun(Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["d" /* getEventData */])(event), eventName);
    } else
    if (eventNamespace === 'archivedresource') {
      handleArchivedResource(Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["d" /* getEventData */])(event), eventName);
    } else
    if (eventNamespace === 'favoritedcollections') {
      handleFavoritedCollection(Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["d" /* getEventData */])(event), eventName);
    } else
    if (eventNamespace === 'forkedcollection') {
      handleForkedCollection(Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["d" /* getEventData */])(event), eventName);
    } else
    {
      let params = dataProperty(Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["d" /* getEventData */])(event), eventName, eventNamespace);
      if (!params) {
        pm.runner.repopulateCollections();
      } else
      {
        let reduxActionName = actionMap[eventName] + _.capitalize(eventNamespace);

        // Only handles the delete Workspace to trigger the event
        // for modal and switching to a new workspace.
        // The deletion from the state is done by RunnerWorkspaceActions.
        if (reduxActionName === 'deleteWorkspace') {
          pm.runner.handleWorkspaceDelete(params);
        }

        _.isFunction(pm.runner[eventNamespace + 'Actions'][reduxActionName]) &&
        pm.runner[eventNamespace + 'Actions'][reduxActionName](params);
      }
    }
    cb();
  });
}


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3678:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 555:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (immutable) */ __webpack_exports__["a"] = initializeConfigurations;
/* unused harmony export initializeServices */
/* unused harmony export subscribeToModelEvents */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_Configuration__ = __webpack_require__(556);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_FeatureFlags__ = __webpack_require__(559);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_model_event__ = __webpack_require__(2);





let servicesMap = [
__WEBPACK_IMPORTED_MODULE_0__services_Configuration__["a" /* default */],
__WEBPACK_IMPORTED_MODULE_1__services_FeatureFlags__["a" /* default */]];


/**
                * Initializes the configuration service
                *
                * @param {Function} cb
                */
function initializeConfigurations(cb) {
  initializeServices().
  then(({ configService, featureFlagService }) => {
    pm.configs = configService;
    pm.features = featureFlagService;
    pm.logger.info('bootConfigurations~initialize - Success');
    cb && cb(null);
  }).
  catch(e => {
    pm.logger.error('bootConfigurations~initialize - Failed', e);
    cb & cb(e);
  });
}

/**
   * Initializes the configuration caches
   */
function initializeServices() {
  return Promise.all(_.map(servicesMap, s => {
    let service = new s();
    subscribeToModelEvents(service, service._getLayerNamespaces());
    return Promise.resolve(service);
  })).
  then(values => {
    return {
      configService: values[0],
      featureFlagService: values[1] };

  });
}

/**
   * Subscribes the caches to the model-events on the event bus
   *
   * @param {*} cache
   * @param {*} namespaces
   */
function subscribeToModelEvents(service, namespaces) {
  pm.eventBus.channel('model-events').subscribe(function (event) {
    Object(__WEBPACK_IMPORTED_MODULE_2__modules_model_event__["i" /* processEvent */])(event, ['updated'], function (event, cb) {
      let eventNamespace = Object(__WEBPACK_IMPORTED_MODULE_2__modules_model_event__["g" /* getEventNamespace */])(event),
      eventName = Object(__WEBPACK_IMPORTED_MODULE_2__modules_model_event__["f" /* getEventName */])(event);

      if (!_.includes(namespaces, eventNamespace)) {
        return cb && cb();
      }

      // Bail out if any other action except updated
      if (eventName !== 'updated') {
        return cb && cb();
      }

      // Invalidate the cache if changes are made
      service.invalidateCache();
      cb && cb();
    });
  });
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 556:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseConfigurationService__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_controllers_UserConfigurationController__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_controllers_DefaultConfigurationController__ = __webpack_require__(557);


let

Configuration = class Configuration extends __WEBPACK_IMPORTED_MODULE_0__BaseConfigurationService__["a" /* default */] {constructor(...args) {var _temp;return _temp = super(...args), this.
    layers = {
      user: {
        controller: __WEBPACK_IMPORTED_MODULE_1__modules_controllers_UserConfigurationController__["a" /* default */],
        namespace: 'userconfigs' },

      app: {
        controller: __WEBPACK_IMPORTED_MODULE_2__modules_controllers_DefaultConfigurationController__["a" /* default */],
        namespace: 'defaultconfigs' } }, this.




    resolutionOrder = ['app', 'user'], _temp;} // The order in which the layers will be resolved
};

/* harmony default export */ __webpack_exports__["a"] = (Configuration);

/***/ }),

/***/ 557:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let defaultConfiguration = __webpack_require__(558);

/* harmony default export */ __webpack_exports__["a"] = ({
  getAll: function () {
    return Promise.resolve(defaultConfiguration);
  } });

/***/ }),

/***/ 558:
/***/ (function(module, exports) {

module.exports = {"editor.requestEditorLayoutName":"layout-1-column","request.autoPersistVariables":true,"user.plansToAllowUpgrade":[],"workspace.visibilityAvailablePlans":[],"editor.openInNew":false,"editor.skipConfirmationBeforeClose":false,"editor.showIcons":true}

/***/ }),

/***/ 559:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseConfigurationService__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_controllers_UserFeatureFlagController__ = __webpack_require__(514);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_controllers_DefaultFeatureFlagController__ = __webpack_require__(560);


let

FeatureFlags = class FeatureFlags extends __WEBPACK_IMPORTED_MODULE_0__BaseConfigurationService__["a" /* default */] {constructor(...args) {var _temp;return _temp = super(...args), this.
    layers = {
      user: {
        controller: __WEBPACK_IMPORTED_MODULE_1__modules_controllers_UserFeatureFlagController__["a" /* default */],
        namespace: 'userfeatureflags' },

      app: {
        controller: __WEBPACK_IMPORTED_MODULE_2__modules_controllers_DefaultFeatureFlagController__["a" /* default */],
        namespace: 'defaultfeatureflags' } }, this.




    resolutionOrder = ['app', 'user'], _temp;} // The order in which the layers will be resolved.

  isEnabled(key) {
    return super.get(key);
  }

  get() {
    return new Error('Feature Flags: Use the isEnabled API to get a flag');
  }};


/* harmony default export */ __webpack_exports__["a"] = (FeatureFlags);

/***/ }),

/***/ 560:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let defaultFeatureFlags = __webpack_require__(561);

/* harmony default export */ __webpack_exports__["a"] = ({
  getAll: function () {
    return Promise.resolve(defaultFeatureFlags);
  } });

/***/ }),

/***/ 561:
/***/ (function(module, exports) {

module.exports = {"graphql":true,"graphqlAutocomplete":true,"inviteByNonAdmin":false}

/***/ }),

/***/ 563:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.connect = exports.Provider = undefined;

var _Provider = __webpack_require__(985);

var _Provider2 = _interopRequireDefault(_Provider);

var _connect = __webpack_require__(986);

var _connect2 = _interopRequireDefault(_connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports.Provider = _Provider2["default"];
exports.connect = _connect2["default"];

/***/ }),

/***/ 564:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _propTypes = __webpack_require__(11);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = _propTypes2["default"].shape({
  subscribe: _propTypes2["default"].func.isRequired,
  dispatch: _propTypes2["default"].func.isRequired,
  getState: _propTypes2["default"].func.isRequired
});

/***/ }),

/***/ 565:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/***/ }),

/***/ 566:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActionTypes; });
/* harmony export (immutable) */ __webpack_exports__["b"] = createStore;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__ = __webpack_require__(567);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_symbol_observable__ = __webpack_require__(904);



/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!Object(__WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__["a" /* default */])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[__WEBPACK_IMPORTED_MODULE_1_symbol_observable__["default"]] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[__WEBPACK_IMPORTED_MODULE_1_symbol_observable__["default"]] = observable, _ref2;
}

/***/ }),

/***/ 567:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__ = __webpack_require__(989);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getPrototype_js__ = __webpack_require__(994);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__ = __webpack_require__(996);




/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__["a" /* default */])(value) || Object(__WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__["a" /* default */])(value) != objectTag) {
    return false;
  }
  var proto = Object(__WEBPACK_IMPORTED_MODULE_1__getPrototype_js__["a" /* default */])(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/* harmony default export */ __webpack_exports__["a"] = (isPlainObject);


/***/ }),

/***/ 568:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root_js__ = __webpack_require__(990);


/** Built-in value references. */
var Symbol = __WEBPACK_IMPORTED_MODULE_0__root_js__["a" /* default */].Symbol;

/* harmony default export */ __webpack_exports__["a"] = (Symbol);


/***/ }),

/***/ 569:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/***/ }),

/***/ 570:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}

/***/ }),

/***/ 581:
/***/ (function(module, exports, __webpack_require__) {

var baseMatches = __webpack_require__(1647),
    baseMatchesProperty = __webpack_require__(1663),
    identity = __webpack_require__(591),
    isArray = __webpack_require__(52),
    property = __webpack_require__(1666);

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;


/***/ }),

/***/ 582:
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(1039),
    baseAssignValue = __webpack_require__(1054);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),

/***/ 583:
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(719);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),

/***/ 584:
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(1053),
    createBaseEach = __webpack_require__(1671);

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;


/***/ }),

/***/ 597:
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ 62:
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ 719:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(116),
    isObjectLike = __webpack_require__(89);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ 721:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var React = __webpack_require__(1);
var factory = __webpack_require__(1631);

if (typeof React === 'undefined') {
  throw Error(
    'create-react-class could not find the React object. If you are using script tags, ' +
      'make sure that React is being loaded before create-react-class.'
  );
}

// Hack to grab NoopUpdateQueue from isomorphic React
var ReactNoopUpdateQueue = new React.Component().updater;

module.exports = factory(
  React.Component,
  React.isValidElement,
  ReactNoopUpdateQueue
);


/***/ }),

/***/ 722:
/***/ (function(module, exports) {

var CONSTANTS = {

  // Positions
  positions: {
    tl: 'tl',
    tr: 'tr',
    tc: 'tc',
    bl: 'bl',
    br: 'br',
    bc: 'bc'
  },

  // Levels
  levels: {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  },

  // Notification defaults
  notification: {
    title: null,
    message: null,
    level: null,
    position: 'tr',
    autoDismiss: 5,
    dismissible: 'both',
    action: null
  }
};


module.exports = CONSTANTS;


/***/ }),

/***/ 723:
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(52),
    isSymbol = __webpack_require__(719);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),

/***/ 724:
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(588),
    stackClear = __webpack_require__(1649),
    stackDelete = __webpack_require__(1650),
    stackGet = __webpack_require__(1651),
    stackHas = __webpack_require__(1652),
    stackSet = __webpack_require__(1653);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ 725:
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(728),
    stubArray = __webpack_require__(1049);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ 726:
/***/ (function(module, exports, __webpack_require__) {

var Uint8Array = __webpack_require__(1046);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),

/***/ 731:
/***/ (function(module, exports) {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),

/***/ 735:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return XPathProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__XPathManager__ = __webpack_require__(602);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_mobx__ = __webpack_require__(6);






/**
                                    * XPathProvider is the root context provider for XPath Components.
                                    *
                                    * XPath component create new xPath by using xPath of its ancestor.
                                    * Also consumers can control when to make an xPath visible by passing boolean value
                                    * to isVisible.
                                    *
                                    * That is why it becomes important to make the xPath context as observable so that any change
                                    * (in xPath or visibility) in an xPath can cause all its descendents to re-register (unregister)
                                    * themselves.
                                    *
                                    *
                                    */let


XPathProvider = class XPathProvider extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props);
    this.xPathManager = Object(__WEBPACK_IMPORTED_MODULE_3_mobx__["p" /* observable */])({
      register: __WEBPACK_IMPORTED_MODULE_2__XPathManager__["a" /* default */].register,
      unregister: __WEBPACK_IMPORTED_MODULE_2__XPathManager__["a" /* default */].unregister,
      path: props.identifier,
      isVisible: this.props.isVisible });

  }

  getChildContext() {
    return { xPathManager: this.xPathManager };
  }

  render() {
    return this.props.children;
  }};


XPathProvider.childContextTypes = { xPathManager: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object };

XPathProvider.propTypes = { identifier: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string };

XPathProvider.defaultProps = {
  isVisible: true };

/***/ }),

/***/ 82:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const RUNNER_SET_COLLECTION = 'RUNNER_SET_COLLECTION';
/* harmony export (immutable) */ __webpack_exports__["J"] = RUNNER_SET_COLLECTION;

const RUNNER_SET_FOLDER = 'RUNNER_SET_FOLDER';
/* harmony export (immutable) */ __webpack_exports__["O"] = RUNNER_SET_FOLDER;

const RUNNER_SET_ENV = 'RUNNER_SET_ENV';
/* harmony export (immutable) */ __webpack_exports__["N"] = RUNNER_SET_ENV;

const RUNNER_SET_ITERATIONS = 'RUNNER_SET_ITERATIONS';
/* harmony export (immutable) */ __webpack_exports__["Q"] = RUNNER_SET_ITERATIONS;

const RUNNER_SET_DELAY = 'RUNNER_SET_DELAY';
/* harmony export (immutable) */ __webpack_exports__["M"] = RUNNER_SET_DELAY;

const RUNNER_SET_DATA_FILE = 'RUNNER_SET_DATA_FILE';
/* harmony export (immutable) */ __webpack_exports__["K"] = RUNNER_SET_DATA_FILE;

const RUNNER_REMOVE_DATA_FILE = 'RUNNER_REMOVE_DATA_FILE';
/* harmony export (immutable) */ __webpack_exports__["H"] = RUNNER_REMOVE_DATA_FILE;

const RUNNER_SET_DATA_FILE_TYPE = 'RUNNER_SET_DATA_FILE_TYPE';
/* harmony export (immutable) */ __webpack_exports__["L"] = RUNNER_SET_DATA_FILE_TYPE;

const RUNNER_SET_PERSIST_VARS = 'RUNNER_SET_PERSIST_VARS';
/* harmony export (immutable) */ __webpack_exports__["R"] = RUNNER_SET_PERSIST_VARS;

const RUNNER_SET_INITIAL_COOKIES = 'RUNNER_SET_INITIAL_COOKIES';
/* harmony export (immutable) */ __webpack_exports__["P"] = RUNNER_SET_INITIAL_COOKIES;

const RUNNER_SET_SAVE_COOKIES_AFTER_RUN = 'RUNNER_SET_SAVE_COOKIES_AFTER_RUN';
/* harmony export (immutable) */ __webpack_exports__["T"] = RUNNER_SET_SAVE_COOKIES_AFTER_RUN;

const RUNNER_SET_SAVE_RESPONSES = 'RUNNER_SET_SAVE_RESPONSES';
/* harmony export (immutable) */ __webpack_exports__["U"] = RUNNER_SET_SAVE_RESPONSES;

const RUNNER_SET_WORKSPACE = 'RUNNER_SET_WORKSPACE';
/* harmony export (immutable) */ __webpack_exports__["V"] = RUNNER_SET_WORKSPACE;

const RUNNER_SET_REQUEST_SELECTION = 'RUNNER_SET_REQUEST_SELECTION';
/* harmony export (immutable) */ __webpack_exports__["S"] = RUNNER_SET_REQUEST_SELECTION;


const RUNNER_START_RUN = 'RUNNER_START_RUN';
/* harmony export (immutable) */ __webpack_exports__["Y"] = RUNNER_START_RUN;

const RUNNER_START_REQUEST = 'RUNNER_START_REQUEST';
/* harmony export (immutable) */ __webpack_exports__["X"] = RUNNER_START_REQUEST;

const RUNNER_START_ITERATION = 'RUNNER_START_ITERATION';
/* harmony export (immutable) */ __webpack_exports__["W"] = RUNNER_START_ITERATION;

const RUNNER_START_TEST = 'RUNNER_START_TEST';
/* harmony export (immutable) */ __webpack_exports__["Z"] = RUNNER_START_TEST;


const RUNNER_PAUSE_RUN = 'RUNNER_PAUSE_RUN';
/* harmony export (immutable) */ __webpack_exports__["G"] = RUNNER_PAUSE_RUN;

const RUNNER_RESUME_RUN = 'RUNNER_RESUME_RUN';
/* harmony export (immutable) */ __webpack_exports__["I"] = RUNNER_RESUME_RUN;

const RUNNER_STOP_RUN = 'RUNNER_STOP_RUN';
/* harmony export (immutable) */ __webpack_exports__["_1"] = RUNNER_STOP_RUN;

const RUNNER_STOPPING_RUN = 'RUNNER_STOPPING_RUN';
/* harmony export (immutable) */ __webpack_exports__["_0"] = RUNNER_STOPPING_RUN;


const RUNNER_ERROR_RUN = 'RUNNER_ERROR_RUN';
/* harmony export (immutable) */ __webpack_exports__["u"] = RUNNER_ERROR_RUN;

const RUNNER_ERROR_REQUEST = 'RUNNER_ERROR_REQUEST';
/* harmony export (immutable) */ __webpack_exports__["t"] = RUNNER_ERROR_REQUEST;

const RUNNER_ERROR_TEST = 'RUNNER_ERROR_TEST';
/* harmony export (immutable) */ __webpack_exports__["v"] = RUNNER_ERROR_TEST;


const RUNNER_END_TESTS = 'RUNNER_END_TESTS';
/* harmony export (immutable) */ __webpack_exports__["s"] = RUNNER_END_TESTS;

const RUNNER_END_ITERATION = 'RUNNER_END_ITERATION';
/* harmony export (immutable) */ __webpack_exports__["p"] = RUNNER_END_ITERATION;

const RUNNER_END_REQUEST = 'RUNNER_END_REQUEST';
/* harmony export (immutable) */ __webpack_exports__["q"] = RUNNER_END_REQUEST;

const RUNNER_END_RUN = 'RUNNER_END_RUN';
/* harmony export (immutable) */ __webpack_exports__["r"] = RUNNER_END_RUN;


const RUNNER_ADD_RESPONSE_BODY = 'RUNNER_ADD_RESPONSE_BODY';
/* harmony export (immutable) */ __webpack_exports__["a"] = RUNNER_ADD_RESPONSE_BODY;


const RUNNER_DELETE_RUN = 'RUNNER_DELETE_RUN';
/* harmony export (immutable) */ __webpack_exports__["n"] = RUNNER_DELETE_RUN;

const RUNNER_DELETE_ALL_RUNS = 'RUNNER_DELETE_ALL_RUNS';
/* harmony export (immutable) */ __webpack_exports__["h"] = RUNNER_DELETE_ALL_RUNS;

const RUNNER_LOAD_RUNS = 'RUNNER_LOAD_RUNS';
/* harmony export (immutable) */ __webpack_exports__["D"] = RUNNER_LOAD_RUNS;

const RUNNER_IMPORT_RUN = 'RUNNER_IMPORT_RUN';
/* harmony export (immutable) */ __webpack_exports__["w"] = RUNNER_IMPORT_RUN;

const RUNNER_CLEAN_RUN = 'RUNNER_CLEAN_RUN';
/* harmony export (immutable) */ __webpack_exports__["b"] = RUNNER_CLEAN_RUN;


const RUNNER_NOOP = 'RUNNER_NOOP';
/* harmony export (immutable) */ __webpack_exports__["F"] = RUNNER_NOOP;


const RUNNER_LOAD_WORKSPACE = 'RUNNER_LOAD_WORKSPACE';
/* harmony export (immutable) */ __webpack_exports__["E"] = RUNNER_LOAD_WORKSPACE;

const RUNNER_SWITCH_WORKSPACE = 'RUNNER_SWITCH_WORKSPACE';
/* harmony export (immutable) */ __webpack_exports__["_2"] = RUNNER_SWITCH_WORKSPACE;

const RUNNER_CREATE_WORKSPACE = 'RUNNER_CREATE_WORKSPACE';
/* harmony export (immutable) */ __webpack_exports__["g"] = RUNNER_CREATE_WORKSPACE;

const RUNNER_UPDATE_WORKSPACE = 'RUNNER_UPDATE_WORKSPACE';
/* harmony export (immutable) */ __webpack_exports__["_6"] = RUNNER_UPDATE_WORKSPACE;

const RUNNER_DELETE_WORKSPACE = 'RUNNER_DELETE_WORKSPACE';
/* harmony export (immutable) */ __webpack_exports__["o"] = RUNNER_DELETE_WORKSPACE;


const RUNNER_LOAD_COLLECTIONS = 'RUNNER_LOAD_COLLECTIONS';
/* harmony export (immutable) */ __webpack_exports__["y"] = RUNNER_LOAD_COLLECTIONS;

const RUNNER_CREATE_COLLECTION = 'RUNNER_CREATE_COLLECTION';
/* harmony export (immutable) */ __webpack_exports__["d"] = RUNNER_CREATE_COLLECTION;

const RUNNER_UPDATE_COLLECTION = 'RUNNER_UPDATE_COLLECTION';
/* harmony export (immutable) */ __webpack_exports__["_3"] = RUNNER_UPDATE_COLLECTION;

const RUNNER_DELETE_COLLECTION = 'RUNNER_DELETE_COLLECTION';
/* harmony export (immutable) */ __webpack_exports__["j"] = RUNNER_DELETE_COLLECTION;


const RUNNER_LOAD_FORKED_COLLECTIONS = 'RUNNER_LOAD_FORKED_COLLECTIONS';
/* harmony export (immutable) */ __webpack_exports__["B"] = RUNNER_LOAD_FORKED_COLLECTIONS;

const RUNNER_CREATE_FORKED_COLLECTION = 'RUNNER_CREATE_FORKED_COLLECTION';
/* harmony export (immutable) */ __webpack_exports__["f"] = RUNNER_CREATE_FORKED_COLLECTION;


const RUNNER_LOAD_ARCHIVED_COLLECTIONS = 'RUNNER_LOAD_ARCHIVED_COLLECTIONS';
/* harmony export (immutable) */ __webpack_exports__["x"] = RUNNER_LOAD_ARCHIVED_COLLECTIONS;

const RUNNER_CREATE_ARCHIVED_COLLECTION = 'RUNNER_CREATE_ARCHIVED_COLLECTION';
/* harmony export (immutable) */ __webpack_exports__["c"] = RUNNER_CREATE_ARCHIVED_COLLECTION;

const RUNNER_DELETE_ARCHIVED_COLLECTION = 'RUNNER_DELETE_ARCHIVED_COLLECTION';
/* harmony export (immutable) */ __webpack_exports__["i"] = RUNNER_DELETE_ARCHIVED_COLLECTION;


const RUNNER_LOAD_FOLDERS = 'RUNNER_LOAD_FOLDERS';
/* harmony export (immutable) */ __webpack_exports__["A"] = RUNNER_LOAD_FOLDERS;

const RUNNER_DELETE_FOLDER = 'RUNNER_DELETE_FOLDER';
/* harmony export (immutable) */ __webpack_exports__["l"] = RUNNER_DELETE_FOLDER;


const RUNNER_LOAD_ENVIRONMENTS = 'RUNNER_LOAD_ENVIRONMENTS';
/* harmony export (immutable) */ __webpack_exports__["z"] = RUNNER_LOAD_ENVIRONMENTS;

const RUNNER_CREATE_ENVIRONMENT = 'RUNNER_CREATE_ENVIRONMENT';
/* harmony export (immutable) */ __webpack_exports__["e"] = RUNNER_CREATE_ENVIRONMENT;

const RUNNER_UPDATE_ENVIRONMENT = 'RUNNER_UPDATE_ENVIRONMENT';
/* harmony export (immutable) */ __webpack_exports__["_4"] = RUNNER_UPDATE_ENVIRONMENT;

const RUNNER_DELETE_ENVIRONMENT = 'RUNNER_DELETE_ENVIRONMENT';
/* harmony export (immutable) */ __webpack_exports__["k"] = RUNNER_DELETE_ENVIRONMENT;


const RUNNER_LOAD_REQUESTS = 'RUNNER_LOAD_REQUESTS';
/* harmony export (immutable) */ __webpack_exports__["C"] = RUNNER_LOAD_REQUESTS;

const RUNNER_CREATE_REQUEST = 'RUNNER_CREATE_REQUEST';
/* unused harmony export RUNNER_CREATE_REQUEST */

const RUNNER_UPDATE_REQUEST = 'RUNNER_UPDATE_REQUEST';
/* harmony export (immutable) */ __webpack_exports__["_5"] = RUNNER_UPDATE_REQUEST;

const RUNNER_DELETE_REQUEST = 'RUNNER_DELETE_REQUEST';
/* harmony export (immutable) */ __webpack_exports__["m"] = RUNNER_DELETE_REQUEST;


const RUNNER_USER_LOGIN = 'RUNNER_USER_LOGIN';
/* harmony export (immutable) */ __webpack_exports__["_7"] = RUNNER_USER_LOGIN;

const RUNNER_USER_LOGOUT = 'RUNNER_USER_LOGOUT';
/* harmony export (immutable) */ __webpack_exports__["_8"] = RUNNER_USER_LOGOUT;


/***/ }),

/***/ 931:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PmConsole; });
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};const sendLogToConsole = function (label, message, type, data) {
  /**
                                                                                                                                                                                                                                                                                                                        * Tells the listener to sanitize and dispatch a console message event.
                                                                                                                                                                                                                                                                                                                        * The actual console message is triggered by `onConsoleMessage` event.
                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                        * @event Mediator#consoleMessage
                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                        * @param {Object} message console message
                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                        * @see Mediator#onConsoleMessage
                                                                                                                                                                                                                                                                                                                        */
  pm.mediator.trigger('consoleMessage', {
    label: label,
    message: message,
    children: {
      type: type,
      data: data } });


};let

PmConsole = class PmConsole {
  constructor() {
    ['debug', 'error', 'info', 'log', 'warn'].forEach(level => {
      this[level] = function (...args) {
        try {
          console.log(...args.slice(2));
        }
        catch (e) {
          // nothing
        }
        if (_.isError(args[0])) {
          sendLogToConsole(level, args[0].message, 'LOG', null);
        } else
        if (args[0] === 'exception') {
          sendLogToConsole(level, args[1] && args[1].message || 'Error', 'LOG', null);
        } else
        {
          const isMultiArg = args.slice(3).length;
          sendLogToConsole(level, args.slice(2)[0], 'LOG', isMultiArg ? args.slice(3) : null);
        }
      };
    });
  }

  trace(args) {

  } // not supported on postman yet

  /**
   * Used to display network log on the console.
   * @param  {String} ref  [Current id of the cursor in the runner]
   * @param  {Object} data [Object with properties => request and response]
   */
  net(ref, data) {
    if (!ref || !data || data && !data.request) {
      pm.logger.error('PmConsole: missing parameters');
      return;
    }
    data.ref = ref;
    sendLogToConsole(data.request.method, data.request.url, 'NET', data);
  }

  netErr(ref, errMsg, data = {}) {
    if (!ref || !errMsg) {
      pm.logger.error('PmConsole: missing parameters');
      return;
    }
    sendLogToConsole('error', null, 'NET', _extends({
      ref: ref,
      err: { message: errMsg } },
    data));

  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 932:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ToastManager; });
let ToastManager = class ToastManager {
  constructor() {
    this.notificationQueue = [];
    this.isPaused = false;
  }

  isVisible() {
    var notifs = !document.getElementsByClassName('notification'),
    tooltips = !document.getElementsByClassName('tooltip'),
    fullscreenModals = !document.getElementsByClassName('modal-fullscreen');

    return !(notifs && tooltips && fullscreenModals);
  }

  enqueue(callback, priority) {
    this.notificationQueue.push({
      callback: callback,
      priority: priority });


    this.process();
  }

  dequeue() {
    var minPriority = _.min(_.map(this.notificationQueue, 'priority'));
    var toRunIndex = _.findKey(this.notificationQueue, function (element) {
      return element.priority === minPriority;
    });
    return this.notificationQueue.splice(toRunIndex, 1)[0];
  }

  process() {
    if (this.isVisible() || this.isPaused) {
      setTimeout(() => {
        this.process();
      }, 1000); // Try again after 1 second
    } else
    {
      this.isPaused = true;
      this.dequeue().callback();

      setTimeout(() => {
        this.isPaused = false;
      }, 2000); // Separation between notifications
    }
  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 933:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__postman_sanitise_user_content__ = __webpack_require__(798);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__postman_sanitise_user_content___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__postman_sanitise_user_content__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_DashboardService__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_uuid_v4__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_uuid_v4___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_uuid_v4__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_messaging_Toast__ = __webpack_require__(934);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__external_navigation_ExternalNavigationService__ = __webpack_require__(70);







const eventBusChannel = null;
/* harmony export (immutable) */ __webpack_exports__["eventBusChannel"] = eventBusChannel;


const getEventBus = function () {
  if (!this.eventBusChannel) this.eventBusChannel = pm.eventBus.channel('notifications');
  return this.eventBusChannel;
};
/* harmony export (immutable) */ __webpack_exports__["getEventBus"] = getEventBus;


const setNotificationComponent = function (ref) {
  this._ref = ref;
  this.attachLinkListeners();

  // Listen for notifications from windows with no UI
  if (_.get(pm, 'windowConfig.ui')) {
    this.getEventBus().subscribe(options => {
      this._show(options);
    });
  }
};
/* harmony export (immutable) */ __webpack_exports__["setNotificationComponent"] = setNotificationComponent;


const attachLinkListeners = function () {
  if (!this._ref) {
    return;
  }

  let notificationWrapper = Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["findDOMNode"])(this._ref);
  if (!notificationWrapper) {
    return;
  }

  notificationWrapper.addEventListener('click', e => {
    let classList = e.target.classList,
    allowClicks = ['toast-dismiss', 'toast-primary-action', 'toast-secondary-action'];

    if (_.isEmpty(_.intersection(classList, allowClicks))) {
      // This check is there if the target is SVG (close icon)
      // and its parent is 'toast-dismiss'
      const maxParentNodeLookupCount = 4;
      let currentTarget = e.target,
      targetClass = currentTarget.className,
      notificationClass = 'notifications-wrapper',
      lookUpCount = 0;

      while (targetClass && targetClass !== notificationClass) {
        if (lookUpCount > maxParentNodeLookupCount) {
          break;
        }

        // Do not prevent if the icon is a child node of toast-dismiss
        if (targetClass === 'toast-dismiss') {
          return;
        }

        currentTarget = _.get(currentTarget, 'parentNode', null);
        targetClass = _.get(currentTarget, 'className', null);
        lookUpCount++;
      }

      e.preventDefault();
      e.stopPropagation();
    }

    if (e.target.tagName !== 'A') {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    let link = e.target.href;
    if (link) {
      Object(__WEBPACK_IMPORTED_MODULE_6__external_navigation_ExternalNavigationService__["a" /* openExternalLink */])(link);
    } else
    {
      try {
        let slug = e.target.dataset.slug;
        if (slug === 'invite_users') {
          Object(__WEBPACK_IMPORTED_MODULE_3__services_DashboardService__["n" /* openInviteUsers */])();
        }
      }
      catch (e) {
        pm.logger.error(e);
      }
    }
  });
};
/* harmony export (immutable) */ __webpack_exports__["attachLinkListeners"] = attachLinkListeners;


const getRef = function () {
  return this._ref;
};
/* harmony export (immutable) */ __webpack_exports__["getRef"] = getRef;


const _getBaseOptions = function (persist, timeout) {
  return {
    position: 'tr',
    dismissible: true,
    autoDismiss: persist ? 0 : timeout };

};
/* harmony export (immutable) */ __webpack_exports__["_getBaseOptions"] = _getBaseOptions;


/**
    * Returns level for type for the react notification system
    *
    * @param {*} type
    */
function getLevelForType(type) {
  let map = {
    success: 'success',
    error: 'error',
    warn: 'warning',
    info: 'info' };

  return map[type];
}

const _show = function (options) {
  if (!this._ref) {
    _.get(pm, 'windowConfig.ui') ? pm.logger.error('Notification System not initialized') : this.getEventBus().publish(options);
    return;
  }

  let {
    type = 'info',
    message,
    dedupeId,
    primaryAction = null,
    secondaryAction = null,
    persist = false,
    timeout = 3000,
    title = null,
    primaryButtonLabel = '',
    secondaryButtonLabel = '',
    enableActions = null,
    noIcon = false,
    isDismissable = true,
    onDismiss = null,
    onView = _.noop,

    // HACK: quick fix for 100K. cleanup.
    skipSanitise = false } =
  options;

  // react notification system takes seconds timeout
  timeout /= 1000;
  let notificationId = __WEBPACK_IMPORTED_MODULE_4_uuid_v4___default()(),
  notification = _.extend(
  this._getBaseOptions(persist, timeout), {
    uid: notificationId,
    level: getLevelForType(type),
    children:
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__components_messaging_Toast__["a" /* default */], {
      isDismissable: isDismissable,
      noIcon: noIcon,
      uid: notificationId,
      dismiss: this._ref.removeNotification,
      type: type,
      title: title || null,
      message: message,
      primaryAction: primaryAction,
      secondaryAction: secondaryAction,
      onDismiss: onDismiss,
      onView: onView }) });





  if (dedupeId) {
    notification = _.extend(notification, { uid: `${getLevelForType(type)}-${dedupeId}` });
  }

  this._ref.addNotification(notification);
};
/* harmony export (immutable) */ __webpack_exports__["_show"] = _show;


const error = function (message, options) {
  message || (message = 'Something went wrong. Please try again.');
  options || (options = {});

  this._show(
  _.extend(options, {
    type: 'error',
    message: message }));


};
/* harmony export (immutable) */ __webpack_exports__["error"] = error;


const info = function (message, options) {
  if (!message) {
    return;
  }

  options || (options = {});

  this._show(
  _.extend(options, {
    type: 'info',
    message: message }));


};
/* harmony export (immutable) */ __webpack_exports__["info"] = info;


const success = function (message, options) {
  if (!message) {
    return;
  }

  options || (options = {});

  this._show(
  _.extend(options, {
    type: 'success',
    message: message }));


};
/* harmony export (immutable) */ __webpack_exports__["success"] = success;


const warn = function (message, options) {
  if (!message) {
    return;
  }

  options || (options = {});

  this._show(
  _.extend(options, {
    type: 'warn',
    message: message }));


};
/* harmony export (immutable) */ __webpack_exports__["warn"] = warn;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 934:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Toast; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_Buttons__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Icons_InformationIcon__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_Icons_CloseIcon__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__base_Markdown__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_UIEventService__ = __webpack_require__(99);







let

Toast = class Toast extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor() {
    super();

    this.handlePrimaryAction = this.handlePrimaryAction.bind(this);
    this.handleSecondaryAction = this.handleSecondaryAction.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    this.props.onView && this.props.onView();
    this.unsubscribeHandler = this.props.dismissEvent && __WEBPACK_IMPORTED_MODULE_7__services_UIEventService__["a" /* default */].subscribe(this.props.dismissEvent, this.dismissToast);
  }

  componentWillUnmount() {
    this.unsubscribeHandler && this.unsubscribeHandler();
  }

  handlePrimaryAction() {
    if (this.props.primaryAction && this.props.primaryAction.onClick) {
      this.props.primaryAction.onClick();
    }
    this.props.dismiss(this.props.uid);
  }

  handleSecondaryAction() {
    if (this.props.secondaryAction && this.props.secondaryAction.onClick) {
      this.props.secondaryAction.onClick();
    }
    this.props.dismiss(this.props.uid);
  }

  dismissToast() {
    // The notification system provides a handler
    // to remove the toast
    this.props.dismiss(this.props.uid);
    this.props.onDismiss && this.props.onDismiss(this.props.uid);
  }

  getTypeClass() {
    let typeClass = this.props.type ? `toast-${this.props.type}` : 'toast-info';
    return __WEBPACK_IMPORTED_MODULE_3_classnames___default()({
      'toast': true,
      [typeClass]: true });

  }

  getActions() {
    const { primaryAction = null, secondaryAction = null } = this.props;

    if (primaryAction || secondaryAction) {
      return (
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'toast-actions' },

          primaryAction &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__base_Buttons__["a" /* Button */], {
              className: 'toast-primary-action',
              type: 'primary',
              size: 'small',
              disabled: primaryAction.disabled,
              onClick: this.handlePrimaryAction },

            primaryAction.label),



          secondaryAction &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__base_Buttons__["a" /* Button */], {
              className: __WEBPACK_IMPORTED_MODULE_3_classnames___default()({ 'toast-secondary-action': true, 'toast-secondary-action-only': !primaryAction }),
              type: 'text',
              disabled: secondaryAction.disabled,
              onClick: this.handleSecondaryAction },

            secondaryAction.label)));




    }
  }

  getContentClasses() {
    return __WEBPACK_IMPORTED_MODULE_3_classnames___default()({
      'toast-content': true,
      'toast-content-shrink': this.props.isDismissable });

  }

  render() {
    const {
      title,
      message,
      onMessageLinkClick,
      disabled,
      isDismissable,
      noIcon } =
    this.props;

    return (
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getTypeClass() },

        !noIcon &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__base_Icons_InformationIcon__["a" /* default */], { className: 'toast-icon' }),

        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: this.getContentClasses() },

          title &&
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'toast-title' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__base_Markdown__["a" /* default */], {
              source: title,
              onLinkClick: onMessageLinkClick })),



          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'toast-body' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__base_Markdown__["a" /* default */], {
              source: message,
              onLinkClick: onMessageLinkClick })),


          this.getActions()),


        isDismissable &&
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            className: 'toast-dismiss',
            onClick: this.dismissToast },

          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__base_Icons_CloseIcon__["a" /* default */], {
            className: 'toast-close',
            size: 'xs' }))));





  }};


Toast.defaultProps = {
  type: 'info',
  message: '',
  disabled: false,
  isDismissable: true,
  noIcon: false,
  onMessageLinkClick: null };


Toast.propTypes = {
  type: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.oneOf(['error', 'success', 'warn', 'info']),
  message: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.string,
  isDismissable: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.bool,
  noIcon: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.bool,
  dismiss: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.func.isRequired,
  onMessageLinkClick: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.func };

/***/ }),

/***/ 935:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* unused harmony export findSession */
/* unused harmony export clearOrphanSessions */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return bootSession; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_controllers_WindowController__ = __webpack_require__(174);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_controllers_WindowController___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_controllers_WindowController__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_controllers_WorkspaceSessionController__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_controllers_WorkspaceController__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_uuid_v4__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_uuid_v4___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_uuid_v4__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_model_event__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_default_workspace__ = __webpack_require__(172);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__electron_ElectronService__ = __webpack_require__(199);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};







let getDefaultSession = window => {
  return Object(__WEBPACK_IMPORTED_MODULE_5__utils_default_workspace__["c" /* defaultUserWorkspaceId */])().
  then(defaultWorkspaceId => {
    if (!defaultWorkspaceId) {
      return Promise.reject(new Error('Could not find default workspace while booting session'));
    }

    return __WEBPACK_IMPORTED_MODULE_2__modules_controllers_WorkspaceController__["a" /* default */].get({ id: defaultWorkspaceId });
  }).
  then(defaultWorkspace => {
    if (!defaultWorkspace) {
      return Promise.reject(new Error('Could not find default workspace while booting session'));
    }

    return defaultWorkspace;
  }).
  then(defaultWorkspace => {
    return __WEBPACK_IMPORTED_MODULE_1__modules_controllers_WorkspaceSessionController__["a" /* default */].
    create({
      id: __WEBPACK_IMPORTED_MODULE_3_uuid_v4___default()(),
      window: window.id,
      workspace: defaultWorkspace.id,
      state: {} }).

    then(sessionCreatedEvent => {
      return Object(__WEBPACK_IMPORTED_MODULE_4__modules_model_event__["d" /* getEventData */])(sessionCreatedEvent);
    });
  });
};

let findSession = (window, options) => {
  return Promise.resolve()

  // First, check if this window is supposed to be opened with a workspace (New window with workspace pre-selected)
  .then(() => {
    // If this window is not being opened with a pre-selected workspace, move on
    if (!options.session || !options.session.workspace) {
      return;
    }

    // If this window is supposed to be opened with a workspace, just create the session
    // with that workspace and move on
    return __WEBPACK_IMPORTED_MODULE_1__modules_controllers_WorkspaceSessionController__["a" /* default */].
    getSessionFor(window.id, options.session.workspace).
    then(session => {
      // If the window is not supposed to have pre-selected state, move on
      if (!options.session.state) {
        return session;
      }

      // Otherwise, update the session's state with whatever is supplied
      return __WEBPACK_IMPORTED_MODULE_1__modules_controllers_WorkspaceSessionController__["a" /* default */].
      update({
        id: session.id,
        state: _extends({},
        session.state,
        options.session.state) }).


      then(sessionUpdatedEvent => {
        return Object(__WEBPACK_IMPORTED_MODULE_4__modules_model_event__["d" /* getEventData */])(sessionUpdatedEvent);
      });
    });
  })

  // First, check if this window is supposed to be opened with a defined session (restore flow)
  .then(session => {
    // If we've already found a session, move on
    if (session) {
      return session;
    }

    // If this window is not being restored, move on
    if (!options.session || !window.activeSession) {
      return;
    }

    return __WEBPACK_IMPORTED_MODULE_1__modules_controllers_WorkspaceSessionController__["a" /* default */].
    get({ id: window.activeSession }).
    then(session => {
      if (!session || session.window !== window.id) {
        return;
      }

      return session;
    });
  })

  // If the window's activeSession exists, continue, or else try finding another suitable session
  .then(session => {
    if (session) {
      return session;
    }

    // Active session on this window does not exist, trying to find some other session on this window
    return __WEBPACK_IMPORTED_MODULE_1__modules_controllers_WorkspaceSessionController__["a" /* default */].
    getAll({ window: pm.window.id }).
    then(allSessions => {
      if (allSessions && allSessions[0]) {
        return allSessions[0];
      }

      // There are no sessions on this window, creating one
      return getDefaultSession(window);
    });
  })

  // Verify if the session being restored points to a valid workspace.
  .then(session => {
    return __WEBPACK_IMPORTED_MODULE_2__modules_controllers_WorkspaceController__["a" /* default */].
    get({ id: session.workspace }).
    then(workspace => {
      // If the workspace being pointed to does not exist, delete this session and restart the session boot
      if (workspace) {
        return session;
      }

      return getDefaultSession(window);
    });
  });
};

let clearOrphanSessions = (activeWindowId, { activeSessionId }) => {
  // Find all sessions, if for a session, the window / workspace does not exist, delete the session
  return __WEBPACK_IMPORTED_MODULE_1__modules_controllers_WorkspaceSessionController__["a" /* default */].
  getAll().
  then(allSessions => {
    // First, take the currently active session out of the picture.
    // Don't want to ever delete that
    _.remove(allSessions, session => session.id === activeSessionId);
    return allSessions;
  }).
  then(allSessions => {
    // Remove all sessions with an invalid window ID
    return Promise.all(
    _.map(allSessions, session => {
      return __WEBPACK_IMPORTED_MODULE_0__common_controllers_WindowController___default.a.get({ id: session.window }).
      then(window => {
        if (window) {
          return session;
        }

        return __WEBPACK_IMPORTED_MODULE_1__modules_controllers_WorkspaceSessionController__["a" /* default */].delete({ id: session.id }).
        then(sessionDeletedEvent => {
          return;
        }).
        catch(e => {
          pm.logger.error(`Failed to clear orphan sessions on window ${session.window}`, e);
          return session;
        });
      });
    }));

  }).
  then(sessions => {
    // Clean the result, remove all undefined values from the previous loop
    return _.compact(sessions);
  }).
  then(allSessions => {
    // Now, remove all sessions on the currentWindow, with an invalid workspace
    return Promise.all(
    _.map(allSessions, session => {
      return __WEBPACK_IMPORTED_MODULE_2__modules_controllers_WorkspaceController__["a" /* default */].get({ id: session.workspace }).
      then(workspace => {
        if (session.window === activeWindowId && !workspace) {
          return __WEBPACK_IMPORTED_MODULE_1__modules_controllers_WorkspaceSessionController__["a" /* default */].delete({ id: session.id }).
          catch(e => {
            pm.logger.error(`Failed to clear orphan sessions with workspace ${session.workspace}`, e);
          });
        }
      });
    }));

  });
};

// IMPORTANT: DO NOT REORDER PROMISES HERE
// 1. Getting launch params from window
// 2. Get / create a window
// 3. Find a suitable session (find / create). Session create should always be after window create, otherwise this might be pruned
// 4. Update the new window with the new session's ID
// 5. Complete the boot process
// 6. Start pruning orphan sessions
let bootSession = cb => {
  return Object(__WEBPACK_IMPORTED_MODULE_6__electron_ElectronService__["d" /* getLaunchParams */])()

  // First, initialize the WindowController
  .then(windowParams => {
    return __WEBPACK_IMPORTED_MODULE_0__common_controllers_WindowController___default.a.bootstrap(...windowParams);
  })

  // Find the window being restored / opened
  .then(windowParams => {
    let window = windowParams[0],
    options = windowParams[1];

    return __WEBPACK_IMPORTED_MODULE_0__common_controllers_WindowController___default.a.
    getCurrentWindow().
    then(currentWindow => {
      if (currentWindow) {
        return currentWindow;
      }

      // Worst case scenario
      return Promise.reject(new Error('Window to open does not exist ' + pm.window.id));
    })

    // Try to find the session that the window opened wants to open
    .then(() => findSession(...windowParams))

    // Update the Window table to indicate the new session is the active session
    .then(session => {
      return __WEBPACK_IMPORTED_MODULE_0__common_controllers_WindowController___default.a.update({
        id: window.id,
        activeSession: session.id });

    })

    // Complete the boot process
    .then(() => {
      pm.logger.info('Session~boot - Success');
      cb && cb(null);
    }).

    catch(e => {
      pm.logger.error('Session~boot - Failed', e);
      cb && cb(e);
    })

    // Prune any sessions that are invalid
    .then(() => clearOrphanSessions()).
    catch(() => {});
  });
};


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 937:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_sync_SyncManagerProxy__ = __webpack_require__(938);


/**
                                                                    *
                                                                    */
function bootSyncProxy(cb) {
  _.assign(window.pm, { syncManager: new __WEBPACK_IMPORTED_MODULE_0__models_sync_SyncManagerProxy__["a" /* default */]() });
  pm.logger.info('SyncProxy~boot - Success');
  cb && cb(null);
}

/* harmony default export */ __webpack_exports__["a"] = (bootSyncProxy);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 938:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_backbone__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_backbone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_backbone__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_model_event__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stores_get_store__ = __webpack_require__(5);




/**
                                                    * Handles the socket, and is the interface for sending and receiving changesets
                                                    *
                                                    * @class SyncManager
                                                    */
var SyncManagerProxy = __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.Model.extend({
  defaults: function () {
    return {
      loggedIn: false,
      nextReconnectTime: null,
      timeTillReconnect: null };

  },

  sendEventToSyncShared: function (event) {
    this.syncInternalChannel.publish(event);
  },

  attachInternalChannelSubscription: function () {
    this.syncManagerInternalDispose = this.syncInternalChannel.subscribe(event => {
      let eventNamespace = Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["g" /* getEventNamespace */])(event),
      eventName = Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["f" /* getEventName */])(event),
      eventData = Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["d" /* getEventData */])(event);

      if (eventNamespace === 'timeTillReconnect' && eventName === 'updated') {
        this.set('timeTillReconnect', eventData.timeTillReconnect);
        return;
      }

      if (eventNamespace === 'loggedIn' && eventName === 'updated') {
        this.set('loggedIn', eventData.loggedIn);
        return;
      }

      if (eventNamespace === 'conflicts' && eventName === 'show') {
        this.showConflicts(eventData.conflicts);
        return;
      }

      if (eventNamespace === 'issue' && eventName === 'show') {
        this.showSyncIssue(eventData.issue);
        return;
      }
    });
  },

  initialize: function () {
    this.syncInternalChannel = pm.eventBus.channel('sync-manager-internal');
    this.attachInternalChannelSubscription();
  },

  showConflicts: function (conflicts) {
    this.trigger('showConflicts', conflicts);
  },

  showSyncIssue: function (issue) {
    pm.mediator.trigger('showSyncIssue', issue);
  },

  syncIconClick: function () {
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["a" /* createEvent */])('syncIconClicked', 'command'));
  },

  restoreCollection: function (restoreTarget, cb) {
    let isSocketConnected = Object(__WEBPACK_IMPORTED_MODULE_2__stores_get_store__["getStore"])('SyncStatusStore').isSocketConnected;
    if (!isSocketConnected) {
      pm.toasts.error('You need to be connected to Postman Sync to restore a collection.');
      _.isFunction(cb) && cb(new Error('No sync connection to restore collection'));
      return;
    }
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["a" /* createEvent */])('restoreCollection', 'command', { restoreTarget: restoreTarget }));
    cb();
  },

  conflictsResolved: function (resolution) {
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["a" /* createEvent */])('conflictsResolved', 'command', { resolution: resolution }));
  },

  forceSync: function () {
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["a" /* createEvent */])('forceSync', 'command'));
  },

  forceSyncCollectionAndContinue: function (id) {
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["a" /* createEvent */])('forceSyncCollectionAndContinue', 'command', { collection: id }));
  },

  forceConnect: function () {
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["a" /* createEvent */])('forceConnect', 'command'));
  },

  fetchPendingConflicts: function () {
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["a" /* createEvent */])('fetchPendingConflicts', 'command'));
  } });


/* harmony default export */ __webpack_exports__["a"] = (SyncManagerProxy);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 940:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProxyListManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_postman_collection__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_postman_collection___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_postman_collection__);
let

ProxyListManager = class ProxyListManager {
  constructor() {
    var globalProxies = this.getFromDB();
    _.isEmpty(globalProxies) && (globalProxies = [{ disabled: true }]);

    this.globalProxies = new __WEBPACK_IMPORTED_MODULE_0_postman_collection__["ProxyConfigList"]({}, globalProxies);
  }

  toJSON() {
    return { globalProxies: this.globalProxies.toJSON() };
  }};


_.assign(ProxyListManager.prototype, /** @lends ProxyListManager.prototype */{
  saveToDB: function () {
    pm.settings.setSetting('ProxyListManager', this.toJSON());
  },

  getFromDB: function () {
    var globalProxies = _.get(pm.settings.getSetting('ProxyListManager'), 'globalProxies');

    // postman-collection v3.4.3 added support port match in `UrlMatchPattern`
    // which broke the Proxy Configuration match pattern i.e, `://*/*` which matches
    // all host and path but fail if a custom port is defined in the request URL.
    // discovered in: https://github.com/postmanlabs/postman-app-support/issues/6364
    //
    // postman-collection v3.4.8 fixed this issue by updating the default proxy
    // match pattern to `://*:*/*`.
    //
    // But, existing apps which already have a proxy configured stored the SDK
    // ProxyConfig object directly into the local storage with the default
    // match pattern as `://*/*`.
    // To fix this, we traverse the globalProxies configuration and update
    // the proxy match pattern to the new default i.e, `://*:*/*`
    // Doing so, older data gets migrated to this new default value.
    //
    // @todo To avoid this, we should only store the user data into the database
    // and not the SDK ProxyConfig object with the defaults etc.
    Array.isArray(globalProxies) && globalProxies.forEach(proxyConfig => {
      let pattern = _.get(proxyConfig, 'match.pattern'),
      PREV_MATCH_PATTERN = '://*/*',
      NEW_MATCH_PATTERN = '://*:*/*';

      // bail out if pattern is not defined, this also means proxy is not configured.
      if (typeof pattern !== 'string') {
        return;
      }

      // pattern can be either `http://*/*` or `https://*/*` or `http+https://*/*`
      // updated match pattern is not done already
      if (pattern.endsWith(PREV_MATCH_PATTERN)) {
        proxyConfig.match.pattern = pattern.replace(PREV_MATCH_PATTERN, NEW_MATCH_PATTERN);
      }
    });

    return globalProxies;
  },

  update: function (options) {
    _.has(options, 'globalProxies') && (this.globalProxies = options.globalProxies);
  } });
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 941:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_backbone__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_backbone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_backbone__);

const Certificate = __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.Model.extend({
  defaults: function () {
    return {
      host: '',
      pemPath: '',
      keyPath: '',
      pfxPath: '',
      passphrase: null,
      _pemData: null,
      _keyData: null };

  },

  resolve: function (cb) {
    if (this.get('_pemData') && this.get('_keyData')) {
      _.isFunction(cb) && cb();
      return;
    }

    const fs = __webpack_require__(24);
    fs.readFile(this.get('pemPath'), (err, _pemData) => {
      fs.readFile(this.get('keyPath'), (err, _keyData) => {
        fs.readFile(this.get('pfxPath'), (err, _pfxData) => {
          this.set({
            '_pemData': _pemData,
            '_keyData': _keyData,
            '_pfxData': _pfxData },
          { silent: true });

          _.isFunction(cb) && cb();
        });
      });
    });
  },

  toJSON: function () {
    return {
      host: this.get('host'),
      pemPath: this.get('pemPath'),
      keyPath: this.get('keyPath'),
      pfxPath: this.get('pfxPath'),
      passphrase: this.get('passphrase') };

  } });



const CertificateManager = __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.Collection.extend({
  model: Certificate,

  initialize: function () {
    this.loadCertificates();
    this.getCertificateContents = this.getCertificateContents.bind(this);
  },

  loadCertificates: function () {
    let serialisedStore = pm.settings.getSetting('clientCertificates'),
    certificateStore = {};

    try {
      certificateStore = JSON.parse(serialisedStore);
      let certificates = _.get(certificateStore, 'certificates', []);
      let sanitizedCertificates = _.map(certificates, certificate => {
        let sanitizedHost = certificate.host.
        replace(/.*?:\/\//g, '') // strip protocol
        .replace(/\?.*/, '') // strip query
        .replace(/\/.*/, '') // strip path
        .replace(/^\./, ''); // strip leading period

        return _.assign({}, certificate, { host: sanitizedHost });
      });
      this.add(sanitizedCertificates);
    }
    catch (e) {
      pm.logger.error('Error loading certificates', e);
    }
  },

  saveCertificates: function () {
    let certificateStore = { certificates: this.toJSON() };

    try {
      let serialisedStore = JSON.stringify(certificateStore);
      pm.settings.setSetting('clientCertificates', serialisedStore);
    }
    catch (e) {
      pm.logger.error('Error saving certificates', e);
    }
  },

  findCertificateByDomain: function (host) {
    return _.find(this.models, certificateModel => {
      return host === certificateModel.get('host');
    });
  },

  getCertificateContents: function (host, cb) {
    if (!host) {
      cb(new Error('Only supported in Electron'));
    }

    let certificate = this.findCertificateByDomain(host);

    if (!certificate) {
      cb(new Error('No Certificate found for host:' + host));
      return;
    }

    certificate.resolve(err => {
      if (err) {
        _.isFunction(cb) && cb(err);
        return;
      }

      _.isFunction(cb) && cb(null, {
        host: host,
        pem: certificate.get('_pemData'),
        key: certificate.get('_keyData'),
        pfx: certificate.get('_pfxData'),
        passphrase: certificate.get('passphrase'),
        pemPath: certificate.get('pemPath'),
        keyPath: certificate.get('keyPath'),
        pfxPath: certificate.get('pfxPath') });

    });
  },

  addCertificate(host, pemPath, keyPath, pfxPath, passphrase) {
    if (!host) {
      pm.logger.error('Error adding certificate', arguments);
      return;
    }

    let certificate = this.findCertificateByDomain(host);

    if (certificate) {
      this.updateCertificate(host, pemPath, keyPath, pfxPath, passphrase);
    } else
    {
      this.add({
        host: host,
        pemPath: pemPath,
        keyPath: keyPath,
        pfxPath: pfxPath,
        passphrase: passphrase });

    }

    this.saveCertificates();
    return true;
  },

  updateCertificate(host, pemPath, keyPath, pfxPath, passphrase) {
    let certificate = this.findCertificateByDomain(host);

    if (!certificate) {
      return false;
    }

    certificate.set({
      pemPath: pemPath,
      keyPath: keyPath,
      pfxPath: pfxPath,
      passphrase: passphrase });


    certificate.resolve();
    this.saveCertificates();

    return true;
  },

  removeCertificate(host) {
    let certificate = this.findCertificateByDomain(host);

    if (!certificate) {
      return false;
    }

    this.remove(certificate);

    this.saveCertificates();

    return true;
  } });


/* harmony default export */ __webpack_exports__["a"] = (CertificateManager);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 984:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (immutable) */ __webpack_exports__["a"] = mergeMutations;
/**
 * Imports mutations from source to destination
 * @param {Object} destination
 * @param {Object} source
 */
function mergeMutations(destination, source = {}) {
  _.forEach(source.compacted, mutation => {
    destination.addMutation(mutation);
  });
  _.forEach(source.stream, mutation => {
    destination.addMutation(mutation);
  });
  return destination;
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 985:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = undefined;

var _react = __webpack_require__(1);

var _propTypes = __webpack_require__(11);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _storeShape = __webpack_require__(564);

var _storeShape2 = _interopRequireDefault(_storeShape);

var _warning = __webpack_require__(565);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var didWarnAboutReceivingStore = false;
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return;
  }
  didWarnAboutReceivingStore = true;

  (0, _warning2["default"])('<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/reactjs/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
}

var Provider = function (_Component) {
  _inherits(Provider, _Component);

  Provider.prototype.getChildContext = function getChildContext() {
    return { store: this.store };
  };

  function Provider(props, context) {
    _classCallCheck(this, Provider);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.store = props.store;
    return _this;
  }

  Provider.prototype.render = function render() {
    return _react.Children.only(this.props.children);
  };

  return Provider;
}(_react.Component);

exports["default"] = Provider;


if (false) {
  Provider.prototype.componentWillReceiveProps = function (nextProps) {
    var store = this.store;
    var nextStore = nextProps.store;


    if (store !== nextStore) {
      warnAboutReceivingStore();
    }
  };
}

Provider.propTypes = {
  store: _storeShape2["default"].isRequired,
  children: _propTypes2["default"].element.isRequired
};
Provider.childContextTypes = {
  store: _storeShape2["default"].isRequired
};

/***/ }),

/***/ 986:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports["default"] = connect;

var _react = __webpack_require__(1);

var _storeShape = __webpack_require__(564);

var _storeShape2 = _interopRequireDefault(_storeShape);

var _shallowEqual = __webpack_require__(987);

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _wrapActionCreators = __webpack_require__(988);

var _wrapActionCreators2 = _interopRequireDefault(_wrapActionCreators);

var _warning = __webpack_require__(565);

var _warning2 = _interopRequireDefault(_warning);

var _isPlainObject = __webpack_require__(227);

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _hoistNonReactStatics = __webpack_require__(380);

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _invariant = __webpack_require__(118);

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultMapStateToProps = function defaultMapStateToProps(state) {
  return {};
}; // eslint-disable-line no-unused-vars
var defaultMapDispatchToProps = function defaultMapDispatchToProps(dispatch) {
  return { dispatch: dispatch };
};
var defaultMergeProps = function defaultMergeProps(stateProps, dispatchProps, parentProps) {
  return _extends({}, parentProps, stateProps, dispatchProps);
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

var errorObject = { value: null };
function tryCatch(fn, ctx) {
  try {
    return fn.apply(ctx);
  } catch (e) {
    errorObject.value = e;
    return errorObject;
  }
}

// Helps track hot reloading.
var nextVersion = 0;

function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var shouldSubscribe = Boolean(mapStateToProps);
  var mapState = mapStateToProps || defaultMapStateToProps;

  var mapDispatch = void 0;
  if (typeof mapDispatchToProps === 'function') {
    mapDispatch = mapDispatchToProps;
  } else if (!mapDispatchToProps) {
    mapDispatch = defaultMapDispatchToProps;
  } else {
    mapDispatch = (0, _wrapActionCreators2["default"])(mapDispatchToProps);
  }

  var finalMergeProps = mergeProps || defaultMergeProps;
  var _options$pure = options.pure,
      pure = _options$pure === undefined ? true : _options$pure,
      _options$withRef = options.withRef,
      withRef = _options$withRef === undefined ? false : _options$withRef;

  var checkMergedEquals = pure && finalMergeProps !== defaultMergeProps;

  // Helps track hot reloading.
  var version = nextVersion++;

  return function wrapWithConnect(WrappedComponent) {
    var connectDisplayName = 'Connect(' + getDisplayName(WrappedComponent) + ')';

    function checkStateShape(props, methodName) {
      if (!(0, _isPlainObject2["default"])(props)) {
        (0, _warning2["default"])(methodName + '() in ' + connectDisplayName + ' must return a plain object. ' + ('Instead received ' + props + '.'));
      }
    }

    function computeMergedProps(stateProps, dispatchProps, parentProps) {
      var mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps);
      if (false) {
        checkStateShape(mergedProps, 'mergeProps');
      }
      return mergedProps;
    }

    var Connect = function (_Component) {
      _inherits(Connect, _Component);

      Connect.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
        return !pure || this.haveOwnPropsChanged || this.hasStoreStateChanged;
      };

      function Connect(props, context) {
        _classCallCheck(this, Connect);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.version = version;
        _this.store = props.store || context.store;

        (0, _invariant2["default"])(_this.store, 'Could not find "store" in either the context or ' + ('props of "' + connectDisplayName + '". ') + 'Either wrap the root component in a <Provider>, ' + ('or explicitly pass "store" as a prop to "' + connectDisplayName + '".'));

        var storeState = _this.store.getState();
        _this.state = { storeState: storeState };
        _this.clearCache();
        return _this;
      }

      Connect.prototype.computeStateProps = function computeStateProps(store, props) {
        if (!this.finalMapStateToProps) {
          return this.configureFinalMapState(store, props);
        }

        var state = store.getState();
        var stateProps = this.doStatePropsDependOnOwnProps ? this.finalMapStateToProps(state, props) : this.finalMapStateToProps(state);

        if (false) {
          checkStateShape(stateProps, 'mapStateToProps');
        }
        return stateProps;
      };

      Connect.prototype.configureFinalMapState = function configureFinalMapState(store, props) {
        var mappedState = mapState(store.getState(), props);
        var isFactory = typeof mappedState === 'function';

        this.finalMapStateToProps = isFactory ? mappedState : mapState;
        this.doStatePropsDependOnOwnProps = this.finalMapStateToProps.length !== 1;

        if (isFactory) {
          return this.computeStateProps(store, props);
        }

        if (false) {
          checkStateShape(mappedState, 'mapStateToProps');
        }
        return mappedState;
      };

      Connect.prototype.computeDispatchProps = function computeDispatchProps(store, props) {
        if (!this.finalMapDispatchToProps) {
          return this.configureFinalMapDispatch(store, props);
        }

        var dispatch = store.dispatch;

        var dispatchProps = this.doDispatchPropsDependOnOwnProps ? this.finalMapDispatchToProps(dispatch, props) : this.finalMapDispatchToProps(dispatch);

        if (false) {
          checkStateShape(dispatchProps, 'mapDispatchToProps');
        }
        return dispatchProps;
      };

      Connect.prototype.configureFinalMapDispatch = function configureFinalMapDispatch(store, props) {
        var mappedDispatch = mapDispatch(store.dispatch, props);
        var isFactory = typeof mappedDispatch === 'function';

        this.finalMapDispatchToProps = isFactory ? mappedDispatch : mapDispatch;
        this.doDispatchPropsDependOnOwnProps = this.finalMapDispatchToProps.length !== 1;

        if (isFactory) {
          return this.computeDispatchProps(store, props);
        }

        if (false) {
          checkStateShape(mappedDispatch, 'mapDispatchToProps');
        }
        return mappedDispatch;
      };

      Connect.prototype.updateStatePropsIfNeeded = function updateStatePropsIfNeeded() {
        var nextStateProps = this.computeStateProps(this.store, this.props);
        if (this.stateProps && (0, _shallowEqual2["default"])(nextStateProps, this.stateProps)) {
          return false;
        }

        this.stateProps = nextStateProps;
        return true;
      };

      Connect.prototype.updateDispatchPropsIfNeeded = function updateDispatchPropsIfNeeded() {
        var nextDispatchProps = this.computeDispatchProps(this.store, this.props);
        if (this.dispatchProps && (0, _shallowEqual2["default"])(nextDispatchProps, this.dispatchProps)) {
          return false;
        }

        this.dispatchProps = nextDispatchProps;
        return true;
      };

      Connect.prototype.updateMergedPropsIfNeeded = function updateMergedPropsIfNeeded() {
        var nextMergedProps = computeMergedProps(this.stateProps, this.dispatchProps, this.props);
        if (this.mergedProps && checkMergedEquals && (0, _shallowEqual2["default"])(nextMergedProps, this.mergedProps)) {
          return false;
        }

        this.mergedProps = nextMergedProps;
        return true;
      };

      Connect.prototype.isSubscribed = function isSubscribed() {
        return typeof this.unsubscribe === 'function';
      };

      Connect.prototype.trySubscribe = function trySubscribe() {
        if (shouldSubscribe && !this.unsubscribe) {
          this.unsubscribe = this.store.subscribe(this.handleChange.bind(this));
          this.handleChange();
        }
      };

      Connect.prototype.tryUnsubscribe = function tryUnsubscribe() {
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
      };

      Connect.prototype.componentDidMount = function componentDidMount() {
        this.trySubscribe();
      };

      Connect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (!pure || !(0, _shallowEqual2["default"])(nextProps, this.props)) {
          this.haveOwnPropsChanged = true;
        }
      };

      Connect.prototype.componentWillUnmount = function componentWillUnmount() {
        this.tryUnsubscribe();
        this.clearCache();
      };

      Connect.prototype.clearCache = function clearCache() {
        this.dispatchProps = null;
        this.stateProps = null;
        this.mergedProps = null;
        this.haveOwnPropsChanged = true;
        this.hasStoreStateChanged = true;
        this.haveStatePropsBeenPrecalculated = false;
        this.statePropsPrecalculationError = null;
        this.renderedElement = null;
        this.finalMapDispatchToProps = null;
        this.finalMapStateToProps = null;
      };

      Connect.prototype.handleChange = function handleChange() {
        if (!this.unsubscribe) {
          return;
        }

        var storeState = this.store.getState();
        var prevStoreState = this.state.storeState;
        if (pure && prevStoreState === storeState) {
          return;
        }

        if (pure && !this.doStatePropsDependOnOwnProps) {
          var haveStatePropsChanged = tryCatch(this.updateStatePropsIfNeeded, this);
          if (!haveStatePropsChanged) {
            return;
          }
          if (haveStatePropsChanged === errorObject) {
            this.statePropsPrecalculationError = errorObject.value;
          }
          this.haveStatePropsBeenPrecalculated = true;
        }

        this.hasStoreStateChanged = true;
        this.setState({ storeState: storeState });
      };

      Connect.prototype.getWrappedInstance = function getWrappedInstance() {
        (0, _invariant2["default"])(withRef, 'To access the wrapped instance, you need to specify ' + '{ withRef: true } as the fourth argument of the connect() call.');

        return this.refs.wrappedInstance;
      };

      Connect.prototype.render = function render() {
        var haveOwnPropsChanged = this.haveOwnPropsChanged,
            hasStoreStateChanged = this.hasStoreStateChanged,
            haveStatePropsBeenPrecalculated = this.haveStatePropsBeenPrecalculated,
            statePropsPrecalculationError = this.statePropsPrecalculationError,
            renderedElement = this.renderedElement;


        this.haveOwnPropsChanged = false;
        this.hasStoreStateChanged = false;
        this.haveStatePropsBeenPrecalculated = false;
        this.statePropsPrecalculationError = null;

        if (statePropsPrecalculationError) {
          throw statePropsPrecalculationError;
        }

        var shouldUpdateStateProps = true;
        var shouldUpdateDispatchProps = true;
        if (pure && renderedElement) {
          shouldUpdateStateProps = hasStoreStateChanged || haveOwnPropsChanged && this.doStatePropsDependOnOwnProps;
          shouldUpdateDispatchProps = haveOwnPropsChanged && this.doDispatchPropsDependOnOwnProps;
        }

        var haveStatePropsChanged = false;
        var haveDispatchPropsChanged = false;
        if (haveStatePropsBeenPrecalculated) {
          haveStatePropsChanged = true;
        } else if (shouldUpdateStateProps) {
          haveStatePropsChanged = this.updateStatePropsIfNeeded();
        }
        if (shouldUpdateDispatchProps) {
          haveDispatchPropsChanged = this.updateDispatchPropsIfNeeded();
        }

        var haveMergedPropsChanged = true;
        if (haveStatePropsChanged || haveDispatchPropsChanged || haveOwnPropsChanged) {
          haveMergedPropsChanged = this.updateMergedPropsIfNeeded();
        } else {
          haveMergedPropsChanged = false;
        }

        if (!haveMergedPropsChanged && renderedElement) {
          return renderedElement;
        }

        if (withRef) {
          this.renderedElement = (0, _react.createElement)(WrappedComponent, _extends({}, this.mergedProps, {
            ref: 'wrappedInstance'
          }));
        } else {
          this.renderedElement = (0, _react.createElement)(WrappedComponent, this.mergedProps);
        }

        return this.renderedElement;
      };

      return Connect;
    }(_react.Component);

    Connect.displayName = connectDisplayName;
    Connect.WrappedComponent = WrappedComponent;
    Connect.contextTypes = {
      store: _storeShape2["default"]
    };
    Connect.propTypes = {
      store: _storeShape2["default"]
    };

    if (false) {
      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
        if (this.version === version) {
          return;
        }

        // We are hot reloading!
        this.version = version;
        this.trySubscribe();
        this.clearCache();
      };
    }

    return (0, _hoistNonReactStatics2["default"])(Connect, WrappedComponent);
  };
}

/***/ }),

/***/ 987:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = shallowEqual;
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var hasOwn = Object.prototype.hasOwnProperty;
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

/***/ }),

/***/ 988:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = wrapActionCreators;

var _redux = __webpack_require__(208);

function wrapActionCreators(actionCreators) {
  return function (dispatch) {
    return (0, _redux.bindActionCreators)(actionCreators, dispatch);
  };
}

/***/ }),

/***/ 989:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(568);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getRawTag_js__ = __webpack_require__(992);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__objectToString_js__ = __webpack_require__(993);




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? Object(__WEBPACK_IMPORTED_MODULE_1__getRawTag_js__["a" /* default */])(value)
    : Object(__WEBPACK_IMPORTED_MODULE_2__objectToString_js__["a" /* default */])(value);
}

/* harmony default export */ __webpack_exports__["a"] = (baseGetTag);


/***/ }),

/***/ 990:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__ = __webpack_require__(991);


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__["a" /* default */] || freeSelf || Function('return this')();

/* harmony default export */ __webpack_exports__["a"] = (root);


/***/ }),

/***/ 991:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ __webpack_exports__["a"] = (freeGlobal);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),

/***/ 992:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(568);


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ __webpack_exports__["a"] = (getRawTag);


/***/ }),

/***/ 993:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ __webpack_exports__["a"] = (objectToString);


/***/ }),

/***/ 994:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__overArg_js__ = __webpack_require__(995);


/** Built-in value references. */
var getPrototype = Object(__WEBPACK_IMPORTED_MODULE_0__overArg_js__["a" /* default */])(Object.getPrototypeOf, Object);

/* harmony default export */ __webpack_exports__["a"] = (getPrototype);


/***/ }),

/***/ 995:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* harmony default export */ __webpack_exports__["a"] = (overArg);


/***/ }),

/***/ 996:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ __webpack_exports__["a"] = (isObjectLike);


/***/ }),

/***/ 997:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = combineReducers;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(566);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__ = __webpack_require__(567);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_warning__ = __webpack_require__(569);




function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!Object(__WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__["a" /* default */])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (false) {
      if (typeof reducers[key] === 'undefined') {
        warning('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var unexpectedKeyCache = void 0;
  if (false) {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (false) {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        warning(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}

/***/ }),

/***/ 998:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/***/ }),

/***/ 999:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = applyMiddleware;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compose__ = __webpack_require__(570);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = __WEBPACK_IMPORTED_MODULE_0__compose__["a" /* default */].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/***/ })

},[3595]);