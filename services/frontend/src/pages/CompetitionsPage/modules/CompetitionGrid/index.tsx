import { Competition } from "@/shared/types";
import { CompetitionCard } from "../../components/CompetitionCard";

interface CompetitionGridProps {
  competitions: Competition[];
}

export function CompetitionGrid({ competitions }: CompetitionGridProps) {
  return (
    <div className="grid grid-cols-3 gap-9">
      {competitions.map((competition) => (
        <CompetitionCard key={competition.id} competition={competition} />
      ))}
    </div>
  );
}
