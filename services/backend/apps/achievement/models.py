from django.db import models

from apps.core.models import BaseModel

class Achievement(BaseModel):
    class AchievementType(models.TextChoices):
        CORRECT_TASKS = "correct_tasks", "Выполненные задания"

    def image_url_upload_to(instance, filename):
        return f"/achievements/{instance.id}/icon"

    name = models.CharField(max_length=30, verbose_name="название",
                            unique=True)
    description = models.TextField(verbose_name="описание")
    icon = models.FileField(
        verbose_name="иконка достижения",
        upload_to=image_url_upload_to,
    )

    type = models.CharField(
        max_length=20,
        choices=AchievementType.choices,
        verbose_name="тип",
        help_text="За какой тип достижений будет выдаваться ачивка",
        default=AchievementType.CORRECT_TASKS,
    )
    need_count = models.IntegerField(
        verbose_name="кол-во того, что нужно для получения ачивки",
        help_text="Здесь нужно указать количество действий, необходимое для получения ачивок. Например, если вы указали в предыдущем пункте \"Выполненные задания\" а тут 5, то ачивка будет выдаваться за 5 решенных заданий",
        default=5
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "ачивка"
        verbose_name_plural = "ачивки"
