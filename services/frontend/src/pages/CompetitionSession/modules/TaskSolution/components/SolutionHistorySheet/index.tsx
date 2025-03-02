import React from 'react';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import SolutionStatus from '../SolutionStatus';
import { Solution } from '@/shared/types/task';

interface SolutionHistorySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  solutions: Solution[];
  maxPoints: number;
  onSolutionSelect: (solution: Solution) => void;
  currentSolutionId?: string | null;
}

const SolutionHistorySheet: React.FC<SolutionHistorySheetProps> = ({
  isOpen,
  onOpenChange,
  solutions,
  maxPoints,
  onSolutionSelect,
  currentSolutionId
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[350px] sm:w-[450px] p-0">
        <SheetHeader className="border-b py-3 px-4">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-lg font-medium">История решений</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col mt-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-80px)] px-4 pb-4">
          {solutions.length > 0 ? (
            solutions.map((solution) => (
              <div 
                key={solution.id} 
                className={`w-full cursor-pointer relative ${solution.id === currentSolutionId ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
                onClick={() => onSolutionSelect(solution)}
              >
                {solution.id === currentSolutionId && (
                  <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white rounded-full p-1">
                    <Check size={14} />
                  </div>
                )}
                <SolutionStatus solution={solution} maxPoints={maxPoints} />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              У вас пока нет истории решений для этой задачи
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SolutionHistorySheet;