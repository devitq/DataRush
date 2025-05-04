import { useSolutions } from "@/pages/CompetitionSession/providers/solution-provider.tsx";
import { useCurrentTask } from "@/pages/CompetitionSession/providers/session-provider.tsx";
import { SolutionsStatusCard } from "../components/solutions-status-card";

export const SolutionStatus = () => {
  const { currentSolution: solution } = useSolutions();
  const { task } = useCurrentTask();

  if (!solution) {
    return null;
  }

  return <SolutionsStatusCard solution={solution} taskPoints={task.points} />;
};
