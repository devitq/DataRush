import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Task } from "@/shared/types";
import { mockSolutions, mockTasks } from "@/shared/mocks/mocks";
import CompetitionHeader from "./components/CompetitionHeader";
import TaskContent from "./components/TaskContent";
import TaskSolution from "./modules/TaskSolution";

const CompetitionSession = () => {
  const { id, taskId } = useParams<{ id: string; taskId?: string }>();
  const [tasks] = useState<Task[]>(mockTasks);
  const [answer, setAnswer] = useState("");

  const currentTask = tasks.find((t) => t.id === taskId) || tasks.at(0);

  if (!taskId && tasks.length > 0) {
    return <Navigate to={`/competition/${id}/tasks/${tasks[0].id}`} replace />;
  }

  const handleSubmit = () => {
    console.log("Submitting answer:", answer);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <CompetitionHeader
        title="Олимпиада DANO 2025. Индивидуальный этап"
        tasks={tasks}
        competitionId={id || ""}
      />

      <main className="flex-1 bg-[#F8F8F8] pb-8">
        <div className="mx-auto max-w-6xl px-4 py-6">
          {currentTask ? (
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
              <p className="font-hse-sans text-gray-500">Загрузка задания...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompetitionSession;
