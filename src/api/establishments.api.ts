import type { PaginationMeta } from '@/types/pagination.types';
import { apiRequest } from './client';
import type {
  EstablishmentResponse,
  GetEstabslishmentsListParams,
} from '@/types/establishments.types';
import { parseWorkingHours } from '@/utils/working-hours.utils';

type RawEstablishmentResponse = Omit<EstablishmentResponse, 'workingHours'> & {
  workingHours: string | null;
};

const parseEstablishmentResponse = (raw: RawEstablishmentResponse): EstablishmentResponse => ({
  ...raw,
  workingHours: parseWorkingHours(raw.workingHours),
});

interface RawNearbyEstablishmentsResponse {
  establishments: RawEstablishmentResponse[];
}

export const getNearbyEstablishments = async (lon: number, lat: number, radius: number) => {
  const data = await apiRequest<RawNearbyEstablishmentsResponse>(
    `/establishments/nearby?lat=${lat}&lon=${lon}&radius=${radius}`
  );
  return { establishments: data.establishments.map(parseEstablishmentResponse) };
};

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
    establishments: RawEstablishmentResponse[];
    meta: PaginationMeta;
  }>(`/establishments?${params.toString()}`);

  return {
    ...response,
    establishments: response.establishments.map(parseEstablishmentResponse),
  };
};
