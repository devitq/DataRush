import { apiFetch } from './index';
import { Task, TaskStatus } from '@/shared/types';

interface ApiTask {
  id: string;
  title: string;
  description: string;
  type: 'input' | 'file' | 'code';
  in_competition_position: number;
  points: number;
  status?: TaskStatus; 
}

/**
 * Fetches tasks for a specific competition
 * @param competitionId - The ID of the competition
 * @returns Promise with an array of tasks in the application's format
 */
export const getCompetitionTasks = async (competitionId: string): Promise<Task[]> => {
  try {
    const apiTasks: ApiTask[] = await apiFetch(`/api/v1/competitions/${competitionId}/tasks`);
    
    // Transform API tasks to application Task format
    return apiTasks.map(apiTask => transformApiTask(apiTask));
  } catch (error) {
    console.error('Failed to fetch competition tasks:', error);
    throw error;
  }
};

/**
 * Transforms an API task to the application's Task format
 */
const transformApiTask = (apiTask: ApiTask): Task => {
  return {
    id: apiTask.id,
    number: String(apiTask.in_competition_position), 
    status: apiTask.status || TaskStatus.Uncleared,
    solutionType: apiTask.type, 
    description: apiTask.description,
    maxScore: apiTask.points
  };
};


// export const submitTaskSolution = async (
//   competitionId: string, 
//   taskId: string, 
//   solution: string | File
// ): Promise<void> => {
//   const endpoint = `/api/v1/competitions/${competitionId}/tasks/${taskId}/submit`;
  
//   // Handle different solution types
//   if (typeof solution === 'string') {
//     // Text or code solution
//     await apiFetch(endpoint, {
//       method: 'POST',
//       body: { answer: solution }
//     });
//   } else {
//     // File solution
//     const formData = new FormData();
//     formData.append('file', solution);
    
//     await apiFetch(endpoint, {
//       method: 'POST',
//       body: formData
//     });
//   }
// };

/**
 * Gets the status of a task submission
 * This would be used to poll for updates after submission
 */
// export const getTaskSubmissionStatus = async (
//   competitionId: string,
//   taskId: string
// ): Promise<TaskStatus> => {
//   const response = await apiFetch(`/api/v1/competitions/${competitionId}/tasks/${taskId}/status`);
//   return response.status;
// };