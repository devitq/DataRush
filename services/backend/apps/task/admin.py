from django.contrib import admin

from apps.task.models import CompetitionTask, CompetitionTaskAttachment


class CompletionAttachmentInline(admin.StackedInline):
    model = CompetitionTaskAttachment
    extra = 0


@admin.register(CompetitionTask)
class CompetitionTaskAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "points")
    inlines = [CompletionAttachmentInline]


class CompetitionTaskInline(admin.StackedInline):
    model = CompetitionTask
    extra = 0
