enum CompetitionStatus {
  InProgress = "В процессе",
  NotParticipating = "Не участвую",
  Completed = "Завершено",
}

enum TaskStatus {
  Uncleared = "uncleared",
  Checking = "checking",
  Correct = "correct",
  Partial = "partial",
  Wrong = "wrong"
}

interface Competition {
  id: string;
  name: string;
  imageUrl: string;
  isOlympics: boolean;
  status: CompetitionStatus;
  description?: string;
}

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

export { CompetitionStatus, TaskStatus };
export type { Solution, Competition, Task };
