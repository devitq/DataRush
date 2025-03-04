from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = "apps.user"
    label = "user"
    verbose_name = "контестанты"

    def ready(self):
        pass
