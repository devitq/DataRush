enum Status {
  InProgress = 'В процессе',
  NotParticipating = 'Не участвую', 
  Completed = 'Завершено'
}

interface Competition {
  id: string;
  name: string;
  imageUrl: string;
  isOlympics: boolean;
  status: Status;
  description?: string;
}

export {Status}
export type {Competition}