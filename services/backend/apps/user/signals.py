from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.achievement.models import Achievement, UserAchievement
from apps.user.models import User


@receiver(post_save, sender=User)
def assign_welcome_achievement(sender, instance, created, **kwargs):
    if created:
        welcome_achievement = Achievement.objects.get(slug="welcome")
        UserAchievement.objects.create(
            user=instance, achievement=welcome_achievement
        )
