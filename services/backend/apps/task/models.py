from uuid import uuid4

from django.db import models
from django.db.models import Count, Q
from mdeditor.fields import MDTextField

from apps.competition.models import Competition
from apps.core.models import BaseModel
from apps.review.models import Review, Reviewer, ReviewStatusChoices
from apps.user.models import User


class CompetitionTask(BaseModel):
    class CompetitionTaskType(models.TextChoices):
        INPUT = "input", "Ввод правильного ответа"
        CHECKER = "checker", "Ввод кода"
        REVIEW = "review", "Ручная"

    def answer_file_upload_to(instance, filename) -> str:
        return f"tasks/{instance.id}/answer/{uuid4()}/{filename}"

    in_competition_position = models.PositiveSmallIntegerField(
        verbose_name="позиция в соревновании"
    )
    competition = models.ForeignKey(
        Competition,
        on_delete=models.CASCADE,
        verbose_name="привязанное соревнование",
    )
    title = models.CharField(verbose_name="заголовок", max_length=50)
    description = MDTextField(verbose_name="описание")
    max_attempts = models.PositiveSmallIntegerField(
        null=True, blank=True, verbose_name="максимальное кол-во попыток"
    )
    type = models.CharField(
        choices=CompetitionTaskType, max_length=8, verbose_name="тип проверки"
    )

    # only when "input" or "checker" type
    correct_answer_file = models.FileField(
        upload_to=answer_file_upload_to,
        null=True,
        blank=True,
        verbose_name="файл с правильным ответом",
        help_text="Имеет смысл только при автоматической (ввод ответа или кода) проверке.",
    )
    points = models.IntegerField(
        null=True, blank=True, verbose_name="общий балл за задание"
    )

    # only when "checker" type
    answer_file_path = models.TextField(
        null=True,
        blank=True,
        verbose_name="куда сделать вывод программы участнику",
        help_text=(
            "Путь до файла в котором ожидается результат. "
            "Пример: stdout или ./output.txt. Имеет смысл только при автоматическом типе проверки."
        ),
        default="stdout",
    )

    # only when "review" type
    reviewers = models.ManyToManyField(
        Reviewer,
        blank=True,
        verbose_name="ревьюверы",
        help_text=(
            "Справа отображаются действующие проверяющие, слева - доступные для выбора. "
            "Для перемещения можно кликнуть 2 раза по проверяющему. Имеет смысл только"
            " при ручном типе проверки."
        ),
    )
    submission_reviewers_count = models.PositiveSmallIntegerField(
        default=1,
        null=True,
        blank=True,
        verbose_name="кол-во проверяющих для зачета задачи",
    )

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "задание"
        verbose_name_plural = "задания"


class CompetitionTaskCriteria(BaseModel):
    task = models.ForeignKey(
        CompetitionTask, on_delete=models.CASCADE, related_name="criteries"
    )

    name = models.TextField(verbose_name="название")
    slug = models.SlugField(verbose_name="техническое название")
    description = models.TextField(verbose_name="описание критерии")
    max_value = models.PositiveSmallIntegerField(
        verbose_name="максимальное кол-во баллов"
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "критерий"
        verbose_name_plural = "критерии"


class CompetitionTaskAttachment(BaseModel):
    def file_upload_at(instance, filename) -> str:
        return f"attachments/{instance.id}/file/{filename}"

    task = models.ForeignKey(
        CompetitionTask, on_delete=models.CASCADE, verbose_name="задание"
    )
    file = models.FileField(upload_to=file_upload_at, verbose_name="файл")
    bind_at = models.CharField(verbose_name="путь сохранения", max_length=255)
    public = models.BooleanField(default=False, verbose_name="публичный")

    class Meta:
        verbose_name = "вложение"
        verbose_name_plural = "вложения"


class CompetitionTaskSubmission(BaseModel):
    class StatusChoices(models.TextChoices):
        SENT = "sent", "Отправлено на проверку"
        CHECKING = "checking", "Проверка"
        CHECKED = "checked", "Проверено"

    def submission_content_upload_to(instance, filename) -> str:
        return f"submissions/{instance.id}/content/{filename}"

    def submission_stdout_upload_to(instance, filename) -> str:
        return f"submissions/{instance.id}/stdout/{filename}"

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="пользователь"
    )
    task = models.ForeignKey(
        CompetitionTask, on_delete=models.CASCADE, verbose_name="задание"
    )

    status = models.CharField(
        choices=StatusChoices.choices,
        default=StatusChoices.SENT,
        max_length=8,
        verbose_name="статус",
    )

    # code or text or file
    content = models.FileField(
        upload_to=submission_content_upload_to,
        verbose_name="содержание посылки",
    )

    # only if task type is checker
    stdout = models.FileField(
        upload_to=submission_stdout_upload_to,
        null=True,
        blank=True,
        verbose_name="вывод программы",
        help_text="Используется только при проверке чекером",
    )

    # depends on task type:
    # - input: {"correct": boolean}
    # - file: {"total_points": integer, "by_criteria": ["criteria_name": integer]}
    # - code: {"correct": boolean}
    result = models.JSONField(
        default=None, null=True, blank=True, verbose_name="результат проверки"
    )
    # just more readable result representation, maybe will be calcuated somehow more complex depends on criteria
    earned_points = models.IntegerField(
        null=True, blank=True, verbose_name="баллы за задание"
    )

    checked_at = models.DateTimeField(
        null=True, blank=True, verbose_name="дата проверки"
    )
    plagiarism_checked = models.BooleanField(
        default=False, verbose_name="проверено на плагиат"
    )
    timestamp = models.DateTimeField(
        auto_now_add=True, verbose_name="дата отправки"
    )

    class Meta:
        verbose_name = "посылка"
        verbose_name_plural = "посылки"

    def __str__(self):
        return str(self.id)

    def send_on_review(self):
        if not self.task.reviewers.exists():
            return

        reviewers_count = self.task.submission_reviewers_count
        reviewers = self.task.reviewers.annotate(
            pending_count=Count(
                "review",
                filter=Q(
                    review__state__in=[
                        ReviewStatusChoices.NOT_CHECKED,
                        ReviewStatusChoices.CHECKING,
                    ]
                ),
            )
        ).order_by("pending_count")[
            :reviewers_count
        ]  # да это медленно работает и чо

        for reviewer in reviewers:
            Review.objects.update_or_create(
                reviewer=reviewer,
                submission=self,
            )
