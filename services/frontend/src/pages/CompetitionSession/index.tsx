import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { mockSolutions } from "@/shared/mocks/mocks";
import CompetitionHeader from "./components/CompetitionHeader";
import TaskContent from "./components/TaskContent";
import TaskSolution from "./modules/TaskSolution";
import { getCompetitionTasks } from "@/shared/api/session";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const CompetitionSession = () => {
  const { id, taskId } = useParams<{ id: string; taskId?: string }>();
  const [answer, setAnswer] = useState("");
  const competitionId = id || "";

  const tasksQuery = useQuery({
    queryKey: ["competitionTasks", competitionId],
    queryFn: () => getCompetitionTasks(competitionId),
    enabled: !!competitionId,
    // refetchOnWindowFocus: false, 
  });

  const tasks = tasksQuery.data || [];
  const isLoading = tasksQuery.isLoading;
  const error = tasksQuery.error ? "Не удалось загрузить задания. Пожалуйста, попробуйте позже." : null;

  const currentTask = tasks.find((t) => t.id === taskId) || null;

  if (!taskId && tasks.length > 0 && !isLoading) {
    return (
      <Navigate
        to={`/competition/${competitionId}/tasks/${tasks[0].id}`}
        replace
      />
    );
  }

  const handleSubmit = async () => {
    if (!currentTask || !competitionId) return;

    try {
      console.log("Solution submitted successfully");
    } catch (err) {
      console.error("Failed to submit solution:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <CompetitionHeader
        title="Олимпиада DANO 2025. Индивидуальный этап"
        tasks={tasks}
        competitionId={competitionId}
      />

      <main className="flex-1 bg-[#F8F8F8] pb-8">
        <div className="mx-auto max-w-6xl px-4 py-6">
          {isLoading ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-white">
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-gray-400" />
              <p className="font-hse-sans text-gray-500">Загрузка заданий...</p>
            </div>
          ) : error ? (
            <div className="flex h-40 items-center justify-center rounded-lg bg-white">
              <p className="font-hse-sans text-red-500">{error}</p>
            </div>
          ) : currentTask ? (
            <div className="font-hse-sans flex flex-col gap-6 md:flex-row">
              <TaskContent task={currentTask} />
              <TaskSolution
                task={currentTask}
                solutions={mockSolutions}
                answer={answer}
                setAnswer={setAnswer}
                onSubmit={handleSubmit}
              />
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg bg-white">
              <p className="font-hse-sans text-gray-500">Задание не найдено</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompetitionSession;