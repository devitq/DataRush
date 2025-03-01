import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Competition } from "@/shared/types";
import { mockCompetitions } from "@/shared/mocks/mocks";

const CompetitionPage = () => {
  const { id } = useParams<{ id: string }>();
  const [competition] = useState<Competition>(
    mockCompetitions.find((comp) => comp.id === id)!,
  );

  return (
    <div className="flex flex-col gap-4">
      <Link
        className="font-hse-sans text-muted-foreground flex items-center"
        to="/"
      >
        <ArrowLeft size={16} className="mr-2" />
        Назад к соревнованиям
      </Link>

      <div className="flex flex-col gap-6">
        <div className="aspect-2 h-auto w-full overflow-hidden rounded-xl">
          <img
            src={competition.imageUrl}
            alt={competition.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="flex gap-8">
          <div className="flex flex-1 flex-col gap-5">
            <h1 className="text-[34px] leading-11 font-semibold text-balance">
              {competition.name}
            </h1>
            <div className="text-xl leading-10 font-normal">
              {competition.description
                ?.split("\n")
                .map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
          <div className="w-96 *:w-full">
            <Button>Продолжить</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionPage;
