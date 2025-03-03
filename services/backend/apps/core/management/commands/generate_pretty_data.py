import random
import uuid
from datetime import timedelta, datetime

from PIL.Image import Image
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.files.base import ContentFile, File
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.competition.models import Competition, State
from apps.review.models import Reviewer
from apps.task.models import (
    CompetitionTask,
    CompetitionTaskCriteria,
    CompetitionTaskSubmission, CompetitionTaskAttachment,
)
from apps.user.models import User, UserRole

# Примеры файлов с правильными ответами
ans1 = ContentFile(
    b"1984",
    name=f"submission_{uuid.uuid4().hex}.txt",
)
ans2 = ContentFile(
    b"3",
    name=f"submission_{uuid.uuid4().hex}.txt",
)
ans3 = ContentFile(
    b"42",
    name=f"submission_{uuid.uuid4().hex}.txt",
)
ans4 = ContentFile(
    b"11",
    name=f"submission_{uuid.uuid4().hex}.txt",
)
dataset = ContentFile(
    b"it is a dataset",
    name=f"dataset-{uuid.uuid4().hex}.txt",
)
dataset2 = ContentFile(
    b"it is a dataset",
    name=f"dataset-{uuid.uuid4().hex}.csv",
)

now = timezone.now()

image_dir = f"{settings.BASE_DIR}/apps/core/contents/images"
f = open(f"{image_dir}/dano.jpg", "rb")
dano_image = File(f, name="dano.jpg")

