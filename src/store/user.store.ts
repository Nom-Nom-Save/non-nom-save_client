import type { Order } from '@/types/orders.types';
import type { User } from '@/types/user.types';
import { create } from 'zustand';

interface UserState {
  user: User | null;
  orders: Order[] | null;
  setUser: (user?: User) => void;
  setUserOrders: (orders: Order[]) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  orders: null,
  setUser: user => set({ user }),
  setUserOrders: orders => set({ orders }),
  clearProfile: () => set({ user: null, orders: null }),
}));
