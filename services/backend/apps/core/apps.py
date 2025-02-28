import contextlib

from django.apps import AppConfig
from django.core.cache import cache


class CoreConfig(AppConfig):
    name = "apps.core"
    label = "core"
