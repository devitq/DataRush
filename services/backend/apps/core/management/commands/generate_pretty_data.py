import random
import uuid
from datetime import timedelta, datetime

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.competition.models import Competition, State
from apps.review.models import Reviewer
from apps.task.models import (
    CompetitionTask,
    CompetitionTaskCriteria,
    CompetitionTaskSubmission,
)
from apps.user.models import User, UserRole

ans1 = ContentFile(
    b"1984",
    name=f"submission_{uuid.uuid4().hex}.txt",
)
ans2 = ContentFile(
    b"3",
    name=f"submission_{uuid.uuid4().hex}.txt",
)

now = timezone.now()
competitions = [
    {
        "obj": None, # докидывает в процессе
        "title": "DANO. Финал",
        "description": "Олимпиада по анализу данных от Т-Банка и ВШЭ",
        "start_date": now - timedelta(days=2),
        "end_date": now + timedelta(days=5),
        "type": "competitive",
        "participation_type": "solo",
        "tasks": [
            {
                "obj": None,
                "title": "Задача 1",
                "description": """На маркетплейсе «Е-шопинг» продаются различные товары. Одна из задач аналитика —
прогнозировать, сколько товаров будет продаваться при определенной цене. В ходе
исследований и экспериментов был выявлен вид зависимости:
$Q(P) = Q_0 \times e^{E \times \frac{P_0 - P}{P_0}}$
где Q — это количество проданных единиц товара при цене P,
Q 0 — количество проданных единиц товара при цене P0 ,
E — коэффициент чувствительности количества проданных единиц товара к изменению
цены.

Найдите, сколько заработает продавец при цене по 3 000 ₽ за нож и сковороду
при условии, что себестоимость ножа — 1 000 ₽, а сковородки — 2 000 ₽.Ответ
округлите до целых.""".strip(),
                "type": CompetitionTask.CompetitionTaskType.INPUT.value,
                "points": 3,
                "submission_reviewers_count": 2,
                "max_attempts": 20,
                "correct_answer_file": ans1
            },
            {
                "obj": None,
                "title": "Задача 2",
                "description": """
Напишите "hello_dano" на питоне
""".strip(),
                "type": CompetitionTask.CompetitionTaskType.CHECKER.value,
                "points": 25,
                "submission_reviewers_count": 2,
                "max_attempts": 50,
            },
            {
                "obj": None,
                "title": "Задача 3",
                "description": """Небольшой интернет-магазин собрал данные о действиях пользователей на своем сайте
за последние несколько месяцев.
ecommerce_logs.csv — журнал действий пользователей:
• user_id — идентификатор пользователя.
• action — тип действия пользователя:
— visit — посещение сайта;
— click — клик на карточку товара;
— cart — добавление товара в корзину;
— delete — удаление товара из корзины;
— purchase — покупка товаров.
• date_time — время совершения действия.
• product_id — идентификатор товара.
• quantity — количество добавленного в корзину товара.
• delivery_price — стоимость доставки.
• sex — пол пользователя.
• region — регион пользователя.
• price — цена товара.

Вам нужно изучить воронку конверсии, которая показывает, как пользователи переходят
от одного шага к другому на сайте. В нашем случае воронка состоит из следующих шагов:
1. Посещение сайта.
2. Просмотр карточки товара.
3. Добавление товара в корзину.
4. Покупка.

1. Посещение сайта.
2. Просмотр карточки товара.
3. Добавление товара в корзину.
4. Покупка.
3 / 11
1.) Посчитайте конверсию (округлите ответ до 3 знаков после запятой):
• Из визита на сайт в клик на карточку товара.
• Из клика в добавление в корзину.
• Из добавления в корзину в покупку.
• Из визита на сайт в добавление в корзину.
• Из визита на сайт в покупку.
2. Постройте воронку конверсии с помощью столбчатой диаграммы:
• По оси X — шаги воронки.
• По оси Y — количество уникальных пользователей на каждом шаге.
3. Определите, на каком этапе конверсия из предыдущего шага ниже всего.
Сформулируйте одну гипотезу, связанную с поведением пользователей, которая
может объяснить падение конверсии именно на этом этапе. Обоснуйте механизм
работы приведенной гипотезы.
4. Постройте график динамики (по оси X — дни) для каждой из конверсий:
• Конверсия из визита в клик.
• Конверсия из визита в добавление в корзину.
• Конверсия из визита в покупку.
5. На графике найдите просадку конверсии: укажите, какая конверсия просела
и в какой примерно период это произошло (допустимая погрешность — 1–3
дня).
6. Чем вызвано снижение конверсии в этот период? Какие изменения в бизнесе
или поведении пользователей могли бы объяснить это? Ответьте на оба
вопроса, опираясь на данные.
""".strip(),
                "type": CompetitionTask.CompetitionTaskType.REVIEW.value,
                "points": 10,
                "submission_reviewers_count": 2,
                "max_attempts": 1,
                "criteries": [
                    {
                        "obj": None,
                        "name": "Обоснованность решения",
                        "slug": "validity",
                        "description": "Аргументация",
                        "max_value": 5
                    },
                    {
                        "obj": None,
                        "name": "Правильность",
                        "slug": "correctness",
                        "description": "Насколько точные и верные ответы были представлены.",
                        "max_value": 5
                    }
                ]
            },
        ]
    },
    {
        "obj": None,
        "title": "PRODANO. Тур 5",
        "description": "Олимпиада по олимпиаде DANO",
        "start_date": now - timedelta(days=10),
        "end_date": now + timedelta(days=50),
        "type": "edu",
        "participation_type": "solo",
        "tasks": [
            {
                "obj": None,
                "title": "Задача 1",
                "description": """Сколько этапов в DANO?""".strip(),
                "type": CompetitionTask.CompetitionTaskType.INPUT.value,
                "points": 3,
                "submission_reviewers_count": 2,
                "max_attempts": 20,
                "correct_answer_file": ans2
            },
            {
                "obj": None,
                "title": "Задача 2",
                "description": """
Напишите отзыв про DANO(Хороший)
""".strip(),
                "type": CompetitionTask.CompetitionTaskType.REVIEW.value,
                "points": 15,
                "submission_reviewers_count": 2,
                "max_attempts": 1,
                "criteries": [
                    {
                        "obj": None,
                        "name": "Хорошесть отзыва",
                        "slug": "validity",
                        "description": "Хорошесть",
                        "max_value": 10
                    },
                    {
                        "obj": None,
                        "name": "Подробность",
                        "slug": "detail",
                        "description": "Насколько подробно расписан ответ.",
                        "max_value": 5
                    }
                ]
            },
            {
                "obj": None,
                "title": "Задача 3",
                "description": """
Напишите выведите 1+3 на питоне
""".strip(),
                "type": CompetitionTask.CompetitionTaskType.CHECKER.value,
                "points": 30,
                "submission_reviewers_count": 2,
                "max_attempts": 100,
            }
        ]
    }
]

