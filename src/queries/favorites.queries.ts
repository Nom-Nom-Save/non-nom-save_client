import { addToFavorites, getUserFavorites, removeFromFavorites } from '@/api/favorites.api';
import { QueryKey } from '@/consts/query-key.consts';
import { queryClient } from '@/lib/query-client';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetFavoritesQuery = (page = 1, limit = 5) => {
  return useQuery({
    queryKey: [QueryKey.FAVORITES, page, limit],
    queryFn: () => getUserFavorites({ page, limit }),
  });
};

export const useAddToFavoritesQuery = () => {
  return useMutation({
    mutationFn: (establishmentId: string) => addToFavorites(establishmentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKey.FAVORITES] });
    },
  });
};

export const useRemoveFromFavoritesQuery = () => {
  return useMutation({
    mutationFn: (establishmentId: string) => removeFromFavorites(establishmentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKey.FAVORITES] });
    },
  });
};
