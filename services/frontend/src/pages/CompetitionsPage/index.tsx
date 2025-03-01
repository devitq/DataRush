import { useState, useEffect } from 'react';
import { Competition, Status } from '@/shared/types/types';
import { CompetitionGrid } from './modules/CompetitionGrid';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/modules/Navbar';

const mockCompetitions: Competition[] = [
  {
    id: '1',
    name: 'Олимпиада DANO 2025. Индивидуальный этап',
    imageUrl: '/DANO.png',
    isOlympics: true,
    status: Status.InProgress
  },
  {
    id: '2',
    name: 'Олимпиада DANO 2025. Индивидуальный этап',
    imageUrl: '/DANO.png',
    isOlympics: false,
    status: Status.NotParticipating
  },
  {
    id: '3',
    name: 'Олимпиада DANO 2025. Индивидуальный этап',
    imageUrl: '/DANO.png',
    isOlympics: false,
    status: Status.InProgress
  },
  {
    id: '4',
    name: 'Олимпиада DANO 2025. Индивидуальный этап',
    imageUrl: '/DANO.png',
    isOlympics: true,
    status: Status.Completed
  },
  {
    id: '5',
    name: 'Олимпиада DANO 2025. Индивидуальный этап',
    imageUrl: '/DANO.png',
    isOlympics: false,
    status: Status.Completed
  },
  {
    id: '6',
    name: 'Олимпиада DANO 2025. Индивидуальный этап',
    imageUrl: '/DANO.png',
    isOlympics: true,
    status: Status.NotParticipating
  }
];


const CompetitionsPage = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("ongoing");

  useEffect(() => {
    // ! симуляция фетча
    const fetchCompetitions = async () => {
      try {
        setTimeout(() => {
          setCompetitions(mockCompetitions);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        setError('Соревнования не найдены, пожалуйста, попробуйте позже');
        setIsLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const myCompetitions = competitions.filter(comp => 
    comp.status === Status.InProgress || comp.status === Status.Completed 
  );
  
  const filteredMyCompetitions = myCompetitions.filter(comp => 
    activeTab === "ongoing" ? comp.status === Status.InProgress : comp.status === Status.Completed 
  );
  
  const availableCompetitions = competitions.filter(comp => 
    comp.status === 'Не участвую'
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold font-hse-sans">Мои события</h2>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="ongoing" className="font-hse-sans">Текущие</TabsTrigger>
                <TabsTrigger value="completed" className="font-hse-sans">Завершенные</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {isLoading ? (
            <CompetitionGrid competitions={[]} isLoading={true} />
          ) : filteredMyCompetitions.length > 0 ? (
            <CompetitionGrid competitions={filteredMyCompetitions} isLoading={false} />
          ) : (
            <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
              <p className="text-gray-500 font-hse-sans">
                {activeTab === "ongoing" ? "У вас нет текущих соревнований" : "У вас нет завершенных соревнований"}
              </p>
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6 font-hse-sans">Доступные события</h2>
          
          {isLoading ? (
            <CompetitionGrid competitions={[]} isLoading={true} />
          ) : availableCompetitions.length > 0 ? (
            <CompetitionGrid competitions={availableCompetitions} isLoading={false} />
          ) : (
            <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
              <p className="text-gray-500 font-hse-sans">Нет доступных соревнований</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CompetitionsPage;