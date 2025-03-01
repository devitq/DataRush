import { Competition, CompetitionStatus } from "../types";

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

const mockTasks = {
  "1": [
    { id: "1.1", number: "1.1", status: "uncleared" },
    { id: "1.2", number: "1.2", status: "checking" },
    { id: "1.3", number: "1.3", status: "correct" },
  ],
  "2": [
    { id: "2.1", number: "1.1", status: "uncleared" },
    { id: "2.2", number: "1.2", status: "uncleared" },
  ],
};

export { mockCompetitions, mockTasks };
