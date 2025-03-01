import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Task } from "@/shared/types";
import { mockTasks } from "@/shared/mocks/mocks";
import CompetitionHeader from "./components/CompetitionHeader";
import TaskContent from "./components/TaskContent";
import TaskSolution from "./modules/TaskSolution";

const CompetitionSessionPage = () => {
  const { id, taskId } = useParams<{ id: string; taskId?: string }>();
  const [tasks] = useState<Task[]>(mockTasks);
  const [answer, setAnswer] = useState("");

  const currentTask = tasks.find(t => t.id === taskId) || null;

  if (!taskId && tasks.length > 0) {
    return <Navigate to={`/competition/${id}/tasks/${tasks[0].id}`} replace />;
  }

  const handleSubmit = () => {
    console.log("Submitting answer:", answer);
  };
  
  const handleHistoryClick = () => {
    console.log("View history");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <CompetitionHeader 
        title="Олимпиада DANO 2025. Индивидуальный этап"
        tasks={tasks} 
        competitionId={id || ""}  
      />
      
      <main className="flex-1 bg-[#F8F8F8] pb-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {currentTask ? (
            <div className="flex flex-col md:flex-row gap-6 font-hse-sans">
              <TaskContent task={currentTask} />
              <TaskSolution 
                task={currentTask}
                answer={answer}
                setAnswer={setAnswer}
                onSubmit={handleSubmit}
                onHistoryClick={handleHistoryClick}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center h-40 bg-white rounded-lg">
              <p className="font-hse-sans text-gray-500">
                Загрузка задания...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompetitionSessionPage;