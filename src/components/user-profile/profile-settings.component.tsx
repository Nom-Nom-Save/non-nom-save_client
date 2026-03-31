import { StringKey } from '@/consts/string-key.consts';
import { useUserStore } from '@/store/user.store';
import {
  userProfileSchema,
  type UserProfileFormData,
} from '@/utils/validations-user/user-profile.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { inputClass } from '../settings/profile-form.component';
import { useUpdateUserProfileMutation } from '@/queries/user.queries';
import { toast } from 'sonner';
import { ApiError } from '@/api/client';
import Toggle from '../ui/toggle';
import { useEffect } from 'react';

const ProfileSettings = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { mutate: updateUserProfile, isPending } = useUpdateUserProfileMutation();

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      notifyNearby: user?.notifyNearby ?? false,
      notifyClosingSoon: user?.notifyClosingSoon ?? false,
      notifyNewItems: user?.notifyNewItems ?? false,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName ?? '',
        email: user.email ?? '',
        notifyNearby: user.notifyNearby ?? false,
        notifyClosingSoon: user.notifyClosingSoon ?? false,
        notifyNewItems: user.notifyNewItems ?? false,
      });
    }
  }, [user, reset]);

  const handleFormSubmit = (data: UserProfileFormData) => {
    if (!user) {
      return;
    }

    updateUserProfile(
      { userId: user.id, data },
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

  const handleCancel = () => {
    reset({
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
    });
  };

  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-brand-green font-bold font-playfair text-3xl mb-3'>
          {t(StringKey.PROFILE_SETTINGS)}
        </h2>
        <p className='text-[#4B5563] text-lg'>{t(StringKey.PROFILE_SETTINGS_DESCRIPTION)}</p>
      </div>
      <div>
        <h3
          className='relative text-brand-green font-bold font-playfair text-2xl pl-4 mb-6
          before:content-[""] before:absolute before:left-0 before:top-0 before:h-full 
          before:w-2 before:bg-brand-green before:rounded-full'
        >
          {t(StringKey.PERSONAL_DETAILS)}
        </h3>

        <form
          className='bg-white rounded-3xl border-[1.5px] border-border p-4 md:p-8 shadow-sm flex flex-col gap-6'
          onSubmit={e => void handleSubmit(handleFormSubmit)(e)}
        >
          <div className='flex flex-col gap-2'>
            <label
              htmlFor='fullName'
              className='text-xs font-bold text-foreground/50 uppercase tracking-wider'
            >
              {t(StringKey.FULL_NAME).toUpperCase()}
            </label>

            <input
              id='fullName'
              type='text'
              {...register('fullName')}
              className={inputClass(!!errors.fullName)}
              placeholder={t(StringKey.FULL_NAME_PLACEHOLDER)}
              disabled={isPending}
            />
            {errors.fullName && (
              <p className='text-destructive text-xs'>{errors.fullName.message}</p>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <label
              htmlFor='user-email'
              className='text-xs font-bold text-foreground/50 uppercase tracking-wider'
            >
              {t(StringKey.EMAIL_ADDRESS).toUpperCase()}
            </label>

            <div className='relative'>
              <input
                id='user-email'
                type='email'
                {...register('email')}
                className={inputClass(!!errors.email)}
                placeholder={t(StringKey.BUYER_EMAIL_PLACEHOLDER)}
                disabled={isPending}
              />
              {errors.email && (
                <AlertCircle
                  size={18}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-destructive'
                />
              )}
            </div>
            {errors.email && <p className='text-destructive text-xs'>{errors.email.message}</p>}
          </div>

          <div className='flex flex-col md:flex-row md:justify-between gap-4 md:gap-0'>
            <div className='flex flex-row justify-between items-center md:flex-col gap-4 md:gap-2 md:items-start'>
              <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
                {t(StringKey.NOTIFY_NEARBY)}
              </label>
              <Controller
                name='notifyNearby'
                control={control}
                render={({ field }) => (
                  <Toggle checked={field.value} onChange={field.onChange} disabled={isPending} />
                )}
              />
            </div>

            <div className='flex flex-row justify-between items-center md:flex-col gap-4 md:gap-2 md:items-start'>
              <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
                {t(StringKey.NOTIFY_CLOSING_SOON)}
              </label>
              <Controller
                name='notifyClosingSoon'
                control={control}
                render={({ field }) => (
                  <Toggle checked={field.value} onChange={field.onChange} disabled={isPending} />
                )}
              />
            </div>

            <div className='flex flex-row justify-between items-center md:flex-col gap-4 md:gap-2 md:items-start'>
              <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
                {t(StringKey.NOTIFY_NEW_ITEMS)}
              </label>
              <Controller
                name='notifyNewItems'
                control={control}
                render={({ field }) => (
                  <Toggle checked={field.value} onChange={field.onChange} disabled={isPending} />
                )}
              />
            </div>
          </div>

          <div className='flex gap-2 justify-end'>
            <button
              type='button'
              onClick={() => handleCancel()}
              className='w-full sm:w-auto self-start flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-bold bg-background border border-border text-foreground hover:bg-muted transition-colors cursor-pointer'
            >
              {t(StringKey.CANCEL)}
            </button>
            <button
              type='submit'
              disabled={isPending}
              className='w-full sm:w-auto self-start flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white bg-brand-green hover:bg-brand-green-hover transition-colors cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {isPending ? t(StringKey.SAVING) : t(StringKey.SAVE_CHANGES)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
