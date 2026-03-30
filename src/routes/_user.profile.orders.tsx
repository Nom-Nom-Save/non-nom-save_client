import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/profile/orders')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_user/profile/orders"!</div>
}
