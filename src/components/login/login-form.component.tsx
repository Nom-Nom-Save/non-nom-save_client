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
import googleIcon from '@/assets/google-icon.svg';
import { StringKey } from '@/consts/string-key.consts';
import { useTranslation } from 'react-i18next';

export const LoginForm = () => {
  const { t } = useTranslation();
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
    loginUser(
      { email: data.email, password: data.password, loginType: 'user' },
      {
        onSuccess: response => {
          setAuth(response.accessToken, 'user');
          void navigate({ to: '/' });
        },
        onError: error => {
          if (error instanceof ApiError && error.status === 401) {
            loginUser(
              { email: data.email, password: data.password, loginType: 'establishment' },
              {
                onSuccess: response => {
                  setAuth(response.accessToken, 'establishment');
                  void navigate({ to: '/' });
                },
                onError: () => {
                  toast.error(t(StringKey.INVALID_CREDENTIALS), {
                    id: 'login-error',
                    description: t(StringKey.INVALID_CREDENTIALS_DESCRIPTION),
                  });
                },
              }
            );
          } else if (error instanceof ApiError && error.status === 403) {
            toast.error(t(StringKey.EMAIL_NOT_VERIFIED), {
              id: 'login-error',
              description: t(StringKey.EMAIL_NOT_VERIFIED_DESCRIPTION),
            });
          } else {
            toast.error(t(StringKey.LOGIN_FAILED), {
              id: 'login-error',
              description: t(StringKey.LOGIN_FAILED_DESCRIPTION),
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
          htmlFor='login-email'
          className={cn(
            'text-base font-semibold',
            errors.email ? 'text-destructive' : 'text-foreground'
          )}
        >
          {t(StringKey.EMAIL_ADDRESS)}
        </label>
        <div className='relative'>
          <input
            id='login-email'
            type='email'
            placeholder={t(StringKey.LOGIN_EMAIL_PLACEHOLDER)}
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
        <div className='flex items-center justify-between'>
          <label
            htmlFor='login-password'
            className={cn(
              'text-base font-semibold',
              errors.password ? 'text-destructive' : 'text-foreground'
            )}
          >
            {t(StringKey.PASSWORD)}
          </label>
          <Link
            to='/forgot-password'
            className='text-sm font-semibold text-brand-green hover:text-brand-green-hover transition-colors'
          >
            {t(StringKey.FORGOT_PASSWORD_LINK)}
          </Link>
        </div>
        <div className='relative'>
          <input
            id='login-password'
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

      <button
        type='submit'
        disabled={isPending}
        className='w-full rounded-xl py-4.5 text-lg font-semibold text-white transition-colors cursor-pointer mt-1 bg-brand-green hover:bg-brand-green-hover disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isPending ? t(StringKey.SIGNING_IN) : t(StringKey.LOGIN)}
      </button>

      <div className='flex items-center gap-4'>
        <div className='flex-1 h-px bg-border' />
        <span className='text-xs text-muted-foreground uppercase tracking-wide'>
          {t(StringKey.OR)}
        </span>
        <div className='flex-1 h-px bg-border' />
      </div>

      <button
        type='button'
        className='w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-white py-4.5 text-lg font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer'
      >
        <img src={googleIcon} alt='Google' />
        {t(StringKey.CONTINUE_WITH_GOOGLE)}
      </button>
    </form>
  );
};
