import UserSidebar from '@/components/user-profile/user-sidebar.component';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_user/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='flex flex-col md:flex-row gap-8 pt-4 flex-1 items-start'>
      <UserSidebar />
      <div className='flex-1 min-w-0'>
        <Outlet />
      </div>
    </div>
  );
}
