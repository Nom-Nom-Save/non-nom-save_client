import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_user/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello /_user/dashboard!</div>;
}
