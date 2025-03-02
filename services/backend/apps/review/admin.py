from django.contrib import admin

from apps.review.models import Reviewer


@admin.register(Reviewer)
class ReviewersAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "surname",
    )
    search_fields = (
        "name",
        "surname",
    )
