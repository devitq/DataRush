import React from 'react';
import { Input } from "@/components/ui/input";

interface InputSolutionProps {
  answer: string;
  setAnswer: (value: string) => void;
}

const InputSolution: React.FC<InputSolutionProps> = ({ answer, setAnswer }) => {
  return (
    <div className="bg-white rounded-lg p-4">
      <Input 
        className="border-0 shadow-none focus-visible:ring-0 font-hse-sans text-sm h-9"
        placeholder="Введите ответ"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
    </div>
  );
};

export default InputSolution;