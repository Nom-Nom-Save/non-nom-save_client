import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/profile/favorites')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_user/profile/favorites"!</div>
}
