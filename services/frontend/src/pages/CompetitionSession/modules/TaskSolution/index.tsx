import React, { useState, useRef, useEffect } from 'react';
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
  answer: string;
  setAnswer: (value: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  onSubmit: () => void;
}

const TaskSolution: React.FC<TaskSolutionProps> = ({ 
  task, 
  answer,
  setAnswer,
  selectedFile,
  setSelectedFile, 
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedSolutionUrl, setSelectedSolutionUrl] = useState<string | null>(null);
  const { id: competitionId } = useParams<{ id: string }>();

  const solutionsQuery = useQuery({
    queryKey: ['solutionHistory', competitionId, task.id],
    queryFn: () => getTaskSolutionHistory(competitionId || '', task.id),
    enabled: !!(competitionId && task.id),
  });

  const solutionHistory = solutionsQuery.data || [];
  const latestSolution = solutionHistory && solutionHistory.length > 0 ? solutionHistory[0] : null;

  useEffect(() => {
    const loadLatestSolution = async () => {
      if (!latestSolution || !latestSolution.content) return;
      
      try {
        if (task.type === TaskType.FILE) {
          setSelectedFile(null);
          setSelectedSolutionUrl(latestSolution.content);
        } else {
          const response = await fetch(latestSolution.content);
          if (!response.ok) {
            throw new Error(`Failed to fetch solution content: ${response.status}`);
          }
          const text = await response.text();
          setAnswer(text);
        }
      } catch (error) {
        console.error('Error loading latest solution content:', error);
      } finally {
      }
    };

    if (latestSolution && !solutionsQuery.isLoading && !solutionsQuery.isError) {
      loadLatestSolution();
    }
  }, [latestSolution, task.id, task.type, setAnswer, setSelectedFile]);

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
  };

  const handleSolutionSelect = async (solution: Solution) => {
    if (!solution.content) return;
    
    try {
      if (task.type === TaskType.FILE) {
        setSelectedFile(null);
        setSelectedSolutionUrl(solution.content);
      } else {
        const response = await fetch(solution.content);
        if (!response.ok) {
          throw new Error(`Failed to fetch solution content: ${response.status}`);
        }
        const text = await response.text();
        setAnswer(text);
      }
    } catch (error) {
      console.error('Error loading solution content:', error);
    } 
  };

  const handleClearExistingFile = () => {
    setSelectedSolutionUrl(null);
  };

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
        <InputSolution 
          answer={answer} 
          setAnswer={setAnswer} 
        />
      )}
      
      {task.type === TaskType.FILE && (
        <FileSolution 
          selectedFile={selectedFile} 
          setSelectedFile={setSelectedFile} 
          fileInputRef={fileInputRef}
          existingFileUrl={selectedSolutionUrl}
          onClearExistingFile={handleClearExistingFile}
        />
      )}
      
      {task.type === TaskType.CODE && (
        <CodeSolution 
          answer={answer} 
          setAnswer={setAnswer} 
        />
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
        onSolutionSelect={handleSolutionSelect}
      />
    </div>
  );
};

export default TaskSolution;