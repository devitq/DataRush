import React from "react";
import { TaskSolution, TaskType } from "@/shared/types/task.ts";
import {
  useCompetition,
  useCurrentTask,
} from "@/pages/CompetitionSession/providers/session-provider.tsx";
import { submitTaskSolution } from "@/shared/api/session.ts";
import { useQueryClient } from "@tanstack/react-query";

interface Answer {
  value: string;
  file: File | null;
}

interface SolutionContextType {
  solutions: TaskSolution[];

  currentSolution?: TaskSolution;
  setCurrentSolution: React.Dispatch<
    React.SetStateAction<TaskSolution | undefined>
  >;

  answer: Answer;
  updateValue: (value: string) => void;
  updateFile: (file: File | null) => void;

  validateAnswer: () => boolean;

  isSubmitting: boolean;
  submitAnswer: () => Promise<void>;
}

const SolutionContext = React.createContext<SolutionContextType | undefined>(
  undefined,
);

interface SolutionProviderProps {
  solutions: TaskSolution[];
  children?: React.ReactNode;
}

export const SolutionProvider = ({
  solutions: fetchedSolutions,
  children,
}: SolutionProviderProps) => {
  const competition = useCompetition();
  const { task } = useCurrentTask();
  const queryClient = useQueryClient();

  const [solutions, setSolutions] =
    React.useState<TaskSolution[]>(fetchedSolutions);

  React.useEffect(() => {
    if (fetchedSolutions.length > solutions.length) {
      setSolutions(fetchedSolutions);
    }
  }, [fetchedSolutions, solutions.length]);

  const sortedSolutions = React.useMemo(
    () =>
      solutions.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    [solutions],
  );

  const [currentSolution, setCurrentSolution] = React.useState<TaskSolution>();

  React.useEffect(() => {
    setCurrentSolution(sortedSolutions.at(0));
  }, [sortedSolutions]);

  const [answer, setAnswer] = React.useState<Answer>({
    value: "",
    file: null,
  });

  const updateValue = React.useCallback((value: string) => {
    setAnswer((prev) => ({ ...prev, value }));
  }, []);

  const updateFile = React.useCallback((file: File | null) => {
    setAnswer((prev) => ({ ...prev, file }));
  }, []);

  const validateAnswer = React.useCallback(() => {
    if ([TaskType.INPUT, TaskType.CODE].includes(task.type)) {
      return answer.value.trim().length > 0;
    }
    return !!answer.file;
  }, [answer.file, answer.value, task.type]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const submitAnswer = React.useCallback(async () => {
    if (!validateAnswer()) {
      return;
    }

    setIsSubmitting(true);

    await submitTaskSolution(
      competition.id,
      task.id,
      [TaskType.INPUT, TaskType.CODE].includes(task.type)
        ? answer.value
        : answer.file!,
    );

    await queryClient.invalidateQueries({
      queryKey: ["competitionResults", competition.id.toString()],
    });

    await queryClient.invalidateQueries({
      queryKey: [
        "solutionHistory",
        competition.id.toString(),
        task.id.toString(),
      ],
    });

    setIsSubmitting(false);
  }, [answer, competition.id, queryClient, task.id, task.type, validateAnswer]);

  React.useEffect(() => {
    console.log(currentSolution);
  }, [currentSolution]);

  return (
    <SolutionContext.Provider
      value={{
        solutions: sortedSolutions,
        currentSolution,
        setCurrentSolution,

        answer,
        updateValue,
        updateFile,

        validateAnswer,

        isSubmitting,
        submitAnswer,
      }}
    >
      {children}
    </SolutionContext.Provider>
  );
};

export const useSolutions = () => {
  const context = React.useContext(SolutionContext);
  if (context === undefined) {
    throw new Error("useSolutions must be used within SolutionProvider");
  }
  return context;
};
