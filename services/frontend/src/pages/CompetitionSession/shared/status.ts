import { CompetitionResult } from "@/shared/types/competition";
import {
  TaskSolution,
  TaskSolutionStatus,
  TaskStatus,
} from "@/shared/types/task";

export const getTaskStatusByResult = (result?: CompetitionResult) => {
  if (!result || result.result === -2) {
    return TaskStatus.DEFAULT;
  }

  if (result.result === -1) {
    return TaskStatus.CHECKING;
  }

  if (result.result === 0) {
    return TaskStatus.WRONG;
  }

  if (result.result < result.max_points) {
    return TaskStatus.PARTIAL;
  }

  if (result.result === result.max_points) {
    return TaskStatus.CORRECT;
  }

  return TaskStatus.CHECKING;
};

export const getSolutionStatusLabel = (
  solution: TaskSolution,
  maxPoints: number,
) => {
  switch (solution.status) {
    case TaskSolutionStatus.SENT:
    case TaskSolutionStatus.CHECKING:
      return "Принято на проверку";

    case TaskSolutionStatus.CHECKED:
      if (solution.earned_points === 0) {
        return "Неверный ответ";
      }
      return `Зачтено ${solution.earned_points}/${maxPoints}`;
  }
};

export const getSolutionStatus = (
  solution: TaskSolution,
  maxPoints: number,
) => {
  switch (solution.status) {
    case TaskSolutionStatus.SENT:
    case TaskSolutionStatus.CHECKING:
      return TaskStatus.CHECKING;

    case TaskSolutionStatus.CHECKED:
      if (solution.earned_points === 0) {
        return TaskStatus.WRONG;
      }
      if (solution.earned_points === maxPoints) {
        return TaskStatus.CORRECT;
      }
      return TaskStatus.PARTIAL;
  }
};
