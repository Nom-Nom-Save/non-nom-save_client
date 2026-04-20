import CartPage from '@/pages/cart.page';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

export const Route = createFileRoute('/my-cart')({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className='min-h-screen bg-brand-cream px-6'>
        <Toaster position='top-right' richColors />
        <Outlet />
        <CartPage />
      </div>
    </>
  );
}
