import EstablishmentGeneralInfo from '@/components/establishment/establishment-general-info.component';
import EstablishmentHeader from '@/components/establishment/establishment-header.component';
import { Loading } from '@/components/loading.component';
import { useEstablishmentByIdQuery } from '@/queries/establishment.queries';
import type { FC } from 'react';
import EstablishmentImpactStats from '@/components/establishment/establishment-impact-stats.component';

interface EstablishmentPageProps {
  establishmentId: string;
}

const EstablishmentPage: FC<EstablishmentPageProps> = ({ establishmentId }) => {
  const { data: establishment, isLoading } = useEstablishmentByIdQuery(establishmentId);

  if (isLoading) {
    return (
      <div className='mt-6 flex justify-center'>
        <Loading size='lg' />
      </div>
    );
  }

  if (!establishment) {
    return null;
  }

  return (
    <main>
      <EstablishmentHeader establishment={establishment} />
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start mt-6'>
        <EstablishmentGeneralInfo establishment={establishment} />
        <EstablishmentImpactStats establishment={establishment} />
      </div>
    </main>
  );
};

export default EstablishmentPage;
