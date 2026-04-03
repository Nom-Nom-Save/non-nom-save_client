import type { Favorites } from '@/types/favorites.types';
import { apiRequest } from './client';
import type { PaginationMeta, PaginationParams } from '@/types/pagination.types';

export interface FavoritesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getUserFavorites = async (params?: PaginationParams) => {
  const query = params ? `?page=${params.page}&limit=${params.limit}` : '';

  const response = await apiRequest<{ favorites: Favorites[]; meta: PaginationMeta }>(
    `/users/favorites${query}`
  );

  return response;
};

export const addToFavorites = async (establishmentId: string) => {
  return await apiRequest('/users/favorites', {
    method: 'POST',
    body: JSON.stringify({
      establishmentId,
    }),
  });
};

export const removeFromFavorites = async (establishmentId: string) => {
  return await apiRequest(`/users/favorites/${establishmentId}`, {
    method: 'DELETE',
  });
};
