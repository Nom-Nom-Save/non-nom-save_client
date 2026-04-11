import { StringKey } from '@/consts/string-key.consts';
import { cn } from '@/lib/utils';
import type { EstablishmentProfile, WorkingHours } from '@/types/establishment.types';
import { parseWorkingHours } from '@/utils/working-hours.utils';
import { useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import EstablishmentReviews from './establishment-reviews.component';
import { DAY_LABELS, DAYS } from '@/types/working-hours.types';
import { useGetEstablishmentMenu } from '@/queries/menu.queries';
import EstablishmentMenuItem from './establishment-menu-item';
import type { MenuItemResponse } from '@/types/menu.types';
import EstablishmentMenuItemSkeleton from './establishment-menu-item-skeleton.component';

interface EstablishmentGeneralInfoProps {
  establishment: EstablishmentProfile;
}

const EstablishmentGeneralInfo: FC<EstablishmentGeneralInfoProps> = ({ establishment }) => {
  const { t } = useTranslation();

  const [menuPage, setMenuPage] = useState(1);
  const [allMenuItems, setAllMenuItems] = useState<MenuItemResponse[]>([]);

  const { data: establishmentMenuData, isLoading: isMenuLoading } = useGetEstablishmentMenu(
    establishment.id,
    menuPage
  );

  useEffect(() => {
    if (establishmentMenuData?.menu) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAllMenuItems(prev =>
        menuPage === 1 ? establishmentMenuData.menu : [...prev, ...establishmentMenuData.menu]
      );
    }
  }, [establishmentMenuData, menuPage]);

  const menuTotalPages = establishmentMenuData?.meta?.totalPages ?? 1;
  const menuTotalItems = establishmentMenuData?.meta?.total ?? 0;
  const hasMoreMenuItems = menuPage < menuTotalPages;

  const isInitialMenuLoading = isMenuLoading && menuPage === 1;
  const isLoadingMore = isMenuLoading && menuPage > 1;
  const isEmpty = !isInitialMenuLoading && allMenuItems.length === 0;

  const [hours] = useState<WorkingHours>(parseWorkingHours(establishment.workingHours ?? null));

  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as (typeof DAYS)[number];

  const handleLoadMore = () => setMenuPage(prev => prev + 1);

  return (
    <section className='flex flex-col gap-6 mb-10'>
      <div className='flex gap-4'>
        <h2 className='font-bold font-playfair text-3xl'>{t(StringKey.ACTIVE_OFFERS)}</h2>
        <span className='flex items-center gap-1.5 bg-destructive/5 rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm'>
          <span className='w-2 h-2 rounded-full bg-destructive inline-block' />
          <span className='text-base text-destructive'>{t(StringKey.LIVE).toUpperCase()}</span>
        </span>
      </div>

      <div className='flex flex-col gap-4'>
        {isMenuLoading ? (
          <ul className='grid grid-cols-3 gap-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              <EstablishmentMenuItemSkeleton key={i} />
            ))}
          </ul>
        ) : isEmpty ? (
          <div className='flex flex-col items-center justify-center py-16 px-8 bg-white rounded-2xl shadow-sm text-center'>
            <div className='text-5xl mb-4'>🍽️</div>
            <p className='font-bold font-playfair text-xl mb-2'>{t(StringKey.NO_ACTIVE_OFFERS)}</p>
            <p className='text-muted-foreground text-sm max-w-xs'>
              {t(StringKey.NO_ACTIVE_OFFERS_DESCRIPTION)}
            </p>
          </div>
        ) : (
          <>
            <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
              {allMenuItems.map(menuItem => (
                <EstablishmentMenuItem key={menuItem.id} menuItem={menuItem} />
              ))}
              {isLoadingMore &&
                Array.from({ length: 3 }).map((_, i) => (
                  <EstablishmentMenuItemSkeleton key={`skeleton-${i}`} />
                ))}
            </ul>

            <div className='flex flex-col items-center gap-2'>
              <div className='flex items-center gap-3 w-full max-w-xs'>
                <span className='text-xs text-muted-foreground whitespace-nowrap'>
                  {allMenuItems.length} / {menuTotalItems}
                </span>
                <div className='flex-1 h-1 rounded-full bg-muted overflow-hidden'>
                  <div
                    className='h-full rounded-full bg-brand-green transition-all duration-500'
                    style={{ width: `${(allMenuItems.length / menuTotalItems) * 100}%` }}
                  />
                </div>
              </div>

              {hasMoreMenuItems && (
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
        )}
      </div>

      <div className='bg-white rounded-2xl p-8 shadow-sm'>
        <p className='font-bold font-playfair text-2xl mb-4'>{t(StringKey.ABOUT)}</p>
        <p className='font-playfair text-base'>{establishment.description}</p>
      </div>

      <div className='bg-white rounded-2xl p-8 shadow-sm'>
        <p className='font-bold font-playfair text-2xl mb-4'>{t(StringKey.WORKING_HOURS)}</p>
        {DAYS.map(day => {
          const isToday = day === today;
          return (
            <div key={day} className='flex justify-between py-4 border-b'>
              <div
                className={cn(
                  'flex items-center',
                  isToday && 'p-4 bg-brand-green/5 border rounded-xl flex-1 justify-between'
                )}
              >
                <div className='flex gap-3 items-center'>
                  <span
                    className={cn(
                      'text-muted-foreground',
                      !hours[day].isOpen && 'text-foreground/40',
                      isToday && 'font-bold text-brand-green'
                    )}
                  >
                    {t(DAY_LABELS[day])}
                  </span>
                  {isToday && (
                    <span className='text-[10px] font-black p-2 rounded-full bg-brand-green text-white uppercase w-fit'>
                      {t(StringKey.TODAY)}
                    </span>
                  )}
                </div>
                <p className={cn('hidden text-brand-green font-bold', isToday && 'block')}>
                  <span>{hours[day].open}</span>-<span>{hours[day].close}</span>
                </p>
              </div>
              <p className={cn('text-brand-green font-bold', isToday && 'hidden')}>
                <span>{hours[day].open}</span>-<span>{hours[day].close}</span>
              </p>
            </div>
          );
        })}
      </div>

      <EstablishmentReviews establishmentId={establishment.id} />
    </section>
  );
};

export default EstablishmentGeneralInfo;
