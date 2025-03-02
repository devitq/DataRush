import { Loading } from "@/components/ui/loading";
import { getReviewer, getReviewerSubmissions } from "@/shared/api/review";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { ReviewHeader } from "./modules/review-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewsList } from "./modules/reviews-list";
import React from "react";
import { ReviewStatus } from "@/shared/types/review";

const ReviewPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const reviewerQuery = useQuery({
    queryKey: ["reviewer", token],
    queryFn: async () => getReviewer(token || ""),
    retry: 0,
  });
  const submissionsQuery = useQuery({
    queryKey: ["submissions", token],
    queryFn: async () => getReviewerSubmissions(token || ""),
    retry: 0,
  });

  const availableReviews = React.useMemo(
    () =>
      (submissionsQuery.data?.submissions || []).filter(
        (s) => s.review_status === ReviewStatus.NOT_CHECKED,
      ),
    [submissionsQuery.data],
  );

  const checkedReviews = React.useMemo(
    () =>
      (submissionsQuery.data?.submissions || []).filter(
        (s) => s.review_status === ReviewStatus.CHECKED,
      ),
    [submissionsQuery.data],
  );

  if (reviewerQuery.isLoading || submissionsQuery.isLoading) {
    return <Loading />;
  }

  if (!token || !reviewerQuery.data || !submissionsQuery.data) {
    navigate("/");
    return;
  }

  return (
    <div className="px-4">
      <div className="mx-auto max-w-5xl">
        <ReviewHeader reviewer={reviewerQuery.data} />

        <Tabs
          defaultValue="available"
          className="my-3 flex flex-col items-stretch gap-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Решения</h1>
            <TabsList>
              <TabsTrigger
                value="available"
                className="flex items-center gap-2"
              >
                <span>Доступные</span>
                {availableReviews.length > 0 && (
                  <div className="bg-primary min-w-5 rounded-full px-1.5 py-0.5 text-xs">
                    {availableReviews.length}
                  </div>
                )}
              </TabsTrigger>
              <TabsTrigger value="checked">Проверенные</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="available" asChild>
            <ReviewsList reviews={availableReviews} />
          </TabsContent>

          <TabsContent value="checked" asChild>
            <ReviewsList reviews={checkedReviews} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewPage;
