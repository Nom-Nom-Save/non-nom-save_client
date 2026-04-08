import { StringKey } from '@/consts/string-key.consts';
import { cn } from '@/lib/utils';
import { ReviewMode, type MyReview, type RatingFilter } from '@/types/reviews.types';
import { useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '../loading.component';
import { renderRating } from '@/utils/rating.utils';
import { formInputVariants } from '../ui/form-input';
import { Star, Pencil, Trash2, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { reviewSchema, type ReviewFormData } from '@/utils/validations-user/review.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserProfileQuery } from '@/queries/user.queries';
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useUserReviewsForEstablishmentQuery,
  useGetEstablishmentReviewsQuery,
  useGetEstablishmentReviewsDistributionQuery,
} from '@/queries/reviews.queries';
import { toast } from 'sonner';
import { ApiError } from '@/api/client';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { formatEditableUntil } from '@/utils/time.utils';
import { getPaginationPages } from '@/utils/get-pagination-pages.utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SortOrder } from '@/types/common.types';

enum ActiveTab {
  ALL = 'all',
  MY = 'my',
}

const getInitials = (fullName: string) => {
  return fullName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

interface EstablishmentReviewsProps {
  establishmentId: string;
}

const EstablishmentReviews: FC<EstablishmentReviewsProps> = ({ establishmentId }) => {
  const { t } = useTranslation();

  const { data: user } = useUserProfileQuery();
  const { mutate: createReview, isPending: isCreating } = useCreateReviewMutation();
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReviewMutation();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReviewMutation();

  const { data: reviewsDistribution, isLoading: isReviewsDistributionLoading } =
    useGetEstablishmentReviewsDistributionQuery(establishmentId);

  const isPending = isCreating || isUpdating;

  const [reviewPage, setReviewPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter | null>(null);

  const { data: establishmentReviewsData, isLoading: isEstablishmentReviewsLoading } =
    useGetEstablishmentReviewsQuery({
      establishmentId,
      sortOrder,
      page: reviewPage,
      ratingFilter,
    });
  const { data: userReviews, isLoading: isUserReviewsLoading } =
    useUserReviewsForEstablishmentQuery({
      establishmentId,
      sortOrder,
      ratingFilter,
    });

  const isLoading = isEstablishmentReviewsLoading && isReviewsDistributionLoading;

  const myReview = establishmentReviewsData?.myReview ?? null;
  const reviews = establishmentReviewsData?.reviews.filter(review => review.id !== myReview?.id);
  const averageRating = Number(reviewsDistribution?.rating ?? 0);
  const ratingDistribution = reviewsDistribution?.ratingDistribution ?? [];
  const totalCount = establishmentReviewsData?.meta?.total ?? 0;
  const totalPages = establishmentReviewsData?.meta?.totalPages ?? 1;

  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.ALL);
  const [selectedReview, setSelectedReview] = useState<{ id: string; comment: string } | null>(
    null
  );
  const [mode, setMode] = useState<ReviewMode>(ReviewMode.LIST);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
    watch,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const rating = watch('rating');

  useEffect(() => {
    if (user) {
      reset({ rating: 0, comment: '' });
    }
  }, [user, reset]);

  const handleStartEditReview = (review: MyReview) => {
    reset({ rating: review.rating, comment: review.comment });
    setSelectedReview({ id: review.id, comment: review.comment });
    setMode(ReviewMode.EDIT);
  };

  const handleStartWriteReview = () => {
    reset({ rating: 0, comment: '' });
    setMode(ReviewMode.WRITE);
  };

  const handleCancelReview = () => {
    reset({ rating: 0, comment: '' });
    setSelectedReview(null);
    setMode(ReviewMode.LIST);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return t(StringKey.TODAY);
    }
    if (diffDays === 1) {
      return t(StringKey.ONE_DAY_AGO);
    }
    if (diffDays < 30) {
      return t(StringKey.DAYS_AGO, { count: diffDays });
    }
    if (diffDays < 365) {
      return t(StringKey.MONTHS_AGO, { count: Math.floor(diffDays / 30) });
    }
    return t(StringKey.YEARS_AGO, { count: Math.floor(diffDays / 365) });
  };

  const handleFormSubmit = (data: ReviewFormData) => {
    if (!user) {
      return;
    }

    if (mode === ReviewMode.EDIT && selectedReview) {
      updateReview(
        { reviewId: selectedReview.id, ...data, establishmentId },
        {
          onSuccess: () => {
            toast.success(t(StringKey.REVIEW_UPDATED));
            reset({ rating: 0, comment: '' });
            setSelectedReview(null);
            setMode(ReviewMode.LIST);
          },
          onError: (error: Error) => {
            if (error instanceof ApiError) {
              toast.error(t(StringKey.REVIEW_FAILED));
            }
          },
        }
      );
    } else {
      createReview(
        { ...data, establishmentId },
        {
          onSuccess: () => {
            toast.success(t(StringKey.REVIEW_SUBMITTED));
            reset({ rating: 0, comment: '' });
            setMode(ReviewMode.LIST);
          },
          onError: (error: Error) => {
            if (error instanceof ApiError) {
              toast.error(t(StringKey.REVIEW_FAILED));
            }
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (!selectedReview) {
      return;
    }

    deleteReview(
      { reviewId: selectedReview.id, establishmentId },
      {
        onSuccess: () => {
          toast.success(t(StringKey.REVIEW_DELETED));
          setSelectedReview(null);
        },
        onError: () => {
          toast.error(t(StringKey.REVIEW_FAILED));
        },
      }
    );
  };

  const handleSort = (value: SortOrder) => {
    setSortOrder(value);
    setReviewPage(1);
  };

  const handleRatingFilter = (rating: RatingFilter) => {
    setRatingFilter(prev => (prev === rating ? null : rating));
    setReviewPage(1);
  };

  const renderHeaderAction = () => {
    if (mode === ReviewMode.WRITE || mode === ReviewMode.EDIT) {
      return (
        <button
          className='font-bold text-brand-green cursor-pointer hover:underline text-sm'
          onClick={handleCancelReview}
        >
          {t(StringKey.BACK_TO_REVIEWS)}
        </button>
      );
    }

    if (myReview?.isEditable) {
      return (
        <Tooltip>
          <TooltipTrigger>
            <span className='font-bold text-muted-foreground/50 text-sm cursor-default select-none'>
              {t(StringKey.WRITE_A_REVIEW)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center gap-1.5'>
                <Clock className='w-3 h-3 shrink-0' />
                <span>
                  {t(StringKey.CAN_EDIT_UNTIL, {
                    time: formatEditableUntil(myReview.editableUntil),
                  })}
                </span>
              </div>
              <span className='text-[11px] text-muted-foreground'>
                {t(StringKey.NEW_REVIEW_AFTER_EDIT_EXPIRES)}
              </span>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <button
        className='font-bold text-brand-green cursor-pointer hover:underline text-sm'
        onClick={handleStartWriteReview}
      >
        {t(StringKey.WRITE_A_REVIEW)}
      </button>
    );
  };

  const isFormMode = mode === ReviewMode.WRITE || mode === ReviewMode.EDIT;

  const renderMyReviewsTab = () => {
    if (!user) {
      return (
        <p className='text-center text-foreground/50 text-base font-bold py-8'>
          {t(StringKey.LOGIN_TO_SEE_YOUR_REVIEWS)}
        </p>
      );
    }

    if (isUserReviewsLoading) {
      return (
        <div className='flex justify-center py-8'>
          <Loading size='lg' />
        </div>
      );
    }

    if (!userReviews || (userReviews.length === 0 && !ratingFilter)) {
      return (
        <p className='text-center text-foreground/50 text-lg sm:text-2xl font-bold'>
          {t(StringKey.YOU_HAVE_NO_REVIEWS)}
        </p>
      );
    }

    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='text-xs text-muted-foreground font-medium'>{t(StringKey.FILTER)}:</span>
          <button
            onClick={() => setRatingFilter(null)}
            className={cn(
              'text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer',
              ratingFilter === null
                ? 'bg-brand-green text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {t(StringKey.ALL)}
          </button>

          {[5, 4, 3, 2, 1].map(star => (
            <button
              key={star}
              onClick={() =>
                setRatingFilter(prev => (prev === star ? null : (star as RatingFilter)))
              }
              className={cn(
                'flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer',
                ratingFilter === star
                  ? 'bg-brand-green/10 text-brand-green ring-1 ring-brand-green/30'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              <Star
                className={cn(
                  'w-3 h-3',
                  ratingFilter === star ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-muted-foreground'
                )}
              />
              {star}
            </button>
          ))}
        </div>
        {userReviews.length === 0 ? (
          <p className='text-center text-foreground/50 text-sm font-bold py-6'>
            {t(StringKey.NO_REVIEWS_FOR_RATING, {
              rating: ratingFilter,
            })}
          </p>
        ) : (
          userReviews.map(review => (
            <div key={review.id} className='bg-muted/40 rounded-2xl p-6'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-sm shrink-0'>
                  {user ? getInitials(user.fullName) : '?'}
                </div>

                <div className='flex-1'>
                  <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <p className='font-bold text-sm truncate'>{user?.fullName}</p>
                        <span className='text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-green text-white uppercase'>
                          {t(StringKey.YOU)}
                        </span>
                      </div>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide mt-0.5'>
                        {formatDate(review.createdAt)}
                      </p>
                    </div>

                    <div className='flex items-center gap-2 shrink-0 self-start sm:self-auto'>
                      {renderRating(review.rating)}

                      {review.isEditable && (
                        <button
                          onClick={() => handleStartEditReview(review)}
                          className='p-1.5 rounded-lg hover:bg-brand-green/10 text-brand-green transition-colors cursor-pointer'
                          title={t(StringKey.EDIT)}
                        >
                          <Pencil className='w-4 h-4' />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          setSelectedReview({ id: review.id, comment: review.comment })
                        }
                        disabled={isDeleting}
                        className='p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50 cursor-pointer'
                        title={t(StringKey.DELETE)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>

                  <p className='text-sm text-foreground/80 mt-3 leading-relaxed'>
                    {review.comment}
                  </p>

                  {review.isEditable && (
                    <div className='flex items-center gap-1.5 mt-3 text-xs text-muted-foreground'>
                      <Clock className='w-3 h-3' />
                      <span>
                        {t(StringKey.CAN_EDIT_UNTIL, {
                          time: formatEditableUntil(review.editableUntil),
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderAllReviewsTab = () => (
    <>
      {isLoading ? (
        <div className='mt-6 flex justify-center'>
          <Loading size='lg' />
        </div>
      ) : (
        <>
          <div className='flex gap-10 mb-8'>
            <div className='flex flex-col items-center justify-center min-w-[100px]'>
              <p className='text-5xl font-extrabold text-brand-green font-playfair'>
                {averageRating.toFixed(1)}
              </p>
              <div className='mt-2'>{renderRating(averageRating, 5, false)}</div>
              <p className='text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wide'>
                {totalCount} {t(StringKey.REVIEWS)}
              </p>
            </div>

            <div className='flex flex-col gap-2 flex-1 justify-center'>
              {[...ratingDistribution].reverse().map(r => (
                <button
                  key={r.rating}
                  onClick={() => handleRatingFilter(r.rating as RatingFilter)}
                  className={cn(
                    'flex items-center gap-3 w-full rounded-lg px-2 py-1 transition-colors cursor-pointer group',
                    ratingFilter === r.rating
                      ? 'bg-brand-green/10 ring-1 ring-brand-green/30'
                      : 'hover:bg-muted/60'
                  )}
                >
                  <span
                    className={cn(
                      'text-sm font-semibold w-2 transition-colors',
                      ratingFilter === r.rating ? 'text-brand-green' : 'text-muted-foreground'
                    )}
                  >
                    {r.rating}
                  </span>
                  <Star
                    className={cn(
                      'w-3 h-3 shrink-0 transition-colors',
                      ratingFilter === r.rating
                        ? 'text-[#F59E0B] fill-[#F59E0B]'
                        : 'text-muted-foreground/50'
                    )}
                  />
                  <div className='flex-1 h-2 bg-muted rounded-full overflow-hidden'>
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        ratingFilter === r.rating ? 'bg-brand-green' : 'bg-brand-green/60'
                      )}
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                  <span className='text-sm text-muted-foreground w-8 text-right'>
                    {r.percentage.toFixed(0)}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            {myReview && (
              <div className='bg-brand-green/5 border border-brand-green/20 rounded-2xl p-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-sm shrink-0'>
                    {user ? getInitials(user.fullName) : '?'}
                  </div>

                  <div className='flex-1'>
                    <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                      <div>
                        <div className='flex items-center gap-2'>
                          <p className='font-bold text-sm'>{user?.fullName}</p>
                          <span className='text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-green text-white uppercase'>
                            {t(StringKey.YOU)}
                          </span>
                        </div>
                        <p className='text-xs text-muted-foreground uppercase tracking-wide mt-0.5'>
                          {formatDate(myReview.createdAt)}
                        </p>
                      </div>

                      <div className='self-end flex items-center gap-2 shrink-0'>
                        {renderRating(myReview.rating)}

                        {myReview.isEditable && (
                          <button
                            onClick={() => handleStartEditReview(myReview)}
                            className='p-1.5 rounded-lg hover:bg-brand-green/10 text-brand-green transition-colors cursor-pointer'
                            title={t(StringKey.EDIT)}
                          >
                            <Pencil className='w-4 h-4' />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            setSelectedReview({ id: myReview.id, comment: myReview.comment })
                          }
                          disabled={isDeleting}
                          className='p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50 cursor-pointer'
                          title={t(StringKey.DELETE)}
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </div>

                    <p className='text-sm text-foreground/80 mt-3 leading-relaxed'>
                      {myReview.comment}
                    </p>

                    {myReview.isEditable && (
                      <div className='flex items-center gap-1.5 mt-3 text-xs text-muted-foreground'>
                        <Clock className='w-3 h-3' />
                        <span>
                          {t(StringKey.CAN_EDIT_UNTIL, {
                            time: formatEditableUntil(myReview.editableUntil),
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isEstablishmentReviewsLoading ? (
              <div className='mt-6 flex justify-center'>
                <Loading size='lg' />
              </div>
            ) : reviews?.length === 0 && !myReview ? (
              <p className='text-center text-foreground/50 text-lg sm:text-2xl font-bold'>
                {t(StringKey.NO_REVIEWS_YET)}
              </p>
            ) : (
              reviews?.map(review => {
                const isUserReview = review.user.id === user?.id;

                return (
                  <div key={review.id} className='bg-muted/40 rounded-2xl p-6'>
                    <div className='flex items-start gap-4'>
                      <div className='w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-sm shrink-0'>
                        {getInitials(review.user.fullName)}
                      </div>

                      <div className='flex-1'>
                        <div className='flex items-start justify-between'>
                          <div>
                            <p className='font-bold text-sm'>{review.user.fullName}</p>
                            <p className='text-xs text-muted-foreground uppercase tracking-wide mt-0.5'>
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                          <div className='flex gap-2'>
                            {renderRating(review.rating)}

                            {isUserReview && (
                              <button
                                onClick={() =>
                                  setSelectedReview({
                                    id: review.id,
                                    comment: review.comment,
                                  })
                                }
                                disabled={isDeleting}
                                className='p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50 cursor-pointer'
                                title={t(StringKey.DELETE)}
                              >
                                <Trash2 className='w-4 h-4' />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className='text-sm text-foreground/80 mt-3 leading-relaxed'>
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className='flex justify-center gap-1.5 sm:gap-2 mt-6 flex-wrap'>
          <button
            onClick={() => setReviewPage(reviewPage - 1)}
            disabled={reviewPage === 1}
            className='w-8 h-8 rounded-full text-sm font-semibold text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer'
          >
            ‹
          </button>

          {getPaginationPages(reviewPage, totalPages).map((page, i) =>
            page === '...' ? (
              <span
                key={`ellipsis-${i}`}
                className='w-8 h-8 flex items-center justify-center text-muted-foreground text-sm'
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setReviewPage(page)}
                className={cn(
                  'w-8 h-8 rounded-full text-sm font-semibold transition-colors cursor-pointer',
                  reviewPage === page
                    ? 'bg-brand-green text-white'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => setReviewPage(reviewPage + 1)}
            disabled={reviewPage === totalPages}
            className='w-8 h-8 rounded-full text-sm font-semibold text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer'
          >
            ›
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className='bg-white rounded-2xl p-4 sm:p-8 shadow-sm'>
        <div className='flex items-center justify-between mb-6 gap-2'>
          <p className='font-bold text-brand-green font-playfair text-xl sm:text-2xl'>
            {t(StringKey.REVIEWS).slice(0, 1).toUpperCase() + t(StringKey.REVIEWS).slice(1)}
          </p>
          <div className='flex gap-3'>
            <Select
              defaultValue={sortOrder}
              onValueChange={value => handleSort(value as SortOrder)}
            >
              <SelectTrigger className='w-40'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SortOrder.DESC}>{t(StringKey.NEWEST_FIRST)}</SelectItem>
                <SelectItem value={SortOrder.ASC}>{t(StringKey.OLDEST_FIRST)}</SelectItem>
              </SelectContent>
            </Select>
            {!isFormMode && renderHeaderAction()}
          </div>
          {isFormMode && (
            <button
              className='font-bold text-brand-green cursor-pointer hover:underline text-sm'
              onClick={handleCancelReview}
            >
              {t(StringKey.BACK_TO_REVIEWS)}
            </button>
          )}
        </div>

        {isFormMode ? (
          <form onSubmit={e => void handleSubmit(handleFormSubmit)(e)}>
            {mode === ReviewMode.EDIT && (
              <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4'>
                {t(StringKey.EDITING_YOUR_REVIEW)}
              </p>
            )}

            <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6'>
              {Array.from({ length: 5 }, (_, i) => {
                const value = i + 1;
                const isActive = (hoveredRating ?? rating) >= value;

                return (
                  <Star
                    key={i}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(null)}
                    onClick={() => {
                      setValue('rating', +value);
                      trigger('rating');
                    }}
                    className={cn(
                      'w-9 h-9 sm:w-10 sm:h-10 cursor-pointer transition-colors',
                      isActive ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-muted-foreground'
                    )}
                  />
                );
              })}
              <p className='w-full text-center text-base text-muted-foreground mt-1 sm:mt-2'>
                {rating > 0 ? `${rating} / 5` : t(StringKey.SELECT_RATING)}
              </p>
            </div>

            {errors.rating && (
              <p className='text-destructive text-xs text-center mb-2'>{errors.rating.message}</p>
            )}

            <div className='flex flex-col gap-2'>
              <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
                {t(StringKey.COMMENT)}
              </label>
              <textarea
                rows={4}
                className={cn(formInputVariants({ variant: 'settings' }), 'resize-none')}
                {...register('comment')}
              />
              {errors.comment && (
                <p className='text-destructive text-xs'>{errors.comment.message}</p>
              )}
            </div>

            <div className='flex flex-col gap-2 sm:flex-row sm:justify-end mt-4'>
              <Button
                type='button'
                variant='outline'
                size='settings'
                onClick={handleCancelReview}
                className='w-full sm:w-auto shadow-none'
              >
                {t(StringKey.CANCEL)}
              </Button>
              <Button
                type='submit'
                variant='brand'
                size='settings'
                disabled={isPending}
                className='w-full sm:w-auto'
              >
                {isPending ? t(StringKey.SAVING) : t(StringKey.SUBMIT_REVIEW)}
              </Button>
            </div>
          </form>
        ) : (
          <>
            {user && (
              <div className='flex gap-1 mb-6 bg-muted/50 rounded-xl p-1'>
                <button
                  onClick={() => {
                    setActiveTab(ActiveTab.ALL);
                    setRatingFilter(null);
                  }}
                  className={cn(
                    'flex-1 text-sm font-semibold py-1.5 rounded-lg transition-all cursor-pointer',
                    activeTab === ActiveTab.ALL
                      ? 'bg-white text-brand-green shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t(StringKey.ALL_REVIEWS)}
                </button>
                <button
                  onClick={() => {
                    setActiveTab(ActiveTab.MY);
                    setRatingFilter(null);
                  }}
                  className={cn(
                    'flex-1 text-sm font-semibold py-1.5 rounded-lg transition-all cursor-pointer',
                    activeTab === ActiveTab.MY
                      ? 'bg-white text-brand-green shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t(StringKey.MY_REVIEWS)}
                </button>
              </div>
            )}

            {activeTab === ActiveTab.ALL ? renderAllReviewsTab() : renderMyReviewsTab()}
          </>
        )}
      </div>

      <Dialog
        open={!!selectedReview && mode !== ReviewMode.EDIT}
        onOpenChange={() => setSelectedReview(null)}
      >
        <DialogContent className='sm:max-w-[520px] bg-brand-cream mx-4 sm:mx-auto'>
          <DialogHeader>
            <DialogTitle>{t(StringKey.DELETE_YOUR_REVIEW)}</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <p className='mb-2'>{t(StringKey.SURE_YOU_WANT_TO_DELETE_REVIEW)}</p>
            {selectedReview?.comment && (
              <div className='border-l-2 border-muted-foreground/30 pl-3 py-1 bg-muted/40 rounded-r-lg'>
                <p className='text-sm text-muted-foreground italic line-clamp-3'>
                  "{selectedReview.comment}"
                </p>
              </div>
            )}
          </DialogDescription>

          <DialogFooter className='flex-col-reverse sm:flex-row gap-2'>
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
              onClick={handleDelete}
            >
              {isPending ? t(StringKey.DELETING) : t(StringKey.DELETE)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EstablishmentReviews;
