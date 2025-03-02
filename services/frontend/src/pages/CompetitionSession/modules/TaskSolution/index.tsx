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
  const [isLoading, setIsLoading] = useState(false);
  const [currentSolution, setCurrentSolution] = useState<Solution | null>(null);
  const { id: competitionId } = useParams<{ id: string }>();

  const solutionsQuery = useQuery({
    queryKey: ['solutionHistory', competitionId, task.id],
    queryFn: () => getTaskSolutionHistory(competitionId || '', task.id),
    enabled: !!(competitionId && task.id),
  });

  const solutionHistory = solutionsQuery.data || [];

  // Set the current solution to the latest one when the task changes or new solutions arrive
  useEffect(() => {
    if (solutionHistory.length > 0 && !currentSolution) {
      setCurrentSolution(solutionHistory[0]);
    }
  }, [solutionHistory, currentSolution, task.id]);

  // Reset current solution when task changes
  useEffect(() => {
    setCurrentSolution(null);
    setSelectedSolutionUrl(null);
    setAnswer(""); // Reset answer when task changes
  }, [task.id, setAnswer]);

  // Load the current solution content when it changes
  useEffect(() => {
    const loadSolutionContent = async () => {
      if (!currentSolution || !currentSolution.content) return;
      
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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

  // Handle successful submission
  const handleSubmitSuccess = (newSolution: Solution) => {
    // Update the current solution to the newly submitted one
    setCurrentSolution(newSolution);
    // Reset form
    setAnswer("");
    setSelectedFile(null);
    setSelectedSolutionUrl(null);
  };

  const handleSubmit = () => {
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
          isLoading={isLoading}
        />
      )}
      
      {task.type === TaskType.CODE && (
        <CodeSolution 
          answer={answer} 
          setAnswer={setAnswer} 
        />
      )}
      
      <ActionButtons 
        onSubmit={handleSubmit} 
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