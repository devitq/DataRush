export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  in_competition_position: number;
  points: number;
  max_attempts: number | null;
}

export interface TaskAttachment {
  id: string;
  file: string;
  public: boolean;
}

export enum TaskType {
  INPUT = "input",
  FILE = "review",
  CODE = "checker",
}

export enum TaskStatus {
  DEFAULT = "default",
  CORRECT = "correct",
  PARTIAL = "partial",
  WRONG = "wrong",
  CHECKING = "checking",
}

export interface TaskSolution {
  id: string;
  timestamp: string;
  earned_points: number;
  content: string;
  status: TaskSolutionStatus;
}

export enum TaskSolutionStatus {
  SENT = "sent",
  CHECKED = "checked",
  CHECKING = "checking",
}
