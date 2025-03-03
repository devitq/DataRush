from django.apps import AppConfig


class CompetitionsConfig(AppConfig):
    name = "apps.competition"
    label = "competition"
    verbose_name = "Соревнование"

    def ready(self):
        import apps.competition.signals
