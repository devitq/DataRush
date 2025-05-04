export interface Competition {
  id: string;
  title: string;
  description: string;
  state: CompetitionState;
  image_url?: string;
  start_date?: Date;
  end_date?: Date;
  type: CompetitionType;
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

export interface CompetitionResult {
  task_name: string;
  result: number;
  max_points: number;
  position: number;
}
