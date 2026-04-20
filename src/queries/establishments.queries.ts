import { getEstablishmentsCities } from '@/api/establishment.api';
import { getEstablishmentsByIds, getEstablishmentsList } from '@/api/establishments.api';
import { QueryKey } from '@/consts/query-key.consts';
import type { GetEstabslishmentsListParams } from '@/types/establishments.types';
import { useQuery } from '@tanstack/react-query';

export const useGetEstablishmentsQuery = ({
  city,
  lat,
  lon,
  radius,
  minRating,
  productTypeIds,
  sortBy,
  sortOrder,
  page = 1,
  limit = 5,
}: GetEstabslishmentsListParams) => {
  return useQuery({
    queryKey: [
      QueryKey.ESTABLISHMENTS,
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
    ],
    queryFn: () =>
      getEstablishmentsList({
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
      }),
  });
};

export const useGetEstablishmentsCitiesQuery = () => {
  return useQuery({
    queryKey: [QueryKey.ESTABLISHMENTS_CITIES],
    queryFn: () => getEstablishmentsCities(),
  });
};

export const useGetEstablishmentsByIdsQuery = (ids: string[]) => {
  return useQuery({
    queryKey: [QueryKey.ESTABLISHMENTS, 'by-ids', ids],
    queryFn: () => getEstablishmentsByIds(ids),
    enabled: ids.length > 0,
  });
};
