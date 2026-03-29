import { BASE_URL } from './client';
import type { EstablishmentResponse } from '@/types/establishments.types';

export interface NearbyEstablishmentsResponse {
  establishments: EstablishmentResponse[];
}

export const getNearbyEstablishments = async (
  lon: number,
  lat: number,
  radius: number
): Promise<NearbyEstablishmentsResponse> => {
  const response = await fetch(
    `${BASE_URL}/establishments/nearby?lat=${lat}&lon=${lon}&radius=${radius}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch nearby establishments: ${response.status} ${response.statusText}`
    );
  }

  const data: unknown = await response.json();
  return data as NearbyEstablishmentsResponse;
};
