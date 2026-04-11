import UserFavorites from '@/components/user-profile/user-favorites.component';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_user/profile/favorites')({
  component: UserFavorites,
});
