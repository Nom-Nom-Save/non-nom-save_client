import { cancelOrder, getUserOrders } from '@/api/order.api';
import { queryClient } from '@/lib/query-client';
import { useUserStore } from '@/store/user.store';
import { useMutation, useQuery } from '@tanstack/react-query';

export const ordersKeys = {
  list: () => ['orders', 'list'] as const,
};

export const useOrdersQuery = () => {
  return useQuery({
    queryKey: ordersKeys.list(),
    queryFn: async () => {
      const { setUserOrders } = useUserStore.getState();
      const orders = await getUserOrders();

      setUserOrders(orders);
      return orders;
    },
    refetchInterval: 60_000,
  });
};

export const useCancelOrder = () => {
  return useMutation({
    mutationFn: async (orderId: string) => cancelOrder(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordersKeys.list() });
    },
  });
};
