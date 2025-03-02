from django.contrib import admin

from apps.review.models import Review, Reviewer


@admin.register(Reviewer)
class ReviewersAdmin(admin.ModelAdmin):
    list_display = ("name", "surname",)
    search_fields = ("name", "surname",)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "reviewer", "submission",)
    search_fields = ("id", "reviewer__id", "reviewer__name", "reviewer__surname",
                     "submission__id", "submission__content")
    list_filter = ("submission__plagiarism_checked", "submission__status",)
