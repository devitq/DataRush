import React from 'react';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import SolutionStatus from '../SolutionStatus';
import { Solution, TaskType } from '@/shared/types/task';

interface SolutionHistorySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  solutions: Solution[];
  maxPoints: number;
  onSolutionSelect: (solution: Solution) => void;
}

const SolutionHistorySheet: React.FC<SolutionHistorySheetProps> = ({
  isOpen,
  onOpenChange,
  solutions,
  maxPoints,
  onSolutionSelect
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
            solutions.map((solution, index) => (
              <div 
                key={solution.id || index} 
                className="w-full cursor-pointer transition-transform hover:scale-[1.01]" 
                onClick={() => {
                  onSolutionSelect(solution);
                  onOpenChange(false); 
                }}
              >
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
