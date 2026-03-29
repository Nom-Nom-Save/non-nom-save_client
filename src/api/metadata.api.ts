import { apiRequest } from '@/api/client';
import type { ProductTypesResponse, AllergensResponse } from '@/types/metadata.types';

export const getProductTypes = async () => {
  const data = await apiRequest<ProductTypesResponse>('/metadata/product-types');
  return data.productTypes;
};

export const getAllergens = async () => {
  const data = await apiRequest<AllergensResponse>('/metadata/allergens');
  return data.allergens;
};
