import { cn } from "@/shared/lib/utils";
import { Review, ReviewStatus } from "@/shared/types/review";
import dayjs from "dayjs";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const id = review.id.split("-").at(-1)?.slice(0, 6);

  const score = review.evaluation?.reduce((acc, e) => acc + e.mark, 0);
  const maxPoints = review.criteries?.reduce((acc, c) => acc + c.max_value, 0);

  const styles = review.review_status === ReviewStatus.CHECKED && {
    "bg-correct text-correct-foreground": (score ?? 0) === (maxPoints ?? 0),
    "bg-partial text-partial-foreground":
      (score ?? 0) > 0 && (score ?? 0) < (maxPoints ?? 0),
    "bg-wrong text-wrong-foreground": (score ?? 0) === 0,
  };

  return (
    <div
      className={cn(
        "bg-card flex cursor-pointer flex-col justify-between gap-2 rounded-lg px-8 py-5 sm:flex-row sm:items-center sm:gap-8",
        styles,
      )}
    >
      <div className="flex flex-1 flex-col gap-1 text-left">
        <p className={cn("text-muted-foreground font-semibold", styles)}>
          {review.competition_name}
        </p>
        <h1 className="text-2xl font-semibold">{review.task_title}</h1>
      </div>
      <div className="flex flex-col-reverse items-end gap-1 text-right sm:flex-col">
        <div
          className={cn(
            "text-muted-foreground flex flex-wrap justify-end gap-1.5 font-semibold",
            styles,
          )}
        >
          <p>{id}</p>
          <p>•</p>
          <p>
            {review.review_status === ReviewStatus.NOT_CHECKED ||
            review.review_status === ReviewStatus.CHECKING
              ? `Дата посылки: ${dayjs(review.submitted_at).format("D MMMM, HH:mm")}`
              : `Дата проверки: ${dayjs(review.checked_at).format("D MMMM, HH:mm")}`}
          </p>
        </div>
        <h1 className="text-2xl font-semibold">
          {review.review_status === ReviewStatus.NOT_CHECKED ||
          review.review_status === ReviewStatus.CHECKING
            ? "Не проверено"
            : score === 0
              ? "Неверный ответ"
              : `Зачтено ${score}/${maxPoints}`}
        </h1>
      </div>
    </div>
  );
};
