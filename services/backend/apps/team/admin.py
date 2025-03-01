from django.contrib import admin

from apps.team.models import Team


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("name", "owner")
    search_fields = ("name", "owner", "members",)
