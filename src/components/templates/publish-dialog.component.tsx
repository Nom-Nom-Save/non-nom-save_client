import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  publishMenuSchema,
  type PublishMenuFormData,
} from '@/utils/validations-establishment/publish-menu.utils';
import { useCreateMenuItemMutation } from '@/queries/menu.queries';
import { ItemType } from '@/types/menu.types';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemType: ItemType;
  originalPrice: number;
  itemName: string;
}

export const PublishDialog = ({
  open,
  onOpenChange,
  itemId,
  itemType,
  originalPrice,
  itemName,
}: PublishDialogProps) => {
  const { t } = useTranslation();
  const { mutate: createMenuItem, isPending } = useCreateMenuItemMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublishMenuFormData>({
    resolver: zodResolver(publishMenuSchema),
    defaultValues: {
      originalPrice,
      totalQuantity: 1,
    },
  });

  const handleFormSubmit = (data: PublishMenuFormData) => {
    createMenuItem(
      {
        itemId,
        itemType,
        totalQuantity: data.totalQuantity,
        originalPrice: data.originalPrice,
        discountPrice: data.discountPrice,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
      },
      {
        onSuccess: () => {
          toast.success(t(StringKey.PUBLISHED_TO_MENU));
          reset();
          onOpenChange(false);
        },
        onError: (error: Error) => {
          if (error instanceof ApiError) {
            toast.error(t(StringKey.FAILED_TO_PUBLISH), { id: 'publish-error' });
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[520px] bg-brand-cream'>
        <DialogHeader>
          <DialogTitle>{t(StringKey.PUBLISH_TO_MENU)}</DialogTitle>
        </DialogHeader>

        <p className='text-sm text-muted-foreground'>
          {t(StringKey.PUBLISHING_ITEM)}:{' '}
          <span className='font-medium text-foreground'>{itemName}</span>
        </p>

        <form
          onSubmit={e => void handleSubmit(handleFormSubmit)(e)}
          className='flex flex-col gap-4 mt-2'
        >
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='publish-original-price' className='text-sm font-medium'>
                {t(StringKey.ORIGINAL_PRICE)}
              </label>
              <input
                id='publish-original-price'
                type='number'
                step='0.01'
                {...register('originalPrice', { valueAsNumber: true })}
                className={cn(
                  'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors bg-white',
                  'focus:ring-2 focus:ring-brand-green/30',
                  errors.originalPrice ? 'border-destructive' : 'border-border'
                )}
              />
              {errors.originalPrice && (
                <p className='text-destructive text-xs'>{errors.originalPrice.message}</p>
              )}
            </div>

            <div className='flex flex-col gap-1.5'>
              <label htmlFor='publish-discount-price' className='text-sm font-medium'>
                {t(StringKey.DISCOUNT_PRICE)}
              </label>
              <input
                id='publish-discount-price'
                type='number'
                step='0.01'
                {...register('discountPrice', { valueAsNumber: true })}
                className={cn(
                  'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors bg-white',
                  'focus:ring-2 focus:ring-brand-green/30',
                  errors.discountPrice ? 'border-destructive' : 'border-border'
                )}
              />
              {errors.discountPrice && (
                <p className='text-destructive text-xs'>{errors.discountPrice.message}</p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label htmlFor='publish-quantity' className='text-sm font-medium'>
              {t(StringKey.QUANTITY)}
            </label>
            <input
              id='publish-quantity'
              type='number'
              {...register('totalQuantity', { valueAsNumber: true })}
              className={cn(
                'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors bg-white',
                'focus:ring-2 focus:ring-brand-green/30',
                errors.totalQuantity ? 'border-destructive' : 'border-border'
              )}
            />
            {errors.totalQuantity && (
              <p className='text-destructive text-xs'>{errors.totalQuantity.message}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='publish-start' className='text-sm font-medium'>
                {t(StringKey.START_TIME)}
              </label>
              <input
                id='publish-start'
                type='datetime-local'
                {...register('startTime')}
                className={cn(
                  'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors bg-white',
                  'focus:ring-2 focus:ring-brand-green/30',
                  errors.startTime ? 'border-destructive' : 'border-border'
                )}
              />
              {errors.startTime && (
                <p className='text-destructive text-xs'>{errors.startTime.message}</p>
              )}
            </div>

            <div className='flex flex-col gap-1.5'>
              <label htmlFor='publish-end' className='text-sm font-medium'>
                {t(StringKey.END_TIME)}
              </label>
              <input
                id='publish-end'
                type='datetime-local'
                {...register('endTime')}
                className={cn(
                  'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors bg-white',
                  'focus:ring-2 focus:ring-brand-green/30',
                  errors.endTime ? 'border-destructive' : 'border-border'
                )}
              />
              {errors.endTime && (
                <p className='text-destructive text-xs'>{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <button
            type='submit'
            disabled={isPending}
            className='w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors cursor-pointer mt-2 bg-brand-green hover:bg-brand-green-hover disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {isPending ? t(StringKey.PUBLISHING) : t(StringKey.PUBLISH_TO_MENU)}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
