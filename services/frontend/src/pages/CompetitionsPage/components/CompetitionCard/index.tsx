import { Competition } from "@/shared/types/types";
import { cn } from "@/shared/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useNavigate } from "react-router";

interface CompetitionCardProps {
  competition: Competition;
  className?: string;
}

export function CompetitionCard({ competition, className }: CompetitionCardProps) {
  const { id, name, imageUrl, isOlympics, status } = competition;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/competition/${id}`);
  };

  return (
    <Card 
      className={cn("overflow-hidden h-full", className)}
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardFooter className="p-4 pb-0 flex items-center text-xs font-medium font-hse-sans">
        <span className="text-gray-500">
          {isOlympics ? "Олимпиада" : "Тренировка"}
        </span>
        <span className="mx-2 w-1.5 h-1.5 rounded-full bg-gray-300"></span>
        <span className={cn(
          status === 'В процессе' && "text-yellow-500",
          status === 'Завершено' && "text-green-500",
          status === 'Не участвую' && "text-gray-500"
        )}>
          {status.replace(/^\w/, c => c.toUpperCase())}
        </span>
      </CardFooter>
      
      <CardContent className="p-4 pt-2">
        <h3 className="font-semibold text-lg line-clamp-2 font-hse-sans">{name}</h3>
      </CardContent>
    </Card>
  );
}