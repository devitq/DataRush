import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

interface ActionButtonsProps {
  onSubmit: () => void;
  onHistoryClick: () => void;
  isSubmitting?: boolean;
  hasSubmissionsLeft?: boolean;
  isCleared: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onSubmit,
  onHistoryClick,
  isSubmitting = false,
  hasSubmissionsLeft = true,
  isCleared
}) => {
  return (
    <div className="flex gap-8">
      <Button 
        variant="ghost" 
        className="font-hse-sans bg-white hover:bg-gray-100"
        onClick={onHistoryClick}
        disabled={isSubmitting}
      >
        История
      </Button>
      
      {isCleared ? (
        <Button 
          disabled={true}
        >
          Задача сдана!
        </Button>
      ) : hasSubmissionsLeft ? (
        <Button 
          onClick={onSubmit}
          className="font-hse-sans flex-grow" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Отправка...
            </>
          ) : (
            "Отправить решение"
          )}
        </Button>
      ) : (
        <div className="flex-grow text-right text-gray-500 flex items-center justify-end font-hse-sans">
          Лимит посылок исчерпан
        </div>
      )}
    </div>
  );
};

export default ActionButtons;