import { Button } from "@/components/ui/button.tsx";
import { useSolutions } from "@/pages/CompetitionSession/providers/solution-provider.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import React from "react";
import {
  useCompetition,
  useCurrentTask,
} from "@/pages/CompetitionSession/providers/session-provider.tsx";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SolutionsStatusCard } from "../components/solutions-status-card";
import { cn } from "@/shared/lib/utils";
import { X } from "lucide-react";
import { CompetitionType } from "@/shared/types/competition";

export const SolutionActions = () => {
  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      <HistoryButton />
      <SubmitButton />
    </div>
  );
};

const SubmitButton = () => {
  const { validateAnswer, isSubmitting, submitAnswer } = useSolutions();
  const { taskResults } = useCurrentTask();
  const competition = useCompetition();

  const { task } = useCurrentTask();
  const { solutions } = useSolutions();

  const remainingAttempts = React.useMemo(
    () => (task.max_attempts ? task.max_attempts - solutions.length : 9999),
    [solutions.length, task.max_attempts],
  );

  const isDone = React.useMemo(
    () => taskResults?.result === taskResults?.max_points,
    [taskResults?.max_points, taskResults?.result],
  );

  console.log(task.max_attempts);

  return (
    <Button
      size={"lg"}
      className="relative flex-1 gap-4"
      onClick={submitAnswer}
      disabled={
        !validateAnswer() || isSubmitting || isDone || remainingAttempts <= 0
      }
    >
      {isSubmitting && <Spinner />}
      <span>
        {isDone
          ? "Задача решена!"
          : remainingAttempts > 0
            ? "Отправить решение"
            : "Попытки закончились"}
      </span>

      {remainingAttempts > 0 &&
        !isDone &&
        competition.type !== CompetitionType.EDU && (
          <div className="bg-popover absolute -top-3 right-2 rounded-full border px-3 py-1 text-sm">
            Попыток: {remainingAttempts}
          </div>
        )}
    </Button>
  );
};

const HistoryButton = () => {
  const { solutions } = useSolutions();

  if (solutions.length === 0) {
    return null;
  }

  return (
    <HistorySheet>
      <Button variant="secondary" size={"lg"}>
        История
      </Button>
    </HistorySheet>
  );
};

const HistorySheet = ({ children }: { children: React.ReactNode }) => {
  const { solutions, setCurrentSolution, currentSolution } = useSolutions();
  const { task } = useCurrentTask();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-screen overflow-y-auto p-5 sm:max-w-screen md:w-full md:max-w-[530px]">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">История решений</h2>
          <SheetClose className="cursor-pointer">
            <X size={20} />
          </SheetClose>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {solutions.map((solution) => (
            <SheetClose key={solution.id} asChild>
              <div
                role="button"
                className={cn(
                  "cursor-pointer rounded-md border-2 border-transparent transition-all active:scale-[0.98]",
                  {
                    "border-foreground": solution.id === currentSolution?.id,
                  },
                )}
                onClick={() => setCurrentSolution(solution)}
              >
                <SolutionsStatusCard
                  solution={solution}
                  taskPoints={task.points}
                />
              </div>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
