"""URL configuration for project_name."""

from django.conf import settings
from django.contrib import admin
from django.urls import include, path

from config import handlers

admin.site.site_title = "project_name"
admin.site.site_header = "project_name"
admin.site.index_title = "project_name"


urlpatterns = [
    # Admin urls
    path("admin/", admin.site.urls),
    # API urls
    path("", include("api.urls")),
]


if settings.DEBUG and settings.DEBUG_TOOLBAR_ENABLED:
    from debug_toolbar.toolbar import debug_toolbar_urls

    urlpatterns += debug_toolbar_urls()


handler400 = handlers.handler400

handler403 = handlers.handler403

handler404 = handlers.handler404

handler500 = handlers.handler500
