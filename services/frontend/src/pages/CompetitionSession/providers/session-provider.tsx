import { Competition, CompetitionResult } from "@/shared/types/competition";
import { Task } from "@/shared/types/task";
import React from "react";

interface SessionContextType {
  currentTask: Task;
  currentTaskResults?: CompetitionResult;

  competition: Competition;
  tasks: Task[];
  results: CompetitionResult[];
}

const SessionContext = React.createContext<SessionContextType | undefined>(
  undefined,
);

interface SessionProviderProps {
  taskId?: string;

  competition: Competition;
  tasks: Task[];
  results: CompetitionResult[];

  children: React.ReactNode;
}

export const SessionProvider = ({
  taskId,
  competition,
  tasks,
  results,
  children,
}: SessionProviderProps) => {
  const sortedTasks = React.useMemo(
    () =>
      tasks.sort(
        (a, b) => a.in_competition_position - b.in_competition_position,
      ),
    [tasks],
  );

  const currentTask = React.useMemo(
    () => sortedTasks.find((t) => t.id === taskId) ?? sortedTasks.at(0),
    [taskId, sortedTasks],
  );

  const currentTaskResults = React.useMemo(
    () =>
      results.find((r) => r.position === currentTask?.in_competition_position),
    [results, currentTask],
  );

  if (!currentTask) {
    return;
  }

  return (
    <SessionContext.Provider
      value={{
        currentTask,
        currentTaskResults,
        competition,
        tasks: sortedTasks,
        results,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useCurrentTask = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useCurrentTask must be used within a SessionProvider");
  }
  return { task: context.currentTask, taskResults: context.currentTaskResults };
};

export const useCompetition = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useCompetition must be used within a SessionProvider");
  }
  return context.competition;
};

export const useTasks = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a SessionProvider");
  }
  return { tasks: context.tasks, results: context.results };
};
