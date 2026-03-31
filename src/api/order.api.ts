import type { Order } from '@/types/orders.types';
import { apiRequest } from './client';

export const getUserOrders = async () => {
  const response = await apiRequest<{ orders: Order[] }>('/orders');

  return response.orders;
};

export const cancelOrder = async (orderId: string) => {
  const response = await apiRequest<{ order: Order }>(`/orders/${orderId}/cancel`, {
    method: 'PATCH',
  });

  return response.order;
};
