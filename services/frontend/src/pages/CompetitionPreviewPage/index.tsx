import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/widgets/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Competition } from "@/shared/types";
import { mockCompetitions, mockTasks } from "@/shared/mocks/mocks";

const CompetitionPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setTimeout(() => {
          const found = mockCompetitions.find((comp) => comp.id === id);
          setCompetition(found || null);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching competition:", error);
        setIsLoading(false);
      }
    };

    fetchCompetition();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

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
    <>
      <Navbar />
      <div className="container mx-auto mt-16 px-4 py-8">
        <button
          onClick={handleBack}
          className="font-hse-sans mb-8 flex items-center text-gray-600"
        >
          <ArrowLeft size={16} className="mr-2" />
          Назад к соревнованиям
        </button>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="font-hse-sans text-gray-500">Загрузка...</p>
          </div>
        ) : competition ? (
          <div className="mx-auto max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="h-80 w-full overflow-hidden">
              <img
                src={competition.imageUrl}
                alt={competition.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-8">
              <div className="mb-8 flex items-center justify-between">
                <h1 className="font-hse-sans mr-6 flex-1 text-3xl font-semibold">
                  {competition.name}
                </h1>
                <Button
                  className="font-hse-sans min-w-[180px] bg-yellow-400 px-12 text-base text-black hover:bg-yellow-500"
                  onClick={handleContinue}
                >
                  Продолжить
                </Button>
              </div>

              <div className="font-hse-sans text-lg leading-relaxed text-gray-700">
                <p>{competition.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <h2 className="font-hse-sans mb-2 text-2xl font-bold">
              Соревнование не найдено
            </h2>
            <p className="font-hse-sans text-gray-600">
              Запрошенное соревнование не существует или было удалено.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CompetitionPreview;
