import { Loading } from "@/components/ui/loading";
import {
  getCompetition,
  getCompetitionResults,
  startCompetition,
} from "@/shared/api/competitions";
import { getCompetitionTasks } from "@/shared/api/session";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { CompetitionHeader } from "./widgets/competition-header.tsx";
import { SessionProvider } from "./providers/session-provider.tsx";
import { TaskContent } from "./widgets/task-content.tsx";
import { TaskSolution } from "@/pages/CompetitionSession/widgets/task-solution.tsx";
import React from "react";
import { CompetitionState } from "@/shared/types/competition.ts";

const CompetitionSession = () => {
  const { competitionId, taskId } = useParams<{
    competitionId: string;
    taskId: string;
  }>();

  const navigate = useNavigate();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [taskId]);

  const competitionQuery = useQuery({
    queryKey: ["competition", competitionId],
    queryFn: () => getCompetition(competitionId || ""),
    enabled: !!competitionId,
  });

  const tasksQuery = useQuery({
    queryKey: ["competitionTasks", competitionId],
    queryFn: () => getCompetitionTasks(competitionId || ""),
    enabled: !!competitionId,
  });

  const resultsQuery = useQuery({
    queryKey: ["competitionResults", competitionId],
    queryFn: () => getCompetitionResults(competitionId || ""),
    enabled: !!competitionId,
    refetchInterval: 3000,
  });

  React.useEffect(() => {
    const start = async () => {
      await startCompetition(competitionQuery.data!.id);
    };

    if (
      competitionQuery.data &&
      competitionQuery.data.state === CompetitionState.NOT_STARTED
    ) {
      start();
    }
  }, [competitionQuery.data, competitionQuery.data?.state]);

  React.useEffect(() => {
    if (
      competitionQuery.data?.state === CompetitionState.FINISHED ||
      (competitionQuery.data?.end_date &&
        new Date(competitionQuery.data.end_date) < new Date())
    ) {
      navigate(`/competitions/${competitionId}`);
    }
  }, [
    competitionQuery.data?.end_date,
    competitionQuery.data?.state,
    navigate,
    competitionId,
  ]);

  if (
    competitionQuery.isLoading ||
    tasksQuery.isLoading ||
    resultsQuery.isLoading
  ) {
    return <Loading />;
  }

  return (
    <SessionProvider
      taskId={taskId}
      competition={competitionQuery.data!}
      tasks={tasksQuery.data!}
      results={resultsQuery.data!}
    >
      <div className="flex max-h-screen flex-col overflow-y-hidden">
        <CompetitionHeader />

        <main
          className="flex-1 overflow-y-scroll px-4 sm:px-6 md:px-8 lg:px-11"
          ref={scrollRef}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-6 py-9 md:flex-row md:gap-8 md:py-11 lg:gap-14">
            <TaskContent />
            <TaskSolution />
          </div>
        </main>
      </div>
    </SessionProvider>
  );
};

export default CompetitionSession;
