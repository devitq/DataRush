import { DataRush } from "@/components/ui/icons/datarush";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router";

const Header = () => {
  return (
    <header className="bg-card sticky top-0 z-30 flex h-[72px] w-full items-center justify-center">
      <div className="flex w-full max-w-5xl items-center justify-between">
        <Link to="/">
          <DataRush />
        </Link>
        <div className="flex items-center gap-1">
          <span className="text-lg font-semibold">itqdev</span>
          <ChevronDown size={20} />
        </div>
      </div>
    </header>
  );
};

export { Header };
