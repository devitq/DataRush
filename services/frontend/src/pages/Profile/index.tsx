import { UserInfo } from "./widgets/user-info";
import { UserAchievements } from "./widgets/user-achievements";
import { UserStatsSections } from "./widgets/user-stats";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/shared/api/user";
import { Loading } from "@/components/ui/loading";
import { useNavigate } from "react-router";

const ProfilePage = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    navigate("/");
    return;
  }

  return (
    <div className="flex flex-col items-stretch gap-14">
      <div className="flex flex-col gap-5 md:flex-row md:gap-0">
        <UserInfo user={user} />
        <UserAchievements achievements={user.achievements} />
      </div>
      <UserStatsSections />
    </div>
  );
};

export default ProfilePage;
