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
  if (typeof solution === 'string') {
    return await userFetch(endpoint, {
      method: 'POST',
      body: { content: solution }
    });
  } else {
    const formData = new FormData();
    formData.append('file', solution);
    
    return await userFetch(endpoint, {
      method: 'POST',
      body: formData
    });
  }
};