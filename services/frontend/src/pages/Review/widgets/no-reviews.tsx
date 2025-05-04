import { Check } from "lucide-react";

export const NoReviews = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Check size={32} />
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-semibold">Посылок пока нет</h2>
        <p className="text-muted-foreground text-lg">Можете расслабиться</p>
      </div>
    </div>
  );
};
