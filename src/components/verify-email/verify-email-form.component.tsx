import { useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useVerifyEmailMutation } from '@/queries/auth.queries';
import { ApiError } from '@/api/client';

interface VerifyEmailFormProps {
  email: string;
}

export const VerifyEmailForm = ({ email }: VerifyEmailFormProps) => {
  const navigate = useNavigate();
  const clearEmail = useAuthStore(s => s.clearPendingVerificationEmail);
  const { mutate: verifyEmail, isPending } = useVerifyEmailMutation();

  const [digits, setDigits] = useState(['', '', '', '']);
  const [hasError, setHasError] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setHasError(false);
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
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
    setHasError(false);
    const focusIndex = Math.min(pasted.length, 3);
    inputRefs[focusIndex].current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 4) {
      setHasError(true);
      toast.error('Invalid code.', {
        id: 'verify-error',
        description: 'Please enter the full 4-digit code.',
      });
      return;
    }

    verifyEmail(
      { email, code },
      {
        onSuccess: () => {
          clearEmail();
          toast.success('Email verified!', {
            description: 'Your account is ready. Please sign in.',
          });
          void navigate({ to: '/' });
        },
        onError: error => {
          setHasError(true);
          setDigits(['', '', '', '']);
          inputRefs[0].current?.focus();
          if (error instanceof ApiError && error.status === 400) {
            toast.error('Invalid or expired code.', {
              id: 'verify-error',
              description: 'Please check the code and try again.',
            });
          } else {
            toast.error('Verification failed.', {
              id: 'verify-error',
              description: 'Something went wrong. Please try again.',
            });
          }
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
      {/* OTP inputs */}
      <div className='flex flex-col gap-3'>
        <label
          className={cn(
            'text-base font-semibold',
            hasError ? 'text-destructive' : 'text-foreground'
          )}
        >
          Verification Code
        </label>
        <div className='flex gap-4' onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={e => handleDigitChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className={cn(
                'w-full aspect-square text-center text-2xl font-bold rounded-xl border outline-none transition-colors bg-white',
                'focus:ring-2',
                hasError
                  ? 'border-destructive bg-destructive/5 focus:ring-destructive/20 text-destructive'
                  : 'border-border focus:ring-(--brand-green)/30'
              )}
            />
          ))}
        </div>
        {hasError && (
          <p className='text-destructive text-xs'>
            Please enter the correct 4-digit code from your email.
          </p>
        )}
      </div>

      <button
        type='submit'
        disabled={isPending}
        className='w-full rounded-xl py-4.5 text-lg font-semibold text-white transition-colors cursor-pointer bg-(--brand-green) hover:bg-(--brand-green-hover) disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isPending ? 'Verifying…' : 'Verify Email'}
      </button>
    </form>
  );
};
