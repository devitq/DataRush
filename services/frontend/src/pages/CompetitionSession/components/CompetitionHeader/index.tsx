import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Task } from '@/shared/types/task';
import { ArrowLeft } from 'lucide-react'; 
import { CompetitionType } from '@/shared/types/competition';
import { CompetitionResult } from '@/shared/types/competition';

interface CompetitionHeaderProps {
  title: string;
  tasks: Task[];
  competitionId: string;
  setAnswer: (value: string) => void;
  setSelectedFile: (file: File | null) => void;
  competitionType?: CompetitionType;
  startDate?: Date | string;
  endDate?: Date | string;
  taskResults?: CompetitionResult[];
}

const CompetitionHeader: React.FC<CompetitionHeaderProps> = ({ 
  title,
  tasks, 
  competitionId,
  setAnswer,
  setSelectedFile,
  competitionType,
  startDate,
  endDate,
  taskResults = []
}) => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId?: string }>();
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  const handleTaskSelect = (taskId: string) => {
    setAnswer("");
    setSelectedFile(null);
    navigate(`/competition/${competitionId}/tasks/${taskId}`);
  }
  
  const formatDate = (date?: Date | string) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  useEffect(() => {
    if (!endDate || competitionType !== CompetitionType.COMPETITIVE) return;
    
    const endDateObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    const updateTimer = () => {
      const now = new Date();
      const diff = endDateObj.getTime() - now.getTime();
      
      if (diff <= 0) {
        navigate(`/competition/${competitionId}`);
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timerInterval);
  }, [endDate, competitionId, navigate, competitionType]);
  
  const getTaskStatus = (task: Task) => {
    const result = taskResults.find(r => r.task_name === task.title);
    
    let bgColor = 'var(--color-task-uncleared)';
    let textColor = 'var(--color-task-text-uncleared)';
    
    if (result) {
      if (result.result === -1) {
        bgColor = 'var(--color-task-checking)';
        textColor = 'var(--color-task-text-checking)';
      } else if (result.result === -2) {
        bgColor = 'var(--color-task-uncleared)';
        textColor = 'var(--color-task-text-uncleared)';
      } else if (result.result === 0) {
        bgColor = 'var(--color-task-wrong)';
        textColor = 'var(--color-task-text-wrong)';
      } else if (result.result < result.max_points) {
        bgColor = 'var(--color-task-partial)';
        textColor = 'var(--color-task-text-partial)';
      } else if (result.result === result.max_points) {
        bgColor = 'var(--color-task-correct)';
        textColor = 'var(--color-task-text-correct)';
      }
    }
    
    const isActive = task.id === taskId;
    const activeBorder = isActive ? 'border-2 border-blue-500' : '';
    
    return {
      backgroundColor: bgColor,
      color: textColor,
      className: `rounded-lg px-3 py-1.5 font-medium text-sm font-hse-sans cursor-pointer 
                transition-all hover:brightness-95 flex-shrink-0 ${activeBorder}`
    };
  };
  
  const showTimeSection = competitionType === CompetitionType.COMPETITIVE && (startDate || endDate);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-30 w-full">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-4">
          <div>
            <Link 
              to={`/competition/${competitionId}`}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-hse-sans text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
            </Link>
            
            <h1 className="font-hse-sans text-xl font-semibold text-center flex-1">
              {title}
            </h1>
          </div>

          
          {showTimeSection ? (
            <div className="flex items-center text-gray-600 font-hse-sans text-sm">
              <div className="flex flex-col items-end">
                {startDate && (
                  <span className="text-xs text-gray-500">
                    Начало: {formatDate(startDate)}
                  </span>
                )}
                {endDate && (
                  <span className="text-xs text-gray-500">
                    Конец: {formatDate(endDate)}
                  </span>
                )}
                {timeLeft && (
                  <span className="font-medium text-red-600">
                    Осталось: {timeLeft}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="w-[70px]"></div>
          )}
        </div>
        
        <div className="flex items-center justify-center gap-4 pb-4 overflow-x-auto no-scrollbar">
          {tasks.map((task) => {
            const { backgroundColor, color, className } = getTaskStatus(task);
            return (
              <button
                key={task.id}
                style={{ backgroundColor, color }}
                className={className}
                onClick={() => handleTaskSelect(task.id)}
              >
                {task.in_competition_position}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default CompetitionHeader;