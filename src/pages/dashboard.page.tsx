import EstablishmentsFilters from '@/components/establishments/establishments-filters.component';
import EstablishmentsList from '@/components/establishments/establishments-list.component';

const DashboardPage = () => {
  return (
    <section className='my-6'>
      <EstablishmentsFilters />
      <EstablishmentsList />
    </section>
  );
};

export default DashboardPage;
