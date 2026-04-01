import { cancelOrder, getUserOrders } from '@/api/order.api';
import { queryClient } from '@/lib/query-client';
import { useMutation, useQuery } from '@tanstack/react-query';

export const orderKeys = {
  list: () => ['orders', 'list'] as const,
};

export const useOrdersQuery = () => {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: () => getUserOrders(),
    refetchInterval: 60_000,
  });
};

export const useCancelOrder = () => {
  return useMutation({
    mutationFn: async (orderId: string) => cancelOrder(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.list() });
    },
  });
};
