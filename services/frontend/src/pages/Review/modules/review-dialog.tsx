import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useToken } from "..";
import { getReviewSubmission, postReviewEvaluation } from "@/shared/api/review";
import { Loading } from "@/components/ui/loading";
import {
  Review,
  ReviewCriteria,
  ReviewEvaluation,
} from "@/shared/types/review";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { ofetch } from "ofetch";
import { File } from "lucide-react";

interface ReviewDialogProps {
  reviewId: string;
  children: React.ReactNode;
}

export const ReviewDialog = ({ reviewId, children }: ReviewDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="h-[calc(100%-2rem)] max-h-[1000px] overflow-hidden p-0">
        <ReviewScreen reviewId={reviewId} />
      </DialogContent>
    </Dialog>
  );
};

const ReviewScreen = ({ reviewId }: { reviewId: string }) => {
  const queryClient = useQueryClient();
  const token = useToken();

  const { data: review, isLoading } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: async () => getReviewSubmission(token, reviewId),
  });

  const [evaluation, setEvaluation] = React.useState<{
    [key: string]: ReviewEvaluation;
  }>({});

  React.useEffect(() => {
    if (review?.evaluation) {
      setEvaluation(
        review.evaluation.reduce(
          (acc, e) => {
            acc[e.slug] = e;
            return acc;
          },
          {} as { [key: string]: ReviewEvaluation },
        ),
      );
    }
  }, [review?.evaluation]);

  const onSubmit = React.useCallback(async () => {
    const e: ReviewEvaluation[] | undefined = review?.criteries?.map((c) => {
      return (
        evaluation[c.slug] ?? {
          slug: c.slug,
          mark: 0,
        }
      );
    });

    if (!e) {
      return;
    }

    await postReviewEvaluation(token, reviewId, e);
    queryClient.invalidateQueries({
      queryKey: ["submissions", token],
    });
  }, [review?.criteries, evaluation, token, queryClient]);

  if (isLoading) {
    return <Loading />;
  }

  if (!review) {
    queryClient.invalidateQueries({
      queryKey: ["submissions", token],
    });
    return;
  }

  return (
    <div className="flex max-h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-7 overflow-y-auto px-8 py-7">
        <ReviewHeader review={review} />
        <ReviewDescription review={review} />
        <ReviewContent review={review} />
        <ReviewCriteriesList
          review={review}
          evaluation={evaluation}
          setEvaluation={setEvaluation}
        />
      </div>
      <ReviewFooter
        evaluation={evaluation}
        criteries={review.criteries}
        onSubmit={onSubmit}
      />
    </div>
  );
};

const ReviewHeader = ({ review }: { review: Review }) => {
  const id = review.id.split("-").at(-1)?.slice(0, 6);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-lg font-semibold">
          {review.competition_name}
        </p>
        <h1 className="text-4xl font-semibold">{review.task_title}</h1>
      </div>

      <div className="text-muted-foreground flex gap-2 font-semibold">
        <span>{id}</span>
        <span>•</span>
        <span>{dayjs(review.submitted_at).format("D MMMM, HH:mm")}</span>
      </div>
    </div>
  );
};

const ReviewDescription = ({ review }: { review: Review }) => {
  if (!review.description) {
    return;
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl font-semibold">Условие</h2>
      <div className="bg-background rounded-xl px-5 py-3 text-lg">
        {review.description}
      </div>
    </div>
  );
};

const ReviewContent = ({ review }: { review: Review }) => {
  const extension = review.content.split(".").at(-1);
  const filename = review.content.split("/").at(-1);

  const { data: content, isLoading } = useQuery({
    queryKey: ["review-file", review.id],
    queryFn: async () => await ofetch(review.content),
  });

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl font-semibold">Ответ</h2>

      <div className="bg-background rounded-xl px-5 py-3 text-lg">
        {extension === "txt" ? (
          content
        ) : (
          <a
            href={review.content}
            target="_blank"
            className="flex items-center gap-3"
          >
            <File size={16} />
            <span>{filename}</span>
          </a>
        )}
      </div>
    </div>
  );
};

const ReviewCriteriesList = ({
  review,
  evaluation,
  setEvaluation,
}: {
  review: Review;
  evaluation: { [key: string]: ReviewEvaluation };
  setEvaluation: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ReviewEvaluation;
    }>
  >;
}) => {
  const onChange = React.useCallback(
    (slug: string, value?: number) => {
      if (!value || isNaN(value)) {
        setEvaluation((prev) => ({ ...prev, [slug]: { slug, mark: 0 } }));
        return;
      }

      if (
        value < 0 ||
        value >
          (review.criteries?.filter((c) => c.slug === slug).at(0)?.max_value ??
            0)
      ) {
        return setEvaluation((prev) => ({
          ...prev,
          [slug]: { slug, mark: 0 },
        }));
      }

      setEvaluation((prev) => ({ ...prev, [slug]: { slug, mark: value } }));
    },
    [evaluation],
  );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-semibold">Критерии</h2>
      <div className="flex flex-col items-stretch gap-5">
        {review.criteries?.map((c) => {
          const value = evaluation[c.slug]?.mark;
          return (
            <Criteria
              key={c.slug}
              criteria={c}
              value={value}
              onChange={onChange}
            />
          );
        })}
      </div>
    </div>
  );
};

const Criteria = ({
  criteria,
  value,
  onChange,
}: {
  criteria: ReviewCriteria;
  value?: number;
  onChange?: (slug: string, value: number) => void;
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-lg">{criteria.name}</h3>
        <p className="text-muted-foreground">
          Максимальное значение — {criteria.max_value}
        </p>
      </div>
      <input
        placeholder={criteria.max_value.toString()}
        className="flex h-10 w-15 items-center rounded-xl border px-2 text-center"
        value={value}
        onChange={(e) => onChange?.(criteria.slug, Number(e.target.value))}
      />
    </div>
  );
};

const ReviewFooter = ({
  evaluation,
  criteries,
  onSubmit,
}: {
  evaluation: { [key: string]: ReviewEvaluation };
  criteries?: ReviewCriteria[];
  onSubmit: () => Promise<void>;
}) => {
  const score = Object.values(evaluation).reduce((acc, e) => acc + e.mark, 0);
  const maxScore = criteries?.reduce((acc, c) => acc + c.max_value, 0);

  return (
    <div
      className={cn("flex flex-col items-stretch gap-7 px-8 py-6", {
        "bg-correct *:text-correct-foreground [&>button]:bg-correct-foreground [&>button]:hover:bg-correct-foreground/80 [&>button]:text-correct":
          score === maxScore,
        "bg-partial *:text-partial-foreground [&>button]:bg-partial-foreground [&>button]:hover:bg-partial-foreground/80 [&>button]:text-partial":
          score > 0 && score < (maxScore ?? 0),
        "bg-wrong *:text-wrong-foreground [&>button]:bg-wrong-foreground [&>button]:hover:bg-wrong-foreground/80 [&>button]:text-wrong":
          score === 0,
      })}
    >
      <div className="flex items-center justify-between gap-4 text-3xl font-semibold">
        <h2>Итого</h2>
        <h2 className="text-right">
          {score <= 0 ? "Неверный ответ" : `Зачтено ${score}/${maxScore}`}
        </h2>
      </div>
      <Button onClick={onSubmit}>Сохранить</Button>
    </div>
  );
};
