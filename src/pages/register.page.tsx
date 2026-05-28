import { useState, useRef } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Store, User } from 'lucide-react';
import { RegistrationLeftPanel } from '@/components/registration/registration-left-panel.component';
import { BuyerForm } from '@/components/registration/buyer-form.component';
import { BusinessForm } from '@/components/registration/business-form.component';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleAuthMutation } from '@/queries/auth.queries';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';
import googleIcon from '@/assets/google-icon.svg';

enum AccountType {
  BUYER = 'buyer',
  BUSINESS = 'business',
}

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const { mutate: googleLogin } = useGoogleAuthMutation();
  const [accountType, setAccountType] = useState<AccountType>(AccountType.BUYER);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleGoogleClick = () => {
    googleButtonRef.current?.querySelector('div[role="button"]')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
  };

  return (
    <div className='flex min-h-screen bg-brand-cream'>
      <RegistrationLeftPanel accountType={accountType} />

      <div className='flex-1 overflow-y-auto'>
        <div className='min-h-full flex flex-col justify-center py-12 px-10'>
          <div className='max-w-[640px] mx-auto w-full'>
            <button
              onClick={() => window.history.back()}
              className='inline-flex items-center gap-2 ...'
            >
              <ArrowLeft size={16} />
              {t(StringKey.BACK)}
            </button>

            <h1 className='text-[2.5rem] font-bold text-foreground mb-8'>
              {t(StringKey.CREATE_YOUR_ACCOUNT)}
            </h1>

            <div className='flex gap-3 mb-8'>
              <button
                type='button'
                onClick={() => setAccountType(AccountType.BUYER)}
                className={cn(
                  'flex items-center justify-center gap-2.5 w-52 py-4 rounded-xl text-base font-semibold transition-all cursor-pointer',
                  accountType === AccountType.BUYER
                    ? 'border-2 border-brand-green bg-brand-green-muted text-brand-green'
                    : 'border border-border bg-white text-foreground hover:border-brand-green'
                )}
              >
                <User size={17} />
                Buyer
              </button>
              <button
                type='button'
                onClick={() => setAccountType(AccountType.BUSINESS)}
                className={cn(
                  'flex items-center justify-center gap-2.5 w-52 py-4 rounded-xl text-base font-semibold transition-all cursor-pointer',
                  accountType === AccountType.BUSINESS
                    ? 'border-2 border-brand-green bg-brand-green-muted text-brand-green'
                    : 'border border-border bg-white text-foreground hover:border-brand-green'
                )}
              >
                <Store size={17} />
                {t(StringKey.BUSINESS)}
              </button>
            </div>

            <div className={accountType === AccountType.BUYER ? 'block' : 'hidden'}>
              <BuyerForm />
            </div>
            <div className={accountType === AccountType.BUSINESS ? 'block' : 'hidden'}>
              <BusinessForm />
            </div>

            <div className='flex items-center gap-4 my-7'>
              <div className='flex-1 h-px bg-border' />
              <span className='text-xs text-muted-foreground'>{t(StringKey.OR)}</span>
              <div className='flex-1 h-px bg-border' />
            </div>

            <div ref={googleButtonRef} className='hidden'>
              <GoogleLogin
                onSuccess={credentialResponse => {
                  if (!credentialResponse.credential) return;
                  const loginType = accountType === AccountType.BUSINESS ? 'establishment' : 'user';
                  googleLogin(
                    { idToken: credentialResponse.credential, loginType },
                    {
                      onSuccess: response => {
                        setAuth(response.accessToken, loginType);
                        void navigate({ to: '/' });
                      },
                      onError: () => toast.error(t(StringKey.GOOGLE_AUTH_FAILED)),
                    }
                  );
                }}
                onError={() => toast.error(t(StringKey.GOOGLE_AUTH_FAILED))}
              />
            </div>

            <button
              type='button'
              onClick={handleGoogleClick}
              className='w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-white py-4.5 text-lg font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer'
            >
              <img src={googleIcon} alt='Google' />
              {t(StringKey.CONTINUE_WITH_GOOGLE)}
            </button>

            <p className='text-center text-sm text-muted-foreground mt-7'>
              {t(StringKey.ALREADY_HAVE_AN_ACCOUNT)}{' '}
              <Link
                to='/login'
                className='font-bold text-brand-green hover:text-brand-green-hover transition-colors'
              >
                {t(StringKey.SIGN_IN)}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
