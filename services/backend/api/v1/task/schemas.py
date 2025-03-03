from typing import Literal
from uuid import UUID

from ninja import ModelSchema, Schema

from apps.task.models import (
    CompetitionTask,
    CompetitionTaskAttachment,
    CompetitionTaskSubmission,
)


class TaskOutSchema(ModelSchema):
    status: Literal["sent", "checked", "checking", "not_submitted"] = None
    type: Literal["input", "checker", "review"] = None

    @staticmethod
    def resolve_status(
        self, context
    ) -> Literal["sent", "checked", "checking", "not_submitted"]:
        if submission := CompetitionTaskSubmission.objects.filter(
            task=self, user=context.get("request").auth
        ).first():
            return submission.status
        return "not_submitted"

    class Meta:
        model = CompetitionTask
        fields = [
            "id",
            "competition",
            "title",
            "description",
            "in_competition_position",
            "points",
            "max_attempts"
        ]


class TaskSubmissionOut(Schema):
    submission_id: UUID


class HistorySubmissionOut(ModelSchema):
    status: Literal["sent", "checked", "checking"]

    class Meta:
        model = CompetitionTaskSubmission
        fields = (
            "id",
            "earned_points",
            "timestamp",
            "content",
        )


class TaskAttachmentSchema(ModelSchema):
    class Meta:
        model = CompetitionTaskAttachment
        fields = (
            "id",
            "file",
            "public",
        )
