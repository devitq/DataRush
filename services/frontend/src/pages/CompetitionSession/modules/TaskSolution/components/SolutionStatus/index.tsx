import React from 'react';
import { Solution, TaskStatus } from "@/shared/types";
import { getTaskBgColor, getTaskTextColor } from '@/pages/CompetitionSession/utils/utils';

interface SolutionStatusProps {
  solution: Solution;
}

const SolutionStatus: React.FC<SolutionStatusProps> = ({ solution }) => {
  const getStatusText = (status: TaskStatus, score?: number, maxScore?: number) => {
    switch (status) {
      case TaskStatus.Checking:
        return 'На проверке';
      case TaskStatus.Wrong:
        return 'Неверный ответ';
      case TaskStatus.Correct:
        return `Зачтено ${maxScore}/${maxScore} баллов`;
      case TaskStatus.Partial:
        return `Зачтено ${score}/${maxScore} баллов`;
      case TaskStatus.Uncleared:
        return 'Не решено';
      default:
        return '';
    }
  };

  return (
    <div className={`${getTaskBgColor(solution.status)} rounded-lg p-4 relative`}>
      <div className="flex flex-col">
        <span className={`${getTaskTextColor(solution.status)} font-medium`}>
          Решение {solution.id}
        </span>
        <span className={`${getTaskTextColor(solution.status)} mt-1`}>
          {getStatusText(solution.status, solution.score, solution.maxScore)}
        </span>
      </div>
      <div className={`absolute bottom-2 right-3 text-xs ${getTaskTextColor(solution.status)}`}>
        {solution.date}
      </div>
    </div>
  );
};

export default SolutionStatus;