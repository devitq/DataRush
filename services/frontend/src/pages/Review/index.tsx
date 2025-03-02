import { Loading } from "@/components/ui/Loading";
import { getReviewer, getReviewerSubmissions } from "@/shared/api/review";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { ReviewHeader } from "./modules/review-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

        <Tabs defaultValue="available" className="my-3">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Посылки</h1>
            <TabsList>
              <TabsTrigger value="available">Доступные</TabsTrigger>
              <TabsTrigger value="checked">Проверенные</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewPage;
