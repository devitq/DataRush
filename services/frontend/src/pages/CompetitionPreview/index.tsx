import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Competition } from "@/shared/types";
import { mockCompetitions, mockTasks } from "@/shared/mocks/mocks";

const CompetitionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [competition] = useState<Competition>(
    mockCompetitions.find((comp) => comp.id === id)!,
  );

  const handleContinue = () => {
    if (competition?.id) {      
      if (mockTasks && mockTasks.length > 0) {
        const firstTaskId = mockTasks[0].id;
        navigate(`/competition/${competition.id}/tasks/${firstTaskId}`);
      } else {
        navigate(`/competition/${competition.id}/tasks`);
      }
    }
  };

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
            <div className="text-xl leading-10 font-normal prose prose-lg max-w-none">
              <ReactMarkdown>
                {competition.description || ''}
              </ReactMarkdown>
            </div>
          </div>
          <div className="w-96 *:w-full">
            <Button onClick={handleContinue}>Продолжить</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionPage;