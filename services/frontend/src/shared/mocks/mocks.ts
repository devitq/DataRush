import { Competition, CompetitionStatus, Solution, Task } from "../types";

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
    status: "uncleared", 
    solutionType: "input"
  },
  { 
    id: "2", 
    number: "1.2", 
    status: "checking", 
    solutionType: "file"
  },
  { 
    id: "3", 
    number: "1.3", 
    status: "correct", 
    solutionType: "code"
  },
  { 
    id: "4", 
    number: "2.1", 
    status: "partial", 
    solutionType: "input"
  },
  { 
    id: "5", 
    number: "2.2", 
    status: "wrong", 
    solutionType: "file"
  },
  { 
    id: "6", 
    number: "2.3", 
    status: "uncleared", 
    solutionType: "code"
  },
  { 
    id: "7", 
    number: "3.1", 
    status: "checking", 
    solutionType: "file"
  },
  { 
    id: "8", 
    number: "3.2", 
    status: "correct", 
    solutionType: "input"
  },
];


const mockSolutions: Solution[] = [
  {
    id: '1',
    status: 'wrong',
    date: '1 марта, 08:41',
  },
  {
    id: '2',
    status: 'partial',
    score: 5,
    maxScore: 10,
    date: '28 февраля, 15:22',
  },
  {
    id: '3',
    status: 'correct',
    score: 0,
    maxScore: 10,
    date: '27 февраля, 12:10',
  },
  {
    id: '4',
    status: 'checking',
    date: '1 марта, 08:41',
  },

];


export { mockCompetitions, mockTasks, mockSolutions };
