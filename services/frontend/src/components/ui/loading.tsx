import { Spinner } from "./spinner";

export const Loading = () => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <Spinner size={24} />
    </div>
  );
};
