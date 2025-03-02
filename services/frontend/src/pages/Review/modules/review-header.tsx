import { buttonVariants } from "@/components/ui/button";
import { DataRushReview } from "@/components/ui/icons/datarush-review";
import { Reviewer } from "@/shared/types/review";
import { Link } from "react-router";

interface ReviewHeaderProps {
  reviewer: Reviewer;
}

export const ReviewHeader = ({ reviewer }: ReviewHeaderProps) => {
  return (
    <header className="flex h-[90px] items-center justify-between gap-4">
      <DataRushReview />
      <div className="flex items-center gap-4">
        <p className="text-right font-semibold">
          {reviewer.name} {reviewer.surname}
        </p>
        <Link
          to="/"
          className={buttonVariants({ size: "sm", variant: "secondary" })}
        >
          Выйти
        </Link>
      </div>
    </header>
  );
};
