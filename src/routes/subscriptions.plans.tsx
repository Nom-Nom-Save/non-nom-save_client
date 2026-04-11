import { createFileRoute, redirect } from '@tanstack/react-router';
import SubscriptionsPlansPage from '@/pages/subscriptions-plans.page';

export const Route = createFileRoute('/subscriptions/plans')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' });
    }
  },
  component: SubscriptionsPlansPage,
});
