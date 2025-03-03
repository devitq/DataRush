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
    UnauthorizedError,
)
from api.v1.user.schemas import (
    LoginSchema,
    RegisterSchema,
    StatSchema,
    TokenSchema,
    UserSchema,
)
from apps.task.models import CompetitionTaskSubmission, CompetitionTask
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
    path="/users/{user_id}",
    response={
        status.OK: UserSchema,
        status.BAD_REQUEST: BadRequestError,
        status.NOT_FOUND: NotFoundError,
    },
)
def get_user(request, user_id: str):
    user = get_object_or_404(User, id=user_id)
    return status.OK, user


@router.get(
    "/me/stat",
    response={status.OK: StatSchema, status.UNAUTHORIZED: UnauthorizedError},
)
def get_my_stat(request):
    user_submissions = CompetitionTaskSubmission.objects.filter(
        user=request.auth
    )
    checked_attempts = user_submissions.filter(
        status=CompetitionTaskSubmission.StatusChoices.CHECKED
    ).all()
    success_attempts_cnt = 0

    for attempt in checked_attempts:
        if attempt.task.type == CompetitionTask.CompetitionTaskType.REVIEW:
            is_correct = attempt.earned_points > 0
        else:
            is_correct = attempt.result.get("correct", None)

        if is_correct:
            success_attempts_cnt += 1

    return StatSchema(
        total_attempts=len(user_submissions), solved_tasks=success_attempts_cnt
    )
