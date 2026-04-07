import { apiRequest } from '@/api/client';
import type {
  CreateMenuItemRequest,
  CreateMenuItemResponse,
  UpdateMenuItemRequest,
  UpdateMenuStatusRequest,
  MenuListResponse,
  MenuItemDetailResponse,
  MessageResponse,
  MenuItemResponse,
} from '@/types/menu.types';
import type { PaginationMeta, PaginationParams } from '@/types/pagination.types';

export const getMenuItems = () => apiRequest<MenuListResponse>('/menu');

export const getMenuItem = (menuId: string) =>
  apiRequest<MenuItemDetailResponse>(`/menu/item/${menuId}`);

export const createMenuItem = (data: CreateMenuItemRequest) =>
  apiRequest<CreateMenuItemResponse>('/menu', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateMenuItem = (menuId: string, data: UpdateMenuItemRequest) =>
  apiRequest<MessageResponse>(`/menu/${menuId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const updateMenuItemStatus = (menuId: string, data: UpdateMenuStatusRequest) =>
  apiRequest<MessageResponse>(`/menu/${menuId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deleteMenuItem = (menuId: string) =>
  apiRequest<MessageResponse>(`/menu/${menuId}`, { method: 'DELETE' });

export const getEstablishmentMenu = async (establishmentId: string, params?: PaginationParams) => {
  const query = params ? `?page=${params.page}&limit=${params.limit}` : '';

  const response = await apiRequest<{ menu: MenuItemResponse[]; meta: PaginationMeta }>(
    `/menu/public/${establishmentId}${query}`
  );
  return response;
};
