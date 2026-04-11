import { createFileRoute } from '@tanstack/react-router';
import CompleteSubscriptionPage from '@/pages/complete-subscription.page';

export const Route = createFileRoute('/complete-subscription')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string | undefined,
    PayerID: search.PayerID as string | undefined,
  }),
  component: CompleteSubscriptionPage,
});
