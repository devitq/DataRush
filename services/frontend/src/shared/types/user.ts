export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  achievements?: Achievement[];
}

export interface Achievement {
  name: string;
  description: string;
  received_at: Date;
  icon?: string;
}

export interface UserStats {
  total_attempts: number;
  solved_tasks: number;
}
