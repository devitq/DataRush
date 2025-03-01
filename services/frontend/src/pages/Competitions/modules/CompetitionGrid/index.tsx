import { Competition } from "@/shared/types";
import { CompetitionCard } from "../../components/CompetitionCard";
import { Link } from "react-router";

interface CompetitionGridProps {
  competitions: Competition[];
}

export function CompetitionGrid({ competitions }: CompetitionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-7 lg:gap-9">
      {competitions.map((competition) => (
        <Link key={competition.id} to={`/competition/${competition.id}`}>
          <CompetitionCard competition={competition} />
        </Link>
      ))}
    </div>
  );
}
