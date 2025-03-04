import { User } from "@/shared/types/user";

export const UserInfo = ({ user }: { user: User }) => {
  return (
    <section className="flex flex-1 flex-col items-center gap-6 text-center md:max-w-[420px] md:items-start md:text-left md:text-ellipsis">
      <div className="bg-card aspect-square h-auto w-full max-w-[300px] overflow-hidden rounded-full border">
        <img
          src={user.avatar ?? "/lottie.png"}
          alt={user.username}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold">{user.username}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
    </section>
  );
};
