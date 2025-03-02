from datetime import datetime
from http import HTTPStatus as status

from django.contrib.auth.hashers import check_password, make_password
from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.errors import AuthenticationError

from api.v1.auth import BearerAuth
from api.v1.schemas import (
    BadRequestError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
)
from api.v1.user.schemas import (
    LoginSchema,
    RegisterSchema,
    TokenSchema,
    UserSchema,
)
from apps.user.models import User

router = Router(tags=["user"])


@router.post(
    path="/sign-up",
    response={
        status.CREATED: TokenSchema,
        status.BAD_REQUEST: BadRequestError,
        status.CONFLICT: ConflictError,
    },
    auth=None,
)
def sign_up(request, data: RegisterSchema):
    user = User(**data.dict(exclude={"password"}))
    user.password = make_password(data.password)
    user.created_at = datetime.now()
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
    if not check_password(data.password, user.password):
        raise AuthenticationError

    token = BearerAuth.generate_jwt(user)
    return status.OK, TokenSchema(token=token)


@router.get(
    "/me",
    response={
        status.OK: UserSchema,
        status.UNAUTHORIZED: ForbiddenError,
    },
)
def get_me(request):
    return 200, request.auth


@router.get(
    path="/user/{user_id}",
    response={
        status.OK: UserSchema,
        status.BAD_REQUEST: BadRequestError,
        status.NOT_FOUND: NotFoundError,
    },
)
def get_user(request, user_id: str):
    user = get_object_or_404(User, id=user_id)
    return status.OK, user
