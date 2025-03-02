import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Competition,
  CompetitionState,
  CompetitionType,
} from "@/shared/types/competition";
import { Clock } from "lucide-react";

interface CompetitionCardProps {
  competition: Competition;
  className?: string;
}

export function CompetitionCard({
  competition,
  className,
}: CompetitionCardProps) {
  const formatDate = (date?: Date) => {
    if (!date) return "";
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card
      className={cn("aspect-square h-full w-auto overflow-hidden", className)}
    >
      <div className="relative h-full overflow-hidden">
        <img
          src={competition.image_url ? competition.image_url : '/DANO.png'}
          alt={competition.title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <CardContent className="p-4">
        <div className="flex flex-col gap-2.5">
          <div className="text-muted-foreground flex items-center gap-2 *:text-sm *:font-semibold">
            <span>
              {competition.type === CompetitionType.COMPETITIVE
                ? "Соревнование"
                : "Тренировка"}
            </span>
            {competition.state != CompetitionState.NOT_STARTED && (
              <>
                <span>•</span>
                <span className="text-primary-foreground">
                  {competition.state === CompetitionState.STARTED
                    ? "Проводится сейчас"
                    : "Завершено"}
                </span>
              </>
            )}
          </div>
          
          <h3 className="line-clamp-2 text-xl font-semibold">
            {competition.title}
          </h3>
          
          {competition.type === CompetitionType.COMPETITIVE && (
            <div className="text-gray-500 text-sm mt-1">
              {competition.start_date && (
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>Начало: {formatDate(competition.start_date)}</span>
                </div>
              )}
              
              {competition.end_date && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock size={14} />
                  <span>Конец: {formatDate(competition.end_date)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}