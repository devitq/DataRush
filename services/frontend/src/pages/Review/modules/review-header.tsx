import { buttonVariants } from "@/components/ui/button";
import { DataRushReview } from "@/components/ui/icons/datarush-review";
import { Reviewer } from "@/shared/types/review";
import { useUserStore } from "@/shared/stores/user";
import { useNavigate } from "react-router-dom";

interface ReviewHeaderProps {
  reviewer: Reviewer;
}

export const ReviewHeader = ({ reviewer }: ReviewHeaderProps) => {
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  return (
    <header className="flex h-[90px] items-center justify-between gap-4">
      <DataRushReview />
      <div className="flex items-center gap-4">
        <p className="text-right font-semibold">
          {reviewer.name} {reviewer.surname}
        </p>
        <button
          onClick={handleLogout}
          className={buttonVariants({ size: "sm", variant: "secondary" })}
        >
          Выйти
        </button>
      </div>
    </header>
  );
};