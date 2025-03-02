export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'input' | 'file' | 'code';
  in_competition_position: number;
  points: number;
}

enum TaskType {
  INPUT = "input",
  FILE = "file",
  CODE = "code",
}
