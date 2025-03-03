import { apiFetch } from ".";
import { Review, Reviewer, ReviewEvaluation } from "../types/review";

export const getReviewer = async (token: string) => {
  return await apiFetch<Reviewer>(`/review/${token}`);
};

export const getReviewSubmissions = async (token: string) => {
  return await apiFetch<{ submissions: Review[] }>(
    `/review/${token}/submissions`,
  );
};

export const getReviewSubmission = async (token: string, reviewId: string) => {
  return await apiFetch<Review>(`/review/${token}/submissions/${reviewId}`);
};

export const postReviewEvaluation = async (
  token: string,
  reviewId: string,
  evaluation: ReviewEvaluation[],
) => {
  return await apiFetch(`/review/${token}/submissions/${reviewId}/evaluate`, {
    method: "POST",
    body: {
      evaluation,
    },
  });
};
