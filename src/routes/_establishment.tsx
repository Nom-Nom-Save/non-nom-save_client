import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { useEstablishmentProfileQuery } from '@/queries/establishment.queries';

const EstablishmentLayout = () => {
  useEstablishmentProfileQuery();

  return (
    <div className='min-h-screen bg-brand-cream'>
      <Toaster position='top-right' richColors />
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute('/_establishment')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    const loginType = localStorage.getItem('loginType');
    if (!token || loginType !== 'establishment') {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' });
    }
  },
  component: EstablishmentLayout,
});
