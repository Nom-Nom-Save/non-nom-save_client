import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  brandImagesSchema,
  type BrandImagesFormData,
} from '@/utils/validations-establishment/brand-images.utils';
import { useUpdateEstablishmentProfileMutation } from '@/queries/establishment.queries';
import { useEstablishmentStore } from '@/store/establishment.store';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

const inputClass = (hasError: boolean) =>
  cn(
    'w-full px-4 py-3 border-[1.5px] rounded-xl bg-brand-cream text-sm font-medium outline-none transition-colors',
    'focus:border-brand-green focus:bg-white',
    hasError ? 'border-destructive' : 'border-border'
  );

export const BrandImagesForm = () => {
  const { t } = useTranslation();
  const profile = useEstablishmentStore(s => s.profile);
  const { mutate: updateProfile, isPending } = useUpdateEstablishmentProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BrandImagesFormData>({
    resolver: zodResolver(brandImagesSchema),
  });

  const logoUrl = useWatch({ control, name: 'logo' });
  const bannerUrl = useWatch({ control, name: 'banner' });

  useEffect(() => {
    if (profile) {
      reset({
        logo: profile.logo ?? '',
        banner: profile.banner ?? '',
      });
    }
  }, [profile, reset]);

  const handleFormSubmit = (data: BrandImagesFormData) => {
    if (!profile) return;

    updateProfile(
      {
        establishmentId: profile.id,
        data: {
          logo: data.logo || undefined,
          banner: data.banner || undefined,
        },
      },
      {
        onSuccess: () => toast.success(t(StringKey.PROFILE_UPDATED)),
        onError: (error: Error) => {
          if (error instanceof ApiError) {
            toast.error(t(StringKey.FAILED_TO_UPDATE_PROFILE), { id: 'brand-images-error' });
          }
        },
      }
    );
  };

  return (
    <form onSubmit={e => void handleSubmit(handleFormSubmit)(e)} className='flex flex-col gap-5'>
      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          {t(StringKey.LOGO_URL)}
        </label>
        <div className='flex gap-3 items-center'>
          <input
            {...register('logo')}
            type='url'
            placeholder='https://'
            className={cn(inputClass(!!errors.logo), 'flex-1')}
          />
          {logoUrl && (
            <div className='w-12 h-12 rounded-xl border-[1.5px] border-border overflow-hidden shrink-0 bg-brand-cream'>
              <img
                src={logoUrl}
                alt=''
                className='w-full h-full object-cover'
                onError={e => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
              />
            </div>
          )}
        </div>
        {errors.logo && <p className='text-destructive text-xs'>{errors.logo.message}</p>}
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          {t(StringKey.BANNER_URL)}
        </label>
        <input
          {...register('banner')}
          type='url'
          placeholder='https://'
          className={inputClass(!!errors.banner)}
        />
        {errors.banner && <p className='text-destructive text-xs'>{errors.banner.message}</p>}
        {bannerUrl && (
          <div className='w-full h-24 rounded-xl border-[1.5px] border-border overflow-hidden bg-brand-cream'>
            <img
              src={bannerUrl}
              alt=''
              className='w-full h-full object-cover'
              onError={e => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
            />
          </div>
        )}
      </div>

      <button
        type='submit'
        disabled={isPending}
        className='w-full sm:w-auto self-start flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white bg-brand-green hover:bg-brand-green-hover transition-colors cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isPending ? t(StringKey.SAVING) : t(StringKey.SAVE_CHANGES)}
      </button>
    </form>
  );
};
