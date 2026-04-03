import { StringKey } from '@/consts/string-key.consts';
import { useGetFavoritesQuery, useRemoveFromFavoritesQuery } from '@/queries/favorites.queries';
import { useTranslation } from 'react-i18next';
import { Loading } from '../loading.component';
import { Heart, MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ApiError } from '@/api/client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

const UserFavorites = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [selectedFavorite, setSelectedFavorite] = useState<{ id: string; name: string } | null>(
    null
  );

  const { data, isLoading } = useGetFavoritesQuery(page);
  const favorites = data?.favorites;
  const meta = data?.meta;

  const { mutate: removeFromFavorites, isPending } = useRemoveFromFavoritesQuery();

  const handleRemoveFromFavorites = (establishmentId: string) => {
    removeFromFavorites(establishmentId, {
      onSuccess: () => {
        toast.success(
          t(StringKey.SUCCESSFULLY_REMOVED_FROM_FAVORITES)
            .split('{establishmentName}')
            .map((part, i) =>
              i === 0 ? (
                <span key={i}>
                  {part}
                  <span className='font-bold text-black'>{selectedFavorite?.name}</span>
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )
        );
        setSelectedFavorite(null);
      },
      onError: (error: Error) => {
        if (error instanceof ApiError) {
          toast.error(
            t(StringKey.FAILED_TO_REMOVE_FROM_FAVORITES)
              .split('{establishmentName}')
              .map((part, i) =>
                i === 0 ? (
                  <span key={i}>
                    {part}
                    <span className='font-bold text-black'>{selectedFavorite?.name}</span>
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )
          );
        }
      },
    });
  };

  const renderRating = (rating: number, max = 5) => {
    return (
      <div className='flex items-center gap-1'>
        {Array.from({ length: max }, (_, i) => (
          <Star
            key={i}
            className={cn(
              i < Math.floor(rating) ? 'text-[#F59E0B]' : 'text-muted-foreground',
              'w-4 h-4'
            )}
          />
        ))}
        <p className='font-bold ml-2'>{rating.toFixed(1)}</p>
      </div>
    );
  };

  return (
    <section className='mb-6'>
      <hgroup className='mb-6'>
        <h2
          id='favorites-heading'
          className='text-brand-green font-bold font-playfair text-2xl sm:text-3xl mb-1'
        >
          {t(StringKey.FAVORITES)}
        </h2>
        <p className='text-sm text-muted-foreground font-playfair'>
          {t(StringKey.YOUR_SAVED_ESTABLISHMENTS)} {favorites?.length ?? 0} {t(StringKey.PLACES)}
        </p>
      </hgroup>

      {isLoading ? (
        <div className='flex justify-center'>
          <Loading />
        </div>
      ) : (
        <ul className='flex flex-col gap-3'>
          {favorites && favorites.length > 0 ? (
            favorites.map(favorite => (
              <li
                key={favorite.id}
                className='bg-white rounded-[1.25rem] border-[1.5px] border-border p-4 md:p-6 shadow-sm'
              >
                <div className='flex items-start gap-4'>
                  <img
                    src={`${favorite.establishment.logo}`}
                    alt={`${favorite.establishment.name} logo`}
                    className='w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0'
                  />

                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-1'>
                      <p className='font-playfair font-bold text-lg sm:text-2xl truncate'>
                        {favorite.establishment.name}
                      </p>

                      <div className='flex items-center gap-2 shrink-0'>
                        <button className='px-3 py-2 sm:px-4 sm:py-3 rounded-full text-sm font-bold text-white bg-brand-green hover:bg-brand-green-hover transition-colors cursor-pointer shadow-md whitespace-nowrap'>
                          <Link
                            to='/establishments/$establishmentId'
                            params={{ establishmentId: favorite.establishmentId }}
                          >
                            {t(StringKey.VIEW)}
                          </Link>
                        </button>

                        <button
                          className='group cursor-pointer border border-border rounded-full p-2.5 hover:bg-border transition-colors'
                          onClick={() =>
                            setSelectedFavorite({
                              id: favorite.establishmentId,
                              name: favorite.establishment.name,
                            })
                          }
                        >
                          <Heart className='hidden group-hover:block text-destructive' />
                          <Heart
                            className='block group-hover:hidden text-destructive'
                            fill='var(--destructive)'
                          />
                        </button>
                      </div>
                    </div>

                    <address className='not-italic flex items-center gap-2 text-muted-foreground mt-1'>
                      <MapPin className='w-4 h-4 shrink-0' />
                      <span className='text-[13px]'>{favorite.establishment.address}</span>
                    </address>

                    <div className='flex items-center justify-between mt-2 flex-wrap gap-2'>
                      {renderRating(+favorite.establishment.rating)}

                      <div className='flex flex-col items-end'>
                        <span className='text-muted-foreground text-[11px]'>
                          {t(StringKey.ADDED)}
                        </span>
                        <p className='font-bold text-sm'>
                          {new Date(favorite.addedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className='text-center text-foreground/50 text-lg sm:text-2xl font-bold'>
              {t(StringKey.NO_FAVORITES_ESTABLISHMENTS)}
            </li>
          )}
        </ul>
      )}

      {meta && meta.totalPages > 1 && (
        <div className='flex items-center justify-center gap-3 mt-4'>
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className='px-4 py-2 rounded-full border border-border font-bold text-sm disabled:opacity-40 hover:bg-border transition-colors'
          >
            ←
          </button>

          <span className='text-sm font-bold'>
            {page} / {meta.totalPages}
          </span>

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === meta.totalPages}
            className='px-4 py-2 rounded-full border border-border font-bold text-sm disabled:opacity-40 hover:bg-border transition-colors'
          >
            →
          </button>
        </div>
      )}

      <Dialog open={!!selectedFavorite} onOpenChange={() => setSelectedFavorite(null)}>
        <DialogContent className='sm:max-w-[520px] bg-brand-cream'>
          <DialogHeader>
            <DialogTitle>{t(StringKey.REMOVE_FROM_FAVORITES)}</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            {t(StringKey.SURE_YOU_WANT_TO_REMOVE_FROM_FAVORITES)
              .split('{establishmentName}')
              .map((part, i) =>
                i === 0 ? (
                  <span key={i}>
                    {part}
                    <span className='font-bold text-black'>{selectedFavorite?.name}</span>
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
          </DialogDescription>

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

            <Button
              type='button'
              variant='destructive'
              className='flex-1 rounded-xl py-2.5 text-sm font-medium cursor-pointer'
              disabled={isPending}
              onClick={() => handleRemoveFromFavorites(selectedFavorite?.id ?? '')}
            >
              {isPending ? t(StringKey.REMOVING) : t(StringKey.REMOVE)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default UserFavorites;
