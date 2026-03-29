import Header from '@/components/header.component';
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';

const AUTH_ROUTES = ['/register', '/login', '/verify-email', '/forgot-password', '/reset-password'];

const RootLayout = () => {
  const { location } = useRouterState();
  const isAuthRoute = AUTH_ROUTES.some(r => location.pathname.startsWith(r));

  return (
    <QueryClientProvider client={queryClient}>
      {!isAuthRoute && <Header />}
      <Outlet />
      <TanStackRouterDevtools />
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
