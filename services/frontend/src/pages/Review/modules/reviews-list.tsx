import { Review } from "@/shared/types/review";
import { ReviewCard } from "../components/review-card";
import { NoReviews } from "./no-reviews";

interface ReviewsListProp {
  reviews: Review[];
}

export const ReviewsList = ({ reviews }: ReviewsListProp) => {
  if (reviews.length === 0) {
    return <NoReviews />;
  }

  return (
    <div className="flex flex-col items-stretch gap-5">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};
