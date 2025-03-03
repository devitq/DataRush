  import React from 'react';
  import { Solution } from '@/shared/types/task';
  import { getSolutionBgColor, getSolutionTextColor, getStatusText } from '@/pages/CompetitionSession/utils/utils';
  import { format, parseISO } from 'date-fns';
  import { ru } from 'date-fns/locale';
  
  interface SolutionStatusProps {
    solution: Solution;
    maxPoints: number;
  }

  const SolutionStatus: React.FC<SolutionStatusProps> = ({ solution, maxPoints }) => {
    const formattedDate = solution.timestamp ? format(parseISO(solution.timestamp), "d MMMM, HH:mm", { locale: ru }) : '';
    console.log(solution, "SOLUTION STATUS")
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
          {formattedDate}
        </div>
      </div>
    );
  };

  export default SolutionStatus;
