"""mywebsite03 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from . import views
from  django.conf.urls import include #分支路由的专门模块

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^show_image$', views.show_image_view),
    url(r"music/",include("music.urls")),
    url(r"index/",include("index.urls")),
    url(r"news/",include("news.urls")),
    url(r"sport/",include("sport.urls")),
]
