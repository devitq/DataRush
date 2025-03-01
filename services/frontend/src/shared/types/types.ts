enum Status {
  InProgress = 'В процессе',
  NotParticipating = 'Не участвую', 
  Completed = 'Завершено'
}

interface Competition {
  id: string;
  name: string;
  imageUrl: string;
  isOlympics: boolean;
  status: Status;
  description?: string;
}

type TaskStatus = "uncleared" | "checking" | "correct" | "partial" | "wrong";

interface Task {
  id: string;
  number: string; 
  status: TaskStatus;
}

export {Status}
export type {Competition, TaskStatus, Task}