import random
import uuid
from datetime import timedelta

from django.contrib.auth.hashers import make_password
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.competition.models import Competition, State
from apps.task.models import CompetetionTaskSumbission, CompetitionTask
from apps.user.models import User, UserRole


class Command(BaseCommand):
    help = "Generate sample data for Users, Competitions, Tasks, Submissions, and States."

    def handle(self, *args, **options):
        self.stdout.write("Starting data generation...")
        users = self.create_users(5)
        competitions = self.create_competitions(2, users)
        tasks = self.create_tasks(competitions)
        self.create_submissions(tasks, users)
        self.create_states(competitions, users)
        self.stdout.write("Data generation completed.")

    def create_users(self, count):
        users = []
        for i in range(1, count + 1):
            email = f"user{i}@example.com"
            username = f"user{i}"
            password = (
                "password123"  # In production, use proper password handling.
            )
            role = random.choice(
                [UserRole.STUDENT.value, UserRole.METODIST.value]
            )
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": username,
                    "password": make_password(password),
                    "status": role,
                },
            )
            users.append(user)
            self.stdout.write(f"Created user: {username}")
        return users

    def create_competitions(self, count, users):
        competitions = []
        now = timezone.now()
        for i in range(1, count + 1):
            title = f"Competition {i}"
            description = f"Description for competition {i}"
            start_date = now - timedelta(days=random.randint(1, 10))
            end_date = now + timedelta(days=random.randint(1, 10))
            competition = Competition.objects.create(
                title=title,
                description=description,
                start_date=start_date,
                end_date=end_date,
                type="solo",  # assuming only one type for now
                participation_type=random.choice(["edu", "competitive"]),
            )
            # Add random participants
            selected_users = random.sample(
                users, k=min(len(users), random.randint(1, len(users)))
            )
            competition.participants.add(*selected_users)
            competitions.append(competition)
            self.stdout.write(f"Created competition: {title}")
        return competitions

    def create_tasks(self, competitions):
        tasks = []
        task_types = [
            CompetitionTask.CompetitionTaskType.INPUT.value,
        ]
        for comp in competitions:
            # Create 3 tasks per competition
            for i in range(1, 4):
                task_type = random.choice(task_types)
                title = f"Task {i} for {comp.title}"
                description = f"Task description for task {i} in {comp.title}"
                task = CompetitionTask.objects.create(
                    competition=comp,
                    title=title,
                    description=description,
                    type=task_type,
                    points=random.randint(1, 10),
                )
                tasks.append(task)
                self.stdout.write(f"Created task: {title} (type: {task_type})")
        return tasks

    def create_submissions(self, tasks, users):
        for task in tasks:
            # Each task will get between 1 and 3 submissions
            num_submissions = random.randint(1, 3)
            for _ in range(num_submissions):
                user = random.choice(users)
                # Create a dummy content file
                dummy_content = ContentFile(
                    b"Submission content",
                    name=f"submission_{uuid.uuid4().hex}.txt",
                )
                submission = CompetetionTaskSumbission.objects.create(
                    user=user,
                    task=task,
                    earned_points=random.randint(
                        0, task.points if task.points else 10
                    ),
                    content=dummy_content,
                )
                submission.save()
                self.stdout.write(
                    f"Created submission for task '{task.title}' by user '{user.username}'"
                )

    def create_states(self, competitions, users):
        # For each competition, create a State for some of its participants
        state_choices = [choice for choice in State.StateChoices.values]
        for comp in competitions:
            for user in comp.participants.all():
                state_obj, created = State.objects.get_or_create(
                    user=user,
                    competition=comp,
                    defaults={
                        "state": random.choice(state_choices),
                        "changed_at": timezone.now(),
                    },
                )
                self.stdout.write(
                    f"Created state '{state_obj.state}' for user '{user.username}' in competition '{comp.title}'"
                )
