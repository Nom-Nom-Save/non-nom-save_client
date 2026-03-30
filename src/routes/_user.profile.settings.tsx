import ProfileSettings from '@/components/user-profile/profile-settings.component';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_user/profile/settings')({
  component: ProfileSettings,
});
