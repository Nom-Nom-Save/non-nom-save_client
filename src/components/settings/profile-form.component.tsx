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
import {
  useEstablishmentProfileQuery,
  useUpdateEstablishmentProfileMutation,
} from '@/queries/establishment.queries';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';
import { FormInput, formInputVariants } from '@/components/ui/form-input';

export const ProfileForm = () => {
  const { t } = useTranslation();
  const { data: profile } = useEstablishmentProfileQuery();
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
        <FormInput variant='settings' {...register('name')} hasError={!!errors.name} />
        {errors.name && <p className='text-destructive text-xs'>{errors.name.message}</p>}
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          {t(StringKey.DESCRIPTION)}
        </label>
        <textarea
          rows={4}
          {...register('description')}
          className={cn(
            formInputVariants({ variant: 'settings', hasError: !!errors.description }),
            'resize-none'
          )}
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
          <FormInput
            variant='settings'
            {...register('address')}
            hasError={!!errors.address}
            className='pl-11'
          />
        </div>
        {errors.address && <p className='text-destructive text-xs'>{errors.address.message}</p>}
      </div>

      <Button
        type='submit'
        variant='brand'
        size='settings'
        disabled={isPending}
        className='w-full sm:w-auto'
      >
        {isPending ? t(StringKey.SAVING) : t(StringKey.SAVE_CHANGES)}
      </Button>
    </form>
  );
};
