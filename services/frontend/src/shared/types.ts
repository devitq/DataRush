enum CompetitionStatus {
  InProgress = "В процессе",
  NotParticipating = "Не участвую",
  Completed = "Завершено",
}

interface Competition {
  id: string;
  name: string;
  imageUrl: string;
  isOlympics: boolean;
  status: CompetitionStatus;
  description?: string;
}

type TaskStatus = "uncleared" | "checking" | "correct" | "partial" | "wrong";

interface Task {
  id: string;
  number: string;
  status: TaskStatus;
}

export { CompetitionStatus };
export type { Competition, TaskStatus, Task };
