import { create } from "zustand";
import { User } from "../types/user";
import { getCurrentUser } from "../api/user";
import Cookies from "js-cookie";

interface UserState {
  user: User | null;
  loading: boolean;

  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    set({ loading: true });
    const user = await getCurrentUser();
    set({ user, loading: false });
  },

  clearUser: () => {
    set({ user: null });
    
    const cookies = Cookies.get();
    Object.keys(cookies).forEach(cookieName => {
      Cookies.remove(cookieName, { path: '/' });
      Cookies.remove(cookieName);
    });
  },
}));

export { useUserStore };