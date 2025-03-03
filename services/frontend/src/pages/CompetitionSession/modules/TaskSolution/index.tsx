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
  const [currentSolution, setCurrentSolution] = useState<Solution | null>(null);
  const { id: competitionId } = useParams<{ id: string }>();
  const taskIdRef = useRef<string | null>(null);

  const solutionsQuery = useQuery({
    queryKey: ['solutionHistory', competitionId, task.id],
    queryFn: () => getTaskSolutionHistory(competitionId || '', task.id),
    enabled: !!(competitionId && task.id),
  });

  const solutionHistory = solutionsQuery.data || [];
  // Handle task changes
  useEffect(() => {
    if (taskIdRef.current !== task.id) {
      setCurrentSolution(null);
      setSelectedSolutionUrl(null);
      setAnswer("");
      setSelectedFile(null);
      taskIdRef.current = task.id;
      
      // Wait for the query to complete
      if (!solutionsQuery.isLoading && solutionHistory.length > 0) {
        // Get the most recent solution (last in the array)
        const latestSolution = solutionHistory[solutionHistory.length - 1];
        setCurrentSolution(latestSolution);
      }
    }
  }, [task.id, solutionHistory, solutionsQuery.isLoading, setAnswer, setSelectedFile]);

  // Refresh current solution when the solution history changes (after a new submission)
  useEffect(() => {
    if (!solutionsQuery.isLoading && solutionHistory.length > 0) {
      // If we don't have a current solution or there's a new submission
      // (which would be the last item in the array)
      if (!currentSolution || 
          currentSolution.id !== solutionHistory[solutionHistory.length - 1].id) {
        // Set to the latest solution (last in the array)
        setCurrentSolution(solutionHistory[solutionHistory.length - 1]);
      }
    }
  }, [solutionHistory, currentSolution, solutionsQuery.isLoading]);

  // Load solution content when current solution changes
  useEffect(() => {
    const loadSolutionContent = async () => {
      if (!currentSolution || !currentSolution.content) return;
      
      try {
        if (task.type === TaskType.FILE) {
          setSelectedFile(null);
          setSelectedSolutionUrl(currentSolution.content);
        } else {
          const response = await fetch(currentSolution.content);
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

    loadSolutionContent();
  }, [currentSolution, task.type, setAnswer, setSelectedFile]);

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
  };

  const handleSolutionSelect = (solution: Solution) => {
    setCurrentSolution(solution);
    setIsHistoryOpen(false);
  };

  const handleClearExistingFile = () => {
    setSelectedSolutionUrl(null);
  };

  const handleSubmitWrapper = () => {
    onSubmit();
  };

  return (
    <div className="md:w-[500px] flex flex-col gap-4">
      {currentSolution ? (
        <SolutionStatus solution={currentSolution} maxPoints={task.points}/>
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
        onSubmit={handleSubmitWrapper} 
        onHistoryClick={handleOpenHistory}
      />
      
      <SolutionHistorySheet 
        isOpen={isHistoryOpen} 
        onOpenChange={setIsHistoryOpen} 
        solutions={solutionHistory}
        maxPoints={task.points}
        onSolutionSelect={handleSolutionSelect}
        currentSolutionId={currentSolution?.id}
      />
    </div>
  );
};

export default TaskSolution;