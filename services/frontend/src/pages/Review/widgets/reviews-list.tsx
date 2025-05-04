import { Review } from "@/shared/types/review";
import { ReviewCard } from "../components/review-card";
import { NoReviews } from "./no-reviews";
import { ReviewDialog } from "./review-dialog";

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
        <ReviewDialog key={review.id} reviewId={review.id}>
          <ReviewCard review={review} />
        </ReviewDialog>
      ))}
    </div>
  );
};
