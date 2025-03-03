import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '@/shared/types/task';
import { ArrowLeft } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

interface CompetitionHeaderProps {
  title: string;
  tasks: Task[];
  competitionId: string;
  setAnswer: (value: string) => void;
  setSelectedFile: (file: File | null) => void;
}

const CompetitionHeader: React.FC<CompetitionHeaderProps> = ({ 
  title,
  tasks, 
  competitionId,
  setAnswer,
  setSelectedFile
}) => {
  const navigate = useNavigate();

  const handleTaskSelect = (taskId: string) => {
    setAnswer("");
    setSelectedFile(null);
    console.log("CLICK TEst")
    
    navigate(`/competition/${competitionId}/tasks/${taskId}`);
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30 w-full">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-4">
          <Link 
            to={`/competition/${competitionId}`}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-hse-sans text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
          </Link>
          
          <h1 className="font-hse-sans text-xl font-semibold text-center flex-1">
            {title}
          </h1>
          
          <div className="w-[70px]"></div>
        </div>
        
        <div className="flex items-center justify-center gap-4 pb-4 overflow-x-auto no-scrollbar">
          {tasks.map((task) => (
          <button
            key={task.id}
            className={`text-[var(--color-task-text-uncleared)] bg-[var(--color-task-uncleared)]
              rounded-lg px-3 py-1.5 font-medium text-sm font-hse-sans cursor-pointer 
              transition-all hover:brightness-95 flex-shrink-0
              `}
            onClick={() => handleTaskSelect(task.id)}
          >
            {task.in_competition_position}
          </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default CompetitionHeader;