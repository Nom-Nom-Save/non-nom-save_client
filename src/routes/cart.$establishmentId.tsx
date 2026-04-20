import EstablishmentCartPage from '@/pages/establishment-cart.page';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

export const Route = createFileRoute('/cart/$establishmentId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { establishmentId } = Route.useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [establishmentId]);

  return (
    <>
      <div className='min-h-screen bg-brand-cream px-6'>
        <Toaster position='top-right' richColors />
        <Outlet />
        <EstablishmentCartPage />
      </div>
    </>
  );
}
