import dayjs from "dayjs";
import { getSolutionStatus, getSolutionStatusLabel } from "../shared/status";
import { TaskSolution } from "@/shared/types/task";

interface SolutionsStatusCardProps {
  solution: TaskSolution;
  taskPoints: number;
}

export const SolutionsStatusCard = ({
  solution,
  taskPoints,
}: SolutionsStatusCardProps) => {
  const status = getSolutionStatus(solution, taskPoints);

  return (
    <div
      className={`bg-${status} text-${status}-foreground flex items-end justify-between gap-3 rounded-md px-6 py-4`}
    >
      <div className="flex flex-col gap-1">
        <p className={`text-base font-medium`}>
          Решение {solution.id.split("-")[0]}
        </p>
        <p className={`text-2xl font-semibold`}>
          {getSolutionStatusLabel(solution, taskPoints)}
        </p>
      </div>
      <div className={`text-right text-base font-medium`}>
        <p>{dayjs(solution.timestamp).format("D MMMM, HH:mm")}</p>
      </div>
    </div>
  );
};
