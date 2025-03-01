from uuid import uuid4

from django.db import models

from apps.competition.models import Competition
from apps.core.models import BaseModel
from apps.task.validators import ContestTaskCriteriesValidator
from apps.user.models import User


class CompetitionTask(BaseModel):
    class CompetitionTaskType(models.TextChoices):
        INPUT = "input", "Ввод правильного ответа"
        CHECKER = "checker", "Вывод кода"
        REVIEW = "review", "Ручная"

    def answer_file_upload_to(instance, filename) -> str:
        return f"/tasks/{instance.id}/answer/{uuid4()}/filename"

    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    title = models.CharField(verbose_name="заголовок", max_length=50)
    description = models.TextField(verbose_name="описание", max_length=300)
    max_attemps = models.PositiveSmallIntegerField()
    type = models.CharField(
        choices=CompetitionTaskType, max_length=8, verbose_name="тип проверки"
    )

    # only when "input" or "checker" type
    correct_answer_file = models.FileField(
        upload_to=answer_file_upload_to,
        null=True,
        blank=True,
        verbose_name="файл с правильным ответом",
    )
    points = models.IntegerField(
        null=True, blank=True, verbose_name="баллы за задание"
    )

    # only when "checker" type
    answer_file_path = models.TextField(
        null=True,
        blank=True,
        verbose_name="куда сохранять решения",
        default="stdout",
    )

    # only when "review" type
    # todo make it more humanize
    criteries = models.JSONField(
        blank=True,
        null=True,
        verbose_name="критерии",
        default=lambda: [
            {
                "name": "CHANGE ME",
                "slug": "CHANGE ME",
                "max_value": 0,
                "min_value": 0,
            }
        ],
    )

    def clean(self):
        ContestTaskCriteriesValidator()(self)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "задание"
        verbose_name_plural = "задания"


class CompetitionTaskSubmission(BaseModel):
    class StatusChoices(models.TextChoices):
        SENT = "sent"
        CHECKING = "checking"
        CHECKED = "checked"

    def submission_content_upload_to(instance, filename) -> str:
        return f"submissions/{instance.id}/content"

    def submission_stdout_upload_to(instance, filename) -> str:
        return f"/submissions/{instance.id}/stdout"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(CompetitionTask, on_delete=models.CASCADE)

    status = models.CharField(
        choices=StatusChoices.choices,
        default=StatusChoices.SENT,
        max_length=8,
    )

    # code or text or file
    content = models.FileField(upload_to=submission_content_upload_to)

    # only if task type is checker
    stdout = models.FileField(
        upload_to=submission_stdout_upload_to, null=True, blank=True
    )

    # depends on task type:
    # - input: {"correct": boolean}
    # - file: {"total_points": integer, "by_criteria": ["criteria_name": integer]}
    # - code: {"correct": boolean}
    result = models.JSONField(default=None, null=True, blank=True)
    # just more readable result representation, maybe will be calcuated somehow more complex depends on criteria
    earned_points = models.IntegerField()

    timestamp = models.DateTimeField(auto_now_add=True)
