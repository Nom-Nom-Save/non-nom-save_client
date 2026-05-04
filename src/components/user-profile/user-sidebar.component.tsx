import { useUserProfileQuery } from '@/queries/user.queries';
import userAvatar from '@/assets/user-avatar.svg';
import {
  ShoppingBag,
  PiggyBank,
  ScrollText,
  Heart,
  CreditCard,
  CircleUserRound,
  Crown,
} from 'lucide-react';
import { StringKey } from '@/consts/string-key.consts';
import { PlanName, SubscriptionStatus } from '@/types/subscription.types';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/time.utils';
import { UnlockPremiumButton } from '@/components/subscription/unlock-premium-button.component';
import { Button } from '@/components/ui/button';

const UserSidebarNavigationItems = [
  {
    lable: StringKey.PROFILE,
    icon: CircleUserRound,
    to: '/profile/settings',
  },
  {
    lable: StringKey.MY_ORDERS,
    icon: ScrollText,
    to: '/profile/orders',
  },
  {
    lable: StringKey.FAVORITES,
    icon: Heart,
    to: '/profile/favorites',
  },
  {
    lable: StringKey.PAYMENT_METHODS,
    icon: CreditCard,
    to: '/profile/payment-methods',
  },
];

const UserSidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: user } = useUserProfileQuery();
  const memberSinceYear = new Date(user?.createdAt ?? '').getFullYear();
  const isPremium =
    user?.subscription?.status === SubscriptionStatus.ACTIVE &&
    user?.subscription?.planName !== PlanName.Free;

  return (
    <aside className='lg:sticky lg:top-4 w-full md:w-[300px]'>
      <section className='bg-white p-8 rounded-[1.25rem] h-fit mb-6'>
        <div className='flex flex-col items-center justify-center mb-6'>
          <div className='relative mb-3'>
            <img
              src={userAvatar}
              alt='User Avatar'
              className='w-24 h-24 rounded-full border-4 border-border bg-brand-avatar-bg'
            />
            {isPremium && (
              <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-brand-green text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap'>
                <Crown size={10} />
                {t(StringKey.PREMIUM)}
              </div>
            )}
          </div>

          <p className='font-playfair text-brand-green text-lg font-semibold mt-1'>
            {user?.fullName}
          </p>
          <p className='text-foreground/50 text-sm'>
            {t(StringKey.MEMBER_SINCE)} {memberSinceYear}
          </p>
        </div>

        <div className='flex flex-col gap-3 w-full'>
          <div className='flex items-center justify-between bg-brand-orange-light rounded-[1.25rem] px-4 py-3'>
            <div className='flex items-center gap-2 text-foreground/50 text-sm'>
              <ShoppingBag size={16} className='text-brand-orange' />
              {t(StringKey.ORDERS)}
            </div>
            <span className='text-brand-orange font-semibold'>
              {user?.successfulOrdersCount ?? 0}
            </span>
          </div>

          <div className='flex items-center justify-between bg-brand-blue-light rounded-[1.25rem] px-4 py-3'>
            <div className='flex items-center gap-2 text-foreground/50 text-sm'>
              <PiggyBank size={16} className='text-brand-blue' />
              {t(StringKey.SAVED)}
            </div>
            <span className='text-brand-blue font-semibold'>${user?.totalSavings ?? 0}</span>
          </div>

          {isPremium && user?.subscription ? (
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between bg-brand-green/8 border border-brand-green/20 rounded-[1.25rem] px-4 py-3'>
                <div className='flex items-center gap-2 text-foreground/50 text-sm'>
                  <Crown size={16} className='text-brand-green' />
                  {user.subscription.planName}
                </div>
                <span className='text-brand-green text-xs font-semibold'>
                  {t(StringKey.PLAN_EXPIRES)} {formatDate(user.subscription.endDate)}
                </span>
              </div>
              <Button
                variant='brand-outline'
                size='settings'
                className='w-full'
                onClick={() => void navigate({ to: '/subscriptions/plans' })}
              >
                <Crown size={15} />
                {t(StringKey.MANAGE_SUBSCRIPTION)}
              </Button>
            </div>
          ) : (
            <UnlockPremiumButton />
          )}
        </div>
      </section>
      <nav>
        <ul className='hidden md:flex flex-col gap-2'>
          {UserSidebarNavigationItems.map(navigationItem => {
            const Icon = navigationItem.icon;
            const activeRoute = location.href === navigationItem.to;

            return (
              <Link
                key={navigationItem.to}
                to={navigationItem.to}
                className={cn(
                  'flex items-center gap-4 p-4 text-base',
                  activeRoute && 'bg-brand-green text-white rounded-4xl'
                )}
              >
                <Icon
                  className={cn('w-5 h-5', activeRoute ? 'text-white' : 'text-foreground/50')}
                />
                {t(navigationItem.lable)}
              </Link>
            );
          })}
        </ul>

        <ul className='flex flex-row gap-2 overflow-x-auto pb-2 scrollbar-none md:hidden'>
          {UserSidebarNavigationItems.map(navigationItem => {
            const Icon = navigationItem.icon;
            const activeRoute = location.href === navigationItem.to;

            return (
              <Link
                key={navigationItem.to}
                to={navigationItem.to}
                className={cn(
                  'flex items-center gap-4 p-4 text-base',
                  activeRoute && 'bg-brand-green text-white rounded-4xl'
                )}
              >
                <Icon
                  className={cn('w-5 h-5', activeRoute ? 'text-white' : 'text-foreground/50')}
                />
                <span className='whitespace-nowrap'>{t(navigationItem.lable)}</span>
              </Link>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default UserSidebar;
