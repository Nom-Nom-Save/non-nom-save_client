import { type FC } from 'react';
import { Clock, Heart, MapPin, Star, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { useAddToFavoritesQuery, useRemoveFromFavoritesQuery } from '@/queries/favorites.queries';
import { toast } from 'sonner';
import { formatEstablishmentToastMessage } from '@/utils/format-establishment-toast.utils';
import { ApiError } from '@/api/client';
import { isEstablishmentOpen } from '@/utils/working-hours.utils';
import { useGetEstablishmentMenu } from '@/queries/menu.queries';
import type { EstablishmentResponse } from '@/types/establishments.types';
import EstablishmentMenuItem from '../establishment/establishment-menu-item';
import EstablishmentMenuItemSkeleton from '../establishment/establishment-menu-item-skeleton.component';
import type { DAYS } from '@/types/working-hours.types';
import { Link } from '@tanstack/react-router';

interface EstablishmentCardProps {
  establishment: EstablishmentResponse;
  isFavorite: boolean;
}

const EstablishmentCard: FC<EstablishmentCardProps> = ({ establishment, isFavorite }) => {
  const { t } = useTranslation();
  const { mutate: removeFromFavorites, isPending: isRemovePending } = useRemoveFromFavoritesQuery();
  const { mutate: addToFavorites, isPending: isAddPending } = useAddToFavoritesQuery();

  const { data: menuData, isLoading: isMenuLoading } = useGetEstablishmentMenu(establishment.id);

  const now = new Date();
  const dayName = now
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as (typeof DAYS)[number];

  const todaySchedule = establishment.workingHours[dayName];
  const isOpenNow = isEstablishmentOpen(establishment.workingHours);

  const handleFavoriteToggle = () => {
    const mutation = isFavorite ? removeFromFavorites : addToFavorites;
    const successMsg = isFavorite
      ? StringKey.SUCCESSFULLY_REMOVED_FROM_FAVORITES
      : StringKey.SUCCESSFULLY_ADDED_TO_FAVORITES;
    const errorMsg = isFavorite
      ? StringKey.FAILED_TO_REMOVE_FROM_FAVORITES
      : StringKey.FAILED_TO_ADD_TO_FAVORITES;

    mutation(establishment.id, {
      onSuccess: () =>
        toast.success(formatEstablishmentToastMessage(t(successMsg), establishment.name ?? '')),
      onError: error =>
        error instanceof ApiError &&
        toast.error(formatEstablishmentToastMessage(t(errorMsg), establishment.name ?? '')),
    });
  };

  return (
    <li
      key={establishment.id}
      className='flex flex-col rounded-[1.25rem] overflow-hidden border border-border bg-white shadow-sm mt-6'
    >
      <div className='relative h-24 md:h-32 w-full bg-slate-100 overflow-hidden'>
        {establishment.banner ? (
          <img src={establishment.banner} alt='' className='w-full h-full object-cover' />
        ) : (
          <div className='w-full h-full bg-linear-to-br from-orange-100 via-brand-green-muted to-amber-100' />
        )}

        {establishment?.distance && (
          <div className='absolute top-4 left-4'>
            <span className='flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-bold shadow-sm'>
              📍
              {establishment.distance?.toFixed(1)} km
            </span>
          </div>
        )}

        <div className='absolute top-4 right-4'>
          <span className='flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-bold shadow-sm'>
            <span
              className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-brand-green' : 'bg-destructive'}`}
            />
            {isOpenNow ? t(StringKey.OPEN_NOW) : t(StringKey.CLOSED).toUpperCase()}
          </span>
        </div>
      </div>

      <div className='p-5 border-b border-border'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-2xl bg-white border border-border overflow-hidden flex items-center justify-center text-2xl shrink-0 shadow-sm'>
              {establishment.logo ? (
                <img
                  src={establishment.logo}
                  alt={`${establishment.name} logo`}
                  className='w-full h-full object-cover'
                />
              ) : (
                '🏪'
              )}
            </div>

            <div className='flex-1 min-w-0'>
              <h3 className='font-playfair font-bold text-2xl leading-tight text-foreground'>
                {establishment.name ?? '—'}
              </h3>
              <div className='flex items-center gap-4 mt-1 flex-wrap'>
                <address className='not-italic flex items-center gap-1.5 text-foreground/60'>
                  <MapPin className='w-4 h-4 text-brand-green' />
                  <span className='text-sm'>{establishment.address ?? '—'}</span>
                </address>

                {establishment.rating && (
                  <div className='flex items-center gap-1.5'>
                    <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
                    <span className='text-sm font-medium'>
                      {establishment.rating}{' '}
                      <span className='text-foreground/40 font-normal'>
                        ({establishment.reviewCount} {t(StringKey.REVIEWS)})
                      </span>
                    </span>
                  </div>
                )}

                {todaySchedule && (
                  <div className='flex items-center gap-1.5 text-foreground/60'>
                    <Clock className='w-4 h-4 text-brand-green' />
                    <span className='text-sm'>
                      {todaySchedule.open} – {todaySchedule.close}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='self-end md:self-auto flex items-center gap-2 shrink-0'>
            <button
              className='group cursor-pointer border border-border rounded-full p-2.5 hover:bg-border transition-colors'
              disabled={isFavorite ? isRemovePending : isAddPending}
              onClick={handleFavoriteToggle}
            >
              <Heart
                className='w-5 h-5 text-destructive transition-all'
                fill={isFavorite ? 'var(--destructive)' : 'transparent'}
              />
            </button>

            <Link
              to='/establishments/$establishmentId'
              params={{ establishmentId: establishment.id }}
            >
              <button className='cursor-pointer font-semibold text-brand-green text-base hover:underline hover:underline-offset-4'>
                {t(StringKey.VIEW_ALL)}
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className='p-4'>
        {isMenuLoading ? (
          <ul className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <EstablishmentMenuItemSkeleton key={i} />
            ))}
          </ul>
        ) : menuData?.menu.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-6 text-center text-muted-foreground gap-1'>
            <UtensilsCrossed className='w-8 h-8 mb-1 opacity-40' />
            <p className='text-sm font-medium'>{t(StringKey.NO_MENU_ITEMS)}</p>
          </div>
        ) : (
          <ul className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {menuData?.menu.map(item => (
              <EstablishmentMenuItem key={item.id} menuItem={item} />
            ))}
          </ul>
        )}{' '}
      </div>
    </li>
  );
};

export default EstablishmentCard;
