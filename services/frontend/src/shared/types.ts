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

enum ParticipationType {
  Solo = "solo",
  Team = "team"
}

interface Competition {
  id: string;
  name: string;
  imageUrl: string;
  isOlympics: boolean;
  status: CompetitionStatus;
  description?: string;
  startDate: Date;
  endDate: Date;
  participationType: ParticipationType
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
  description: string;
  maxScore: number;
  status: TaskStatus;
  solutionType: SolutionType;
  requirements?: string;
  attachments?: string[];
}

export { CompetitionStatus, TaskStatus, ParticipationType };
export type { Solution, Competition, Task };
