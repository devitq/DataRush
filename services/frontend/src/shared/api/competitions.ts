import { apiFetch } from '.';
import { Competition, CompetitionStatus, ParticipationType } from '@/shared/types';

interface ApiCompetition {
  id: string;
  state: 'started' | 'not_started' | 'finished';
  title: string;
  description: string;
  image_url: string | null;
  end_date: string;
  start_date: string;
  type: string;
  participation_type: ParticipationType;
}

const mapStateToStatus = (state: string, isParticipating: boolean): CompetitionStatus => {
  if (!isParticipating) {
    return CompetitionStatus.NotParticipating;
  }
  
  switch (state) {
    case 'started':
      return CompetitionStatus.InProgress;
    case 'finished':
      return CompetitionStatus.Completed;
    case 'not_started':
      return CompetitionStatus.InProgress;
    default:
      return CompetitionStatus.NotParticipating;
  }
};

const transformApiCompetition = (apiComp: ApiCompetition, isParticipating: boolean): Competition => {
  return {
    id: apiComp.id,
    name: apiComp.title,
    imageUrl: apiComp.image_url || '/DANO.png', 
    isOlympics: apiComp.type !== 'edu',
    status: mapStateToStatus(apiComp.state, isParticipating),
    description: apiComp.description,
    startDate: new Date(apiComp.start_date),
    endDate: new Date(apiComp.end_date),
    participationType: apiComp.participation_type
  };
};

export const getParticipatingCompetitions = async (): Promise<Competition[]> => {
  try {
    const apiCompetitions: ApiCompetition[] = await apiFetch('/api/v1/competitions', {
      query: { is_participating: true }
    });
    
    return apiCompetitions.map(comp => transformApiCompetition(comp, true));
  } catch (error) {
    console.error('Failed to fetch participating competitions:', error);
    throw error;
  }
};

export const getNonParticipatingCompetitions = async (): Promise<Competition[]> => {
  try {
    const apiCompetitions: ApiCompetition[] = await apiFetch('/api/v1/competitions', {
      query: { is_participating: false }
    });
    
    return apiCompetitions.map(comp => transformApiCompetition(comp, false));
  } catch (error) {
    console.error('Failed to fetch non-participating competitions:', error);
    throw error;
  }
};

export const getAllCompetitions = async (): Promise<{
  participating: Competition[];
  nonParticipating: Competition[];
}> => {
  const [participating, nonParticipating] = await Promise.all([
    getParticipatingCompetitions(),
    getNonParticipatingCompetitions()
  ]);
  
  return { participating, nonParticipating };
};