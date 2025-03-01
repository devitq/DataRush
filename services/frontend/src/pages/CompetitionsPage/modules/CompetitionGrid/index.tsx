import { Competition } from "@/shared/types/types";
import { CompetitionCard } from "../../components/CompetitionCard";
import CompetitionSkeleton from "../../components/CompetitionSkeleton";
import { cn } from "@/shared/lib/utils";

interface CompetitionGridProps {
  competitions: Competition[];
  isLoading?: boolean;
  className?: string;
  skeletonCount?: number;
}

export function CompetitionGrid({ 
  competitions, 
  isLoading = false, 
  className,
  skeletonCount
}: CompetitionGridProps) {
  const gridClasses = cn(
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
    className
  );

  const numberOfSkeletons = skeletonCount ?? (competitions.length > 0 ? competitions.length : 4);

  if (isLoading) {
    return (
      <div className={gridClasses}>
        {Array.from({ length: numberOfSkeletons }).map((_, index) => (
          <CompetitionSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={gridClasses}>
      {competitions.map((competition) => (
        <CompetitionCard 
          key={competition.id} 
          competition={competition} 
        />
      ))}
    </div>
  );
}