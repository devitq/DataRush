import React, { useState } from "react";
import { CompetitionGrid } from "./modules/CompetitionsGrid";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getCompetitions } from "@/shared/api/competitions";
import { NoCompetitions } from "./modules/NoCompetitions";
import { TabsContent } from "@radix-ui/react-tabs";
import { Loading } from "@/components/ui/loading";
import { CompetitionState } from "@/shared/types/competition";

enum CompetitionTab {
  ONGOING = "ongoing",
  COMPLETED = "completed",
}

const CompetitionsPage = () => {
  const [activeTab, setActiveTab] = useState<string>(CompetitionTab.ONGOING);

  const activeCompetitionsQuery = useQuery({
    queryKey: ["active-competitions"],
    queryFn: async () => getCompetitions(true),
    retry: 1,
  });

  const inactiveCompetitionsQuery = useQuery({
    queryKey: ["inactive-competitions"],
    queryFn: async () => getCompetitions(false),
    retry: 1,
  });

  const startedCompetitions = React.useMemo(
    () =>
      (activeCompetitionsQuery.data ?? []).filter(
        (comp) => comp.state === CompetitionState.STARTED,
      ),
    [activeCompetitionsQuery.data],
  );

  const finishedCompetitions = React.useMemo(
    () =>
      (activeCompetitionsQuery.data ?? []).filter(
        (comp) => comp.state === CompetitionState.FINISHED,
      ),
    [activeCompetitionsQuery.data],
  );

  if (
    activeCompetitionsQuery.isLoading ||
    inactiveCompetitionsQuery.isLoading
  ) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {(activeCompetitionsQuery.data ?? []).length > 0 && (
        <Section>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <SectionHeader>
              <SectionTitle>Мои события</SectionTitle>

              <TabsList>
                <TabsTrigger value={CompetitionTab.ONGOING}>
                  В процессе
                </TabsTrigger>
                <TabsTrigger value={CompetitionTab.COMPLETED}>
                  Завершенные
                </TabsTrigger>
              </TabsList>
            </SectionHeader>

            <TabsContent value={CompetitionTab.ONGOING} asChild>
              <CompetitionGrid competitions={startedCompetitions} />
            </TabsContent>

            <TabsContent value={CompetitionTab.COMPLETED} asChild>
              <CompetitionGrid competitions={finishedCompetitions} />
            </TabsContent>
          </Tabs>
        </Section>
      )}

      <Section>
        <SectionHeader>
          <SectionTitle>События</SectionTitle>
        </SectionHeader>
        {(inactiveCompetitionsQuery.data ?? []).length > 0 ? (
          <CompetitionGrid
            competitions={inactiveCompetitionsQuery.data ?? []}
          />
        ) : (
          <NoCompetitions />
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


export default CompetitionsPage;