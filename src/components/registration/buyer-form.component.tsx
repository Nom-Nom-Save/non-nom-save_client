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
} from '@/utils/validations-registration/registration/buyer-registration.utils';
import { useRegisterUserMutation } from '@/queries/auth.queries';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/api/client';

export const BuyerForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
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
            toast.error('Email already in use.', {
              id: 'registration-conflict',
              description: 'An account with this email already exists.',
            });
          } else {
            toast.error('Registration failed.', {
              id: 'registration-error',
              description: 'Something went wrong. Please try again.',
            });
          }
        },
      }
    );
  };

  const handleInvalidSubmit = (fieldErrors: FieldErrors<BuyerRegistrationFormData>) => {
    if (fieldErrors.agreeToTerms) {
      toast.error('Agreement required.', {
        id: 'terms-error',
        description: 'You must agree to the Terms of Service and Privacy Policy to continue.',
      });
    }
    if (Object.keys(fieldErrors).some(key => key !== 'agreeToTerms')) {
      toast.error('Registration failed.', {
        id: 'registration-error',
        description: 'Please check the form fields.',
      });
    }
  };

  return (
    <form
      onSubmit={e => void handleSubmit(handleFormSubmit, handleInvalidSubmit)(e)}
      className='flex flex-col gap-6'
    >
      {/* Full Name */}
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='buyer-fullName'
          className={cn(
            'text-base font-semibold',
            errors.fullName ? 'text-destructive' : 'text-foreground'
          )}
        >
          Full Name
        </label>
        <input
          id='buyer-fullName'
          type='text'
          placeholder='Boss Molokosos'
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

      {/* Email Address */}
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='buyer-email'
          className={cn(
            'text-base font-semibold',
            errors.email ? 'text-destructive' : 'text-foreground'
          )}
        >
          Email Address
        </label>
        <div className='relative'>
          <input
            id='buyer-email'
            type='email'
            placeholder='john@example.com'
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

      {/* Password */}
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='buyer-password'
          className={cn(
            'text-base font-semibold',
            errors.password ? 'text-destructive' : 'text-foreground'
          )}
        >
          Password
        </label>
        <div className='relative'>
          <input
            id='buyer-password'
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••'
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
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        {errors.password && <p className='text-destructive text-xs'>{errors.password.message}</p>}
      </div>

      {/* Terms checkbox */}
      <div className='flex flex-col gap-1.5'>
        <div className='flex items-start gap-3'>
          <input
            id='buyer-agreeToTerms'
            type='checkbox'
            {...register('agreeToTerms')}
            className='mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-(--brand-green)'
          />
          <label
            htmlFor='buyer-agreeToTerms'
            className={cn(
              'text-sm leading-snug cursor-pointer',
              errors.agreeToTerms ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            By joining, you agree to our{' '}
            <a
              href='#'
              className='font-semibold text-(--brand-green) hover:text-(--brand-green-hover) transition-colors'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='#'
              className='font-semibold text-(--brand-green) hover:text-(--brand-green-hover) transition-colors'
            >
              Privacy Policy
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
        className='w-full rounded-xl py-4.5 text-lg font-semibold text-white transition-colors cursor-pointer mt-1 bg-(--brand-green) hover:bg-(--brand-green-hover) disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isPending ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
};
