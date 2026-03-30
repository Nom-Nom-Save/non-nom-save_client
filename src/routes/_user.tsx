import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { useUserProfileQuery } from '@/queries/user.queries';

const UserLayout = () => {
  useUserProfileQuery();

  return (
    <div className='min-h-screen bg-brand-cream'>
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
