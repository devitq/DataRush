from django.db import models

from apps.core.models import BaseModel


class CompetitionType(models.TextChoices):
    SOLO = "solo"


class CompetitionParticipationType(models.TextChoices):
    EDU = "edu"
    COMPETITIVE = "competitive"


class Competition(BaseModel):
    title = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(verbose_name="Описание")
    image_url = models.FileField(
        verbose_name="Изображение соревнования", null=True, blank=True
    )
    end_date = models.DateTimeField(
        verbose_name="Дедлайн участия", null=True, blank=True
    )
    start_date = models.DateTimeField(
        verbose_name="Дедлайн участия", null=True, blank=True
    )
    type = models.CharField(
        max_length=10,
        choices=CompetitionType.choices,
        verbose_name="Тип участия",
    )
    participation_type = models.CharField(
        max_length=11,
        choices=CompetitionParticipationType.choices,
        verbose_name="Тип соревнования",
    )

    class Meta:
        verbose_name = "соревнование"
        verbose_name_plural = "соревнования"
