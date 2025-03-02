import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '@/shared/types/task';
import { getTaskBgColor, getTaskTextColor } from '../../utils/utils';

interface CompetitionHeaderProps {
  title: string;
  tasks: Task[];
  competitionId: string;
}

const CompetitionHeader: React.FC<CompetitionHeaderProps> = ({ 
  title,
  tasks, 
  competitionId 
}) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-30 w-full">
      <div className="mx-auto max-w-6xl px-4">
        <div className="py-4 text-center">
          <h1 className="font-hse-sans text-xl font-semibold">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center justify-center gap-4 pb-4 overflow-x-auto no-scrollbar">
          {tasks.map((task) => (
            <Link
              key={task.id}
              to={`/competition/${competitionId}/tasks/${task.id}`}
              className={`text-[var(--color-task-text-uncleared)] bg-[var(--color-task-uncleared)]
                rounded-lg px-3 py-1.5 font-medium text-sm font-hse-sans cursor-pointer 
                transition-all hover:brightness-95 flex-shrink-0
                `}
            >
              {task.in_competition_position}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default CompetitionHeader;