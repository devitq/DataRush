from typing import Literal
from uuid import UUID

from django.http import HttpRequest
from ninja import ModelSchema, Schema

from apps.review.models import Reviewer
from apps.task.models import CompetetionTaskSumbission


class PingOut(Schema):
    status: str = "ok"


class ReviewerOut(ModelSchema):
    id: UUID

    class Meta:
        model = Reviewer
        exclude = ("token",)


class SubmissionOut(ModelSchema):
    id: UUID
    status: Literal["sent", "checking", "checked"]

    class Meta:
        model = CompetetionTaskSumbission
        exclude = ("user",)


class SubmissionsOut(Schema):
    submissions: list[SubmissionOut] = []

    @staticmethod
    def resolve_submissions(self, context: HttpRequest) -> list[SubmissionOut]:
        return list(CompetetionTaskSumbission.objects.all())
