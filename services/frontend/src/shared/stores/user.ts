import { create } from "zustand";
import { User } from "../types/user";
import { getCurrentUser } from "../api/user";

interface UserState {
  user: User | null;
  loading: boolean;

  fetchUser: () => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    set({ loading: true });
    const user = await getCurrentUser();
    set({ user, loading: false });
  },
}));

export { useUserStore };
