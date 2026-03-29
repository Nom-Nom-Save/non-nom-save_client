import { Link } from '@tanstack/react-router';
import { LoginLeftPanel } from '@/components/login/login-left-panel.component';
import { LoginForm } from '@/components/login/login-form.component';
import { StringKey } from '@/consts/string-key.consts';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <div className='flex min-h-screen bg-brand-cream'>
      <LoginLeftPanel />

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
            <h1 className='text-[2.5rem] font-bold text-foreground mb-10 font-playfair'>
              {t(StringKey.LOGIN_TO_YOUR_ACCOUNT)}
            </h1>

            <LoginForm />

            <p className='text-center text-sm text-muted-foreground mt-7'>
              {t(StringKey.DONT_HAVE_AN_ACCOUNT)}{' '}
              <Link
                to='/register'
                className='font-bold text-brand-green hover:text-brand-green-hover transition-colors'
              >
                {t(StringKey.SING_UP)}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
