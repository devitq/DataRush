# myapp/signals.py
from django.db.models.signals import m2m_changed
from django.dispatch import receiver

from apps.review.models import Review
from apps.task.models import CompetitionTask, CompetitionTaskSubmission


@receiver(m2m_changed, sender=CompetitionTask.reviewers.through)
def print_reviewers(sender, instance, action, **kwargs):
    if action in ['post_add', 'post_remove', 'post_clear']:
        submissions = CompetitionTaskSubmission.objects.filter(task=instance)
        for submission in submissions:
            submission.send_on_review()