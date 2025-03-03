import { Ban } from "lucide-react";

export const NoCompetitions = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Ban size={32} />
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-semibold">Событий нет</h2>
        <p className="text-muted-foreground text-lg">
          Увы, очередная победа.рф
        </p>
      </div>
    </div>
  );
};

export const NoActiveCompetitions = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Ban size={32} />
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-semibold">Нет активных событий</h2>
        <p className="text-muted-foreground text-lg">Начните новое</p>
      </div>
    </div>
  );
};

export const NoCompletedCompetitions = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Ban size={32} />
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-semibold">Завершенных событий нет</h2>
        <p className="text-muted-foreground text-lg">Завершите начатое</p>
      </div>
    </div>
  );
};
