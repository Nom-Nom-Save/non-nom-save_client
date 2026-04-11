import { StringKey } from '@/consts/string-key.consts';
import type { SortOrder } from './common.types';

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
  reviewCount: number;
  distance?: number;
}

export const ESTABLISHMENT_NAV = [
  { to: '/templates' as const, labelKey: StringKey.TEMPLATES },
  { to: '/menu' as const, labelKey: StringKey.MENU },
  { to: '/analytics' as const, labelKey: StringKey.ANALYTICS },
  { to: '/settings' as const, labelKey: StringKey.SETTINGS },
];

export interface GetEstabslishmentsListParams {
  city?: string;
  lat?: number;
  lon?: number;
  radius?: number;
  minRating?: number;
  productTypeIds?: string[];
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export enum EstablishmentsSortBy {
  RATING = 'rating',
  DISTANCE = 'distance',
  CLOSING_TIME = 'closingTime',
}
