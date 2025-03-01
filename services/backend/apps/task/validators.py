from django.core.exceptions import ValidationError
from pydantic import BaseModel
from pydantic import ValidationError as PydanticValidationError


class Criteria(BaseModel):
    name: str
    slug: str
    max_value: int
    min_value: int


class ContestTaskCriteriesValidator:
    def __call__(self, instance):
        if instance.criteries and not isinstance(instance.criteries, list):
            err = "criteries must be a valid dictionary"
            raise ValidationError(err)

        try:
            for criteria in instance.criteries if instance.criteries else []:
                Criteria(**criteria)
        except PydanticValidationError:
            err = "invalid criteries data"
            raise ValidationError(err)
