import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { useUserProfileQuery } from '@/queries/user.queries';
import { useOrdersQuery } from '@/queries/order.queries';
import { useGetFavoritesQuery } from '@/queries/favorites.queries';

const UserLayout = () => {
  useUserProfileQuery();
  useOrdersQuery();
  useGetFavoritesQuery();

  return (
    <div className='min-h-screen bg-brand-cream px-6'>
      <Toaster position='top-right' richColors />
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute('/_user')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    const loginType = localStorage.getItem('loginType');

    if (!token || loginType !== 'user') {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' });
    }
  },
  component: UserLayout,
});
