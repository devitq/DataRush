import React, { useState } from "react";
import { DataRush } from "@/components/ui/icons/datarush";
import { ChevronDown, User, Settings, BarChart2, LogOut } from "lucide-react";
import { Link } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { useUserStore } from "@/shared/stores/user";

const Header = () => {
  const user = useUserStore((state) => state.user);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-card sticky top-0 z-30 flex h-[72px] w-full items-center justify-center px-4 sm:px-6">
      <div className="flex w-full max-w-5xl items-center justify-between">
        <Link to="/">
          <DataRush />
        </Link>
        <div
          className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 transition-opacity hover:opacity-80"
          onClick={() => setIsProfileOpen(true)}
        >
          <span className="font-hse-sans text-lg font-semibold">
            {user?.username}
          </span>
          <ChevronDown size={20} />
        </div>
      </div>

      <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <SheetContent className="w-[300px] p-0 sm:w-[350px]">
          <SheetHeader className="border-b px-5 py-4">
            <SheetTitle className="font-hse-sans text-lg font-medium">
              Профиль
            </SheetTitle>
          </SheetHeader>

          <div className="px-2 py-4">
            <ProfileOption
              icon={<User size={18} />}
              label="Соси дура"
              onClick={() => {
                setIsProfileOpen(false);
              }}
            />

            <ProfileOption
              icon={<Settings size={18} />}
              label="Настройки"
              onClick={() => {
                setIsProfileOpen(false);
              }}
            />

            <ProfileOption
              icon={<BarChart2 size={18} />}
              label="Статистика"
              onClick={() => {
                setIsProfileOpen(false);
              }}
            />

            <div className="mt-2 border-t pt-2">
              <ProfileOption
                icon={<LogOut size={18} />}
                label="Выйти"
                onClick={() => {
                  setIsProfileOpen(false);
                }}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

interface ProfileOptionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({
  icon,
  label,
  onClick,
  className,
}) => {
  return (
    <SheetClose asChild>
      <button
        className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-gray-100 ${className || ""}`}
        onClick={onClick}
      >
        <span className="text-gray-600">{icon}</span>
        <span className="font-hse-sans">{label}</span>
      </button>
    </SheetClose>
  );
};

export { Header };
