from ninja import Router

from api.v1.users.schemas import LoginSchema, RegisterSchema, TokenSchema
from api.v1.schemas import BadRequestError, ForbiddenError
from apps.users.models import User


router = Router(tags=["users"])


@router.post(
    path="/sign-up",
    response={
        201: TokenSchema,
        400: BadRequestError,
    }
)
def sign_up(data: RegisterSchema):
    ...


@router.post(
    path="/sign-in",
    response={
        200: TokenSchema,
        400: BadRequestError,
        403: ForbiddenError,
    }
)
def sign_in(data: LoginSchema):
    ...
