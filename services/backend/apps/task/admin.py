from django.contrib import admin

from apps.task.models import (
    CompetitionTask,
    CompetitionTaskAttachment,
    CompetitionTaskSubmission,
    CompetitionTaskCriteria
)


class CompletionAttachmentInline(admin.StackedInline):
    model = CompetitionTaskAttachment
    extra = 0


class CompetitionCriteriaInline(admin.StackedInline):
    model = CompetitionTaskCriteria
    extra = 0


@admin.register(CompetitionTask)
class CompetitionTaskAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "points")
    filter_horizontal = ("reviewers",)
    list_filter = ("type",)
    inlines = (CompletionAttachmentInline, CompetitionCriteriaInline,)


@admin.register(CompetitionTaskSubmission)
class CompetitionTaskSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "task",
        "user",
        "status",
    )
    search_fields = (
        "task__id",
        "task__title",
        "user__username",
        "user__email",
    )
    list_filter = ("plagiarism_checked", "status")
    ordering = ["-timestamp"]

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class CompetitionTaskInline(admin.StackedInline):
    model = CompetitionTask
    extra = 0
