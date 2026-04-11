import { getNearbyEstablishments } from '@/api/establishments.api';
import { StringKey } from '@/consts/string-key.consts';
import type { EstablishmentResponse } from '@/types/establishments.types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EstablishmentsSlider from './establishments-slider.component';
import { Loading } from '../loading.component';
import { MoveRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useLocationStore } from '@/store/location.store';

const AvailableNow = () => {
  const { t } = useTranslation();
  const [nearbyEstablishments, setNearbyEstablishments] = useState<EstablishmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setLocation } = useLocationStore();

  useEffect(() => {
    void getVisitiorIp();
  }, []);

  const getVisitiorIp = async () => {
    try {
      setIsLoading(true);

      await new Promise<void>((resolve, reject) => {
        if (!navigator.geolocation) {
          return reject(new Error('Geolocation not supported'));
        }

        navigator.geolocation.getCurrentPosition(({ coords }) => {
          const { latitude, longitude } = coords;
          setLocation(longitude, latitude);
          getNearbyEstablishments(longitude, latitude, 50)
            .then(res => {
              setNearbyEstablishments(res.establishments);
              resolve();
            })
            .catch((error: unknown) => {
              reject(error instanceof Error ? error : new Error(String(error)));
            });
        });
      });
    } catch (error) {
      console.error('Failer to fetch IP: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='py-10'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-3xl text-start font-bold font-playfair'>
            {t(StringKey.AVAILABLE_NOW)}
          </h2>
          <h4 className='text-muted-foreground font-lg text-start mb-8'>
            {t(StringKey.FRESHLY_LISTED)}
          </h4>
        </div>
        <Link to={'/dashboard'}>
          <button
            type='button'
            className='rounded-xl py-4 px-8 text-lg font-semibold text-white transition-colors cursor-pointer bg-brand-green hover:bg-brand-green-hover flex justify-between items-center gap-4'
          >
            <span>{t(StringKey.EXPLORE_ALL)}</span>
            <MoveRight />
          </button>
        </Link>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-8'>
          <Loading size='xl' />
        </div>
      ) : nearbyEstablishments.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-8 text-center text-muted-foreground'>
          <p className='text-lg font-medium'>{t(StringKey.NO_ESTABLISHMENTS_NEARBY)}</p>
        </div>
      ) : (
        <EstablishmentsSlider establishments={nearbyEstablishments} />
      )}
    </section>
  );
};

export default AvailableNow;
