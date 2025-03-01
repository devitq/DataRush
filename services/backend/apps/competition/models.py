from datetime import datetime

from django.db import models

from apps.core.models import BaseModel
from apps.user.models import User


class Competition(BaseModel):
    class CompetitionType(models.TextChoices):
        EDU = "edu", "Образовательный"
        COMPETITIVE = "competitive", "Соревновательный"

    class CompetitionParticipationType(models.TextChoices):
        SOLO = "solo", "Индивидуальный"

    def image_url_upload_to(instance, filename):
        return f"/competitions/{instance.id}/image"

    title = models.CharField(max_length=100, verbose_name="название")
    description = models.TextField(verbose_name="описание")
    image_url = models.ImageField(
        verbose_name="изображение соревнования",
        null=True,
        blank=True,
        upload_to=image_url_upload_to,
    )
    end_date = models.DateTimeField(
        verbose_name="дедлайн участия", null=True, blank=True
    )
    start_date = models.DateTimeField(
        verbose_name="дедлайн участия", null=True, blank=True
    )
    type = models.CharField(
        max_length=11,
        choices=CompetitionType.choices,
        verbose_name="тип участия",
    )
    participation_type = models.CharField(
        max_length=11,
        choices=CompetitionParticipationType.choices,
        verbose_name="тип соревнования",
    )
    participants = models.ManyToManyField(
        User, related_name="participants", blank=True, editable=False
    )

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
