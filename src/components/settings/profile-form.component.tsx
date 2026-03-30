import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  profileSchema,
  type ProfileFormData,
} from '@/utils/validations-establishment/profile.utils';
import { useUpdateEstablishmentProfileMutation } from '@/queries/establishment.queries';
import { useEstablishmentStore } from '@/store/establishment.store';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

export const inputClass = (hasError: boolean) =>
  cn(
    'w-full px-4 py-3 border-[1.5px] rounded-xl bg-brand-cream text-sm font-medium outline-none transition-colors',
    'focus:border-brand-green focus:bg-white',
    hasError ? 'border-destructive' : 'border-border',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand-cream'
  );

export const ProfileForm = () => {
  const { t } = useTranslation();
  const profile = useEstablishmentStore(s => s.profile);
  const { mutate: updateProfile, isPending } = useUpdateEstablishmentProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        description: profile.description ?? '',
        address: profile.address,
      });
    }
  }, [profile, reset]);

  const handleFormSubmit = (data: ProfileFormData) => {
    if (!profile) return;

    updateProfile(
      { establishmentId: profile.id, data },
      {
        onSuccess: () => toast.success(t(StringKey.PROFILE_UPDATED)),
        onError: (error: Error) => {
          if (error instanceof ApiError) {
            toast.error(t(StringKey.FAILED_TO_UPDATE_PROFILE), { id: 'profile-error' });
          }
        },
      }
    );
  };

  return (
    <form onSubmit={e => void handleSubmit(handleFormSubmit)(e)} className='flex flex-col gap-5'>
      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          {t(StringKey.ESTABLISHMENT_NAME)} *
        </label>
        <input {...register('name')} className={inputClass(!!errors.name)} />
        {errors.name && <p className='text-destructive text-xs'>{errors.name.message}</p>}
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          {t(StringKey.DESCRIPTION)}
        </label>
        <textarea
          rows={4}
          {...register('description')}
          className={cn(inputClass(!!errors.description), 'resize-none')}
        />
        {errors.description && (
          <p className='text-destructive text-xs'>{errors.description.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          {t(StringKey.STREET_ADDRESS)} *
        </label>
        <div className='relative'>
          <MapPin
            size={18}
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35'
          />
          <input {...register('address')} className={cn(inputClass(!!errors.address), 'pl-11')} />
        </div>
        {errors.address && <p className='text-destructive text-xs'>{errors.address.message}</p>}
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
