from django.db import models

from apps.core.models import BaseModel
from apps.task.models import CompetitionTaskSubmission


class Reviewer(BaseModel):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)

    token = models.CharField(max_length=100)


class ReviewStatusChoices(models.TextChoices):
    NOT_CHECKED = "not_checked"
    CHECKING = "checking"
    CHECKED = "checked"


class Review(BaseModel):
    reviewer = models.ForeignKey(Reviewer, on_delete=models.CASCADE)
    submission = models.ForeignKey(
        CompetitionTaskSubmission,
        on_delete=models.CASCADE,
        related_name="reviews",
    )

    evaluation = models.JSONField(default=list, null=True, blank=True)
    state = models.CharField(
        choices=ReviewStatusChoices.choices,
        default=ReviewStatusChoices.NOT_CHECKED.value,
        max_length=11,
    )
