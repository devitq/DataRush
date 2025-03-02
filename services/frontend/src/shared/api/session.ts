import { userFetch } from ".";
import { Task } from "../types/task";

export const getCompetitionTasks = async (competitionId: string) => {
  return await userFetch<Task[]>(`/competitions/${competitionId}/tasks`);
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
      body: { answer: solution }
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