import React from 'react';
import { Task } from "@/shared/types";
import { getTaskBgColor, getTaskTextColor } from '@/pages/CompetitionSession/utils/utils';

interface SolutionStatusProps {
  task: Task;
}

const SolutionStatus: React.FC<SolutionStatusProps> = ({ task }) => {
  return (
    <div className={`${getTaskBgColor(task.status)} rounded-lg p-4 relative`}>
      <div className="flex flex-col">
        <span className={`${getTaskTextColor(task.status)} font-medium`}>
          Решение 12345
        </span>
        <span className={`${getTaskTextColor(task.status)} mt-1`}>
          Зачтено 5/10 баллов
        </span>
      </div>
      <div className={`absolute bottom-2 right-3 text-xs ${getTaskTextColor(task.status)}`}>
        1 марта, 08:41
      </div>
    </div>
  );
};

export default SolutionStatus;