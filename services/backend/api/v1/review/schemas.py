from datetime import datetime
from typing import Literal
from uuid import UUID

from ninja import ModelSchema, Schema
from pydantic import Field

from apps.review.models import Review, Reviewer, ReviewStatusChoices
from apps.task.models import CompetitionTaskSubmission


class ReviewerOut(ModelSchema):
    id: UUID

    class Meta:
        model = Reviewer
        exclude = ("token",)


class CriteriaMarkOut(Schema):
    slug: str
    mark: float


class CriteriaOut(Schema):
    name: str
    slug: str
    max_value: int
    min_value: int


class SubmissionOut(ModelSchema):
    id: UUID
    review_status: Literal["not_checked", "checked", "checking"]
    evaluation: list[CriteriaMarkOut] | None = None
    criteries: list[CriteriaOut] | None = None
    submitted_at: datetime = Field(..., alias="timestamp")
    competition: UUID = Field(..., alias="task.competition.id")
    competition_name: str = Field(..., alias="task.competition.title")

    @staticmethod
    def resolve_criteries(self, context) -> list[CriteriaOut] | None:
        criteries = self.task.criteries
        return criteries

    @staticmethod
    def resolve_evaluation(self, context) -> list[CriteriaMarkOut] | None:
        if not (
            review := Review.objects.filter(
                reviewer=context.get("request").auth, submission=self
            ).first()
        ):
            return None
        return review.evaluation

    @staticmethod
    def resolve_review_status(self, context):
        reviewer = context.get("request").auth
        if not (
            review := Review.objects.filter(
                reviewer=reviewer, submission=self
            ).first()
        ):
            return ReviewStatusChoices.NOT_CHECKED.value
        return review.state

    class Meta:
        model = CompetitionTaskSubmission
        fields = (
            "id",
            "task",
            "content",
            "stdout",
            "result",
            "earned_points",
            "checked_at",
        )


class CriteriaMarkIn(Schema):
    slug: str
    mark: float


class EvaluationIn(Schema):
    evaluation: list[CriteriaMarkIn]


class SubmissionsOut(Schema):
    submissions: list[SubmissionOut | None] = []

    @staticmethod
    def resolve_submissions(self, context) -> list[SubmissionOut | None]:
        submissions = list(
            CompetitionTaskSubmission.objects.filter(
                reviews__reviewer=context.get("request").auth
            )
        )
        return submissions
