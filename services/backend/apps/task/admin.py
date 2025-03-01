from django.contrib import admin

from apps.task.models import CompetitionTask


@admin.register(CompetitionTask)
class CompetitionTaskAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "points")


class CompetitionTaskInline(admin.StackedInline):
    model = CompetitionTask
    extra = 0
