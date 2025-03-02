import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCompetition, startCompetition } from "@/shared/api/competitions";
import { getCompetitionTasks } from "@/shared/api/session";
import { Loading } from "@/components/ui/loading";

const CompetitionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const competitionId = id || "";

  const competitionQuery = useQuery({
    queryKey: ["competition", competitionId],
    queryFn: () => getCompetition(competitionId),
    enabled: !!competitionId,
  });

  const startMutation = useMutation({
    mutationFn: () => startCompetition(competitionId),
    onSuccess: async () => {
      try {
        const tasks = await getCompetitionTasks(competitionId);
        
        if (tasks && tasks.length > 0) {
          navigate(`/competition/${competitionId}/tasks/${tasks[0].id}`);
        } else {
          navigate(`/competition/${competitionId}/tasks`);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        navigate(`/competition/${competitionId}/tasks`);
      }
    },
    onError: (error) => {
      console.error("Failed to start competition:", error);
    }
  });

  const handleStart = () => {
    startMutation.mutate();
  };

  if (competitionQuery.isLoading) {
    return <Loading />;
  }

  if (!competitionId || !competitionQuery.data) {
    return <></>;
  }

  const competition = competitionQuery.data;

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
            src={competition.image_url ? competition.image_url : '/DANO.png'}
            alt={competition.title}
            className="h-full w-full object-cover object-center"
          />
        </div>

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
            <Button 
              size={"lg"} 
              onClick={handleStart} 
              disabled={startMutation.isPending}
            >
              {startMutation.isPending ? "Загрузка..." : "Приступить к выполнению"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionPage;