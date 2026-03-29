import { createFileRoute } from '@tanstack/react-router';
import AnalyticsPage from '@/pages/analytics.page';

export const Route = createFileRoute('/_establishment/analytics')({
  component: AnalyticsPage,
});
