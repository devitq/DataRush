from typing import Literal
from uuid import UUID

from ninja import ModelSchema, Schema

from apps.review.models import Review, Reviewer
from apps.task.models import CompetitionTaskSubmission


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
        model = CompetitionTaskSubmission
        exclude = ("user",)


class SubmissionsOut(Schema):
    submissions: list = None

    @staticmethod
    def resolve_submissions(self, context) -> list[SubmissionOut]:
        return list(
            Review.objects.filter(reviewer=context.get("request").auth)
        )
