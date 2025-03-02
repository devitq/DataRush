import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { mockTasks } from "@/shared/mocks/mocks";
import { useQuery } from "@tanstack/react-query";
import { getCompetition } from "@/shared/api/competitions";
import { Loading } from "@/components/ui/Loading";

const CompetitionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: competition, isLoading } = useQuery({
    queryKey: ["competition", id],
    queryFn: async () => getCompetition(id || ""),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!id || !competition) {
    return <></>;
  }

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
        {competition.image_url && (
          <div className="aspect-2 h-auto w-full overflow-hidden rounded-xl">
            <img
              src={competition.image_url}
              alt={competition.title}
              className="h-full w-full object-cover object-center"
            />
          </div>
        )}

        <div className="flex flex-col-reverse gap-8 md:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <h1 className="text-[34px] leading-11 font-semibold text-balance">
              {competition.title}
            </h1>
            <div className="prose prose-lg max-w-none text-xl leading-10 font-normal">
              <ReactMarkdown>{competition.description || ""}</ReactMarkdown>
            </div>
          </div>
          <div className="w-full *:w-full md:w-96">
            <Button size={"lg"} onClick={handleContinue}>
              Продолжить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionPage;
