import { PlanName } from '@/types/subscription.types';
import type { RawSubscription, Subscription } from '@/types/subscription.types';

export const parsePlanName = (name: string | null | undefined): PlanName => {
  if (!name) return PlanName.Free;
  const n = name.toLowerCase();
  if (n.includes('pro')) return PlanName.Pro;
  if (n.includes('sponsor')) return PlanName.Sponsor;
  return PlanName.Free;
};

export const parseSubscription = (sub: RawSubscription | null): Subscription | null => {
  if (!sub) return null;
  return { ...sub, planName: parsePlanName(sub.planName) };
};
