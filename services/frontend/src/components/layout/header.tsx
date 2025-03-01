import React, { useState } from 'react';
import { DataRush } from "@/components/ui/icons/datarush";
import { ChevronDown, User, Settings, BarChart2, LogOut } from "lucide-react";
import { Link } from "react-router";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetClose 
} from "@/components/ui/sheet";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-card sticky top-0 z-30 flex h-[72px] w-full items-center justify-center">
      <div className="flex w-full max-w-5xl items-center justify-between">
        <Link to="/">
          <DataRush />
        </Link>
        <div 
          className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity px-2 py-1 rounded-md"
          onClick={() => setIsProfileOpen(true)}
        >
          <span className="text-lg font-semibold font-hse-sans">itqdev</span>
          <ChevronDown size={20} />
        </div>
      </div>

      <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <SheetContent className="w-[300px] sm:w-[350px] p-0">
          <SheetHeader className="border-b py-4 px-5">
            <SheetTitle className="font-hse-sans text-lg font-medium">Профиль</SheetTitle>
          </SheetHeader>
          
          <div className="py-4 px-2">
            <ProfileOption 
              icon={<User size={18} />} 
              label="Ваш профиль" 
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
            
            <div className="border-t mt-2 pt-2">
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

const ProfileOption: React.FC<ProfileOptionProps> = ({ icon, label, onClick, className }) => {
  return (
    <SheetClose asChild>
      <button 
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-left transition-colors hover:bg-gray-100 ${className || ''}`}
        onClick={onClick}
      >
        <span className="text-gray-600">{icon}</span>
        <span className="font-hse-sans">{label}</span>
      </button>
    </SheetClose>
  );
};

export { Header };