import { StringKey } from '@/consts/string-key.consts';
import { Link, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useEstablishmentProfileQuery } from '@/queries/establishment.queries';
import logoUrl from '@/assets/NomNomSave-Logo.svg';
import { useUserStore } from '@/store/user.store';
import type { FC } from 'react';
import { USER_NAV } from '@/types/user.types';
import { ESTABLISHMENT_NAV } from '@/types/establishments.types';
import { useUserProfileQuery } from '@/queries/user.queries';

const Header = () => {
  const { t } = useTranslation();
  const { location } = useRouterState();
  const loginType = useAuthStore(s => s.loginType);
  const clearAuth = useAuthStore(s => s.clearAuth);
  const isEstablishment = loginType === 'establishment';
  const isUser = loginType === 'user';

  if (isEstablishment) {
    return <EstablishmentHeader t={t} location={location} clearAuth={clearAuth} />;
  }

  if (isUser) {
    return <UserHeader t={t} location={location} clearAuth={clearAuth} />;
  }

  return (
    <header className='flex justify-between items-center bg-brand-cream py-5 px-6 border-b border-border'>
      <div className='flex gap-2 items-center'>
        <img src={logoUrl} alt='NomNomSave' className='w-12 h-auto' />
        <h1 className='text-2xl text-brand-green font-playfair font-bold'>
          {t(StringKey.NOM_NOM_SAVE)}
        </h1>
      </div>
      <div className='flex flex-col sm:flex-row gap-3 items-center'>
        <Link to='/login'>
          <button
            type='button'
            className='rounded-xl py-2 px-5 text-md font-semibold text-brand-green border border-brand-green transition-colors cursor-pointer hover:bg-brand-green hover:text-white'
          >
            {t(StringKey.LOG_IN)}
          </button>
        </Link>
        <Link to='/register'>
          <button
            type='button'
            className='rounded-xl py-2 px-5 text-md font-semibold text-white transition-colors cursor-pointer bg-brand-green hover:bg-brand-green-hover'
          >
            {t(StringKey.SING_IN)}
          </button>
        </Link>
      </div>
    </header>
  );
};

interface UserHeaderProps {
  t: (key: string) => string;
  location: { pathname: string };
  clearAuth: () => void;
}

const UserHeader: FC<UserHeaderProps> = ({ t, location, clearAuth }) => {
  useUserProfileQuery();
  const { user } = useUserStore();

  return (
    <header className='sticky top-0 z-50 h-[72px] bg-brand-cream/92 backdrop-blur-sm border-b border-border'>
      <div className='max-w-[1320px] mx-auto px-8 h-full flex items-center justify-between'>
        <div className='flex items-center gap-10'>
          <Link to='/' className='flex items-center gap-2'>
            <img src={logoUrl} alt='NomNomSave' className='h-9' />
          </Link>

          <nav className='flex gap-10'>
            {USER_NAV.map(item => {
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'text-sm font-semibold transition-colors pb-0.5',
                    isActive
                      ? 'text-brand-green font-bold border-b-2 border-brand-green'
                      : 'text-foreground/50 hover:text-foreground'
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className='flex items-center gap-4'>
          <button
            type='button'
            onClick={clearAuth}
            className='w-9 h-9 rounded-full bg-brand-cream border border-border flex items-center justify-center cursor-pointer hover:bg-destructive/10 transition-colors'
            title={t(StringKey.LOGOUT)}
          >
            <LogOut size={18} className='text-foreground/50' />
          </button>
          <Link to='/profile/settings' className='flex items-center gap-2'>
            <div className='w-[38px] h-[38px] rounded-full bg-brand-green-muted border-2 border-brand-green flex items-center justify-center'>
              <span className='text-sm font-bold text-brand-green'>
                {user?.fullName?.charAt(0)?.toUpperCase() ?? 'E'}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

interface EstablishmentHeaderProps {
  t: (key: string) => string;
  location: { pathname: string };
  clearAuth: () => void;
}

const EstablishmentHeader = ({ t, location, clearAuth }: EstablishmentHeaderProps) => {
  const { data: profile } = useEstablishmentProfileQuery();

  return (
    <header className='sticky top-0 z-50 h-[72px] bg-brand-cream/92 backdrop-blur-sm border-b border-border'>
      <div className='max-w-[1320px] mx-auto px-8 h-full flex items-center justify-between'>
        <div className='flex items-center gap-10'>
          <Link to='/templates' className='flex items-center gap-2'>
            <img src={logoUrl} alt='NomNomSave' className='h-9' />
          </Link>

          <nav className='flex gap-10'>
            {ESTABLISHMENT_NAV.map(item => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'text-sm font-semibold transition-colors pb-0.5',
                    isActive
                      ? 'text-brand-green font-bold border-b-2 border-brand-green'
                      : 'text-foreground/50 hover:text-foreground'
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className='flex items-center gap-4'>
          <button
            type='button'
            onClick={clearAuth}
            className='w-9 h-9 rounded-full bg-brand-cream border border-border flex items-center justify-center cursor-pointer hover:bg-destructive/10 transition-colors'
            title={t(StringKey.LOGOUT)}
          >
            <LogOut size={18} className='text-foreground/50' />
          </button>
          <Link to='/settings' className='flex items-center gap-2'>
            <div className='w-[38px] h-[38px] rounded-full bg-brand-green-muted border-2 border-brand-green flex items-center justify-center'>
              <span className='text-sm font-bold text-brand-green'>
                {profile?.name?.charAt(0)?.toUpperCase() ?? 'E'}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
