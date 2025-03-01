import { TaskStatus } from "@/shared/types/types";

const getTaskBgColor = (status: TaskStatus): string => {
  switch (status) {
    case "uncleared": return "bg-[var(--color-task-uncleared)]";
    case "checking": return "bg-[var(--color-task-checking)]";
    case "correct": return "bg-[var(--color-task-correct)]";
    case "partial": return "bg-[var(--color-task-partial)]";
    case "wrong": return "bg-[var(--color-task-wrong)]";
  }
};

const getTaskTextColor = (status: TaskStatus): string => {
  switch (status) {
    case "uncleared": return "text-[var(--color-task-text-uncleared)]";
    case "checking": return "text-[var(--color-task-text-checking)]";
    case "correct": return "text-[var(--color-task-text-correct)]";
    case "partial": return "text-[var(--color-task-text-partial)]";
    case "wrong": return "text-[var(--color-task-text-wrong)]";
  }
};

export {getTaskBgColor, getTaskTextColor}