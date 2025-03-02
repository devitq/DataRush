import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Task, TaskType, Solution } from '@/shared/types/task';
import { useQuery } from '@tanstack/react-query';
import { getTaskSolutionHistory } from '@/shared/api/session';
import SolutionStatus from './components/SolutionStatus';
import InputSolution from './components/InputSolution';
import FileSolution from './components/FileSolution';
import CodeSolution from './components/CodeSolution';
import ActionButtons from './components/ActionButtons';
import SolutionHistorySheet from './components/SolutionHistorySheet';

interface TaskSolutionProps {
  task: Task;
  solutions: Solution[];
  answer: string;
  setAnswer: (value: string) => void;
  onSubmit: () => void;
}

const TaskSolution: React.FC<TaskSolutionProps> = ({ 
  task, 
  solutions = [],
  answer, 
  setAnswer, 
  onSubmit, 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { id: competitionId } = useParams<{ id: string }>();

  const solutionsQuery = useQuery({
    queryKey: ['solutionHistory', competitionId, task.id],
    queryFn: () => getTaskSolutionHistory(competitionId || '', task.id),
    enabled: !!(competitionId && task.id),
  });

  const solutionHistory = solutionsQuery.data || [];

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
  };

  const latestSolution = solutions && solutions.length > 0 ? solutions[0] : null;

  return (
    <div className="md:w-[500px] flex flex-col gap-4">
      {latestSolution ? (
        <SolutionStatus solution={latestSolution} maxPoints={task.points}/>
      ) : (
        <div className="bg-gray-100 rounded-lg p-4 text-gray-600 font-hse-sans">
          Решение еще не отправлено
        </div>
      )}
      
      {task.type === TaskType.INPUT && (
        <InputSolution answer={answer} setAnswer={setAnswer} />
      )}
      
      {task.type === TaskType.FILE && (
        <FileSolution 
          selectedFile={selectedFile} 
          setSelectedFile={setSelectedFile} 
          fileInputRef={fileInputRef}
        />
      )}
      
      {task.type === TaskType.CODE && (
        <CodeSolution answer={answer} setAnswer={setAnswer} />
      )}
      
      <ActionButtons 
        onSubmit={onSubmit} 
        onHistoryClick={handleOpenHistory}
      />
      
      <SolutionHistorySheet 
        isOpen={isHistoryOpen} 
        onOpenChange={setIsHistoryOpen} 
        solutions={solutionHistory}
        maxPoints={task.points}
      />
    </div>
  );
};

export default TaskSolution;