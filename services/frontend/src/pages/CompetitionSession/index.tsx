import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Task } from "@/shared/types";
import { getTaskBgColor, getTaskTextColor } from "./utils/utils";
import { mockTasks } from "@/shared/mocks/mocks";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const CompetitionRunnerPage = () => {
  const { id, taskId } = useParams<{ id: string; taskId?: string }>();
  const navigate = useNavigate();
  const [competitionTitle, setCompetitionTitle] = useState(
    "Олимпиада DANO 2025. Индивидуальный этап",
  );
  const [tasks] = useState<Task[]>(mockTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    taskId || null,
  );
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (taskId) {
      setSelectedTaskId(taskId);
    } else if (tasks.length > 0) {
      navigate(`/competition/${id}/tasks/${tasks[0].id}`, { replace: true });
    }
  }, [taskId, tasks, id, navigate]);

  const handleTaskClick = (taskId: string) => {
    if (selectedTaskId !== taskId) {
      setSelectedTaskId(taskId);
      navigate(`/competition/${id}/tasks/${taskId}`);
    }
  };

  const currentTask = tasks.find((t) => t.id === selectedTaskId);

  const handleSubmit = () => {
    console.log("Submitting answer:", answer);
    // Submit logic here
  };

  const handleHistoryClick = () => {
    console.log("View history");
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="py-3 text-center">
            <h1 className="font-hse-sans text-lg font-semibold">
              {competitionTitle}
            </h1>
          </div>

          <div className="no-scrollbar flex items-center justify-center gap-2 overflow-x-auto pb-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`${getTaskBgColor(task.status)} ${getTaskTextColor(task.status)} font-hse-sans flex-shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-all hover:brightness-95 ${selectedTaskId === task.id ? "scale-105 transform shadow-md" : ""}`}
                onClick={() => handleTaskClick(task.id)}
              >
                {task.number}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-[#F8F8F8] pb-8">
        <div className="mx-auto max-w-6xl px-4 py-6">
          {currentTask ? (
            <div className="font-hse-sans flex flex-col gap-6 md:flex-row">
              {/* Left Container - Task Description */}
              <div className="flex-1 rounded-lg bg-white p-6">
                <h2 className="mb-4 text-xl font-medium">
                  Задача {currentTask.number}
                </h2>

                <div className="prose max-w-none text-gray-700">
                  <p>
                    Рассмотрим последовательность чисел 2, 3, 5, 9, 17, 33, 65,
                    129, ... Каждый член этой последовательности, начиная с
                    третьего, равен сумме двух предыдущих членов.
                  </p>
                  <p className="mt-4">
                    Найдите сумму первых 15 членов этой последовательности.
                  </p>
                  <p className="mt-4">В ответе укажите целое число.</p>
                </div>
              </div>

              {/* Right Container - Solution Area */}
              <div className="flex flex-col gap-4 md:w-[350px]">
                {/* Solution Status Card */}
                <div
                  className={`${getTaskBgColor(currentTask.status)} relative rounded-lg p-4`}
                >
                  <div className="flex flex-col">
                    <span
                      className={`${getTaskTextColor(currentTask.status)} font-medium`}
                    >
                      Решение 12345
                    </span>
                    <span
                      className={`${getTaskTextColor(currentTask.status)} mt-1`}
                    >
                      Зачтено 5/10 баллов
                    </span>
                  </div>
                  <div className="absolute right-3 bottom-2 text-xs text-gray-600">
                    1 марта, 08:41
                  </div>
                </div>

                {/* Answer Input */}
                <div className="rounded-lg bg-white p-4">
                  <textarea
                    className="font-hse-sans h-32 w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Введите ответ"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between gap-3">
                  <Button
                    variant="outline"
                    className="font-hse-sans"
                    onClick={handleHistoryClick}
                  >
                    История
                  </Button>
                  <Button
                    className="font-hse-sans bg-yellow-400 text-black hover:bg-yellow-500"
                    onClick={handleSubmit}
                  >
                    Отправить решение
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg bg-white">
              <p className="font-hse-sans text-gray-500">Загрузка задания...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompetitionRunnerPage;
