import React, { useState, useRef } from 'react';
import { Solution, Task } from "@/shared/types";
import SolutionStatus from './components/SolutionStatus';
import InputSolution from './components/InputSolution';
import FileSolution from './components/FileSolution';
import CodeSolution from './components/CodeSolution';
import ActionButtons from './components/ActionButtons';

interface TaskSolutionProps {
  task: Task;
  solutions: Solution[];
  answer: string;
  setAnswer: (value: string) => void;
  onSubmit: () => void;

}

const TaskSolution: React.FC<TaskSolutionProps> = ({ 
  task, 
  solutions,
  answer, 
  setAnswer, 
  onSubmit, 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="md:w-[500px] flex flex-col gap-4">
      <SolutionStatus solution={solutions[0]} />
      
      {task.solutionType === 'input' && (
        <InputSolution answer={answer} setAnswer={setAnswer} />
      )}
      
      {task.solutionType === 'file' && (
        <FileSolution 
          selectedFile={selectedFile} 
          setSelectedFile={setSelectedFile} 
          fileInputRef={fileInputRef}
        />
      )}
      
      {task.solutionType === 'code' && (
        <CodeSolution answer={answer} setAnswer={setAnswer} />
      )}
      
      <ActionButtons onSubmit={onSubmit} />
    </div>
  );
};

export default TaskSolution;