# Расширенный список соревнований, включая 3 новых
competitions = [
    {
        "obj": None,  # будет заполнено позже
        "title": "DANO. Финал",
        "description": "Олимпиада по анализу данных от Т-Банка и ВШЭ",
        "start_date": now - timedelta(days=2),
        "end_date": now + timedelta(days=5),
        "type": "competitive",
        "participation_type": "solo",
        "image": dano_image,
        "tasks": [
            {
                "obj": None,
                "title": "Задача 1",
                "description": (
                    """
На маркетплейсе «Е-шопинг» продаются различные товары. Одна из задач аналитика — 
прогнозировать, сколько товаров будет продаваться при определенной цене. В ходе исследований 
был выявлен вид зависимости:\n
$Q(P) = Q_0 \\times e^{E \\times \\frac{P_0 - P}{P_0}}$\n
где Q — это количество проданных единиц товара при цене P,
Q 0 — количество проданных единиц товара при цене P0 ,
E — коэффициент чувствительности количества проданных единиц товара к изменению
цены.
1. Кофемашину «Кофе каждый день» купили 200 000 раз (Q 0 ) при цене 20 000 ₽ (P 0
).
Позже продавец поднял цену на 5 000 ₽, при этом продажи сократились на 24 000
штук. Какой коэффициент чувствительности Е имеет этот товар? Ответ округлите
до двух знаков после запятой.
2. Потом продавец решил поставить новую цену на эту же модель: 22 000 ₽. Сколько
продаж согласно нашей зависимости будет у этого товара? Используйте результаты
предыдущего пункта. Ответ округлите до целых.
3. Другой продавец предлагает на нашем маркетплейсе кухонные ножи и сковородки.
Благодаря исследованиям были получены следующие формулы зависимостей
количества проданных товаров:

Найдите, сколько заработает продавец при цене по 3 000 ₽ за нож и сковороду
при условии, что себестоимость ножа — 1 000 ₽, а сковородки — 2 000 ₽.Ответ
округлите до целых.
Найдите, сколько заработает продавец при цене по 3 000 ₽ за нож и сковороду при условии, 
что себестоимость ножа — 1 000 ₽, а сковородки — 2 000 ₽. Ответ округлите до целых.
                    """.strip()
                ),
                "type": CompetitionTask.CompetitionTaskType.INPUT.value,
                "points": 3,
                "submission_reviewers_count": 2,
                "max_attempts": 20,
                "correct_answer_file": ans1,
            },
            {
                "obj": None,
                "title": "Задача 2",
                "description": "Найдите максимальную зарплату программиста из датасета на питоне",
                "type": CompetitionTask.CompetitionTaskType.CHECKER.value,
                "attachment": dataset,
                "attachment_path": "dataset",
                "points": 25,
                "submission_reviewers_count": 2,
                "max_attempts": 50,
            },
            {
                "obj": None,
                "title": "Задача 3",
                "attachment": dataset2,
                "attachment_path": "dataset2",
                "description": """
Небольшой интернет-магазин собрал данные о действиях пользователей на своем сайте
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
Ваша задача — проанализировать поведение пользователей, выявить возможные
проблемы при покупке и предложить решения. Ваш анализ поможет понять, на каком
этапе воронки магазин теряет покупателей и какие изменения можно внести, чтобы
улучшить процесс покупок в интернет-магазине.
Как правило, количество пользователей на каждом последующем шаге уменьшается,
и такая ситуация называется “воронкой”. Конверсия — это отношение количества
пользователей на каком-то одном шаге к количеству пользователей на одном
из предыдущих шагов. Например, конверсия из визита сайта в добавление товара
в корзину рассчитывается так: количество пользователей, добавивших товар в корзину,
делится на количество пользователей, посетивших сайт.
Вам нужно изучить воронку конверсии, которая показывает, как пользователи переходят
от одного шага к другому на сайте. В нашем случае воронка состоит из следующих шагов:
1. Посещение сайта.
2. Просмотр карточки товара.
3. Добавление товара в корзину.
4. Покупка.
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
                        "max_value": 5,
                    },
                    {
                        "obj": None,
                        "name": "Правильность",
                        "slug": "correctness",
                        "description": "Точность вычислений",
                        "max_value": 5,
                    },
                ],
            },
        ],
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
                "description": """
Конверсия — это доля клиентов, перешедших с одного этапа на другой. Например,
на сайт с заявками на кредитные карты зашли 50 человек, после ознакомления
с условиями заявку на оформление карты (далее — заявку) оставили только 45
из них. В данном случае конверсия составляет 90% = 45/50.
Рассмотрим следующую ситуацию. В ноябре сайт посетили 100 мужчин и 100
женщин, при этом из них заявки оставили 10 мужчин и всего 5 женщин.
    1. Посчитайте конверсии для мужчин и для женщин из захода на сайт
в оформление заявки.
    2. Посчитайте общую конверсию для всех пользователей.
    3. В декабре была проведена дополнительная рекламная компания, и общее
число зашедших на сайт стало больше. При этом конверсия для мужчин стала
равна 12%, а для женщин — 7%. Может ли быть такое, что общая конверсия
в декабре упала? Если да, то приведите численный пример. Если нет —
докажите.
    4. При условии увеличения конверсий у мужчин и у женщин до 12% и 7%
соответственно в каком интервале будет лежать общая конверсия? Обоснуйте
свой ответ.
                """.strip(),
                "type": CompetitionTask.CompetitionTaskType.INPUT.value,
                "points": 3,
                "submission_reviewers_count": 2,
                "correct_answer_file": ans2,
            },
            {
                "obj": None,
                "title": "Задача 2",
                "description": """
Каждый день Дима звонит в пекарню, чтобы узнать, есть ли сегодня в продаже его
любимые булочки с повидлом. За последние 3 дня булочки были в наличии 2 раза,
а 1 раз их не было.
Пусть переменная Х = 0, если булочек нет, и Х = 1, если булочки есть. Наличие
булочек в конкретный день не зависит от наличия булочек в любой другой день.
    1. Сколько наблюдений собрал Дима? Выпишите все значения из его выборки
через запятую. Посчитайте для этой выборки среднее значение Х, дисперсию Х.
В какой доле случаев булочки были в наличии?
    2. Пусть p — вероятность того, что булочки в наличии (p не может быть меньше 0
и больше 1. Например, p может быть равно 0,2 = 1/5 — то есть в одном из пяти
случаев булочки в наличии). Чему равна вероятность, что сегодня булочки
есть, а завтра их не будет? Чему равна вероятность, что за два дня в один день
булочки будут, а в другой — не будут? (Напишите два выражения, зависящие
от p.)
    3. Чему равна вероятность получения наблюдений как у Димы? (Напишите одно
выражение, зависящее от p.)
    4. При каком значении p вероятность получить выборку как у Димы максимальна?
Вычислите его. Как это значение соотносится с наблюдениями Димы?
    5. Дима нашел значение p из предыдущего пункта и сделал вывод, что
на следующий день булочки испекут с вероятностью p. Верный ли вывод сделал
Дима? Поясните свой ответ.
    6. Рядом с домом Димы открыли новую пекарню, где тоже делают булочки
с повидлом. Дима решил сравнить две пекарни. Для этого он собрал выборку
за 100 дней: в новой пекарне булочки были в наличии 70 дней, в старой — 60
дней. Какую гипотезу может проверить Дима? Какой механизм, может лежать
в основе этой гипотезы? При описании механизма вы можете сами дополнить
историю Димы (например, предположить расположение старой пекарни,
себестоимость повидла и другое, что могло бы помочь объяснить гипотезу,
необязательно рассматривать приведенные примеры). Помогите Диме
проверить описанную вами гипотезу. Есть ли разница в производительности
между новой пекарней и старой?
                """.strip(),
                "type": CompetitionTask.CompetitionTaskType.REVIEW.value,
                "points": 15,
                "submission_reviewers_count": 2,
                "criteries": [
                    {
                        "obj": None,
                        "name": "Хорошесть отзыва",
                        "slug": "validity",
                        "description": "Критерий качества отзыва",
                        "max_value": 10,
                    },
                    {
                        "obj": None,
                        "name": "Подробность",
                        "slug": "detail",
                        "description": "Насколько подробно расписан ответ",
                        "max_value": 5,
                    },
                ],
            },
            {
                "obj": None,
                "title": "Задача 3",
                "description": """
Вы аналитик ведущей игровой компании GameMasters Inc., которая
специализируется на разработке мобильных игр. Ваши коллеги разработали
обновленный игровой магазин, в котором игроки могут приобретать внутриигровые
предметы и суперспособности. Ваша задача — провести сравнение, чтобы
определить, как внедрение нового магазина повлияло на поведение пользователей
в игре.
Для этого пользователи были разделены на две равные группы случайным образом:
А — пользователи, которым доступен только старый магазин;
B — пользователи, которым доступен только обновленный магазин.
Спустя месяц после запуска по каждому пользователю из каждой группы были
посчитаны следующие метрики:
‘revenue_per_user’ — доход, который был получен от пользователя за период;
‘orders_cnt_per_user’ — количество заказов, которое совершено пользователем
за период;
‘converted_from_main_screen_to_item_card_screen’ — флаг захода на экран
с товарами (0 — если пользователь не заходил на карточку товара, 1 — если
заходил).
В таблице приведены значения этих метрик. Также в ней находится столбец ‘group’,
в котором указано, к какой группе (A или B) относится пользователь и столбец
‘period’ — характеризующий значение метрик до начала теста и во время проведения
теста. На карточке товара содержится дополнительная информация, фотография
и его характеристики. Однако оплатить товар можно и без захода на карточку
товара.
Задача: сравните группы по каждой метрике и сделайте вывод о том, стоит ли
продолжить внедрение обновленного магазина или нужно вернуть старый
                """.strip(),
                "type": CompetitionTask.CompetitionTaskType.CHECKER.value,
                "points": 30,
                "submission_reviewers_count": 2,
            },
        ],
    },
    {
        "obj": None,
        "title": "Data Challenge 2025(FAKE DANO)",
        "description": """
Ну типо дано
        """.strip(),
        "start_date": now - timedelta(days=1),
        "end_date": now + timedelta(days=10),
        "type": "competitive",
        "participation_type": "solo",
        "tasks": [
            {
                "obj": None,
                "title": "Анализ трендов", # TODO сюда добавить бд
                "description": """ 
Скачайте базу данных со специальной страницы (https://dano.hse.ru/data), изучите ее более
внимательно: посмотрите на переменные, посчитайте описательные статистики, постройте
предварительные графики и таблицы, обратите внимание на выбросы.
Продумайте все детали: исследовательский вопрос, гипотезу, механизм и пр.
Разработайте дизайн исследования:
    • что вам нужно для того, чтобы ответить на исследовательский вопрос
    • что нужно чтобы проверить ту или иную гипотезу
    • какие таблицы и графики вам понадобятся
    • какую информацию из них можно извлечь
    • как интерпретировать получаемые результаты
    • помогает ли это в вашем исследовании
    • несет ли полезную информацию
    • действительно ли эти построенные таблицы и графики необходимы и продвигают ваш
проект или может быть необходимы другие
    • какие методы и модели вам нужны
    • в какой последовательности выполнять все расчеты и построения
Обращайте особое внимание на то, что все эти процедуры должны быть оправданы и
продвигать вас в направлении поиска ответа на исследовательский вопрос.
Распределите задачи между членами команды. Установите сроки. Придерживайтесь взятых
на себя обязательств и данных друг другу обещаний – делайте все в срок. Обсуждайте между
собой полученные результаты, ищите наиболее удачный способ проверить ваши гипотезы,
наиболее удачные графики и таблицы. Советуйтесь с ментором, обращайтесь к нему за
помощью – его задача помочь вам отобрать правильные идеи и подсказать как их технически
реализовать.
Заведите общее облачное пространство, где будут хранится все ваши результаты.
Структурируйте, создавайте необходимые папки, называйте папки и документы говорящими
именами, оставляйте комментарии
                """.strip(),
                "type": CompetitionTask.CompetitionTaskType.REVIEW.value,
                "points": 20,
                "submission_reviewers_count": 3,
                "max_attempts": 2,
                "attachment": dataset,
                "attachment_path": "dataset",
                "criteries": [
                    {
                        "obj": None,
                        "name": "Качество анализа",
                        "slug": "analysis_quality",
                        "description": "Глубина анализа данных",
                        "max_value": 10,
                    },
                    {
                        "obj": None,
                        "name": "Обоснованность выводов",
                        "slug": "insight",
                        "description": "Логичность выводов",
                        "max_value": 10,
                    },
                ],
            },
            {
                "obj": None,
                "title": "Ещё задачка",
                "description": """
Как известно, Израиль является одной из лидирующих стран по темпам вакцинации. По
данным на июнь 2021 г. в стране вакцинировано 60% граждан (85% взрослого населения).
Однако среди заразившихся в этом же месяце (июне 2021 года), как признали власти
Израиля, примерно половина была уже вакцинирована. Что можно сказать об
эффективности вакцины на основании этих данных?
    1) Данные не свидетельствуют об эффективности вакцины, т. к. вероятность
заразиться составляет 50%, независимо от того, вакцинировался человек или нет
    2) Данные не свидетельствуют об эффективности вакцины, т. к. среди
вакцинированных есть заразившиеся
    3) Данные свидетельствуют об эффективности вакцины, т. к. если бы она не работала,
доля вакцинированных среди заболевших была бы равна доле вакцинированных
среди всего населения страны
    4) Данные свидетельствуют об эффективности вакцины, т. к. вакцинированные
переносят болезнь в более легкой форме
                """.strip(),
                "type": CompetitionTask.CompetitionTaskType.INPUT.value,
                "points": 15,
                "submission_reviewers_count": 2,
                "max_attempts": 50,
                "correct_answer_file": ans3
            },
            {
                "obj": None,
                "title": "Быстрый ответ",
                "description": "Сколько будет 6 * 7?",
                "type": CompetitionTask.CompetitionTaskType.INPUT.value,
                "points": 5,
                "submission_reviewers_count": 2,
                "max_attempts": 10,
                "correct_answer_file": ans3,
            },
        ],
    },
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
    },
    {
        "email": "alisa.kuznetsova@gmail.com",
        "username": "alisa_kuz",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "ivan.petrov@gmail.com",
        "username": "ivan_petrov",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "olga.sidorova@gmail.com",
        "username": "olga_sid",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "karim@gmail.com",
        "username": "karim",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "noble@gmail.com",
        "username": "noble",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "koller@gmail.com",
        "username": "koller",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "gold_checker@gmail.com",
        "username": "gold_checker",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "looka@gmail.com",
        "username": "looka",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "danil_malikov@gmail.com",
        "username": "danil_malikov",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "marina-looks@gmail.com",
        "username": "marina-looks",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "pasha@gmail.com",
        "username": "pasha",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "oleg-tinkov@gmail.com",
        "username": "oleg-tinkov",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
    {
        "email": "baron_ivanych@gmail.com",
        "username": "baron_ivanych",
        "password": "password123!",
        "role": UserRole.STUDENT.value,
    },
]

reviewers = [
    {
        "name": "Владислав",
        "surname": "Пикиневич",
        "token": "aa443163-9861-4b8d-b8f7-81ecd25f6088",
    },
    {
        "name": "Александр",
        "surname": "Шахов",
        "token": "d2e8904a-01dd-4f84-a8b0-8a60f1a3b6c0",
    },
    {
        "name": "Мария",
        "surname": "Иванова",
        "token": "e3f8904a-23cd-4f84-a8b0-9b70f1a4b7d1",
    },
    {
        "name": "Сергей",
        "surname": "Смирнов",
        "token": "f4g9015b-45de-5g95-b9c1-0c81g2b5c8e2",
    },
    {
        "name": "Паша",
        "surname": "Проверкин",
        "token": "f4g9015b-45de-5g95-b9c1-0c81g2b3c8e2",
    },
    {
        "name": "Илья",
        "surname": "Продкин",
        "token": "f4g9015b-45de-5g95-b8c1-0c81g2b5c8e2",
    },
    {
        "name": "Влад",
        "surname": "Проверкин",
        "token": "f4g9015b-45de-5g95-b9c1-0c81g2b5c8e1",
    },
    {
        "name": "Сашка",
        "surname": "Пашкин",
        "token": "f4g9015b-45de-5g95-b9c1-1c81g2b5c8e2",
    },
    {
        "name": "Чарльз",
        "surname": "Проверкин",
        "token": "b4g9015b-45de-5g95-b9g1-0c81g2b5c8e2",
    },
    {
        "name": "Тимурка",
        "surname": "Проверкин",
        "token": "f4g9015b-25de-5g95-b9c1-0c81g2b5c8e2",
    },
    {
        "name": "Александр",
        "surname": "Даношкин",
        "token": "f4g9015t-45de-5g95-b9c1-0c81g2b5c8e2",
    },
    {
        "name": "Паша",
        "surname": "Проверкин",
        "token": "f4g9015r-45de-5g95-b9c1-0c81g2b5c8e2",
    },
    {
        "name": "Лука",
        "surname": "Проверкин",
        "token": "f4g9015e-45de-5g95-b9c1-0c81g2b5c8e2",
    },
    {
        "name": "Кирилл",
        "surname": "Проверкин",
        "token": "f4g9015w-45de-5g95-b9c1-0c81g2b5c8e2",
    },
    {
        "name": "Олег",
        "surname": "Проверкин",
        "token": "f4g9015q-45de-5g95-b9c1-0c81g2b5c8e2",
    },
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

        f.close()

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

            if competition.get("image"):
                competition_obj.image_url = competition['image']
                competition_obj.save()

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
                    in_competition_position=j+1,
                    competition=competition['obj'],
                    title=task['title'],
                    description=task['description'],
                    type=task['type'],
                    points=task['points'],
                    submission_reviewers_count=task['submission_reviewers_count'],
                    max_attempts=task.get('max_attempts'),
                )
                competitions[i]['tasks'][j]['obj'] = task_obj

                if task['type'] == CompetitionTask.CompetitionTaskType.INPUT.value:
                    task_obj.correct_answer_file = task['correct_answer_file']
                if task.get("attachment"):
                    CompetitionTaskAttachment.objects.create(
                        task=task_obj,
                        file=task['attachment'],
                        bind_at=task['attachment_path'],
                        public=True
                    )

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
                            pptx = File(f, name="presentation.pptx")
                            files = [pptx, pptx, dummy_content_txt]
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