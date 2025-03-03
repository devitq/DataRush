from ninja import ModelSchema, Schema

from api.v1.achievement.schemas import UserAchievementSchema
from apps.achievement.models import UserAchievement
from apps.user.models import User


class TokenSchema(Schema):
    token: str


class RegisterSchema(ModelSchema):
    class Meta:
        model = User
        fields = ["email", "username", "password"]


class LoginSchema(ModelSchema):
    class Meta:
        model = User
        fields = ["email", "password"]


class UserSchema(ModelSchema):
    achievements: list[UserAchievementSchema] = None

    @staticmethod
    def resolve_achievements(self, context):
        return UserAchievement.objects.filter(
            user=context.get("request").auth
        ).order_by("-received_at")

    class Meta:
        model = User
        fields = ["id", "email", "username", "created_at"]


class StatSchema(Schema):
    total_attempts: int
    solved_tasks: int
