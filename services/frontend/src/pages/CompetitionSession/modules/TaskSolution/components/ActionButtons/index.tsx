import React from 'react';
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onHistoryClick: () => void;
  onSubmit: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onHistoryClick, onSubmit }) => {
  return (
    <div className="flex gap-3 justify-between">
      <Button 
        variant="ghost" 
        className="font-hse-sans bg-white hover:bg-gray-100"
        onClick={onHistoryClick}
      >
        История
      </Button>
      <Button 
        onClick={onSubmit}
        className="font-hse-sans"
      >
        Отправить решение
      </Button>
    </div>
  );
};

export default ActionButtons;