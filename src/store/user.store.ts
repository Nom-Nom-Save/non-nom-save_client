import type { User } from '@/types/user.types';
import { create } from 'zustand';

interface UserState {
  user: User | null;
  setUser: (data: User) => void;
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: data => set({ user: data }),
}));
