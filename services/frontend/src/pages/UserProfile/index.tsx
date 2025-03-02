import React from "react";
import { User } from "lucide-react";
import { useUserStore } from "@/shared/stores/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserProfile = () => {
  const user = useUserStore((state) => state.user);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <User size={40} className="text-blue-500" />
          )}
        </div>
        <div>
          <h1 className="font-hse-sans text-3xl font-bold">{user?.username}</h1>
          <p className="font-hse-sans text-gray-500">
            {user?.role || "Участник"} • На платформе с{" "}
            {new Date(user?.createdAt || Date.now()).toLocaleDateString("ru-RU", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="info" className="font-hse-sans">
            Информация
          </TabsTrigger>
          <TabsTrigger value="statistics" className="font-hse-sans">
            Статистика
          </TabsTrigger>
          <TabsTrigger value="achievements" className="font-hse-sans">
            Достижения
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <UserInfo />
        </TabsContent>

        <TabsContent value="statistics">
          <UserStatistics />
        </TabsContent>

        <TabsContent value="achievements">
          <UserAchievements />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const UserInfo = () => {
  const user = useUserStore((state) => state.user);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-hse-sans">Личная информация</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-hse-sans text-sm font-medium text-gray-500">
              Полное имя
            </h3>
            <p className="font-hse-sans mt-1">
              {user?.fullName || "Не указано"}
            </p>
          </div>

          <div>
            <h3 className="font-hse-sans text-sm font-medium text-gray-500">
              Email
            </h3>
            <p className="font-hse-sans mt-1">{user?.email || "Не указано"}</p>
          </div>

          <div>
            <h3 className="font-hse-sans text-sm font-medium text-gray-500">
              Учебное заведение
            </h3>
            <p className="font-hse-sans mt-1">
              {user?.university || "Не указано"}
            </p>
          </div>

          <div>
            <h3 className="font-hse-sans text-sm font-medium text-gray-500">
              Специализация
            </h3>
            <p className="font-hse-sans mt-1">
              {user?.specialization || "Не указано"}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-hse-sans text-sm font-medium text-gray-500">
            О себе
          </h3>
          <p className="font-hse-sans mt-1">
            {user?.bio || "Пользователь пока не добавил информацию о себе."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const UserStatistics = () => {
  // Mock statistics data
  const statistics = {
    totalCompetitions: 12,
    completedCompetitions: 8,
    totalScore: 756,
    averageScore: 94.5,
    bestResult: {
      competition: "Олимпиада DANO 2024",
      place: 3,
      score: 97,
    },
    totalTasks: 86,
    solvedTasks: 72,
    tasksByStatus: {
      correct: 58,
      partial: 14,
      wrong: 9,
      unattempted: 5,
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Всего соревнований"
          value={statistics.totalCompetitions}
        />
        <StatCard
          title="Завершено соревнований"
          value={statistics.completedCompetitions}
        />
        <StatCard title="Всего баллов" value={statistics.totalScore} />
        <StatCard
          title="Средний балл"
          value={statistics.averageScore.toFixed(1)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-hse-sans">Лучший результат</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-hse-sans text-lg font-medium">
                {statistics.bestResult.competition}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-hse-sans text-gray-500">Место</span>
                <span className="font-hse-sans font-medium">
                  {statistics.bestResult.place}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-hse-sans text-gray-500">Баллы</span>
                <span className="font-hse-sans font-medium">
                  {statistics.bestResult.score}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-hse-sans">Решение задач</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-hse-sans">Всего задач</span>
                <span className="font-hse-sans font-medium">
                  {statistics.totalTasks}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-hse-sans">Решено задач</span>
                <span className="font-hse-sans font-medium">
                  {statistics.solvedTasks}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-hse-sans text-sm font-medium">
                Статусы решений
              </h4>
              <div className="h-6 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="flex h-full">
                  <div
                    className="bg-green-500"
                    style={{
                      width: `${
                        (statistics.tasksByStatus.correct /
                          statistics.totalTasks) *
                        100
                      }%`,
                    }}
                  ></div>
                  <div
                    className="bg-yellow-500"
                    style={{
                      width: `${
                        (statistics.tasksByStatus.partial /
                          statistics.totalTasks) *
                        100
                      }%`,
                    }}
                  ></div>
                  <div
                    className="bg-red-500"
                    style={{
                      width: `${
                        (statistics.tasksByStatus.wrong /
                          statistics.totalTasks) *
                        100
                      }%`,
                    }}
                  ></div>
                  <div
                    className="bg-gray-300"
                    style={{
                      width: `${
                        (statistics.tasksByStatus.unattempted /
                          statistics.totalTasks) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="font-hse-sans">
                    Верно ({statistics.tasksByStatus.correct})
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="font-hse-sans">
                    Частично ({statistics.tasksByStatus.partial})
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="font-hse-sans">
                    Неверно ({statistics.tasksByStatus.wrong})
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


const StatCard = ({ title, value }: { title: string; value: number | string }) => (
  <Card>
    <CardContent className="pt-6">
      <p className="font-hse-sans text-sm text-gray-500">{title}</p>
      <p className="font-hse-sans mt-2 text-3xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const UserAchievements = () => {
  const achievements = [
    {
      id: 1,
      name: "Первые шаги",
      description: "Участие в первом соревновании",
      imageUrl: "/achievements/first-steps.png",
      unlocked: true,
    },
    {
      id: 2,
      name: "Восходящая звезда",
      description: "Победа в соревновании",
      imageUrl: "/achievements/rising-star.png",
      unlocked: true,
    },
    {
      id: 3,
      name: "Мастер кода",
      description: "Решите 50 задач на программирование",
      imageUrl: "/achievements/code-master.png",
      unlocked: true,
    },
    {
      id: 4,
      name: "Бронзовый призер",
      description: "Займите 3 место в соревновании",
      imageUrl: "/achievements/bronze.png",
      unlocked: true,
    },
    {
      id: 5,
      name: "Серебряный призер",
      description: "Займите 2 место в соревновании",
      imageUrl: "/achievements/silver.png",
      unlocked: false,
    },
    {
      id: 6,
      name: "Золотой призер",
      description: "Займите 1 место в соревновании",
      imageUrl: "/achievements/gold.png",
      unlocked: false,
    },
    {
      id: 7,
      name: "Марафонец",
      description: "Участвуйте в 10 соревнованиях",
      imageUrl: "/achievements/marathon.png",
      unlocked: false,
    },
    {
      id: 8,
      name: "Идеальное решение",
      description: "Получите максимальные баллы за все задачи в соревновании",
      imageUrl: "/achievements/perfect.png",
      unlocked: false,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-hse-sans text-xl font-semibold">
        Разблокировано {achievements.filter(a => a.unlocked).length} из {achievements.length}
      </h2>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`flex flex-col items-center justify-center rounded-lg p-4 text-center ${
              achievement.unlocked ? "" : "opacity-40"
            }`}
          >
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              {achievement.imageUrl ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${achievement.imageUrl})` }}
                  ></div>
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-200 text-blue-700">
                  <span className="font-hse-sans text-xl font-bold">
                    {achievement.name.substring(0, 1)}
                  </span>
                </div>
              )}
            </div>
            <h3 className="font-hse-sans text-sm font-medium">
              {achievement.name}
            </h3>
            <p className="font-hse-sans mt-1 text-xs text-gray-500">
              {achievement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;