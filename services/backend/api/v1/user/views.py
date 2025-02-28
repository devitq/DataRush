from ninja import Router

from api.v1.schemas import BadRequestError, ForbiddenError, NotFoundError
from api.v1.user.schemas import (
    LoginSchema,
    RegisterSchema,
    TokenSchema,
    UserSchema,
)

router = Router(tags=["user"])


@router.post(
    path="/sign-up",
    response={
        201: TokenSchema,
        400: BadRequestError,
    },
)
def sign_up(data: RegisterSchema): ...


@router.post(
    path="/sign-in",
    response={
        200: TokenSchema,
        400: BadRequestError,
        403: ForbiddenError,
    },
)
def sign_in(data: LoginSchema): ...


@router.get(
    path="/user/{user_id}",
    response={
        200: UserSchema,
        400: BadRequestError,
        404: NotFoundError,
    },
)
def get_user(user_id: str): ...
