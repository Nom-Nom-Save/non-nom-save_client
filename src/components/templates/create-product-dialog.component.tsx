import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  productSchema,
  type ProductFormData,
} from '@/utils/validations-establishment/product.utils';
import { useCreateProductMutation, useUpdateProductMutation } from '@/queries/product.queries';
import { useProductTypesQuery, useAllergensQuery } from '@/queries/metadata.queries';
import { MultiSelectPills } from '@/components/templates/multi-select-pills.component';
import type { ProductResponse } from '@/types/product.types';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';
import { FormInput, formInputVariants } from '@/components/ui/form-input';

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct?: ProductResponse | null;
}

export const CreateProductDialog = ({
  open,
  onOpenChange,
  editingProduct,
}: CreateProductDialogProps) => {
  const { t } = useTranslation();
  const isEditing = !!editingProduct;
  const [isPublic, setIsPublic] = useState(false);
  const { mutate: createProduct, isPending: isCreating } = useCreateProductMutation();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProductMutation();
  const isPending = isCreating || isUpdating;

  const { data: rawTypes } = useProductTypesQuery();
  const { data: rawAllergens } = useAllergensQuery();

  const productTypes = useMemo(() => rawTypes ?? [], [rawTypes]);
  const allergens = useMemo(() => rawAllergens ?? [], [rawAllergens]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const pictureUrl = useWatch({ control, name: 'picture' });

  useEffect(() => {
    if (editingProduct) {
      const typeIds = editingProduct.types
        .map(name => productTypes.find(pt => pt.name === name)?.id)
        .filter((id): id is string => !!id);
      const allergenIds = editingProduct.allergens
        .map(name => allergens.find(a => a.name === name)?.id)
        .filter((id): id is string => !!id);

      reset({
        name: editingProduct.name,
        description: editingProduct.description,
        recommendedPrice: editingProduct.recommendedPrice,
        weight: editingProduct.weight,
        picture: editingProduct.picture ?? '',
        typeIds,
        allergenIds,
      });
    } else {
      reset({
        name: '',
        description: '',
        recommendedPrice: 0,
        weight: 0,
        picture: '',
        typeIds: [],
        allergenIds: [],
      });
    }
  }, [editingProduct, reset, productTypes, allergens]);

  const handleFormSubmit = (data: ProductFormData) => {
    if (isEditing && editingProduct) {
      updateProduct(
        { id: editingProduct.id, data },
        {
          onSuccess: () => {
            toast.success(t(StringKey.PRODUCT_UPDATED));
            reset();
            onOpenChange(false);
          },
          onError: (error: Error) => {
            if (error instanceof ApiError) {
              toast.error(t(StringKey.FAILED_TO_UPDATE_PRODUCT), { id: 'product-error' });
            }
          },
        }
      );
    } else {
      createProduct(
        { ...data, boundTo: isPublic ? '0' : undefined },
        {
          onSuccess: () => {
            toast.success(t(StringKey.PRODUCT_CREATED));
            reset();
            onOpenChange(false);
          },
          onError: (error: Error) => {
            if (error instanceof ApiError) {
              toast.error(t(StringKey.FAILED_TO_CREATE_PRODUCT), { id: 'product-error' });
            }
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[520px] max-h-[90vh] overflow-y-auto bg-brand-cream'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t(StringKey.EDIT_PRODUCT) : t(StringKey.CREATE_PRODUCT)}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={e => void handleSubmit(handleFormSubmit)(e)}
          className='flex flex-col gap-4 mt-2'
        >
          <div className='flex flex-col gap-1.5'>
            <label htmlFor='product-name' className='text-sm font-medium'>
              {t(StringKey.NAME)}
            </label>
            <div className='relative'>
              <FormInput id='product-name' {...register('name')} hasError={!!errors.name} />
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
            <label htmlFor='product-picture' className='text-sm font-medium'>
              {t(StringKey.PICTURE_URL)}
            </label>
            <div className='flex gap-3 items-start'>
              <FormInput
                id='product-picture'
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
            <label htmlFor='product-description' className='text-sm font-medium'>
              {t(StringKey.DESCRIPTION)}
            </label>
            <textarea
              id='product-description'
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
              <label htmlFor='product-price' className='text-sm font-medium'>
                {t(StringKey.ORIGINAL_PRICE)}
              </label>
              <FormInput
                id='product-price'
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
              <label htmlFor='product-weight' className='text-sm font-medium'>
                {t(StringKey.WEIGHT)}
              </label>
              <FormInput
                id='product-weight'
                type='number'
                step='0.01'
                {...register('weight', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium'>{t(StringKey.PRODUCT_TYPE)}</label>
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
            <label className='text-sm font-medium'>{t(StringKey.ALLERGENS)}</label>
            <Controller
              name='allergenIds'
              control={control}
              render={({ field }) => (
                <MultiSelectPills
                  options={allergens}
                  selected={field.value ?? []}
                  onChange={field.onChange}
                  placeholder={t(StringKey.SELECT_ALLERGENS)}
                  emptyMessage={t(StringKey.NO_ALLERGENS_AVAILABLE)}
                  variant='danger'
                />
              )}
            />
          </div>

          {isEditing ? (
            <div className='flex flex-col gap-1 px-3 py-2.5 rounded-xl bg-muted border border-border'>
              <span className='text-xs font-semibold text-foreground/50 uppercase tracking-wider'>
                {t(StringKey.ACCESS_KEY_LABEL)}
              </span>
              <span className='text-sm font-mono text-foreground break-all'>
                {editingProduct.boundTo ?? '—'}
              </span>
            </div>
          ) : (
            <label className='flex items-start gap-3 cursor-pointer select-none'>
              <input
                type='checkbox'
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
                className='mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-green'
              />
              <div>
                <p className='text-sm font-semibold text-foreground'>{t(StringKey.MAKE_PUBLIC)}</p>
                <p className='text-xs text-foreground/50'>{t(StringKey.MAKE_PUBLIC_DESCRIPTION)}</p>
              </div>
            </label>
          )}

          <Button type='submit' variant='brand' size='dialog' disabled={isPending} className='mt-2'>
            {isPending
              ? t(StringKey.SAVING)
              : isEditing
                ? t(StringKey.SAVE_CHANGES)
                : t(StringKey.CREATE_PRODUCT)}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
