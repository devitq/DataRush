from uuid import uuid4

from competition.models import Competition
from core.models import BaseModel
from django.db import models

from apps.task.validators import ContestTaskCriteriesValidator


class CompetitionTask(BaseModel):
    class CompetitionTaskType(models.TextChoices):
        INPUT = "input"
        CHECKER = "checker"
        REVIEW = "review"

    def answer_file_upload_to(instance, filename) -> str:
        return f"/tasks/{instance.id}/answer/{uuid4}"

    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    title = models.TextField(verbose_name="заголовок", max_length=50)
    description = models.TextField(verbose_name="описание", max_length=300)
    type = models.CharField(choices=CompetitionTaskType)

    # only when "input" or "checker" type
    correct_answer_file = models.FileField(upload_to=answer_file_upload_to)

    # only when "checker" type
    answer_file_path = models.TextField()

    # only when "review" type
    criteries = models.JSONField(blank=True, null=True)

    def clean(self):
        ContestTaskCriteriesValidator()(self)
