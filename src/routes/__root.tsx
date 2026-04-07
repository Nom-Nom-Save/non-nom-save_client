import Header from '@/components/header.component';
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const AUTH_ROUTES = ['/register', '/login', '/verify-email', '/forgot-password', '/reset-password'];

const RootLayout = () => {
  const { location } = useRouterState();
  const isAuthRoute = AUTH_ROUTES.some(route => location.pathname.startsWith(route));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className='flex flex-col min-h-screen'>
          {!isAuthRoute && <Header />}
          <div className='flex-1 flex flex-col'>
            <Outlet />
            <Toaster position='top-right' richColors />
          </div>
        </div>
      </TooltipProvider>
      <TanStackRouterDevtools />
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
