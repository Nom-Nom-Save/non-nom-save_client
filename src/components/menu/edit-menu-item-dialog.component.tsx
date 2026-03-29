import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  publishMenuSchema,
  type PublishMenuFormData,
} from '@/utils/validations-establishment/publish-menu.utils';
import { useUpdateMenuItemMutation } from '@/queries/menu.queries';
import { ItemType } from '@/types/menu.types';
import type { MenuItemResponse } from '@/types/menu.types';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

const toLocalDatetime = (iso: string) => {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

interface EditMenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: MenuItemResponse | null;
}

export const EditMenuItemDialog = ({ open, onOpenChange, menuItem }: EditMenuItemDialogProps) => {
  const { t } = useTranslation();
  const { mutate: updateMenuItem, isPending } = useUpdateMenuItemMutation();

  const isProduct = menuItem?.itemType === ItemType.PRODUCT;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublishMenuFormData>({
    resolver: zodResolver(publishMenuSchema),
  });

  useEffect(() => {
    if (!menuItem) return;
    reset({
      totalQuantity: menuItem.priceData.totalQuantity,
      originalPrice: menuItem.priceData.originalPrice,
      discountPrice: menuItem.priceData.discountPrice,
      startTime: toLocalDatetime(menuItem.priceData.startTime),
      endTime: toLocalDatetime(menuItem.priceData.endTime),
    });
  }, [menuItem, reset]);

  const handleFormSubmit = (data: PublishMenuFormData) => {
    if (!menuItem) return;
    updateMenuItem(
      {
        id: menuItem.id,
        data: {
          totalQuantity: data.totalQuantity,
          originalPrice: data.originalPrice,
          discountPrice: data.discountPrice,
          startTime: new Date(data.startTime).toISOString(),
          endTime: new Date(data.endTime).toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast.success(t(StringKey.MENU_ITEM_UPDATED));
          onOpenChange(false);
        },
        onError: (error: Error) => {
          if (error instanceof ApiError) {
            toast.error(t(StringKey.FAILED_TO_UPDATE_MENU_ITEM), { id: 'menu-edit-error' });
          }
        },
      }
    );
  };

  const fieldClass = (hasError: boolean) =>
    cn(
      'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors bg-white',
      'focus:ring-2 focus:ring-brand-green/30',
      hasError ? 'border-destructive' : 'border-border'
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[520px] max-h-[90vh] overflow-y-auto bg-brand-cream'>
        <DialogHeader>
          <DialogTitle>{t(StringKey.EDIT_MENU_ITEM)}</DialogTitle>
        </DialogHeader>

        {menuItem && (
          <p className='text-sm text-muted-foreground'>
            <span className='font-medium text-foreground'>{menuItem.itemDetails.name}</span>
          </p>
        )}

        <form
          onSubmit={e => void handleSubmit(handleFormSubmit)(e)}
          className='flex flex-col gap-4 mt-2'
        >
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='edit-original-price' className='text-sm font-medium'>
                {t(StringKey.ORIGINAL_PRICE)}
              </label>
              <input
                id='edit-original-price'
                type='number'
                step='0.01'
                {...register('originalPrice', { valueAsNumber: true })}
                className={fieldClass(!!errors.originalPrice)}
              />
              {errors.originalPrice && (
                <p className='text-destructive text-xs'>{errors.originalPrice.message}</p>
              )}
            </div>

            <div className='flex flex-col gap-1.5'>
              <label htmlFor='edit-discount-price' className='text-sm font-medium'>
                {t(StringKey.DISCOUNT_PRICE)}
              </label>
              <input
                id='edit-discount-price'
                type='number'
                step='0.01'
                {...register('discountPrice', { valueAsNumber: true })}
                className={fieldClass(!!errors.discountPrice)}
              />
              {errors.discountPrice && (
                <p className='text-destructive text-xs'>{errors.discountPrice.message}</p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label htmlFor='edit-quantity' className='text-sm font-medium'>
              {t(StringKey.QUANTITY)}
            </label>
            <input
              id='edit-quantity'
              type='number'
              {...register('totalQuantity', { valueAsNumber: true })}
              className={fieldClass(!!errors.totalQuantity)}
            />
            {errors.totalQuantity && (
              <p className='text-destructive text-xs'>{errors.totalQuantity.message}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='edit-start' className='text-sm font-medium'>
                {t(StringKey.START_TIME)}
              </label>
              <input
                id='edit-start'
                type='datetime-local'
                {...register('startTime')}
                className={fieldClass(!!errors.startTime)}
              />
              {errors.startTime && (
                <p className='text-destructive text-xs'>{errors.startTime.message}</p>
              )}
            </div>

            <div className='flex flex-col gap-1.5'>
              <label htmlFor='edit-end' className='text-sm font-medium'>
                {t(StringKey.END_TIME)}
              </label>
              <input
                id='edit-end'
                type='datetime-local'
                {...register('endTime')}
                className={fieldClass(!!errors.endTime)}
              />
              {errors.endTime && (
                <p className='text-destructive text-xs'>{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className='border-t border-border pt-4 flex flex-col gap-3'>
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground/50'>
                {isProduct ? t(StringKey.PRODUCT_TYPE) : t(StringKey.BOX_TYPE)}
              </label>
              <div className='flex flex-wrap gap-1.5'>
                {menuItem && menuItem.itemDetails.types.length > 0 ? (
                  menuItem.itemDetails.types.map(type => (
                    <span
                      key={type}
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full bg-brand-green-muted text-brand-green text-xs font-semibold'
                    >
                      {type}
                    </span>
                  ))
                ) : (
                  <span className='text-sm text-foreground/40'>—</span>
                )}
              </div>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground/50'>
                {t(StringKey.ALLERGENS)}
              </label>
              <div className='flex flex-wrap gap-1.5'>
                {menuItem && menuItem.itemDetails.allergens.length > 0 ? (
                  menuItem.itemDetails.allergens.map(allergen => (
                    <span
                      key={allergen}
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold'
                    >
                      {allergen}
                    </span>
                  ))
                ) : (
                  <span className='text-sm text-foreground/40'>—</span>
                )}
              </div>
            </div>
          </div>

          <button
            type='submit'
            disabled={isPending}
            className='w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors cursor-pointer mt-2 bg-brand-green hover:bg-brand-green-hover disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {isPending ? t(StringKey.UPDATING) : t(StringKey.SAVE_CHANGES)}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
