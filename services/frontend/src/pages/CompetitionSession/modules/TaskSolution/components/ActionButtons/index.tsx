import React from 'react';
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onSubmit: () => void;
  onHistoryClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onSubmit,
  onHistoryClick
}) => {
  return (
    <div className="flex gap-8">
      <Button 
        variant="ghost" 
        className="font-hse-sans bg-white hover:bg-gray-100"
        onClick={onHistoryClick}
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
  );
};

export default ActionButtons;