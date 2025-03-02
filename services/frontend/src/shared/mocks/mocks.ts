import { Competition, CompetitionStatus, Solution, Task, TaskStatus } from "../types";

const mockCompetitions: Competition[] = [
  {
    id: "1",
    name: "Олимпиада DANO 2025. Индивидуальный этап",
    imageUrl: "/DANO.png",
    isOlympics: true,
    status: CompetitionStatus.InProgress,
    description: `Проверка глубоких знаний и навыков в анализе данных.
Будет несколько творческих заданий со свободным ответом.
Задания выполняются индивидуально, вес тура в итоговом результате – 0,5.
Этап пройдет онлайн в заданное время, с применением системы прокторинга.
На работу дается 240 минут.`,
  },
  {
    id: "2",
    name: "Олимпиада DANO 2025. Индивидуальный этап",
    imageUrl: "/DANO.png",
    isOlympics: false,
    status: CompetitionStatus.NotParticipating,
    description:
      "Индивидуальный этап олимпиады DANO 2025 – это уникальная возможность для студентов продемонстрировать свои навыки анализа данных и решения сложных задач. Участники будут работать с реальными наборами данных и применять современные методы машинного обучения и статистического анализа.",
  },
  {
    id: "3",
    name: "Олимпиада DANO 2025. Индивидуальный этап",
    imageUrl: "/DANO.png",
    isOlympics: false,
    status: CompetitionStatus.InProgress,
  },
  {
    id: "4",
    name: "Олимпиада DANO 2025. Индивидуальный этап",
    imageUrl: "/DANO.png",
    isOlympics: true,
    status: CompetitionStatus.Completed,
  },
  {
    id: "5",
    name: "Олимпиада DANO 2025. Индивидуальный этап",
    imageUrl: "/DANO.png",
    isOlympics: false,
    status: CompetitionStatus.Completed,
  },
  {
    id: "6",
    name: "Олимпиада DANO 2025. Индивидуальный этап",
    imageUrl: "/DANO.png",
    isOlympics: true,
    status: CompetitionStatus.NotParticipating,
  },
];

const mockTasks: Task[] = [
  { 
    id: "1", 
    number: "1.1", 
    status: TaskStatus.Uncleared, 
    solutionType: "input",
    description: "123",
    maxScore: 10,
  },
  { 
    id: "2", 
    number: "1.2", 
    status: TaskStatus.Checking, 
    solutionType: "file",
    description: "123",
    maxScore: 20,
  },
  { 
    id: "3", 
    number: "1.3", 
    status: TaskStatus.Correct, 
    solutionType: "code",
    description: "123",
    maxScore: 20,
  },
  { 
    id: "4", 
    number: "2.1", 
    status: TaskStatus.Partial, 
    solutionType: "input",
    description: "123",
    maxScore: 20,

  },
  { 
    id: "5", 
    number: "2.2", 
    status: TaskStatus.Wrong, 
    solutionType: "file",
    description: "123",
    maxScore: 20,

  },
  { 
    id: "6", 
    number: "2.3", 
    status: TaskStatus.Uncleared, 
    solutionType: "code",
    description: "123",
    maxScore: 20,

  },
  { 
    id: "7", 
    number: "3.1", 
    status: TaskStatus.Checking, 
    solutionType: "file",
    description: "123",
    maxScore: 20,

  },
  { 
    id: "8", 
    number: "3.2", 
    status: TaskStatus.Correct, 
    solutionType: "input",
    description: "123",
    maxScore: 20,

  },
];


const mockSolutions: Solution[] = [
  {
    id: '1',
    status: TaskStatus.Wrong,
    date: '1 марта, 08:41',
  },
  {
    id: '2',
    status: TaskStatus.Partial,
    score: 5,
    maxScore: 10,
    date: '28 февраля, 15:22',
  },
  {
    id: '3',
    status: TaskStatus.Correct,
    score: 0,
    maxScore: 10,
    date: '27 февраля, 12:10',
  },
  {
    id: '4',
    status: TaskStatus.Checking,
    date: '1 марта, 08:41',
  },

];

const mockAchievements = [
  {
    id: 1,
    name: "Первые шаги",
    description: "Участие в первом соревновании",
    imageUrl: "/achievements/first-steps.png",
    unlocked: true,
  },
  {
    id: 2,
    name: "Восходящая звезда",
    description: "Победа в соревновании",
    imageUrl: "/achievements/rising-star.png",
    unlocked: true,
  },
  {
    id: 3,
    name: "Мастер кода",
    description: "Решите 50 задач на программирование",
    imageUrl: "/achievements/code-master.png",
    unlocked: true,
  },
  {
    id: 4,
    name: "Бронзовый призер",
    description: "Займите 3 место в соревновании",
    imageUrl: "/achievements/bronze.png",
    unlocked: true,
  },
  {
    id: 5,
    name: "Серебряный призер",
    description: "Займите 2 место в соревновании",
    imageUrl: "/achievements/silver.png",
    unlocked: false,
  },
  {
    id: 6,
    name: "Золотой призер",
    description: "Займите 1 место в соревновании",
    imageUrl: "/achievements/gold.png",
    unlocked: false,
  },
  {
    id: 7,
    name: "Марафонец",
    description: "Участвуйте в 10 соревнованиях",
    imageUrl: "/achievements/marathon.png",
    unlocked: false,
  },
  {
    id: 8,
    name: "Идеальное решение",
    description: "Получите максимальные баллы за все задачи в соревновании",
    imageUrl: "/achievements/perfect.png",
    unlocked: false,
  },
];


const mockStatistics = {
  totalCompetitions: 12,
  completedCompetitions: 8,
  totalScore: 756,
  averageScore: 94.5,
  bestResult: {
    competition: "Олимпиада DANO 2024",
    place: 3,
    score: 97,
  },
  totalTasks: 86,
  solvedTasks: 72,
  tasksByStatus: {
    correct: 58,
    partial: 14,
    wrong: 9,
    unattempted: 5,
  },
};

export { mockCompetitions, mockTasks, mockSolutions, mockAchievements, mockStatistics };
