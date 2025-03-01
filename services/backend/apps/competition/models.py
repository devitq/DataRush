from datetime import datetime

from django.db import models
from tinymce.models import HTMLField

from apps.core.models import BaseModel
from apps.user.models import User


class Competition(BaseModel):
    class CompetitionType(models.TextChoices):
        SOLO = "solo", "Индивидуальный"

    class CompetitionParticipationType(models.TextChoices):
        EDU = "edu", "Образовательный"
        COMPETITIVE = "competitive", "Соревновательный"

    title = models.CharField(max_length=100, verbose_name="аазвание")
    description = HTMLField(verbose_name="описание")
    image_url = models.FileField(
        verbose_name="изображение соревнования", null=True, blank=True
    )
    end_date = models.DateTimeField(
        verbose_name="дедлайн участия", null=True, blank=True
    )
    start_date = models.DateTimeField(
        verbose_name="дедлайн участия", null=True, blank=True
    )
    type = models.CharField(
        max_length=10,
        choices=CompetitionType.choices,
        verbose_name="тип участия",
    )
    participation_type = models.CharField(
        max_length=11,
        choices=CompetitionParticipationType.choices,
        verbose_name="тип соревнования",
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
