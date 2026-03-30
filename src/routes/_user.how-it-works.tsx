import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/how-it-works')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_user/how-it-works"!</div>
}
