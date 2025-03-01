import { TaskStatus } from "@/shared/types";
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

export {getTaskBgColor, getTaskTextColor}