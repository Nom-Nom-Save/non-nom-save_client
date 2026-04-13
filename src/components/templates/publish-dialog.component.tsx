import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import {
  publishMenuSchema,
  type PublishMenuFormData,
} from '@/utils/validations-establishment/publish-menu.utils';
import { useCreateMenuItemMutation } from '@/queries/menu.queries';
import { ItemType } from '@/types/menu.types';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { DateTimePicker } from '@/components/date-time-picker.component';
import { useEstablishmentProfileQuery } from '@/queries/establishment.queries';
import type { WorkingHours } from '@/types/establishment.types';

const toDatetimeLocal = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

const getTodaySchedule = (wh: WorkingHours | null): { open: string; close: string } | null => {
  if (!wh) return null;
  const schedule = wh[DAY_NAMES[new Date().getDay()]];
  return schedule?.isOpen ? { open: schedule.open, close: schedule.close } : null;
};

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
  const { data: profile } = useEstablishmentProfileQuery();

  const todayDateStr = toDatetimeLocal(new Date()).split('T')[0];
  const schedule = getTodaySchedule(profile?.workingHours ?? null);
  const isTodayClosed = !!profile && !schedule;
  const minTime = schedule ? `${todayDateStr}T${schedule.open}` : `${todayDateStr}T00:00`;
  const maxTime = schedule ? `${todayDateStr}T${schedule.close}` : `${todayDateStr}T23:55`;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PublishMenuFormData>({
    resolver: zodResolver(publishMenuSchema),
    defaultValues: {
      originalPrice,
      totalQuantity: 1,
      startTime: minTime,
      endTime: maxTime,
    },
  });

  const startTime = useWatch({ control, name: 'startTime' });

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

        {isTodayClosed && (
          <div className='rounded-xl bg-destructive/8 border border-destructive/20 px-4 py-3 text-sm text-destructive'>
            {t(StringKey.PUBLISH_UNAVAILABLE_CLOSED_DAY)}
          </div>
        )}

        <form
          onSubmit={e => void handleSubmit(handleFormSubmit)(e)}
          className='flex flex-col gap-4 mt-2'
        >
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='publish-original-price' className='text-sm font-medium'>
                {t(StringKey.ORIGINAL_PRICE)}
              </label>
              <FormInput
                id='publish-original-price'
                type='number'
                step='0.01'
                {...register('originalPrice', { valueAsNumber: true })}
                hasError={!!errors.originalPrice}
              />
              {errors.originalPrice && (
                <p className='text-destructive text-xs'>{errors.originalPrice.message}</p>
              )}
            </div>

            <div className='flex flex-col gap-1.5'>
              <label htmlFor='publish-discount-price' className='text-sm font-medium'>
                {t(StringKey.DISCOUNT_PRICE)}
              </label>
              <FormInput
                id='publish-discount-price'
                type='number'
                step='0.01'
                {...register('discountPrice', { valueAsNumber: true })}
                hasError={!!errors.discountPrice}
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
            <FormInput
              id='publish-quantity'
              type='number'
              {...register('totalQuantity', { valueAsNumber: true })}
              hasError={!!errors.totalQuantity}
            />
            {errors.totalQuantity && (
              <p className='text-destructive text-xs'>{errors.totalQuantity.message}</p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>{t(StringKey.START_TIME)}</label>
            <Controller
              name='startTime'
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.startTime}
                  min={minTime}
                  max={maxTime}
                />
              )}
            />
            {errors.startTime && (
              <p className='text-destructive text-xs'>{errors.startTime.message}</p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>{t(StringKey.END_TIME)}</label>
            <Controller
              name='endTime'
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.endTime}
                  min={startTime}
                  max={maxTime}
                />
              )}
            />
            {errors.endTime && <p className='text-destructive text-xs'>{errors.endTime.message}</p>}
          </div>

          <Button
            type='submit'
            variant='brand'
            size='dialog'
            disabled={isPending || isTodayClosed}
            className='mt-2'
          >
            {isPending ? t(StringKey.PUBLISHING) : t(StringKey.PUBLISH_TO_MENU)}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
