import { useQuery } from "@tanstack/react-query";
import {
  useCompetition,
  useCurrentTask,
} from "../providers/session-provider.tsx";
import { getTaskSolutionHistory } from "@/shared/api/session";
import { SolutionProvider } from "@/pages/CompetitionSession/providers/solution-provider.tsx";
import { SolutionStatus } from "@/pages/CompetitionSession/widgets/solution-status.tsx";
import { Loading } from "@/components/ui/loading.tsx";
import { SolutionAnswer } from "@/pages/CompetitionSession/widgets/solution-answer.tsx";
import { SolutionActions } from "@/pages/CompetitionSession/widgets/solution-actions.tsx";

export const TaskSolution = () => {
  const competition = useCompetition();
  const { task } = useCurrentTask();

  const solutionsQuery = useQuery({
    queryKey: [
      "solutionHistory",
      competition.id.toString(),
      task.id.toString(),
    ],
    queryFn: () => getTaskSolutionHistory(competition.id, task.id),
    refetchInterval: 4000,
  });

  return (
    <div className="sticky top-11 flex h-fit flex-1 flex-col gap-5 md:max-w-[520px] md:min-w-[370px]">
      {solutionsQuery.isFetching && !solutionsQuery.isFetchedAfterMount ? (
        <div className={"relative h-96"}>
          <Loading />
        </div>
      ) : (
        solutionsQuery.data && (
          <SolutionProvider solutions={solutionsQuery.data}>
            <SolutionStatus />
            <SolutionAnswer />
            <SolutionActions />
          </SolutionProvider>
        )
      )}
    </div>
  );
};
