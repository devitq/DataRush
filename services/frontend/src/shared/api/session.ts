import { userFetch } from ".";
import { Task, TaskSolution, TaskAttachment } from "../types/task";
import { v4 as uuidv4 } from "uuid";

export const getCompetitionTasks = async (competitionId: string) => {
  return await userFetch<Task[]>(`/competitions/${competitionId}/tasks`);
};

export const getTaskSolutionHistory = async (
  competitionId: string,
  taskId: string,
) => {
  return await userFetch<TaskSolution[]>(
    `/competitions/${competitionId}/tasks/${taskId}/history`,
  );
};

export const getTaskAttachments = async (
  competitionId: string,
  taskId: string,
) => {
  return await userFetch<TaskAttachment[]>(
    `/competitions/${competitionId}/tasks/${taskId}/attachments`,
  );
};

export const submitTaskSolution = async (
  competitionId: string,
  taskId: string,
  solution: string | File,
) => {
  const formData = new FormData();

  if (typeof solution === "string") {
    const textFile = new File([solution], uuidv4(), {
      type: "text/plain",
    });
    formData.append("content", textFile);
  } else {
    formData.append("content", solution);
  }

  return await userFetch(
    `/competitions/${competitionId}/tasks/${taskId}/submit`,
    {
      method: "POST",
      body: formData,
    },
  );
};
