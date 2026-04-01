import { useEffect, useMemo } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { boxSchema, type BoxFormData } from '@/utils/validations-establishment/box.utils';
import { useCreateBoxMutation, useUpdateBoxMutation } from '@/queries/box.queries';
import { useProductTypesQuery } from '@/queries/metadata.queries';
import { useProductsQuery } from '@/queries/product.queries';
import { MultiSelectPills } from '@/components/templates/multi-select-pills.component';
import type { BoxResponse } from '@/types/box.types';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';
import { FormInput, formInputVariants } from '@/components/ui/form-input';

interface CreateBoxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBox?: BoxResponse | null;
}

export const CreateBoxDialog = ({ open, onOpenChange, editingBox }: CreateBoxDialogProps) => {
  const { t } = useTranslation();
  const isEditing = !!editingBox;
  const { mutate: createBox, isPending: isCreating } = useCreateBoxMutation();
  const { mutate: updateBox, isPending: isUpdating } = useUpdateBoxMutation();
  const isPending = isCreating || isUpdating;

  const { data: rawTypes } = useProductTypesQuery();
  const { data: rawProducts } = useProductsQuery();

  const productTypes = useMemo(() => rawTypes ?? [], [rawTypes]);
  const products = useMemo(() => rawProducts ?? [], [rawProducts]);

  const productOptions = useMemo(() => products.map(p => ({ id: p.id, name: p.name })), [products]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BoxFormData>({
    resolver: zodResolver(boxSchema),
  });

  const pictureUrl = useWatch({ control, name: 'picture' });
  const selectedProductIds = useWatch({ control, name: 'productIds' }) ?? [];

  const derivedAllergens = (() => {
    const allergenSet = new Set<string>();
    for (const pid of selectedProductIds) {
      const product = products.find(p => p.id === pid);
      if (product) {
        for (const allergen of product.allergens) {
          allergenSet.add(allergen);
        }
      }
    }
    return Array.from(allergenSet);
  })();

  useEffect(() => {
    if (editingBox) {
      const typeIds = editingBox.types
        .map(name => productTypes.find(pt => pt.name === name)?.id)
        .filter((id): id is string => !!id);

      reset({
        name: editingBox.name,
        description: editingBox.description,
        recommendedPrice: editingBox.recommendedPrice,
        quantityOfItems: editingBox.quantityOfItems,
        picture: editingBox.picture ?? '',
        typeIds,
        productIds: editingBox.productIds,
      });
    } else {
      reset({
        name: '',
        description: '',
        recommendedPrice: 0,
        quantityOfItems: 1,
        picture: '',
        typeIds: [],
        productIds: [],
      });
    }
  }, [editingBox, reset, productTypes]);

  const handleFormSubmit = (data: BoxFormData) => {
    if (isEditing && editingBox) {
      updateBox(
        { id: editingBox.id, data },
        {
          onSuccess: () => {
            toast.success(t(StringKey.BOX_UPDATED));
            reset();
            onOpenChange(false);
          },
          onError: (error: Error) => {
            if (error instanceof ApiError) {
              toast.error(t(StringKey.FAILED_TO_UPDATE_BOX), { id: 'box-error' });
            }
          },
        }
      );
    } else {
      createBox(data, {
        onSuccess: () => {
          toast.success(t(StringKey.BOX_CREATED));
          reset();
          onOpenChange(false);
        },
        onError: (error: Error) => {
          if (error instanceof ApiError) {
            toast.error(t(StringKey.FAILED_TO_CREATE_BOX), { id: 'box-error' });
          }
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[520px] max-h-[90vh] overflow-y-auto bg-brand-cream'>
        <DialogHeader>
          <DialogTitle>{isEditing ? t(StringKey.EDIT_BOX) : t(StringKey.CREATE_BOX)}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={e => void handleSubmit(handleFormSubmit)(e)}
          className='flex flex-col gap-4 mt-2'
        >
          <div className='flex flex-col gap-1.5'>
            <label htmlFor='box-name' className='text-sm font-medium'>
              {t(StringKey.NAME)}
            </label>
            <div className='relative'>
              <FormInput id='box-name' {...register('name')} hasError={!!errors.name} />
              {errors.name && (
                <AlertCircle
                  size={16}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-destructive'
                />
              )}
            </div>
            {errors.name && <p className='text-destructive text-xs'>{errors.name.message}</p>}
          </div>

          <div className='flex flex-col gap-1.5'>
            <label htmlFor='box-picture' className='text-sm font-medium'>
              {t(StringKey.PICTURE_URL)}
            </label>
            <div className='flex gap-3 items-start'>
              <FormInput
                id='box-picture'
                type='url'
                {...register('picture')}
                className='flex-1'
                placeholder='https://'
              />
              {pictureUrl && (
                <div className='w-[52px] h-[52px] rounded-xl border border-border overflow-hidden shrink-0 bg-brand-green-muted'>
                  <img
                    src={pictureUrl}
                    alt=''
                    className='w-full h-full object-cover'
                    onError={e => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                  />
                </div>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label htmlFor='box-description' className='text-sm font-medium'>
              {t(StringKey.DESCRIPTION)}
            </label>
            <textarea
              id='box-description'
              rows={3}
              {...register('description')}
              className={cn(formInputVariants({ hasError: !!errors.description }), 'resize-none')}
            />
            {errors.description && (
              <p className='text-destructive text-xs'>{errors.description.message}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='box-price' className='text-sm font-medium'>
                {t(StringKey.ORIGINAL_PRICE)}
              </label>
              <FormInput
                id='box-price'
                type='number'
                step='0.01'
                {...register('recommendedPrice', { valueAsNumber: true })}
                hasError={!!errors.recommendedPrice}
              />
              {errors.recommendedPrice && (
                <p className='text-destructive text-xs'>{errors.recommendedPrice.message}</p>
              )}
            </div>

            <div className='flex flex-col gap-1.5'>
              <label htmlFor='box-quantity' className='text-sm font-medium'>
                {t(StringKey.QUANTITY_OF_ITEMS)}
              </label>
              <FormInput
                id='box-quantity'
                type='number'
                {...register('quantityOfItems', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>{t(StringKey.BOX_TYPE)}</label>
            <Controller
              name='typeIds'
              control={control}
              render={({ field }) => (
                <MultiSelectPills
                  options={productTypes}
                  selected={field.value ?? []}
                  onChange={field.onChange}
                  placeholder={t(StringKey.SELECT_TYPES)}
                  emptyMessage={t(StringKey.NO_TYPES_AVAILABLE)}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>{t(StringKey.PRODUCTS_IN_BOX)}</label>
            <Controller
              name='productIds'
              control={control}
              render={({ field }) => (
                <MultiSelectPills
                  options={productOptions}
                  selected={field.value ?? []}
                  onChange={field.onChange}
                  placeholder={t(StringKey.SELECT_PRODUCTS)}
                  emptyMessage={t(StringKey.NO_PRODUCTS_AVAILABLE)}
                />
              )}
            />
          </div>

          {derivedAllergens.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground/60'>
                {t(StringKey.DERIVED_ALLERGENS)}
              </label>
              <div className='flex flex-wrap gap-1.5'>
                {derivedAllergens.map(allergen => (
                  <span
                    key={allergen}
                    className='inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold'
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button type='submit' variant='brand' size='dialog' disabled={isPending} className='mt-2'>
            {isPending
              ? t(StringKey.SAVING)
              : isEditing
                ? t(StringKey.SAVE_CHANGES)
                : t(StringKey.CREATE_BOX)}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
