import type { EstablishmentProfile } from '@/types/establishment.types';
import { Heart, MapPin, Share2, Star, Copy, Check, Link2 } from 'lucide-react';
import { useState, type FC } from 'react';
import {
  useAddToFavoritesQuery,
  useGetFavoritesQuery,
  useRemoveFromFavoritesQuery,
} from '@/queries/favorites.queries';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { StringKey } from '@/consts/string-key.consts';
import { ApiError } from '@/api/client';
import { formatEstablishmentToastMessage } from '@/utils/format-establishment-toast.utils';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { isEstablishmentOpen } from '@/utils/working-hours.utils';

const SHARE_OPTIONS = [
  {
    key: 'telegram',
    label: 'Telegram',
    icon: (
      <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
        <path
          d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 6.54-1.7 8.02c-.12.56-.46.7-.93.43l-2.57-1.9-1.24 1.19c-.14.13-.26.25-.52.25l.18-2.63 4.74-4.28c.21-.18-.04-.28-.32-.1L7.9 14.51l-2.52-.79c-.55-.17-.56-.54.11-.8l9.84-3.8c.46-.17.86.11.7.62z'
          fill='#27A7E7'
        />
      </svg>
    ),
    getUrl: (url: string, name: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(name)}`,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: (
      <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
        <path
          d='M12 2C6.477 2 2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.563V12h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.99 22 12c0-5.523-4.477-10-10-10z'
          fill='#1877F2'
        />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
] as const;

interface EstablishmentHeaderProps {
  establishment: EstablishmentProfile;
}

const EstablishmentHeader: FC<EstablishmentHeaderProps> = ({ establishment }) => {
  const { t } = useTranslation();

  const { data: favoritesData } = useGetFavoritesQuery();
  const isFavorite =
    favoritesData?.favorites?.some(favorite => favorite.establishmentId === establishment.id) ??
    false;

  const isOpenNow = isEstablishmentOpen(establishment.workingHours);

  const { mutate: removeFromFavorites, isPending: isRemovePending } = useRemoveFromFavoritesQuery();
  const { mutate: addToFavorites, isPending: isAddPending } = useAddToFavoritesQuery();

  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(establishment.id, {
        onSuccess: () => {
          toast.success(
            formatEstablishmentToastMessage(
              t(StringKey.SUCCESSFULLY_REMOVED_FROM_FAVORITES),
              establishment.name
            )
          );
        },
        onError: (error: Error) => {
          if (error instanceof ApiError) {
            toast.error(
              formatEstablishmentToastMessage(
                t(StringKey.FAILED_TO_REMOVE_FROM_FAVORITES),
                establishment.name
              )
            );
          }
        },
      });
    } else {
      addToFavorites(establishment.id, {
        onSuccess: () => {
          toast.success(
            formatEstablishmentToastMessage(
              t(StringKey.SUCCESSFULLY_ADDED_TO_FAVORITES),
              establishment.name
            )
          );
        },
        onError: (error: Error) => {
          if (error instanceof ApiError) {
            toast.error(
              formatEstablishmentToastMessage(
                t(StringKey.FAILED_TO_ADD_TO_FAVORITES),
                establishment.name
              )
            );
          }
        },
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success(t(StringKey.LINK_COPIED));
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error(t(StringKey.FAILED_TO_COPY_LINK));
    }
  };

  const handleShareOption = (getUrl: (url: string, name: string) => string) => {
    window.open(getUrl(shareUrl, establishment.name), '_blank', 'noopener,noreferrer');
  };

  return (
    <section className='relative rounded-[1.25rem] overflow-hidden mt-6 min-h-52'>
      <div className='absolute inset-0 bg-linear-to-br from-orange-100 via-brand-green-muted to-amber-100'>
        {establishment.banner ? (
          <img src={establishment.banner} alt='' className='w-full h-full object-cover' />
        ) : null}
      </div>

      <div className='hidden sm:block absolute top-4 right-4'>
        <span className='flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm'>
          {isOpenNow ? (
            <>
              <span className='w-2 h-2 rounded-full bg-brand-green inline-block' />
              {t(StringKey.OPEN_NOW)}
            </>
          ) : (
            <>
              <span className='w-2 h-2 rounded-full bg-destructive inline-block' />
              {t(StringKey.CLOSED).toUpperCase()}
            </>
          )}
        </span>
      </div>

      <div className='absolute bottom-0 left-0 right-0 m-3'>
        <div className='flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between bg-white rounded-2xl p-4 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-14 h-14 rounded-xl bg-brand-green-muted border border-border overflow-hidden flex items-center justify-center text-2xl shrink-0'>
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
              <div className='flex items-center gap-2 flex-wrap'>
                <p className='font-playfair font-bold text-lg leading-tight'>
                  {establishment.name ?? '—'}
                </p>
                <span className='flex sm:hidden items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm'>
                  {isOpenNow ? (
                    <>
                      <span className='w-2 h-2 rounded-full bg-brand-green inline-block' />
                      {t(StringKey.OPEN_NOW)}
                    </>
                  ) : (
                    <>
                      <span className='w-2 h-2 rounded-full bg-destructive inline-block' />
                      {t(StringKey.CLOSED).toUpperCase()}
                    </>
                  )}
                </span>
              </div>
              <div className='flex items-center gap-3 mt-1 flex-wrap'>
                <address className='not-italic flex items-center gap-1 text-foreground/50'>
                  <MapPin className='w-3.5 h-3.5 shrink-0' />
                  <span className='text-sm'>{establishment.address ?? '—'}</span>
                </address>
                {establishment.rating && (
                  <div className='flex items-center gap-1 text-foreground/50'>
                    <Star className='w-3.5 h-3.5 text-amber-400 fill-amber-400' />
                    <span className='text-muted-foreground text-sm'>
                      {establishment.rating} ({establishment.reviewCount} {t(StringKey.REVIEWS)})
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

            <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
              <DialogContent className='sm:max-w-[520px] bg-brand-cream'>
                <DialogHeader>
                  <DialogTitle>{t(StringKey.SHARE_ESTABLISHMENT)}</DialogTitle>
                </DialogHeader>

                <div className='flex flex-col gap-4 py-2'>
                  <div className='grid grid-cols-2 gap-2'>
                    {SHARE_OPTIONS.map(option => (
                      <button
                        key={option.key}
                        onClick={() => handleShareOption(option.getUrl)}
                        className='flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:bg-border transition-colors cursor-pointer'
                      >
                        {option.icon}
                        <span className='text-xs text-foreground/60'>{option.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className='flex items-center gap-2 bg-background rounded-xl border border-border px-3 py-2.5 min-w-0'>
                    <Link2 className='w-4 h-4 text-foreground/40 shrink-0' />
                    <span className='text-sm text-foreground/60 flex-1 break-all'>{shareUrl}</span>
                    <button
                      onClick={() => {
                        void handleCopyLink();
                      }}
                      className='flex items-center gap-1.5 text-xs font-medium text-brand-green hover:opacity-80 transition-opacity cursor-pointer shrink-0'
                    >
                      {isCopied ? (
                        <>
                          <Check className='w-3.5 h-3.5' />
                          {t(StringKey.COPIED)}
                        </>
                      ) : (
                        <>
                          <Copy className='w-3.5 h-3.5' />
                          {t(StringKey.COPY)}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type='button'
                      variant='outline'
                      className='flex-1 rounded-xl py-2.5 text-sm font-medium cursor-pointer'
                    >
                      {t(StringKey.CANCEL)}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button
              className='cursor-pointer border border-border rounded-full p-2.5 hover:bg-border transition-colors'
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share2 className='w-5 h-5 text-foreground/60' />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EstablishmentHeader;
