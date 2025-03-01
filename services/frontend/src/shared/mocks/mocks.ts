import { Competition, Status, Task } from "../types/types";

const mockCompetitions: Competition[] = [
  {
    id: '1',
    name: 'Олимпиада DANO 2025. Индивидуальный этап',
    imageUrl: '/DANO.png',
    isOlympics: true,
    status: Status.InProgress,
    description: 'Проверка глубоких знаний и навыков в анализе данных. Будет несколько творческих заданий со свободным ответом. Задания выполняются индивидуально, вес тура в итоговом результате – 0,5. Этап пройдет онлайн в заданное время, с применением системы прокторинга. На работу дается 240 минут.'
  },
  {
    id: '2',
    name: 'Олимпиада DANO 2025. Индивидуальный этап',
    imageUrl: '/DANO.png',
    isOlympics: false,
    status: Status.NotParticipating,
    description: 'Индивидуальный этап олимпиады DANO 2025 – это уникальная возможность для студентов продемонстрировать свои навыки анализа данных и решения сложных задач. Участники будут работать с реальными наборами данных и применять современные методы машинного обучения и статистического анализа.'
  },
  {
    id: '3',
    name: 'Олимпиада DANO 2025. Индивидуальный этап',
    imageUrl: '/DANO.png',
    isOlympics: false,
    status: Status.InProgress
  },
  {
    id: '4',
    name: 'Олимпиада DANO 2025. Индивидуальный этап',
    imageUrl: '/DANO.png',
    isOlympics: true,
    status: Status.Completed
  },
  {
    id: '5',
    name: 'Олимпиада DANO 2025. Индивидуальный этап',
    imageUrl: '/DANO.png',
    isOlympics: false,
    status: Status.Completed
  },
  {
    id: '6',
    name: 'Олимпиада DANO 2025. Индивидуальный этап',
    imageUrl: '/DANO.png',
    isOlympics: true,
    status: Status.NotParticipating
  }
];

const mockTasks: Task[] = [
  { id: "1", number: "1.1", status: "uncleared" },
  { id: "2", number: "1.2", status: "checking" },
  { id: "3", number: "1.3", status: "correct" },
  { id: "4", number: "2.1", status: "partial" },
  { id: "5", number: "2.2", status: "wrong" },
  { id: "6", number: "2.3", status: "uncleared" },
  { id: "7", number: "3.1", status: "checking" },
  { id: "8", number: "3.2", status: "correct" },
];

export { mockCompetitions, mockTasks }