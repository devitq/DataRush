import { Review, ReviewStatus } from "@/shared/types/review";
import dayjs from "dayjs";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const id = review.id.split("-").at(-1)?.slice(0, 6);

  return (
    <div className="bg-card flex items-center justify-between gap-8 rounded-lg px-8 py-5">
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground font-semibold">
          {review.competition_name}
        </p>
        <h1 className="text-2xl font-semibold">{review.task_title}</h1>
      </div>
      <div className="flex flex-col items-end gap-1 text-right">
        <div className="text-muted-foreground flex gap-1.5 font-semibold">
          <p>{id}</p>
          <p>•</p>
          <p>
            {review.review_status === ReviewStatus.NOT_CHECKED
              ? `Дата посылки: ${dayjs(review.submitted_at).format("D MMMM, HH:mm")}`
              : `Дата проверки: ${review.checked_at}`}
          </p>
        </div>
        <h1 className="text-2xl font-semibold">
          {review.review_status === ReviewStatus.NOT_CHECKED
            ? "Не проверено"
            : ""}
        </h1>
      </div>
    </div>
  );
};
