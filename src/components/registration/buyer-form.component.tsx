import { useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import {
  buyerRegistrationSchema,
  type BuyerRegistrationFormData,
} from '@/utils/validations-registration/buyer-registration.utils';
import { useRegisterUserMutation } from '@/queries/auth.queries';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

export const BuyerForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const setPendingVerificationEmail = useAuthStore(s => s.setPendingVerificationEmail);
  const { mutate: registerUser, isPending } = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuyerRegistrationFormData>({
    resolver: zodResolver(buyerRegistrationSchema),
    defaultValues: { agreeToTerms: false },
  });

  const handleFormSubmit = (data: BuyerRegistrationFormData) => {
    registerUser(
      {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: response => {
          setPendingVerificationEmail(response.email);
          void navigate({ to: '/verify-email' });
        },
        onError: error => {
          if (error instanceof ApiError && error.status === 409) {
            toast.error(t(StringKey.EMAIL_ALREADY_IN_USE), {
              id: 'registration-conflict',
              description: t(StringKey.EMAIL_ALREADY_IN_USE_DESCRIPTION),
            });
          } else {
            toast.error(t(StringKey.REGISTRATION_FAILED), {
              id: 'registration-error',
              description: t(StringKey.REGISTRATION_FAILED_DESCRIPTION),
            });
          }
        },
      }
    );
  };

  const handleInvalidSubmit = (fieldErrors: FieldErrors<BuyerRegistrationFormData>) => {
    if (fieldErrors.agreeToTerms) {
      toast.error(t(StringKey.AGREEMENT_REQUIRED), {
        id: 'terms-error',
        description: t(StringKey.AGREEMENT_REQUIRED_DESCRIPTION),
      });
    }
    if (Object.keys(fieldErrors).some(key => key !== 'agreeToTerms')) {
      toast.error(t(StringKey.REGISTRATION_FAILED), {
        id: 'registration-error',
        description: t(StringKey.REGISTRATION_FIELDS_ERROR),
      });
    }
  };

  return (
    <form
      onSubmit={e => void handleSubmit(handleFormSubmit, handleInvalidSubmit)(e)}
      className='flex flex-col gap-6'
    >
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='buyer-fullName'
          className={cn(
            'text-base font-semibold',
            errors.fullName ? 'text-destructive' : 'text-foreground'
          )}
        >
          {t(StringKey.FULL_NAME)}
        </label>
        <input
          id='buyer-fullName'
          type='text'
          placeholder={t(StringKey.FULL_NAME_PLACEHOLDER)}
          {...register('fullName')}
          className={cn(
            'w-full rounded-xl border px-4 py-4 text-base outline-none transition-colors placeholder:text-muted-foreground',
            'bg-white focus:ring-2 focus:ring-(--brand-green)/30',
            errors.fullName
              ? 'border-destructive bg-destructive/5 focus:ring-destructive/20'
              : 'border-border'
          )}
        />
        {errors.fullName && <p className='text-destructive text-xs'>{errors.fullName.message}</p>}
      </div>

      <div className='flex flex-col gap-2'>
        <label
          htmlFor='buyer-email'
          className={cn(
            'text-base font-semibold',
            errors.email ? 'text-destructive' : 'text-foreground'
          )}
        >
          {t(StringKey.EMAIL_ADDRESS)}
        </label>
        <div className='relative'>
          <input
            id='buyer-email'
            type='email'
            placeholder={t(StringKey.BUYER_EMAIL_PLACEHOLDER)}
            {...register('email')}
            className={cn(
              'w-full rounded-xl border px-4 py-4 text-base outline-none transition-colors placeholder:text-muted-foreground',
              'bg-white focus:ring-2 focus:ring-(--brand-green)/30',
              errors.email
                ? 'border-destructive bg-destructive/5 pr-11 focus:ring-destructive/20'
                : 'border-border'
            )}
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

      <div className='flex flex-col gap-2'>
        <label
          htmlFor='buyer-password'
          className={cn(
            'text-base font-semibold',
            errors.password ? 'text-destructive' : 'text-foreground'
          )}
        >
          {t(StringKey.PASSWORD)}
        </label>
        <div className='relative'>
          <input
            id='buyer-password'
            type={showPassword ? 'text' : 'password'}
            placeholder={t(StringKey.PASSWORD_PLACEHOLDER)}
            {...register('password')}
            className={cn(
              'w-full rounded-xl border px-4 py-4 pr-11 text-base outline-none transition-colors placeholder:text-muted-foreground',
              'bg-white focus:ring-2 focus:ring-(--brand-green)/30',
              errors.password
                ? 'border-destructive bg-destructive/5 focus:ring-destructive/20'
                : 'border-border'
            )}
          />
          <button
            type='button'
            onClick={() => setShowPassword(prev => !prev)}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
            aria-label={showPassword ? t(StringKey.HIDE_PASSWORD) : t(StringKey.SHOW_PASSWORD)}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        {errors.password && <p className='text-destructive text-xs'>{errors.password.message}</p>}
      </div>

      <div className='flex flex-col gap-1.5'>
        <div className='flex items-start gap-3'>
          <input
            id='buyer-agreeToTerms'
            type='checkbox'
            {...register('agreeToTerms')}
            className='mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-green'
          />
          <label
            htmlFor='buyer-agreeToTerms'
            className={cn(
              'text-sm leading-snug cursor-pointer',
              errors.agreeToTerms ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {t(StringKey.BY_JOINING_AGREE)}{' '}
            <a
              href='#'
              className='font-semibold text-brand-green hover:text-brand-green-hover transition-colors'
            >
              {t(StringKey.TERMS_OF_SERVICE)}
            </a>{' '}
            {t(StringKey.AND)}{' '}
            <a
              href='#'
              className='font-semibold text-brand-green hover:text-brand-green-hover transition-colors'
            >
              {t(StringKey.PRIVACY_POLICY)}
            </a>
            .
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className='text-destructive text-xs pl-7'>{errors.agreeToTerms.message}</p>
        )}
      </div>

      <button
        type='submit'
        disabled={isPending}
        className='w-full rounded-xl py-4.5 text-lg font-semibold text-white transition-colors cursor-pointer mt-1 bg-brand-green hover:bg-brand-green-hover disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isPending ? t(StringKey.CREATING_ACCOUNT) : t(StringKey.CREATE_ACCOUNT)}
      </button>
    </form>
  );
};
