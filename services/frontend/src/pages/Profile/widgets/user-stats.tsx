import { Loading } from "@/components/ui/loading";
import { UserStatBlock } from "../components/user-stat-block";
import { getCurrentUserStats } from "@/shared/api/user";
import { useQuery } from "@tanstack/react-query";

export const UserStatsSections = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: getCurrentUserStats,
  });

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-3xl font-semibold">Аналитика</h2>
      {isLoading ? (
        <div className="relative h-20 w-full">
          <Loading />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <UserStatBlock
            value={stats.solved_tasks}
            description="Задач решено"
          />
          <UserStatBlock
            value={stats.total_attempts}
            description="Попыток выполнено"
          />
        </div>
      ) : (
        <div className="text-center">
          <h3 className="w-full text-2xl font-semibold">
            Что-то пошло не так 😔
          </h3>
        </div>
      )}
    </section>
  );
};
