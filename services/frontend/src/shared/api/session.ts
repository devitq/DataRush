import { userFetch } from ".";
import { Task, Solution, TaskAttachment } from "../types/task";

export const getCompetitionTasks = async (competitionId: string) => {
  return await userFetch<Task[]>(`/competitions/${competitionId}/tasks`);
};

export const getTaskSolutionHistory = async (competitionId: string, taskId: string) => {
  return await userFetch<Solution[]>(`/competitions/${competitionId}/tasks/${taskId}/history`);
};

export const getTaskAttachments = async (competitionId: string, taskId: string) => {
  return await userFetch<TaskAttachment[]>(`/competitions/${competitionId}/tasks/${taskId}/attachments`);
};


export const submitTaskSolution = async (
  competitionId: string, 
  taskId: string, 
  solution: string | File
) => {
  const endpoint = `/competitions/${competitionId}/tasks/${taskId}/submit`;
  const formData = new FormData();

  // туповатый костыль но для мвп сойдет
  if (typeof solution === 'string') {
    const textFile = new File([solution], 'solution.txt', { type: 'text/plain' });
    formData.append('content', textFile);
  } else {
    formData.append('content', solution);
  }
  
  return await userFetch(endpoint, {
    method: 'POST',
    body: formData
  });
};