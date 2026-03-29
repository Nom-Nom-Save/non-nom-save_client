import { useQuery } from '@tanstack/react-query';
import { getProductTypes, getAllergens } from '@/api/metadata.api';

export const metadataKeys = {
  productTypes: () => ['metadata', 'product-types'] as const,
  allergens: () => ['metadata', 'allergens'] as const,
};

export const useProductTypesQuery = () =>
  useQuery({
    queryKey: metadataKeys.productTypes(),
    queryFn: getProductTypes,
    staleTime: Infinity,
  });

export const useAllergensQuery = () =>
  useQuery({
    queryKey: metadataKeys.allergens(),
    queryFn: getAllergens,
    staleTime: Infinity,
  });
