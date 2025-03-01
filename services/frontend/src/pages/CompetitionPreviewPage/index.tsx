import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/modules/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Competition } from "@/shared/types/types";
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
          const found = mockCompetitions.find(comp => comp.id === id);
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
      const competitionTasks = mockTasks[competition.id];
      
      if (competitionTasks && competitionTasks.length > 0) {
        const firstTaskId = competitionTasks[0].id;
        navigate(`/competition/${competition.id}/tasks/${firstTaskId}`);
      } else {
        navigate(`/competition/${competition.id}/tasks`);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 mb-8 font-hse-sans"
        >
          <ArrowLeft size={16} className="mr-2" />
          Назад к соревнованиям
        </button>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="font-hse-sans text-gray-500">Загрузка...</p>
          </div>
        ) : competition ? (
          <div className="max-w-5xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="w-full h-80 overflow-hidden">
              <img 
                src={competition.imageUrl} 
                alt={competition.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold font-hse-sans mr-6 flex-1">{competition.name}</h1>
                <Button 
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-hse-sans text-base px-12 min-w-[180px]"
                  onClick={handleContinue}
                >
                  Продолжить
                </Button>
              </div>
              
              <div className="text-gray-700 font-hse-sans text-lg leading-relaxed">
                <p>{competition.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2 font-hse-sans">Соревнование не найдено</h2>
            <p className="text-gray-600 font-hse-sans">Запрошенное соревнование не существует или было удалено.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CompetitionPreview;