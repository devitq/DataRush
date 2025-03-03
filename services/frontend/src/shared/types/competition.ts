export interface Competition {
  id: string;
  title: string;
  description: string;
  state: CompetitionState;
  image_url?: string;
  start_date?: Date;
  end_date?: Date;
  type: CompetitionType;
  participation_type: CompetitionParticipationType;
}

export enum CompetitionState {
  NOT_STARTED = "not_started",
  STARTED = "started",
  FINISHED = "finished",
}

export enum CompetitionType {
  EDU = "edu",
  COMPETITIVE = "competitive",
}

export enum CompetitionParticipationType {
  SOLO = "solo",
}

export interface CompetitionResult {
  task_name: string;
  result: number;
}