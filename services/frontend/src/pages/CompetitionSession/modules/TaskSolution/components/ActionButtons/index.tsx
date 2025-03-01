import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import SolutionHistorySheet from '../SolutionHistorySheet';
import { Solution } from "@/shared/types";
import { mockSolutions } from '@/shared/mocks/mocks';

interface ActionButtonsProps {
  onHistoryClick: () => void;
  onSubmit: () => void;
  solutionHistory?: Solution[]; 
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onHistoryClick, 
  onSubmit,
  solutionHistory = mockSolutions
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const handleHistoryClick = () => {
    setIsHistoryOpen(true);
    onHistoryClick();
  };

  return (
    <>
      <div className="flex gap-8">
        <Button 
          variant="ghost" 
          className="font-hse-sans bg-white hover:bg-gray-100"
          onClick={handleHistoryClick}
        >
          История
        </Button>
        <Button 
          onClick={onSubmit}
          className="font-hse-sans flex-grow" 
        >
          Отправить решение
        </Button>
      </div>
      {/* чуть-чуть рак */}
      <SolutionHistorySheet 
        isOpen={isHistoryOpen} 
        onOpenChange={setIsHistoryOpen} 
        solutions={solutionHistory} 
      />
    </>
  );
};

export default ActionButtons;