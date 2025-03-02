from http import HTTPStatus as status

from ninja import Router

from apps.achievement.models import Achievement
from api.v1.achievement.schemas import AchievementSchema
from api.v1.schemas import UnauthorizedError

router = Router()


@router.get(
    "",
    response={
        status.OK: list[AchievementSchema],
        status.UNAUTHORIZED: UnauthorizedError,
    }
)
def get_all_achievements(request):
    return Achievement.objects.all()
