from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.achievement.models import Achievement, UserAchievement
from apps.competition.models import State
from apps.user.models import User


@receiver(post_save, sender=State)
def assign_start_competition_achievement(sender, instance, created, **kwargs):
    if created:
        if State.objects.filter(user=instance.user, state=State.StateChoices.STARTED.value).count() == 1 \
                and not State.objects.filter(user=instance.user, state=State.StateChoices.FINISHED.value).exists():
            start_competition_achievement = Achievement.objects.get(slug="start_competition")
            UserAchievement.objects.create(
                user=instance.user, achievement=start_competition_achievement
            )
