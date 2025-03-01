from http import HTTPStatus as status

from django.http import HttpRequest
from ninja import Router

from api.v1.ping import schemas

router = Router(tags=["ping"])


@router.get(
    "",
    response={
        status.OK: schemas.PingOut,
    },
)
def ping(request: HttpRequest) -> tuple[status, schemas.PingOut]:
    return status.OK, schemas.PingOut()
