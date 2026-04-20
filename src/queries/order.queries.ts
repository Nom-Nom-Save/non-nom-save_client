import { cancelOrder, createOrder, getUserOrders } from '@/api/order.api';
import { QueryKey } from '@/consts/query-key.consts';
import { queryClient } from '@/lib/query-client';
import type { OrderItem } from '@/types/orders.types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useOrdersQuery = () => {
  return useQuery({
    queryKey: [QueryKey.ORDERS],
    queryFn: () => getUserOrders(),
    refetchInterval: 60_000,
  });
};

export const useCancelOrderMutation = () => {
  return useMutation({
    mutationFn: async (orderId: string) => cancelOrder(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKey.ORDERS] });
    },
  });
};

export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: async (items: OrderItem[]) => createOrder(items),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKey.ORDERS] });
    },
  });
};
