from django.conf import settings
from django.core.files import File
from django.core.management import BaseCommand

from apps.achievement.models import Achievement

icons_dir = f"{settings.BASE_DIR}/apps/achievement/icons"


class Command(BaseCommand):
    help = "Create achievement fixtures."

    def handle(self, *args, **options):
        if not Achievement.objects.filter(slug="first_steps").exists():
            with open(f"{icons_dir}/first_steps.png", "rb") as f:
                first_steps_icon = File(f, name="first_steps.png")
                Achievement.objects.get_or_create(
                    name="Первые шаги",
                    description="Отправьте свое первое решение на задачу!",
                    slug="first_steps",
                    icon=first_steps_icon,
                )

        if not Achievement.objects.filter(slug="welcome").exists():
            with open(f"{icons_dir}/welcome.png", "rb") as f:
                welcome_icon = File(f, name="welcome.png")
                Achievement.objects.get_or_create(
                    name="Добро пожаловать!",
                    description="Зарегистрируйтесь на платформе",
                    slug="welcome",
                    icon=welcome_icon,
                )

        if not Achievement.objects.filter(slug="start_competition").exists():
            with open(f"{icons_dir}/start_competition.png", "rb") as f:
                start_competition = File(f, name="start_competition.png")
                Achievement.objects.get_or_create(
                    name="Да начнётся битва!",
                    description="Начните соревнование",
                    slug="start_competition",
                    icon=start_competition,
                )
