import { userFetch } from ".";
import { Competition, CompetitionResult } from "../types/competition";

export const getCompetitions = async (participating?: boolean) => {
  return await userFetch<Competition[]>("/competitions", {
    params: {
      is_participating: participating,
    },
  });
};

export const getCompetition = async (id: string) => {
  return await userFetch<Competition>(`/competitions/${id}`);
};

export const getCompetitionResults = async (id: string) => {
  return await userFetch<CompetitionResult[]>(`/competitions/${id}/results`);
}

export const startCompetition = async (competitionId: string) => {
  return await userFetch(`/competitions/${competitionId}/start`, {
    method: "POST",
  });
};