users = [
    {
        "email": "germanivanov1984@gmail.com",
        "username": "germanivanov",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "dreamonovich@gmail.com",
        "username": "dreamonovich",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    }
]

reviewers = [
    {
        "name": "Владислав",
        "surname": "Пикиневич",
        "token": "pikinevich"
    },
    {
        "name": "Александр",
        "surname": "Шахов",
        "token": "ashakhov"
    }
]

class Command(BaseCommand):
    help = "Generate sample data for Users, Competitions, Tasks, Submissions, and States."

    def handle(self, *args, **options):
        self.stdout.write("Starting data generation...")
        users = self.create_users(5)
        competitions = self.create_competitions(2, users)
        self.reviewers = self.create_reviewers(2)
        tasks = self.create_tasks()
        self.create_incorrect_submissions(tasks, users)
        self.create_states(competitions, users)
        self.stdout.write("Data generation completed.")

    def create_reviewers(self, count):
        reviewers_objs = []
        for reviewer in reviewers:
            name = reviewer['name']
            surname = reviewer['surname']
            token = reviewer['token']
            reviewer_obj = Reviewer(name=name, surname=surname, token=token)
            reviewer_obj.save()
            reviewers_objs.append(reviewer_obj)
        return reviewers_objs

    def create_users(self, count):
        users_objs = []
        for user in users:
            user_obj, created = User.objects.get_or_create(
                email=user['email'],
                defaults={
                    "username": user['username'],
                    "password": make_password(user['password']),
                    "status": user['role'],
                },
            )
            users_objs.append(user_obj)
            self.stdout.write(f"Created user: {user['username']}")
        return users_objs

    def create_competitions(self, count, users):
        competitions_objs = []

        for i, competition in enumerate(competitions):
            competition_obj = Competition.objects.create(
                title=competition['title'],
                description=competition['description'],
                start_date=competition['start_date'],
                end_date=competition['end_date'],
                type=competition['type'],
                participation_type=competition['participation_type'],
            )

            competitions[i]['obj'] = competition_obj
            competition_obj.participants.add(*users)
            competitions_objs.append(competition_obj)
            self.stdout.write(f"Created competition: {competition['title']}")
        return competitions_objs

    def create_tasks(self):
        tasks_objs = []
        task_types = [
            CompetitionTask.CompetitionTaskType.INPUT.value,
            CompetitionTask.CompetitionTaskType.REVIEW.value,
            CompetitionTask.CompetitionTaskType.INPUT.value,
        ]
        for i, competition in enumerate(competitions):
            for j, task in enumerate(competition['tasks']):
                task_obj = CompetitionTask.objects.create(
                    in_competition_position=j,
                    competition=competition['obj'],
                    title=task['title'],
                    description=task['description'],
                    type=task['type'],
                    points=task['points'],
                    submission_reviewers_count=task['submission_reviewers_count'],
                    max_attempts=task['max_attempts'],
                )
                competitions[i]['tasks'][j]['obj'] = task_obj

                if task['type'] == CompetitionTask.CompetitionTaskType.INPUT.value:
                    task_obj.correct_answer_file = task['correct_answer_file']

                if (
                    task['type']
                    == CompetitionTask.CompetitionTaskType.REVIEW.value
                ):
                    for k, criteria in enumerate(task['criteries']):
                        criteria_obj = CompetitionTaskCriteria.objects.create(
                            task=task_obj,
                            name=criteria['name'],
                            slug=criteria['slug'],
                            description=criteria['description'],
                            max_value=criteria['max_value'],
                        )
                        competitions[i]['tasks'][j]['criteries'][k]['obj'] = criteria_obj
                        self.stdout.write(f"Created criteria: {criteria['slug']}")
                tasks_objs.append(task_obj)
                self.stdout.write(f"Created task: {task['title']} (type: {task['type']})")
        self.add_reviewers_to_task(tasks_objs)
        return tasks_objs

    def add_reviewers_to_task(self, tasks):
        for task in tasks:
            task.reviewers.set(self.reviewers)
            task.save()

    def create_incorrect_submissions(self, tasks, users):
        for user in users:
            for task in tasks:
                if task.type == CompetitionTask.CompetitionTaskType.REVIEW.value:
                    num_submissions = random.randint(1, 3)
                    for m in range(num_submissions):
                        dummy_content_txt = ContentFile(
                            b"otvet: 112 sto proc" ,
                            name=f"submission_{uuid.uuid4().hex}.txt",
                        )

                        content_dir = f"{settings.BASE_DIR}/apps/core/contents"
                        with open(f"{content_dir}/presentation.pptx", "rb") as f:
                            files = [f, f, dummy_content_txt]
                            submission = CompetitionTaskSubmission.objects.create(
                                user=user,
                                task=task,
                                content=random.choice(files),
                            )
                        submission.save()
                        submission.send_on_review()
                        self.stdout.write(
                            f"Created submission for task '{task.title}' by user '{user.username}'"
                        )

    def create_states(self, competitions, users):
        for comp in competitions:
            for user in comp.participants.all():
                state_obj, created = State.objects.get_or_create(
                    user=user,
                    competition=comp,
                    defaults={
                        "state": "started",
                        "changed_at": timezone.now() - timedelta(days=random.randint(1, 30)),
                    },
                )
                self.stdout.write(
                    f"Created state '{state_obj.state}' for user '{user.username}' in competition '{comp.title}'"
                )
