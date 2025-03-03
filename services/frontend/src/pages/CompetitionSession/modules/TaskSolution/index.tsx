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
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskSolutionProps {
  task: Task;
  answer: string;
  setAnswer: (value: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const TaskSolution: React.FC<TaskSolutionProps> = ({ 
  task, 
  answer,
  setAnswer,
  selectedFile,
  setSelectedFile, 
  onSubmit,
  isSubmitting = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedSolutionUrl, setSelectedSolutionUrl] = useState<string | null>(null);
  const [displayedSolution, setDisplayedSolution] = useState<Solution | null>(null);
  const { id: competitionId } = useParams<{ id: string }>();
  const prevTaskIdRef = useRef<string | null>(null);

  const solutionsQuery = useQuery({
    queryKey: ['solutionHistory', competitionId, task.id],
    queryFn: () => getTaskSolutionHistory(competitionId || '', task.id),
    enabled: !!(competitionId && task.id),
  });

  const solutionHistory = solutionsQuery.data || [];
  
  const getLatestSolution = () => {
    return solutionHistory.length > 0 ? solutionHistory[solutionHistory.length - 1] : null;
  };
  
  const isOutdatedSolution = () => {
    if (!displayedSolution || solutionHistory.length === 0) return false;
    const latestSolution = getLatestSolution();
    return latestSolution?.id !== displayedSolution.id;
  };

  // Set initial solution to the last one (most recent) when solutions are loaded
  useEffect(() => {
    if (solutionHistory.length > 0 && !displayedSolution) {
      const latestSolution = solutionHistory[solutionHistory.length - 1];
      setDisplayedSolution(latestSolution);
    }
  }, [solutionHistory, displayedSolution]);

  // When task changes, reset everything and load the latest solution for the new task
  useEffect(() => {
    if (prevTaskIdRef.current !== task.id) {
      // Reset states for new task
      setDisplayedSolution(null);
      setSelectedSolutionUrl(null);
      
      // If solutions are already loaded for the new task, set the latest one
      if (solutionHistory.length > 0) {
        const latestSolution = solutionHistory[solutionHistory.length - 1];
        setDisplayedSolution(latestSolution);
      }
      
      prevTaskIdRef.current = task.id;
    }
  }, [task.id, solutionHistory]);

  // Check if a new solution was submitted (latest solution ID changed)
  useEffect(() => {
    if (solutionHistory.length > 0 && displayedSolution) {
      const latestSolution = solutionHistory[solutionHistory.length - 1];
      
      // If the latest solution ID is different from the displayed one,
      // a new solution was submitted - update to show the latest
      if (latestSolution.id !== displayedSolution.id) {
        setDisplayedSolution(latestSolution);
      }
    }
  }, [solutionHistory, displayedSolution]);

  // Load solution content when the displayed solution changes
  useEffect(() => {
    const loadSolutionContent = async () => {
      if (!displayedSolution || !displayedSolution.content) return;
      
      try {
        if (task.type === TaskType.FILE) {
          setSelectedFile(null);
          setSelectedSolutionUrl(displayedSolution.content);
        } else {
          const response = await fetch(displayedSolution.content);
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
  }, [displayedSolution, task.type, setAnswer, setSelectedFile]);

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
  };

  const handleSolutionSelect = (solution: Solution) => {
    setDisplayedSolution(solution);
  };

  const handleClearExistingFile = () => {
    setSelectedSolutionUrl(null);
  };
  
  // Function to switch to the latest solution
  const goToLatestSolution = () => {
    const latestSolution = getLatestSolution();
    if (latestSolution) {
      setDisplayedSolution(latestSolution);
    }
  };

  return (
    <div className="md:w-[500px] flex flex-col gap-4">
      {displayedSolution ? (
        <SolutionStatus solution={displayedSolution} maxPoints={task.points}/>
      ) : (
        <div className="bg-gray-100 rounded-lg p-4 text-gray-600 font-hse-sans">
          Решение еще не отправлено
        </div>
      )}
      
      {/* Outdated solution warning */}
      {isOutdatedSolution() && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex justify-between items-center">
          <div className="flex items-center text-amber-800">
            <AlertTriangle size={18} className="mr-2 text-amber-500" />
            <span className="font-hse-sans text-sm">Устаревшая посылка</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center"
            onClick={goToLatestSolution}
          >
            <span className="mr-1">К последней</span>
            <ArrowRight size={16} />
          </Button>
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
          isLoading={isSubmitting}
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
        currentSolutionId={displayedSolution?.id}
      />
    </div>
  );
};

export default TaskSolution;