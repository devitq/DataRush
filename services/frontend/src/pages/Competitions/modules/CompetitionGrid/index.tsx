import { Competition } from "@/shared/types";
import { CompetitionCard } from "../../components/CompetitionCard";
import { Link } from "react-router";

interface CompetitionGridProps {
  competitions: Competition[];
}

export function CompetitionGrid({ competitions }: CompetitionGridProps) {
  return (
    <div className="grid grid-cols-3 gap-9">
      {competitions.map((competition) => (
        <Link key={competition.id} to={`/competitions/${competition.id}`}>
          <CompetitionCard competition={competition} />
        </Link>
      ))}
    </div>
  );
}
