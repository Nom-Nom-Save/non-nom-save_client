import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_user/map')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello /_user/map!</div>;
}
