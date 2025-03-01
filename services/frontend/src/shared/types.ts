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
type SolutionType = "input" | "file" | "code";

interface Solution {
  id: string,
  status: TaskStatus,
  date: string,
  score?: number,
  maxScore?: number,
}
interface Task {
  id: string;
  number: string;
  status: TaskStatus;
  solutionType: SolutionType;
}

export { CompetitionStatus };
export type { Solution, Competition, TaskStatus, Task };
