import { createFileRoute } from '@tanstack/react-router';
import CancelSubscriptionPage from '@/pages/cancel-subscription.page';

export const Route = createFileRoute('/cancel-subscription')({
  component: CancelSubscriptionPage,
});
