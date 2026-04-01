import { apiRequest } from './client';
import type { EstablishmentResponse } from '@/types/establishments.types';

export interface NearbyEstablishmentsResponse {
  establishments: EstablishmentResponse[];
}

export const getNearbyEstablishments = (lon: number, lat: number, radius: number) =>
  apiRequest<NearbyEstablishmentsResponse>(
    `/establishments/nearby?lat=${lat}&lon=${lon}&radius=${radius}`
  );
