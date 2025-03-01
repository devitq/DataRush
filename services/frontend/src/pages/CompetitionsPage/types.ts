export enum Status {
  InProgress = 'В процессе',
  NotParticipating = 'Не участвую', 
  Completed = 'Завершено'
}

export interface Competition {
  id: string;
  name: string;
  imageUrl: string;
  isOlympics: boolean;
  status: Status;
}
