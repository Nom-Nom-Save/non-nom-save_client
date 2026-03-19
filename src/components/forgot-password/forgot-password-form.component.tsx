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

export const ForgotPasswordForm = () => {
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
            toast.error('Account not found.', {
              id: 'forgot-password-error',
              description: 'No account found for this email address.',
            });
          } else {
            toast.error('Failed to send reset code.', {
              id: 'forgot-password-error',
              description: 'Please check your email address and try again.',
            });
          }
        },
      }
    );
  };

  return (
    <form onSubmit={e => void handleSubmit(handleFormSubmit)(e)} className='flex flex-col gap-6'>
      {/* Email */}
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='forgot-email'
          className={cn(
            'text-base font-semibold',
            errors.email ? 'text-destructive' : 'text-foreground'
          )}
        >
          Email Address
        </label>
        <div className='relative'>
          <input
            id='forgot-email'
            type='email'
            placeholder='hello@nomnomsave.com'
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

      <button
        type='submit'
        disabled={isPending}
        className='w-full flex items-center justify-center gap-2 rounded-xl py-4.5 text-lg font-semibold text-white transition-colors cursor-pointer bg-(--brand-green) hover:bg-(--brand-green-hover) disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isPending ? (
          'Sending…'
        ) : (
          <>
            Send Reset Code
            <ArrowRight size={20} />
          </>
        )}
      </button>

      <Link
        to='/login'
        className='flex items-center justify-center gap-1.5 text-sm font-semibold text-foreground hover:text-(--brand-green) transition-colors'
      >
        ← Back to Login
      </Link>
    </form>
  );
};
