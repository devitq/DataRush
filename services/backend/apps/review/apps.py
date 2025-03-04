from django.apps import AppConfig


class CoreConfig(AppConfig):
    name = "apps.review"
    label = "review"
    verbose_name = "Проверка"

    def ready(self):
        import apps.review.signals
