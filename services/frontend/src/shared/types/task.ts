interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  in_competition_position: number;
  points: number;
}

export interface TaskAttachment {
  id: string;
  file: string;
  public: boolean;
}

enum TaskType {
  INPUT = "input",
  FILE = "checker",
  CODE = "review",
}

enum SolutionStatus {
  SENT = "sent",
  CHECKING = "checking",
  CHECKED = "checked",
}

interface Solution {
  id: string,
  status: SolutionStatus,
  timestamp: string,
  earned_points: number
}

export type {Task, Solution}
export {TaskType, SolutionStatus}