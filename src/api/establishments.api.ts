import type { PaginationMeta } from '@/types/pagination.types';
import { apiRequest } from './client';
import type {
  EstablishmentResponse,
  GetEstabslishmentsListParams,
} from '@/types/establishments.types';

export interface NearbyEstablishmentsResponse {
  establishments: EstablishmentResponse[];
}

export const getNearbyEstablishments = (lon: number, lat: number, radius: number) =>
  apiRequest<NearbyEstablishmentsResponse>(
    `/establishments/nearby?lat=${lat}&lon=${lon}&radius=${radius}`
  );

export const getEstablishmentsList = async ({
  city,
  lat,
  lon,
  radius,
  minRating,
  productTypeIds,
  sortBy,
  sortOrder,
  page,
  limit,
}: GetEstabslishmentsListParams) => {
  const params = new URLSearchParams();

  const args = {
    city,
    lat,
    lon,
    radius,
    minRating,
    sortBy,
    sortOrder,
    page,
    limit,
  };

  Object.entries(args).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  if (productTypeIds && productTypeIds.length > 0) {
    params.set('productTypeIds', productTypeIds.join(','));
  }

  const response = await apiRequest<{
    message: string;
    establishments: EstablishmentResponse[];
    meta: PaginationMeta;
  }>(`/establishments?${params.toString()}`);

  return response;
};
