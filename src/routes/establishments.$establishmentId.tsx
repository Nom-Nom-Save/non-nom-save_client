import EstablishmentPage from '@/pages/establishment.page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/establishments/$establishmentId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { establishmentId } = Route.useParams();

  return (
    <div className='min-h-screen bg-brand-cream px-6'>
      <EstablishmentPage establishmentId={establishmentId} />
    </div>
  );
}
