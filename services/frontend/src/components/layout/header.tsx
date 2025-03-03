import { DataRush } from "@/components/ui/icons/datarush";
import { ChevronDown, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useUserStore } from "@/shared/stores/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { removeToken } from "@/shared/token";

export const Header = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = () => {
    removeToken();
    clearUser();
    navigate("/login");
  };

  return (
    <header className="bg-card sticky top-0 z-30 flex h-[72px] w-full items-center justify-center px-4 sm:px-6">
      <div className="flex w-full max-w-5xl items-center justify-between">
        <Link to="/">
          <DataRush />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/docs/"
            className="hidden items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 md:flex"
            target="_blank"
          >
            <FileText className="h-4 w-4" />
            Материалы
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-left transition-opacity hover:opacity-80">
                <span className="font-hse-sans text-lg font-semibold">
                  {user?.username}
                </span>
                <ChevronDown size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link to="/profile">
                <DropdownMenuItem>Аккаунт</DropdownMenuItem>
              </Link>

              <div className="md:hidden">
                <Link to="/docs">
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Материалы
                  </DropdownMenuItem>
                </Link>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
