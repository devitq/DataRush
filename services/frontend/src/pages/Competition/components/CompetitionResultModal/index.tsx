import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';

export interface CompetitionResult {
  task_name: string;
  result: number;
  max_points: number
}

interface CompetitionResultsModalProps {
  competitionTitle: string;
  results: CompetitionResult[] | undefined;
  isLoading: boolean;
  error: unknown;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CompetitionResultsModal: React.FC<CompetitionResultsModalProps> = ({
  competitionTitle,
  results,
  isLoading,
  error,
  isOpen,
  onOpenChange,
}) => {
  const renderResultValue = (result: number, maxPoints: number) => {
    if (result === -1) {
      return <span className="text-yellow-600">На проверке</span>;
    } else if (result === -2) {
      return <span className="text-gray-500">Нет ответа</span>;
    } else {
      return (
        <span className="text-green-600">
          Зачтено {result}/{maxPoints} баллов
        </span>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Результаты</DialogTitle>
          <DialogDescription>
            Ваши результаты по соревнованию "{competitionTitle}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">
              Произошла ошибка при загрузке результатов
            </div>
          ) : results && results.length > 0 ? (
            results.map((result, index) => (
              <div 
                key={index} 
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg border"
              >
                <div className="font-medium mb-2 md:mb-0">{result.task_name}</div>
                <div className="text-right font-semibold">
                  {renderResultValue(result.result, result.max_points)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              Нет доступных результатов
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};