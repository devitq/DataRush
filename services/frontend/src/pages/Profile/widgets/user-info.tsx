import { User } from "@/shared/types/user";

export const UserInfo = ({ user }: { user: User }) => {
  return (
    <section className="flex max-w-[420px] flex-1 flex-col gap-6">
      {user.avatar && (
        <div className="aspect-square h-auto w-full max-w-[300px] overflow-hidden rounded-full border">
          <img
            src={user.avatar}
            alt={user.username}
            className="h-full w-full object-cover object-center"
          />
        </div>
      )}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold">{user.username}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
    </section>
  );
};
