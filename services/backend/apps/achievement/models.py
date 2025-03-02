from django.db import models

from apps.core.models import BaseModel

class Achievement(BaseModel):
    class AchievementType(models.TextChoices):
        CORRECT_TASKS = "correct_tasks", "Выполненные задания"

    def image_url_upload_to(instance, filename):
        return f"achievements/{instance.id}/icon/{filename}"

    name = models.CharField(max_length=30, verbose_name="название",
                            unique=True)
    description = models.TextField(verbose_name="описание")
    icon = models.FileField(
        verbose_name="иконка достижения",
        upload_to=image_url_upload_to,
    )

    slug = models.SlugField(
        verbose_name="слаг", unique=True
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "ачивка"
        verbose_name_plural = "ачивки"
