import { StringKey } from '@/consts/string-key.consts';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LogOut, Crown } from 'lucide-react';
import { PlanName, SubscriptionStatus } from '@/types/subscription.types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useEstablishmentProfileQuery } from '@/queries/establishment.queries';
import logoUrl from '@/assets/NomNomSave-Logo.svg';
import type { FC } from 'react';
import { USER_NAV } from '@/types/user.types';
import { ESTABLISHMENT_NAV } from '@/types/establishments.types';
import { useUserProfileQuery } from '@/queries/user.queries';

const Header = () => {
  const { t } = useTranslation();
  const { location } = useRouterState();
  const navigate = useNavigate();

  const loginType = useAuthStore(s => s.loginType);
  const clearAuth = useAuthStore(s => s.clearAuth);
  const isEstablishment = loginType === 'establishment';
  const isUser = loginType === 'user';

  const handleLogout = () => {
    clearAuth();
    void navigate({ to: '/login' });
  };

  if (isEstablishment) {
    return <EstablishmentHeader t={t} location={location} handleLogout={handleLogout} />;
  }

  if (isUser) {
    return <UserHeader t={t} location={location} handleLogout={handleLogout} />;
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
          <Button type='button' variant='brand-outline' className='rounded-xl py-2 px-5 text-base'>
            {t(StringKey.LOG_IN)}
          </Button>
        </Link>
        <Link to='/register'>
          <Button type='button' variant='brand' className='rounded-xl py-2 px-5 text-base'>
            {t(StringKey.SING_IN)}
          </Button>
        </Link>
      </div>
    </header>
  );
};

interface UserHeaderProps {
  t: (key: string) => string;
  location: { pathname: string };
  handleLogout: () => void;
}

const UserHeader: FC<UserHeaderProps> = ({ t, location, handleLogout }) => {
  const { data: user } = useUserProfileQuery();

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
          <Button
            type='button'
            variant='ghost-circle'
            className='w-9 h-9 rounded-full'
            onClick={handleLogout}
            title={t(StringKey.LOGOUT)}
          >
            <LogOut size={18} className='text-foreground/50' />
          </Button>
          <Link to='/profile/settings' className='flex items-center gap-2'>
            <div className='relative'>
              <div className='w-[38px] h-[38px] rounded-full bg-brand-green-muted border-2 border-brand-green flex items-center justify-center'>
                <span className='text-sm font-bold text-brand-green'>
                  {user?.fullName?.charAt(0)?.toUpperCase() ?? 'E'}
                </span>
              </div>
              {user?.subscription?.status === SubscriptionStatus.ACTIVE &&
                user?.subscription?.planName !== PlanName.Free && (
                  <Crown
                    size={18}
                    className='absolute -top-2.5 -right-1.5'
                    style={{ color: 'var(--brand-green)', fill: 'var(--brand-green)' }}
                  />
                )}
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
  handleLogout: () => void;
}

const EstablishmentHeader = ({ t, location, handleLogout }: EstablishmentHeaderProps) => {
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
          <Button
            type='button'
            variant='ghost-circle'
            className='w-9 h-9 rounded-full'
            onClick={handleLogout}
            title={t(StringKey.LOGOUT)}
          >
            <LogOut size={18} className='text-foreground/50' />
          </Button>
          <Link to='/settings' className='flex items-center gap-2'>
            <div className='relative'>
              <div className='w-[38px] h-[38px] rounded-full bg-brand-green-muted border-2 border-brand-green flex items-center justify-center'>
                <span className='text-sm font-bold text-brand-green'>
                  {profile?.name?.charAt(0)?.toUpperCase() ?? 'E'}
                </span>
              </div>
              {profile?.subscription?.status === SubscriptionStatus.ACTIVE &&
                profile?.subscription?.planName !== PlanName.Free && (
                  <Crown
                    size={18}
                    className='absolute -top-2.5 -right-1.5'
                    style={{ color: 'var(--brand-green)', fill: 'var(--brand-green)' }}
                  />
                )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
