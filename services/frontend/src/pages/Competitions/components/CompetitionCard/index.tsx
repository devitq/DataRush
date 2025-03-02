import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Competition,
  CompetitionState,
  CompetitionType,
} from "@/shared/types/competition";

interface CompetitionCardProps {
  competition: Competition;
  className?: string;
}

export function CompetitionCard({
  competition,
  className,
}: CompetitionCardProps) {
  return (
    <Card
      className={cn("aspect-square h-full w-auto overflow-hidden", className)}
    >
      <div className="relative h-full overflow-hidden">
        {competition.image_url && (
          <img
            src={competition.image_url ? competition.image_url : '/DANO.png'}
            alt={competition.title}
            className="h-full w-full object-cover object-center"
          />
        )}
      </div>

      <CardContent>
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
                    ? "В прогрессе"
                    : "Завершено"}
                </span>
              </>
            )}
          </div>
          <h3 className="line-clamp-2 text-xl font-semibold">
            {competition.title}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
