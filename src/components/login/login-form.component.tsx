import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { loginSchema, type LoginFormData } from '@/utils/validations-login/login.utils';
import { useLoginMutation } from '@/queries/auth.queries';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/api/client';

const GoogleIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 18 18'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <path
      d='M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z'
      fill='#4285F4'
    />
    <path
      d='M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z'
      fill='#34A853'
    />
    <path
      d='M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z'
      fill='#FBBC05'
    />
    <path
      d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z'
      fill='#EA4335'
    />
  </svg>
);

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const { mutate: loginUser, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit = (data: LoginFormData) => {
    // Try "user" first; if 401 with establishment hint, retry as "establishment"
    loginUser(
      { email: data.email, password: data.password, loginType: 'user' },
      {
        onSuccess: response => {
          setAuth(response.accessToken, 'user');
          void navigate({ to: '/' });
        },
        onError: error => {
          if (error instanceof ApiError && error.status === 401) {
            // Retry as establishment
            loginUser(
              { email: data.email, password: data.password, loginType: 'establishment' },
              {
                onSuccess: response => {
                  setAuth(response.accessToken, 'establishment');
                  void navigate({ to: '/' });
                },
                onError: () => {
                  toast.error('Invalid credentials.', {
                    id: 'login-error',
                    description: 'Please check your email and password.',
                  });
                },
              }
            );
          } else if (error instanceof ApiError && error.status === 403) {
            toast.error('Email not verified.', {
              id: 'login-error',
              description: 'Please verify your email before signing in.',
            });
          } else {
            toast.error('Login failed.', {
              id: 'login-error',
              description: 'Something went wrong. Please try again.',
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
          htmlFor='login-email'
          className={cn(
            'text-base font-semibold',
            errors.email ? 'text-destructive' : 'text-foreground'
          )}
        >
          Email Address
        </label>
        <div className='relative'>
          <input
            id='login-email'
            type='email'
            placeholder='name@example.com'
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
        <div className='flex items-center justify-between'>
          <label
            htmlFor='login-password'
            className={cn(
              'text-base font-semibold',
              errors.password ? 'text-destructive' : 'text-foreground'
            )}
          >
            Password
          </label>
          <Link
            to='/forgot-password'
            className='text-sm font-semibold text-(--brand-green) hover:text-(--brand-green-hover) transition-colors'
          >
            Forgot Password?
          </Link>
        </div>
        <div className='relative'>
          <input
            id='login-password'
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

      <button
        type='submit'
        disabled={isPending}
        className='w-full rounded-xl py-4.5 text-lg font-semibold text-white transition-colors cursor-pointer mt-1 bg-(--brand-green) hover:bg-(--brand-green-hover) disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isPending ? 'Signing in…' : 'Login'}
      </button>

      {/* Divider */}
      <div className='flex items-center gap-4'>
        <div className='flex-1 h-px bg-border' />
        <span className='text-xs text-muted-foreground uppercase tracking-wide'>or</span>
        <div className='flex-1 h-px bg-border' />
      </div>

      {/* Google */}
      <button
        type='button'
        className='w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-white py-4.5 text-lg font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer'
      >
        <GoogleIcon />
        Continue with Google
      </button>
    </form>
  );
};
