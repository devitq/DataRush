from datetime import datetime

from django.db import models

from apps.core.models import BaseModel
from apps.user.models import User


class Competition(BaseModel):
    class CompetitionType(models.TextChoices):
        SOLO = "solo", "Индивидуальный"

    class CompetitionParticipationType(models.TextChoices):
        EDU = "edu", "Образовательный"
        COMPETITIVE = "competitive", "Соревновательный"

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
    participants = models.ManyToManyField(User, related_name="participants", blank=True,
                                          editable=False)

    def __str__(self):
        return self.title



    class Meta:
        verbose_name = "соревнование"
        verbose_name_plural = "соревнования"


class State(BaseModel):
    class StateChoices(models.TextChoices):
        NOT_STARTED = "not_started"
        STARTED = "started"
        FINISHED = "finished"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    state = models.CharField(choices=StateChoices.choices, max_length=11)
    changed_at = models.DateTimeField(default=datetime.now)
