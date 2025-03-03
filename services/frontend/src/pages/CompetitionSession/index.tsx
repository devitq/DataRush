import { useState, useEffect } from "react";
import { useParams, Navigate   } from "react-router-dom";
import CompetitionHeader from "./components/CompetitionHeader";
import TaskContent from "./components/TaskContent";
import TaskSolution from "./modules/TaskSolution";
import { getCompetitionTasks, submitTaskSolution } from "@/shared/api/session";
import { getCompetition, getCompetitionResults } from "@/shared/api/competitions";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskType } from "@/shared/types/task";

const CompetitionSession = () => {
  const { id, taskId } = useParams<{ id: string; taskId?: string }>();
  const [answer, setAnswer] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isReloading, setIsReloading] = useState(false);
  const competitionId = id || "";
  const queryClient = useQueryClient();

  const competitionQuery = useQuery({
    queryKey: ["competition", competitionId],
    queryFn: () => getCompetition(competitionId),
    enabled: !!competitionId,
  });

  const tasksQuery = useQuery({
    queryKey: ["competitionTasks", competitionId],
    queryFn: () => getCompetitionTasks(competitionId),
    enabled: !!competitionId,
  });

  const resultsQuery = useQuery({
    queryKey: ["competitionResults", competitionId],
    queryFn: () => getCompetitionResults(competitionId),
    enabled: !!competitionId,
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!currentTask || !competitionId) throw new Error("Missing task or competition ID");
      
      if (currentTask.type === TaskType.FILE) {
        if (!selectedFile) throw new Error("No file selected");
        return submitTaskSolution(competitionId, taskId || "", selectedFile);
      } else {
        if (!answer.trim()) throw new Error("Answer is empty");
        return submitTaskSolution(competitionId, taskId || "", answer);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['solutionHistory', competitionId, taskId] 
      });
      
      queryClient.invalidateQueries({
        queryKey: ['competitionResults', competitionId]
      });
      
      setIsReloading(true);
      
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    },
    onError: (error) => {
      console.error("Error submitting solution:", error);
    }
  });

  const competition = competitionQuery.data;
  const tasks = [...(tasksQuery.data || [])].sort((a, b) => {
    return a.in_competition_position - b.in_competition_position;
  });
  const results = resultsQuery.data || [];
  const isLoading = tasksQuery.isLoading || competitionQuery.isLoading;
  const error = tasksQuery.error || competitionQuery.error 
    ? "Не удалось загрузить данные. Пожалуйста, попробуйте позже." 
    : null;

  const currentTask = tasks.find((t) => t.id === taskId) || null;

  if (!taskId && tasks.length > 0 && !isLoading) {
    return (
      <Navigate
        to={`/competition/${competitionId}/tasks/${tasks[0].id}`}
        replace
      />
    );
  }

  const handleSubmit = () => {
    if (!currentTask || !competitionId) return;
    
    if (currentTask.type === TaskType.FILE && !selectedFile) {
      console.error("No file selected");
      return;
    }
    
    if (currentTask.type !== TaskType.FILE && !answer.trim()) {
      console.error("Answer is empty");
      return;
    }
    
    submitMutation.mutate();
  };

  const competitionTitle = competition?.title || "Загрузка соревнования...";

  useEffect(() => {
    setAnswer("");
    setSelectedFile(null);
  }, [taskId]);

  const isSubmitting = submitMutation.isPending || isReloading;

  return (
    <div className="flex min-h-screen flex-col">
      <CompetitionHeader
        title={competitionTitle}
        tasks={tasks}
        competitionId={competitionId}
        setAnswer={setAnswer}
        setSelectedFile={setSelectedFile}
        competitionType={competition?.type}
        startDate={competition?.start_date}
        endDate={competition?.end_date}
        taskResults={results}
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
                answer={answer}
                setAnswer={setAnswer}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
              {isReloading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="font-hse-sans text-gray-700">
                      Решение отправлено! Пожалуйста, подождите...
                    </p>
                  </div>
                </div>
              )}
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