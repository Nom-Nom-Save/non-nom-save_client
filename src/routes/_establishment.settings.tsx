import { createFileRoute } from '@tanstack/react-router';
import SettingsPage from '@/pages/settings.page';

export const Route = createFileRoute('/_establishment/settings')({
  component: SettingsPage,
});
