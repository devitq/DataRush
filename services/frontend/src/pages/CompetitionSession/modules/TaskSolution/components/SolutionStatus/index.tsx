import React from 'react';
import { Solution } from '@/shared/types/task';
import { getSolutionBgColor, getSolutionTextColor, getStatusText } from '@/pages/CompetitionSession/utils/utils';

interface SolutionStatusProps {
  solution: Solution;
  maxPoints: number;
}

const SolutionStatus: React.FC<SolutionStatusProps> = ({ solution, maxPoints }) => {
 
  return (
    <div className={`${getSolutionBgColor(solution.status, solution.earned_points, maxPoints)} rounded-lg p-4 relative`}>
      <div className="flex flex-col">
        <span className={`${getSolutionTextColor(solution.status, solution.earned_points, maxPoints)} font-medium`}>
          Решение {solution.id}
        </span>
        <span className={`${getSolutionTextColor(solution.status, solution.earned_points, maxPoints)} mt-1`}>
          {getStatusText(solution.status, solution.earned_points, maxPoints)}
        </span>
      </div>
      <div className={`absolute bottom-2 right-3 text-xs ${getSolutionTextColor(solution.status, solution.earned_points, maxPoints)}`}>
        {solution.timestamp}
      </div>
    </div>
  );
};

export default SolutionStatus;
