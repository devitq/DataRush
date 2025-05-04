import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  Trophy,
  BookOpen,
  AlertCircle,
  BarChart2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useQuery } from "@tanstack/react-query";
import {
  getCompetition,
  getCompetitionResults,
} from "@/shared/api/competitions";
import { Loading } from "@/components/ui/loading";
import { CompetitionType } from "@/shared/types/competition";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { CompetitionResultsModal } from "./components/CompetitionResultModal";

const CompetitionPage = () => {
  const { id } = useParams<{ id: string }>();
  const competitionId = id || "";
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

  const competitionQuery = useQuery({
    queryKey: ["competition", competitionId],
    queryFn: () => getCompetition(competitionId),
    enabled: !!competitionId,
  });

  const resultsQuery = useQuery({
    queryKey: ["competitionResults", competitionId],
    queryFn: () => getCompetitionResults(competitionId),
    enabled: !!competitionId,
  });

  const formatDate = (date?: Date | string) => {
    if (!date) return "";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    return dateObj.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasResults =
    resultsQuery.data &&
    resultsQuery.data.length > 0 &&
    resultsQuery.data.some((result) => result.result !== -2);

  if (competitionQuery.isLoading) {
    return <Loading />;
  }

  if (!competitionId || !competitionQuery.data) {
    return <></>;
  }

  const competition = competitionQuery.data;

  const isCompetitionNotStarted = () => {
    if (!competition?.start_date) return false;

    const startDate = new Date(competition.start_date);
    const now = new Date();

    return now < startDate;
  };

  const isCompetitionEnded = () => {
    if (!competition?.end_date) return false;

    const endDate = new Date(competition.end_date);
    const now = new Date();

    return now > endDate;
  };

  const competitionNotStarted = isCompetitionNotStarted();
  const competitionEnded = isCompetitionEnded();

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
            src={competition.image_url ? competition.image_url : "/DANO.png"}
            alt={competition.title}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="flex flex-col-reverse gap-8 md:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {competition.type === CompetitionType.COMPETITIVE ? (
                    <>
                      <Trophy size={14} className="mr-1.5" />
                      Соревнование
                    </>
                  ) : (
                    <>
                      <BookOpen size={14} className="mr-1.5" />
                      Тренировка
                    </>
                  )}
                </div>

                {competitionNotStarted &&
                  competition.type === CompetitionType.COMPETITIVE && (
                    <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                      Скоро начнется
                    </div>
                  )}

                {competitionEnded &&
                  competition.type === CompetitionType.COMPETITIVE && (
                    <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                      Завершено
                    </div>
                  )}
              </div>

              <h1 className="text-[34px] leading-11 font-semibold text-balance">
                {competition.title}
              </h1>

              {competition.type === CompetitionType.COMPETITIVE && (
                <div className="font-hse-sans mt-3 text-gray-600">
                  {competition.start_date && (
                    <div className="mb-1 flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span>Начало: {formatDate(competition.start_date)}</span>
                    </div>
                  )}
                  {competition.end_date && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span>Окончание: {formatDate(competition.end_date)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="prose prose-lg max-w-none text-xl leading-10 font-normal">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
              >
                {competition.description || ""}
              </ReactMarkdown>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 *:w-full md:w-96">
            {competitionNotStarted &&
            competition.type === CompetitionType.COMPETITIVE ? (
              <Button
                size={"lg"}
                disabled={true}
                className="cursor-not-allowed bg-gray-200 text-gray-500"
              >
                <AlertCircle size={18} className="mr-2" />
                Скоро начнется
              </Button>
            ) : !competitionEnded ? (
              <Button size={"lg"} asChild>
                <Link to={`/session/${competition.id}`}>
                  Приступить к выполнению
                </Link>
              </Button>
            ) : null}

            {hasResults && (
              <Button
                variant={"secondary"}
                size={"lg"}
                onClick={() => setIsResultsModalOpen(true)}
              >
                <BarChart2 size={18} className="mr-2" />
                Посмотреть результаты
              </Button>
            )}

            {competitionEnded &&
              !hasResults &&
              competition.type === CompetitionType.COMPETITIVE &&
              !resultsQuery.isLoading && (
                <div className="rounded-md border bg-gray-50 p-4 text-center">
                  <p className="text-gray-600">Соревнование завершено. Увы</p>
                </div>
              )}
          </div>
        </div>
      </div>

      <CompetitionResultsModal
        competitionTitle={competition.title}
        results={resultsQuery.data}
        isLoading={resultsQuery.isLoading}
        error={resultsQuery.error}
        isOpen={isResultsModalOpen}
        onOpenChange={setIsResultsModalOpen}
      />
    </div>
  );
};

export default CompetitionPage;
