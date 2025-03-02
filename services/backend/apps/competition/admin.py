from django.contrib import admin

from apps.competition.models import Competition
from apps.task.admin import CompetitionTaskInline


@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "end_date",
        "type",
    )
    search_fields = (
        "title",
        "description",
    )
    list_filter = (
        "type",
        "participation_type",
    )
    inlines = [CompetitionTaskInline]
