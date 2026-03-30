import { StringKey } from '@/consts/string-key.consts';

export interface EstablishmentResponse {
  id: string;
  email: string;
  isEmailVerified: boolean;
  password: string | null;
  name: string | null;
  description: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  workingHours: string | null;
  logo: string | null;
  banner: string | null;
  rating: string | null;
  boundTo: string;
  createdAt: Date | null;
  status: string;
}

export const ESTABLISHMENT_NAV = [
  { to: '/templates' as const, labelKey: StringKey.TEMPLATES },
  { to: '/menu' as const, labelKey: StringKey.MENU },
  { to: '/analytics' as const, labelKey: StringKey.ANALYTICS },
  { to: '/settings' as const, labelKey: StringKey.SETTINGS },
];
