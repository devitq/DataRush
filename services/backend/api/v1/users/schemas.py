from ninja import Schema, ModelSchema


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
    class Meta:
        model = User
        fields = ["email", "username"]
