import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/modules/Navbar";
import { Task, TaskStatus } from "@/shared/types/types";



const sampleTasks: Task[] = [
  { id: "1", number: "1.1", status: "uncleared" },
  { id: "2", number: "1.2", status: "checking" },
  { id: "3", number: "1.3", status: "correct" },
  { id: "4", number: "2.1", status: "partial" },
  { id: "5", number: "2.2", status: "wrong" },
  { id: "6", number: "2.3", status: "uncleared" },
  { id: "7", number: "3.1", status: "checking" },
  { id: "8", number: "3.2", status: "correct" },
];

const CompetitionRunnerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [competitionTitle, setCompetitionTitle] = useState("Олимпиада DANO 2025. Индивидуальный этап");
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const getTaskBgColor = (status: TaskStatus): string => {
    switch (status) {
      case "uncleared": return "bg-[var(--color-task-uncleared)]";
      case "checking": return "bg-[var(--color-task-checking)]";
      case "correct": return "bg-[var(--color-task-correct)]";
      case "partial": return "bg-[var(--color-task-partial)]";
      case "wrong": return "bg-[var(--color-task-wrong)]";
    }
  };

  const getTaskTextColor = (status: TaskStatus): string => {
    switch (status) {
      case "uncleared": return "text-gray-600";
      case "checking": return "text-gray-800";
      case "correct": return "text-green-800";
      case "partial": return "text-green-700";
      case "wrong": return "text-red-800";
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  return (
    <>
      <Navbar />
      
      <div className="sticky top-16 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="py-4">
            <h1 className="text-xl font-semibold font-hse-sans">{competitionTitle}</h1>
          </div>
          
          <div className="flex items-center gap-3 pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={`${getTaskBgColor(task.status)} ${getTaskTextColor(task.status)} 
                  rounded-lg px-4 py-2 font-medium text-sm font-hse-sans cursor-pointer 
                  transition-transform hover:scale-105 flex-shrink-0
                  ${selectedTaskId === task.id ? 'ring-2 ring-black' : ''}`}
                onClick={() => handleTaskClick(task.id)}
              >
                {task.number}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {selectedTaskId ? (
            <div className="font-hse-sans">
              <h2 className="text-lg font-medium mb-4">
                Задание {tasks.find(t => t.id === selectedTaskId)?.number}
              </h2>
              <p className="text-gray-700">
                Содержание задания будет отображаться здесь.
              </p>
            </div>
          ) : (
            <p className="font-hse-sans text-gray-500">
              Выберите задание для просмотра
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CompetitionRunnerPage;