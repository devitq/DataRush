import { Task, TaskStatus } from "@/shared/types/task";
import {
  useCompetition,
  useCurrentTask,
  useTasks,
} from "../providers/session-provider.tsx";
import { CompetitionResult, CompetitionType } from "@/shared/types/competition";
import { Link, useNavigate } from "react-router";
import { cn } from "@/shared/lib/utils";
import React from "react";
import { getTaskStatusByResult } from "../shared/status.ts";
import { ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { finishCompetition } from "@/shared/api/competitions.ts";

export const CompetitionHeader = () => {
  const competition = useCompetition();
  const { task: currentTask } = useCurrentTask();
  const { tasks, results } = useTasks();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white px-4 sm:px-6 md:px-8 lg:px-11">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 py-5">
        <div className="flex items-center justify-between gap-5 overflow-hidden">
          <Link to={`/competitions/${competition.id}`}>
            <div className="text-muted-foreground flex items-center gap-2 sm:min-w-[110px] md:min-w-[200px]">
              <ChevronLeft size={18} />
              <span className="hidden sm:block">Назад</span>
            </div>
          </Link>
          <h3 className="overflow-hidden text-center text-xl font-semibold overflow-ellipsis whitespace-nowrap">
            {competition.title}
          </h3>
          <div className="flex flex-1 justify-end gap-4 sm:min-w-[110px] sm:flex-0 md:min-w-[200px]">
            <TimerNumbers className="hidden md:flex" />
            <CompleteButton />
          </div>
        </div>
        <div className="flex w-full flex-wrap justify-center gap-4">
          {tasks.map((t) => (
            <NavigationTask
              key={t.id}
              task={t}
              active={currentTask.id === t.id}
              results={results}
              competitionId={competition.id}
            />
          ))}
        </div>
      </div>
    </header>
  );
};

interface NavigationTaskProps {
  task: Task;
  active: boolean;
  results: CompetitionResult[];
  competitionId: string;
}

const NavigationTask = ({
  task,
  active,
  results,
  competitionId,
}: NavigationTaskProps) => {
  const result = React.useMemo(
    () => results.find((r) => r.position === task.in_competition_position),
    [results, task],
  );
  const status = getTaskStatusByResult(result);

  return (
    <Link to={`/session/${competitionId}/tasks/${task.id}`} preventScrollReset>
      <div
        className={cn(
          `bg-muted flex h-10 min-w-13 items-center justify-center rounded-md border-2 border-transparent px-4 font-semibold`,
          {
            "border-foreground": active,
            [`bg-${status} text-${status}-foreground`]:
              status != TaskStatus.DEFAULT,
          },
        )}
      >
        {task.in_competition_position}
      </div>
    </Link>
  );
};

const CompleteButton = () => {
  const { results } = useTasks();
  const competition = useCompetition();
  const navigate = useNavigate();

  const isCompleted = React.useMemo(
    () => results.every((result) => result.result === result.max_points),
    [results],
  );

  const completeCompetition = React.useCallback(async () => {
    await finishCompetition(competition.id);
    navigate("/");
  }, [competition.id, navigate]);

  if (competition.type === CompetitionType.EDU) {
    return <p className="text-muted-foreground text-sm">Тренировка</p>;
  }

  const CompButton = (
    <Button
      size={"sm"}
      variant={"outline"}
      onClick={isCompleted ? completeCompetition : undefined}
    >
      <span className="hidden md:block">Завершить</span>
      <TimerNumbers className="flex md:hidden" withIcon={false} />
    </Button>
  );

  if (isCompleted) {
    return CompButton;
  }

  return (
    <CompleteDialog completeCompetition={completeCompetition}>
      {CompButton}
    </CompleteDialog>
  );
};

const CompleteDialog = ({
  children,
  completeCompetition,
}: {
  children: React.ReactNode;
  completeCompetition: () => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Завершить соревнование?</DialogTitle>
          <DialogDescription>Вы решили не все задачи</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Отмена</Button>
          </DialogClose>
          <Button variant={"destructive"} onClick={completeCompetition}>
            Завершить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TimerNumbers = ({
  className,
  withIcon = true,
}: {
  className?: string;
  withIcon?: boolean;
}) => {
  const competition = useCompetition();
  const navigate = useNavigate();

  const [seconds, setSeconds] = React.useState(
    competition.end_date
      ? Math.round(
          (new Date(competition.end_date).getTime() - new Date().getTime()) /
            1000,
        )
      : 0,
  );

  const timerRef = React.useRef<null | number>(null);

  React.useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (
      seconds <= 0 &&
      competition.type === CompetitionType.COMPETITIVE &&
      competition.end_date
    ) {
      if (new Date(competition.end_date).getTime() <= new Date().getTime()) {
        navigate("/");
      }
    }
  }, [competition.end_date, competition.type, navigate, seconds]);

  if (competition.type === CompetitionType.EDU) {
    return null;
  }

  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = seconds % 60;

  return (
    <div
      className={cn(
        "text-muted-foreground flex items-center gap-1.5",
        { "text-destructive-foreground": seconds <= 300 },
        className,
      )}
    >
      {withIcon && <Clock size={16} />}
      <span className="text-sm">
        {hh > 0 ? (
          <>
            <TimerNumber value={hh} />:
          </>
        ) : (
          ""
        )}
        <TimerNumber value={mm} />:<TimerNumber value={ss} />
      </span>
    </div>
  );
};

const TimerNumber = ({ value }: { value: number }) => {
  return <span>{value < 10 ? `0${value}` : value}</span>;
};
