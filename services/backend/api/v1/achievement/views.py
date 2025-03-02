from http import HTTPStatus as status

from ninja import Router

from api.v1.achievement.schemas import AchievementSchema
from api.v1.schemas import UnauthorizedError
from apps.achievement.models import Achievement

router = Router(tags=["achievement"])


@router.get(
    "all",
    response={
        status.OK: list[AchievementSchema],
        status.UNAUTHORIZED: UnauthorizedError,
    },
    auth=None,
)
def get_all_achievements(request):
    return Achievement.objects.all()
