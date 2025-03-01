import { Competition, CompetitionStatus } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";

interface CompetitionCardProps {
  competition: Competition;
  className?: string;
}

export function CompetitionCard({
  competition,
  className,
}: CompetitionCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/competition/${competition.id}`);
  };

  return (
    <Card
      className={cn(
        "aspect-square h-full max-h-80 w-auto overflow-hidden",
        className,
      )}
      onClick={handleClick}
    >
      <div className="relative h-full overflow-hidden">
        <img
          src={competition.imageUrl}
          alt={competition.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <CardContent>
        <div className="flex flex-col gap-2.5">
          <div className="text-muted-foreground flex items-center gap-2 *:text-sm *:font-semibold">
            <span>{competition.isOlympics ? "Олимпиада" : "Тренировка"}</span>
            {competition.status != CompetitionStatus.NotParticipating && (
              <>
                <span>•</span>
                <span className="text-primary-foreground">
                  {competition.status}
                </span>
              </>
            )}
          </div>
          <h3 className="text-xl font-semibold">{competition.name}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
