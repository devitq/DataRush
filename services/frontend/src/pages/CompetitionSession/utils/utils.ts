import { TaskStatus } from "@/shared/types";
import { SolutionStatus } from "@/shared/types/task";
const getTaskBgColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Uncleared: return "bg-[var(--color-task-uncleared)]";
    case TaskStatus.Checking: return "bg-[var(--color-task-checking)]";
    case TaskStatus.Correct: return "bg-[var(--color-task-correct)]";
    case TaskStatus.Partial: return "bg-[var(--color-task-partial)]";
    case TaskStatus.Wrong: return "bg-[var(--color-task-wrong)]";
  }
};

const getTaskTextColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Uncleared: return "text-[var(--color-task-text-uncleared)]";
    case TaskStatus.Checking: return "text-[var(--color-task-text-checking)]";
    case TaskStatus.Correct: return "text-[var(--color-task-text-correct)]";
    case TaskStatus.Partial: return "text-[var(--color-task-text-partial)]";
    case TaskStatus.Wrong: return "text-[var(--color-task-text-wrong)]";
  }
};

const getSolutionBgColor = (status: SolutionStatus, earned_points: number, maxPoints: number): string => {
  switch (status) {
    case SolutionStatus.SENT: return "text-[var(--color-task-uncleared)]";
    case SolutionStatus.CHECKING: return "text-[var(--color-task-checking)]";
    case SolutionStatus.CHECKED: {
      if (earned_points === 0) return "text-[var(--color-task-wrong)]";
      else if (earned_points === maxPoints) "text-[var(--color-task-correct)]";
      return "text-[var(--color-task-partial)]";
    }
  }
}

const getSolutionTextColor = (status: SolutionStatus, earned_points: number, maxPoints: number): string => {
  switch (status) {
    case SolutionStatus.SENT: return "text-[var(--color-task-text-uncleared)]";
    case SolutionStatus.CHECKING: return "text-[var(--color-task-text-checking)]";
    case SolutionStatus.CHECKED: {
      if (earned_points === 0) return "text-[var(--color-task-text-wrong)]";
      else if (earned_points === maxPoints) "text-[var(--color-task-text-correct)]";
      return "text-[var(--color-task-text-partial)]";
    }
  }
}

const getStatusText = (status: SolutionStatus, earned_points: number, maxPoints: number): string => {
  switch (status) {
    case SolutionStatus.SENT: return "Решение отправлено";
    case SolutionStatus.CHECKING: return "Решение проверяется";
    case SolutionStatus.CHECKED: {
      if (earned_points === 0) return "Неверный ответ";
      else if (earned_points === maxPoints) `Зачтено ${maxPoints}/${maxPoints} баллов`;
      return `Зачтено ${earned_points}/${maxPoints} баллов`;
    }
  }
}
export {getTaskBgColor, getTaskTextColor, getSolutionBgColor, getSolutionTextColor, getStatusText}