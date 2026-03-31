import UserOrders from '@/components/user-profile/user-orders.component';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_user/profile/orders')({
  component: UserOrders,
});
