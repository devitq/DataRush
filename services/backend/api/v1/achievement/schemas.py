from ninja import ModelSchema

from apps.achievement.models import Achievement


class AchievementSchema(ModelSchema):
    class Meta:
        model = Achievement
        fields = (
            "id",
            "name",
            "description",
            "icon",
        )
