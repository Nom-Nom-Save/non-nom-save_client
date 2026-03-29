import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  updateMenuItemStatus,
} from '@/api/menu.api';
import type {
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  UpdateMenuStatusRequest,
} from '@/types/menu.types';

export const menuKeys = {
  all: () => ['menu'] as const,
  byId: (id: string) => ['menu', id] as const,
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
