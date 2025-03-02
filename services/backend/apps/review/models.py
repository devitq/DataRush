from django.db import models

from apps.core.models import BaseModel
from apps.task.models import CompetitionTaskSubmission


class Reviewer(BaseModel):
    name = models.CharField(max_length=100, verbose_name="имя")
    surname = models.CharField(max_length=100, verbose_name="фамилия")

    token = models.CharField(max_length=100, verbose_name="токен для входа")

    def __str__(self):
        return self.name + " " + self.surname

    class Meta:
        verbose_name = "проверяющий"
        verbose_name_plural = "проверяющие"


class ReviewStatusChoices(models.TextChoices):
    NOT_CHECKED = "not_checked"
    CHECKING = "checking"
    CHECKED = "checked"


class Review(BaseModel):
    reviewer = models.ForeignKey(Reviewer, on_delete=models.CASCADE,
                                 verbose_name="проверяющий")
    submission = models.ForeignKey(
        CompetitionTaskSubmission,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="посылка"
    )

    evaluation = models.JSONField(default=list, null=True, blank=True,
                                  verbose_name="выполнение")
    state = models.CharField(
        choices=ReviewStatusChoices.choices,
        default=ReviewStatusChoices.NOT_CHECKED.value,
        max_length=11,
        verbose_name="состояние"
    )

    def __str__(self):
        return self.id

    class Meta:
        verbose_name = "проверка"
        verbose_name_plural = "проверки"
