import { apiFetch } from ".";
import { Review, Reviewer } from "../types/review";

export const getReviewer = async (token: string) => {
  return await apiFetch<Reviewer>(`/review/${token}`);
};

export const getReviewerSubmissions = async (token: string) => {
  return await apiFetch<{ submissions: Review[] }>(
    `/review/${token}/submissions`,
  );
};
