import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';

export const Route = createFileRoute('/_auth')({
  component: () => (
    <>
      <Toaster position='top-right' richColors />
      <Outlet />
    </>
  ),
});
