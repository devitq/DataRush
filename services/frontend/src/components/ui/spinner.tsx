import { Loader } from "lucide-react";

export const Spinner = (props: React.ComponentProps<typeof Loader>) => (
  <Loader className="animate-spin" {...props} />
);
