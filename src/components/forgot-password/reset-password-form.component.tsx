import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/utils/validations-login/reset-password.utils';
import { useVerifyCodeMutation, useResetPasswordMutation } from '@/queries/auth.queries';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/api/client';

type Step = 'code' | 'password';

interface ResetPasswordFormProps {
  email: string;
  onStepChange: (step: Step) => void;
}

export const ResetPasswordForm = ({ email, onStepChange }: ResetPasswordFormProps) => {
  const navigate = useNavigate();
  const clearPendingResetEmail = useAuthStore(s => s.clearPendingResetEmail);
  const { mutate: verifyCode, isPending: isVerifying } = useVerifyCodeMutation();
  const { mutate: resetPassword, isPending: isResetting } = useResetPasswordMutation();

  const [step, setStep] = useState<Step>('code');
  const [digits, setDigits] = useState(['', '', '', '']);
  const [codeError, setCodeError] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const changeStep = (newStep: Step) => {
    setStep(newStep);
    onStepChange(newStep);
  };

  // --- OTP handlers ---

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setCodeError(false);
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;
    const newDigits = ['', '', '', ''];
    pasted.split('').forEach((char, i) => {
      newDigits[i] = char;
    });
    setDigits(newDigits);
    setCodeError(false);
    inputRefs.current[Math.min(pasted.length, 3)]?.focus();
  };

  // --- Step 1: Verify code ---

  const handleVerifyCode = () => {
    const code = digits.join('');
    if (code.length < 4) {
      setCodeError(true);
      toast.error('Invalid code.', {
        id: 'verify-code-error',
        description: 'Please enter the full 4-digit code from your email.',
      });
      return;
    }

    verifyCode(
      { email, code },
      {
        onSuccess: () => {
          changeStep('password');
        },
        onError: error => {
          setCodeError(true);
          setDigits(['', '', '', '']);
          inputRefs.current[0]?.focus();
          if (error instanceof ApiError && error.status === 400) {
            toast.error('Invalid or expired code.', {
              id: 'verify-code-error',
              description: 'Please check the code and try again.',
            });
          } else if (error instanceof ApiError && error.status === 404) {
            toast.error('Account not found.', {
              id: 'verify-code-error',
              description: 'No account found for this email address.',
            });
          } else {
            toast.error('Verification failed.', {
              id: 'verify-code-error',
              description: 'Something went wrong. Please try again.',
            });
          }
        },
      }
    );
  };

  // --- Step 2: Reset password ---

  const handleResetPassword = (data: ResetPasswordFormData) => {
    resetPassword(
      { email, newPassword: data.newPassword },
      {
        onSuccess: () => {
          clearPendingResetEmail();
          toast.success('Password reset!', {
            description: 'Your password has been changed. Please sign in.',
          });
          void navigate({ to: '/login' });
        },
        onError: error => {
          if (error instanceof ApiError && error.status === 404) {
            toast.error('Account not found.', {
              id: 'reset-error',
              description: 'No account found for this email address.',
            });
          } else {
            toast.error('Reset failed.', {
              id: 'reset-error',
              description: 'Something went wrong. Please try again.',
            });
          }
        },
      }
    );
  };

  // --- Step 1: Code verification UI ---
  if (step === 'code') {
    return (
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-3'>
          <label
            className={cn(
              'text-base font-semibold',
              codeError ? 'text-destructive' : 'text-foreground'
            )}
          >
            Reset Code
          </label>
          <div className='flex gap-4' onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={el => {
                  inputRefs.current[index] = el;
                }}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={e => handleDigitChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className={cn(
                  'w-full aspect-square text-center text-2xl font-bold rounded-xl border outline-none transition-colors bg-white focus:ring-2',
                  codeError
                    ? 'border-destructive bg-destructive/5 focus:ring-destructive/20 text-destructive'
                    : 'border-border focus:ring-(--brand-green)/30'
                )}
              />
            ))}
          </div>
          {codeError && (
            <p className='text-destructive text-xs'>
              Please enter the correct 4-digit code from your email.
            </p>
          )}
        </div>

        <button
          type='button'
          onClick={handleVerifyCode}
          disabled={isVerifying}
          className='w-full rounded-xl py-4.5 text-lg font-semibold text-white transition-colors cursor-pointer mt-1 bg-(--brand-green) hover:bg-(--brand-green-hover) disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {isVerifying ? 'Verifying…' : 'Verify Code'}
        </button>

        <Link
          to='/login'
          className='flex items-center justify-center gap-1.5 text-sm font-semibold text-foreground hover:text-(--brand-green) transition-colors'
        >
          ← Back to Login
        </Link>
      </div>
    );
  }

  // --- Step 2: New password UI ---
  return (
    <form onSubmit={e => void handleSubmit(handleResetPassword)(e)} className='flex flex-col gap-6'>
      {/* New password */}
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='reset-newPassword'
          className={cn(
            'text-base font-semibold',
            errors.newPassword ? 'text-destructive' : 'text-foreground'
          )}
        >
          New Password
        </label>
        <div className='relative'>
          <input
            id='reset-newPassword'
            type={showNewPassword ? 'text' : 'password'}
            placeholder='••••••••'
            {...register('newPassword')}
            className={cn(
              'w-full rounded-xl border px-4 py-4 pr-11 text-base outline-none transition-colors placeholder:text-muted-foreground',
              'bg-white focus:ring-2 focus:ring-(--brand-green)/30',
              errors.newPassword
                ? 'border-destructive bg-destructive/5 focus:ring-destructive/20'
                : 'border-border'
            )}
          />
          <button
            type='button'
            onClick={() => setShowNewPassword(p => !p)}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
          >
            {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        {errors.newPassword && (
          <p className='text-destructive text-xs'>{errors.newPassword.message}</p>
        )}
      </div>

      {/* Confirm password */}
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='reset-confirmPassword'
          className={cn(
            'text-base font-semibold',
            errors.confirmPassword ? 'text-destructive' : 'text-foreground'
          )}
        >
          Confirm Password
        </label>
        <div className='relative'>
          <input
            id='reset-confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='••••••••'
            {...register('confirmPassword')}
            className={cn(
              'w-full rounded-xl border px-4 py-4 pr-11 text-base outline-none transition-colors placeholder:text-muted-foreground',
              'bg-white focus:ring-2 focus:ring-(--brand-green)/30',
              errors.confirmPassword
                ? 'border-destructive bg-destructive/5 focus:ring-destructive/20'
                : 'border-border'
            )}
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(p => !p)}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className='text-destructive text-xs'>{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type='submit'
        disabled={isResetting}
        className='w-full rounded-xl py-4.5 text-lg font-semibold text-white transition-colors cursor-pointer mt-1 bg-(--brand-green) hover:bg-(--brand-green-hover) disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isResetting ? 'Resetting…' : 'Reset Password'}
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
