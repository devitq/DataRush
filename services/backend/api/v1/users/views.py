from http import HTTPStatus as status

from ninja import Router
from ninja.errors import AuthenticationError

from api.v1.users.schemas import LoginSchema, RegisterSchema, TokenSchema, UserSchema
from api.v1.auth import BearerAuth
from api.v1.schemas import BadRequestError, ForbiddenError, NotFoundError
from apps.user.models import User

router = Router(tags=["user"])


@router.post(
    path="/sign-up",
    response={
        status.CREATED: TokenSchema,
        status.BAD_REQUEST: BadRequestError,
    },
    auth=None,
)
def sign_up(request, data: RegisterSchema):
    user = User(**data.dict())
    user.full_clean()
    user.save()

    token = BearerAuth.generate_jwt(user)
    return status.CREATED, TokenSchema(token=token)


@router.post(
    path="/sign-in",
    response={
        status.OK: TokenSchema,
        status.BAD_REQUEST: BadRequestError,
        status.UNAUTHORIZED: ForbiddenError,
    },
    auth=None,
)
def sign_in(request, data: LoginSchema):
    user = User.objects.filter(email=data.email).first()
    if not user:
        raise AuthenticationError
    if user.password != data.password:
        raise AuthenticationError

    token = BearerAuth.generate_jwt(user)
    return status.OK, TokenSchema(token=token)


@router.get(
    path="/user/{user_id}",
    response={
        status.OK: UserSchema,
        status.BAD_REQUEST: BadRequestError,
        status.NOT_FOUND: NotFoundError,
    },
)
def get_user(request, user_id: str):
    ...
