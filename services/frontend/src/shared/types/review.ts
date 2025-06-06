export interface Reviewer {
  id: string;
  name: string;
  surname: string;
}

export interface Review {
  id: string;
  review_status: ReviewStatus;
  evaluation?: ReviewEvaluation[];
  criteries?: ReviewCriteria[];
  submitted_at: string;
  competition: string;
  competition_name: string;
  task: string;
  content: string;
  stdout?: string;
  result?: unknown;
  earned_points?: number;
  checked_at?: string;
  task_title: string;
  description?: string;
}

export enum ReviewStatus {
  NOT_CHECKED = "not_checked",
  CHECKED = "checked",
  CHECKING = "checking",
}

export interface ReviewEvaluation {
  slug: string;
  mark: number;
}

export interface ReviewCriteria {
  name: string;
  slug: string;
  max_value: number;
  min_value: number;
}
