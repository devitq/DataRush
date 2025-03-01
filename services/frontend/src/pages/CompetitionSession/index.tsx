import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Task } from "@/shared/types";
import { getTaskBgColor, getTaskTextColor } from "./utils/utils";
import { mockTasks } from "@/shared/mocks/mocks";
import { Button } from "@/components/ui/button";

const CompetitionSessionPage = () => {
  const { id, taskId } = useParams<{ id: string; taskId?: string }>();
  const navigate = useNavigate();
  const [competitionTitle, setCompetitionTitle] = useState("Олимпиада DANO 2025. Индивидуальный этап");
  const [tasks] = useState<Task[]>(mockTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(taskId || null);
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

  const currentTask = tasks.find(t => t.id === selectedTaskId);
  
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
          
          <div className="flex items-center justify-center gap-2 pb-3 overflow-x-auto no-scrollbar">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`${getTaskBgColor(task.status)} ${getTaskTextColor(task.status)} 
                  rounded-lg px-3 py-1.5 font-medium text-sm font-hse-sans cursor-pointer 
                  transition-all hover:brightness-95 flex-shrink-0
                  ${selectedTaskId === task.id ? 'shadow-md transform scale-105' : ''}`}
                onClick={() => handleTaskClick(task.id)}
              >
                {task.number}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-[#F8F8F8] min-h-screen pb-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {currentTask ? (
            <div className="flex flex-col md:flex-row gap-6 font-hse-sans">
              {/* Left Container - Task Description */}
              <div className="flex-1 bg-white rounded-lg p-6">
                <h2 className="text-xl font-medium mb-4">
                  Задача {currentTask.number}
                </h2>
                
                <div className="prose max-w-none text-gray-700">
                  <p>
                    Рассмотрим последовательность чисел 2, 3, 5, 9, 17, 33, 65, 129, ... 
                    Каждый член этой последовательности, начиная с третьего, равен сумме двух предыдущих членов.
                  </p>
                  <p className="mt-4">
                    Найдите сумму первых 15 членов этой последовательности.
                  </p>
                  <p className="mt-4">
                    В ответе укажите целое число.
                  </p>
                </div>
              </div>
              
              {/* Right Container - Solution Area */}
              <div className="md:w-[350px] flex flex-col gap-4">
                {/* Solution Status Card */}
                <div className={`${getTaskBgColor(currentTask.status)} rounded-lg p-4 relative`}>
                  <div className="flex flex-col">
                    <span className={`${getTaskTextColor(currentTask.status)} font-medium`}>
                      Решение 12345
                    </span>
                    <span className={`${getTaskTextColor(currentTask.status)} mt-1`}>
                      Зачтено 5/10 баллов
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-3 text-xs text-gray-600">
                    1 марта, 08:41
                  </div>
                </div>
                
                {/* Answer Input */}
                <div className="bg-white rounded-lg p-4">
                  <textarea 
                    className="w-full h-32 border border-gray-300 rounded-md p-3 font-hse-sans text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Введите ответ"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 justify-between">
                  <Button 
                    variant="outline" 
                    className="font-hse-sans"
                    onClick={handleHistoryClick}
                  >
                    История
                  </Button>
                  <Button 
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-hse-sans"
                    onClick={handleSubmit}
                  >
                    Отправить решение
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40 bg-white rounded-lg">
              <p className="font-hse-sans text-gray-500">
                Загрузка задания...
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompetitionSessionPage;
