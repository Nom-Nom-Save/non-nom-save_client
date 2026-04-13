export interface DaySchedule {
  open: string;
  close: string;
  isOpen: boolean;
}

export type WorkingHours = Record<
  'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
  DaySchedule
>;

import type { Subscription } from '@/types/subscription.types';

export interface EstablishmentProfile {
  id: string;
  name: string;
  description: string | null;
  address: string;
  latitude: string | null;
  longitude: string | null;
  workingHours: WorkingHours;
  logo: string | null;
  banner: string | null;
  rating: string | null;
  createdAt: string;
  reviewCount: number;
  isFavorite: boolean;
  bagsSold: number;
  foodSaved: string;
  subscription: Subscription | null;
}

export interface UpdateEstablishmentRequest {
  name?: string;
  email?: string;
  description?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  workingHours?: string;
  logo?: string;
  banner?: string;
  boundTo?: string;
}

export interface EstablishmentProfileResponse {
  message: string;
  establishment: EstablishmentProfile;
}

export interface UpdateEstablishmentResponse {
  message: string;
  establishment: EstablishmentProfile;
}
