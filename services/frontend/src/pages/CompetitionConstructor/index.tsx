import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Task, TaskStatus } from "@/shared/types";
import ConstructorHeader from "./components/ConstructorHeader";
import TaskCreationModal from "./modules/TaskCreationModal";

const CompetitionConstructor = () => {
  const { id, taskId } = useParams<{ id: string; taskId?: string }>();
  const navigate = useNavigate();
  const [competitionTitle, setCompetitionTitle] = useState("Новая олимпиада");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const isSettings = taskId === "settings";
  
  const handleOpenTaskModal = () => {
    setIsTaskModalOpen(true);
  };
  
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
  };
  
  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      number: taskData.number || `${tasks.length + 1}`,
      status: TaskStatus.Uncleared,
      solutionType: taskData.solutionType || "input",
      description: taskData.description || "",
      requirements: taskData.requirements,
      attachments: taskData.attachments || []
    };
    
    setTasks([...tasks, newTask]);
    setIsTaskModalOpen(false);
    navigate(`/constructor/${id}/tasks/${newTask.id}`);
  };
  
  if (!taskId) {
    if (tasks.length > 0) {
      return <Navigate to={`/constructor/${id}/tasks/${tasks[0].id}`} replace />;
    } else {
      return <Navigate to={`/constructor/${id}/tasks/settings`} replace />;
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ConstructorHeader 
        title={competitionTitle}
        tasks={tasks} 
        competitionId={id || ""}
        onAddTaskClick={handleOpenTaskModal}
      />
      
      <TaskCreationModal 
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onCreateTask={handleCreateTask}
        taskCount={tasks.length}
      />
      
      <main className="flex-1 bg-[#F8F8F8] pb-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {isSettings ? (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6 font-hse-sans">Настройки олимпиады</h2>
              <p className="text-gray-500 font-hse-sans">
                Здесь будет форма настроек олимпиады
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6 font-hse-sans">
                {`Редактирование задачи ${tasks.find(t => t.id === taskId)?.number || ""}`}
              </h2>
              <p className="text-gray-500 font-hse-sans">
                Здесь будет форма редактирования задачи
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompetitionConstructor;