import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/utils/validations-login/forgot-password.utils';
import { useForgotPasswordMutation } from '@/queries/auth.queries';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/api/client';
import { StringKey } from '@/consts/string-key.consts';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';

export const ForgotPasswordForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setPendingResetEmail = useAuthStore(s => s.setPendingResetEmail);
  const { mutate: sendResetLink, isPending } = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleFormSubmit = (data: ForgotPasswordFormData) => {
    sendResetLink(
      { email: data.email },
      {
        onSuccess: response => {
          setPendingResetEmail(response.email);
          void navigate({ to: '/reset-password' });
        },
        onError: error => {
          if (error instanceof ApiError && error.status === 404) {
            toast.error(t(StringKey.ACCOUNT_NOT_FOUND), {
              id: 'forgot-password-error',
              description: t(StringKey.ACCOUNT_NOT_FOUND_DESCRIPTION),
            });
          } else {
            toast.error(t(StringKey.FAILED_TO_SEND_RESET_CODE), {
              id: 'forgot-password-error',
              description: t(StringKey.FAILED_TO_SEND_RESET_CODE_DESCRIPTION),
            });
          }
        },
      }
    );
  };

  return (
    <form onSubmit={e => void handleSubmit(handleFormSubmit)(e)} className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='forgot-email'
          className={cn(
            'text-base font-semibold',
            errors.email ? 'text-destructive' : 'text-foreground'
          )}
        >
          {t(StringKey.EMAIL_ADDRESS)}
        </label>
        <div className='relative'>
          <FormInput
            id='forgot-email'
            type='email'
            variant='auth'
            placeholder={t(StringKey.EMAIL_PLACEHOLDER)}
            {...register('email')}
            hasError={!!errors.email}
            className={errors.email ? 'pr-11' : undefined}
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

      <Button type='submit' variant='brand' size='auth' disabled={isPending}>
        {isPending ? (
          t(StringKey.SENDING)
        ) : (
          <>
            {t(StringKey.SEND_RESET_CODE)}
            <ArrowRight size={20} />
          </>
        )}
      </Button>

      <Link
        to='/login'
        className='flex items-center justify-center gap-1.5 text-sm font-semibold text-foreground hover:text-brand-green transition-colors'
      >
        {t(StringKey.BACK_TO_LOGIN)}
      </Link>
    </form>
  );
};
