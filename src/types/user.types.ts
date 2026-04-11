import { StringKey } from '@/consts/string-key.consts';
import type { Subscription } from '@/types/subscription.types';

export interface User {
  id: string;
  email: string;
  fullName: string;
  notifyNearby: boolean;
  notifyClosingSoon: boolean;
  notifyNewItems: boolean;
  createdAt: string;
  successfulOrdersCount: number;
  totalSavings: number;
  totalOrderedItems: number;
  subscription: Subscription | null;
}

export const USER_NAV = [
  { to: '/how-it-works' as const, labelKey: StringKey.HOW_IT_WORKS },
  { to: '/dashboard' as const, labelKey: StringKey.DASHBOARD },
  { to: '/map' as const, labelKey: StringKey.MAP },
];

export type UpdateUserInput = Partial<{
  fullName: string | null;
  email: string;
  notifyNearby: boolean;
  notifyClosingSoon: boolean;
  notifyNewItems: boolean;
}>;
