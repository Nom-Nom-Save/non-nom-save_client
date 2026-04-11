import { useGetEstablishmentsQuery } from '@/queries/establishments.queries';
import { Loading } from '../loading.component';
import { useGetFavoritesQuery } from '@/queries/favorites.queries';
import EstablishmentCard from './establishment-card.component';
import { useEffect, useState } from 'react';
import type { EstablishmentResponse } from '@/types/establishments.types';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Store } from 'lucide-react';
import { useEstablishmentsStore } from '@/store/establishments.store';
import { useLocationStore } from '@/store/location.store';

const EstablishmentsList = () => {
  const { t } = useTranslation();
  const [establishmentPage, setEstablishmentPage] = useState<number>(1);
  const [establishments, setEstablishments] = useState<EstablishmentResponse[]>([]);

  const { lon, lat } = useLocationStore();
  const { distanceFilter, minRating, sortBy, sortOrder, city, productTypes } =
    useEstablishmentsStore();

  const { data: establishmentsData, isLoading } = useGetEstablishmentsQuery({
    page: establishmentPage,
    minRating: minRating ? minRating : undefined,
    radius: distanceFilter ? distanceFilter : undefined,
    sortBy,
    sortOrder,
    city: city !== 'All cities' && city !== 'My location' ? city : undefined,
    lon: lon && city === 'My location' ? lon : undefined,
    lat: lat && city === 'My location' ? lat : undefined,
    productTypeIds: productTypes ? productTypes : undefined,
  });
  const { data: favoritesData } = useGetFavoritesQuery();

  useEffect(() => {
    if (establishmentsData?.establishments) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEstablishments(prev =>
        establishmentPage === 1
          ? establishmentsData.establishments
          : [...prev, ...establishmentsData.establishments]
      );
    }
  }, [establishmentsData, establishmentPage]);

  const establishmentsTotalPages = establishmentsData?.meta.totalPages ?? 1;
  const establishmentsTotalItems = establishmentsData?.meta.total ?? 0;
  const hasMoreEstablishments = establishmentPage < establishmentsTotalPages;

  const isInitialLoading = isLoading && establishmentPage === 1;
  const isLoadingMore = isLoading && establishmentPage > 1;
  const isEmpty = !isInitialLoading && establishments.length === 0;

  const handleLoadMore = () => setEstablishmentPage(prev => prev + 1);

  if (isInitialLoading) {
    return (
      <div className='mt-6 flex justify-center'>
        <Loading size='lg' />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className='flex flex-col items-center justify-center py-16 px-8 text-center'>
        <Store className='w-12 h-12 mb-4' />
        <p className='font-bold font-playfair text-xl mb-2'>{t(StringKey.NO_ESTABLISHMENTS)}</p>
        <p className='text-muted-foreground text-sm max-w-xs'>
          {t(StringKey.NO_ESTABLISHMENTS_DESCRIPTION)}
        </p>
      </div>
    );
  }

  return (
    <>
      <ul>
        {establishments.map(establishment => {
          const isFavorite = favoritesData?.favorites.some(
            favorite => favorite.establishmentId === establishment.id
          );

          return (
            <EstablishmentCard
              key={establishment.id}
              establishment={establishment}
              isFavorite={!!isFavorite}
            />
          );
        })}
      </ul>

      <div className='flex flex-col items-center gap-2 my-4'>
        <div className='flex items-center gap-3 w-full max-w-xs'>
          <span className='text-xs text-muted-foreground whitespace-nowrap'>
            {establishments.length} / {establishmentsTotalItems}
          </span>
          <div className='flex-1 h-1 rounded-full bg-muted overflow-hidden'>
            <div
              className='h-full rounded-full bg-brand-green transition-all duration-500'
              style={{ width: `${(establishments.length / establishmentsTotalItems) * 100}%` }}
            />
          </div>
        </div>

        {hasMoreEstablishments && (
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className='flex items-center gap-2 px-6 py-2.5 rounded-full border border-border bg-white text-sm font-semibold hover:bg-muted/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {isLoadingMore ? (
              <>
                <span className='h-4 w-4 rounded-full border-2 border-brand-green/30 border-t-brand-green animate-spin' />
                {t(StringKey.LOADING)}
              </>
            ) : (
              <>
                {t(StringKey.LOAD_MORE)}
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  className='text-brand-green'
                >
                  <path
                    d='M8 3v10M4 9l4 4 4-4'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default EstablishmentsList;
