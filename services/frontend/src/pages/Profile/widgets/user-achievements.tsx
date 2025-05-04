import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Achievement } from "@/shared/types/user";
import dayjs from "dayjs";

export const UserAchievements = ({
  achievements,
}: {
  achievements?: Achievement[];
}) => {
  return (
    <section className="flex flex-1 flex-col gap-5">
      <h2 className="text-3xl font-semibold">Достижения</h2>
      {achievements && achievements.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {achievements.map((a) => (
            <AchievementDialog key={a.name} achievement={a}>
              <AchievementCard achievement={a} />
            </AchievementDialog>
          ))}
        </div>
      ) : (
        <div className="flex h-12 flex-col items-center justify-center">
          <p className="text-muted-foreground text-center">
            Достижений пока нет
          </p>
        </div>
      )}
    </section>
  );
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  return (
    <div className="flex cursor-pointer items-center gap-4 text-left">
      <div className="aspect-square h-auto w-full max-w-[90px] flex-1">
        <img src={achievement.icon} alt={achievement.name} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="text-lg font-semibold">{achievement.name}</h3>
        <p className="text-muted-foreground text-sm">
          {dayjs(achievement.received_at).format("D MMM YYYY")}
        </p>
      </div>
    </div>
  );
};

const AchievementDialog = ({
  achievement,
  children,
}: {
  achievement: Achievement;
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-4">
          <div className="aspect-square h-auto w-full max-w-[140px] flex-1">
            <img src={achievement.icon} alt={achievement.name} />
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h1 className="text-3xl font-semibold">{achievement.name}</h1>
            <p className="text-muted-foreground">
              Получено {dayjs(achievement.received_at).format("DD MMMM YYYY")}
            </p>
          </div>

          <p className="text-center text-lg">{achievement.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
