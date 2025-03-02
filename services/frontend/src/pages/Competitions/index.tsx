import { useState, useEffect } from "react";
import { Competition, CompetitionStatus } from "@/shared/types";
import { CompetitionGrid } from "./modules/CompetitionGrid";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { getAllCompetitions } from "@/shared/api/competitions";

const CompetitionsPage = () => {
  const [myCompetitions, setMyCompetitions] = useState<Competition[]>([]);
  const [availableCompetitions, setAvailableCompetitions] = useState<Competition[]>([]);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const { participating, nonParticipating } = await getAllCompetitions();
        setMyCompetitions(participating);
        setAvailableCompetitions(nonParticipating);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch competitions:", err);
        setError("Не удалось загрузить события. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const filteredMyCompetitions = myCompetitions.filter((comp) =>
    activeTab === "ongoing"
      ? comp.status === CompetitionStatus.InProgress
      : comp.status === CompetitionStatus.Completed,
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-4" />
        <p className="font-hse-sans text-gray-500">Загрузка событий...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <p className="font-hse-sans text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <Section>
        <SectionHeader>
          <SectionTitle>Мои события</SectionTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="ongoing">В процессе</TabsTrigger>
              <TabsTrigger value="completed">Завершенные</TabsTrigger>
            </TabsList>
          </Tabs>
        </SectionHeader>
        {filteredMyCompetitions.length > 0 ? (
          <CompetitionGrid competitions={filteredMyCompetitions} />
        ) : (
          <EmptyState message={`У вас нет ${activeTab === "ongoing" ? "текущих" : "завершенных"} событий`} />
        )}
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>События</SectionTitle>
        </SectionHeader>
        {availableCompetitions.length > 0 ? (
          <CompetitionGrid competitions={availableCompetitions} />
        ) : (
          <EmptyState message="Нет доступных событий" />
        )}
      </Section>
    </div>
  );
};

const Section = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-6 sm:gap-8">{children}</div>;
};

const SectionHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-[58px] flex-col items-center justify-center gap-4 sm:flex-row sm:gap-2">
      {children}
    </div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="w-full text-3xl font-semibold">{children}</h1>;
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex justify-center items-center p-12 bg-gray-50 rounded-lg">
      <p className="font-hse-sans text-gray-500">{message}</p>
    </div>
  );
};

export default CompetitionsPage;