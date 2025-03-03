export const UserStatBlock = ({
  value,
  description,
}: {
  value: number;
  description: string;
}) => {
  return (
    <div className="bg-card flex flex-col items-center gap-4 rounded-xl px-5 py-8 text-center">
      <h2 className="text-5xl font-bold">{value}</h2>
      <p className="text-muted-foreground font-semibold">{description}</p>
    </div>
  );
};
