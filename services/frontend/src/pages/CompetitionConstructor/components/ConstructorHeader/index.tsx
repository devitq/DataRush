import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from "@/shared/types";
import { Settings, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ConstructorHeaderProps {
  title: string;
  tasks: Task[];
  competitionId: string;
  onAddTaskClick: () => void;
}

const ConstructorHeader: React.FC<ConstructorHeaderProps> = ({ 
  title,
  tasks, 
  competitionId,
  onAddTaskClick
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
          <Link
            to={`/constructor/${competitionId}/tasks/settings`}
            className="bg-gray-100 text-gray-700 rounded-lg px-3 py-1.5 font-medium text-sm font-hse-sans cursor-pointer 
              transition-all hover:bg-gray-200 flex-shrink-0 flex items-center"
          >
            <Settings size={16} className="mr-1" />
          </Link>
          
          {tasks.map((task) => (
            <Link
              key={task.id}
              to={`/constructor/${competitionId}/tasks/${task.id}`}
              className="bg-blue-100 text-blue-700 rounded-lg px-3 py-1.5 font-medium text-sm font-hse-sans cursor-pointer 
                transition-all hover:bg-blue-200 flex-shrink-0"
            >
              {task.number}
            </Link>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg flex items-center px-2 h-8"
            onClick={onAddTaskClick}
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ConstructorHeader;