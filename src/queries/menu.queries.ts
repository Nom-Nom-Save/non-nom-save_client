import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  updateMenuItemStatus,
  deleteMenuItem,
  getEstablishmentMenu,
} from '@/api/menu.api';
import type {
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  UpdateMenuStatusRequest,
} from '@/types/menu.types';
import { QueryKey } from '@/consts/query-key.consts';

export const menuKeys = {
  all: () => [QueryKey.MENU] as const,
  byId: (id: string) => [QueryKey.MENU, id] as const,
};

export const useMenuItemsQuery = () =>
  useQuery({
    queryKey: menuKeys.all(),
    queryFn: getMenuItems,
  });

export const useMenuItemQuery = (id: string) =>
  useQuery({
    queryKey: menuKeys.byId(id),
    queryFn: () => getMenuItem(id),
    enabled: !!id,
  });

export const useCreateMenuItemMutation = () =>
  useMutation({
    mutationFn: (data: CreateMenuItemRequest) => createMenuItem(data),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: menuKeys.all() }),
  });

export const useUpdateMenuItemMutation = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuItemRequest }) =>
      updateMenuItem(id, data),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: menuKeys.all() }),
  });

export const useUpdateMenuStatusMutation = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuStatusRequest }) =>
      updateMenuItemStatus(id, data),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: menuKeys.all() }),
  });

export const useDeleteMenuItemMutation = () =>
  useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: menuKeys.all() }),
  });

export const useGetEstablishmentMenu = (establishmentId: string, page = 1, limit = 5) => {
  return useQuery({
    queryKey: [QueryKey.MENU, establishmentId, page, limit],
    queryFn: () => getEstablishmentMenu(establishmentId, { page, limit }),
  });
};
