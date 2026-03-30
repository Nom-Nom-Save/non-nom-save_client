import { useUserStore } from '@/store/user.store';
import userAvatar from '@/assets/user-avatar.svg';
import {
  ShoppingBag,
  PiggyBank,
  ScrollText,
  Heart,
  CreditCard,
  CircleUserRound,
} from 'lucide-react';
import { StringKey } from '@/consts/string-key.consts';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

const UserSidebarNavigationItems = [
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
  {
    lable: StringKey.PROFILE,
    icon: CircleUserRound,
    to: '/profile/settings',
  },
];

const UserSidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { user } = useUserStore();
  const memberSinceYear = new Date(user?.createdAt ?? '').getFullYear();

  return (
    <aside className='w-full md:w-[300px]'>
      <section className='bg-white p-8 rounded-4xl h-fit mb-6'>
        <div className='flex flex-col items-center justify-center mb-6'>
          <div className='relative mb-3'>
            <img
              src={userAvatar}
              alt='User Avatar'
              className='w-24 h-24 rounded-full border-4 border-border bg-[#F2C4A0]'
            />
          </div>

          <p className='font-playfair text-brand-green text-lg font-semibold'>{user?.fullName}</p>
          <p className='text-[#6B7280] text-sm'>
            {t(StringKey.MEMBER_SINCE)} {memberSinceYear}
          </p>
        </div>

        <div className='flex flex-col gap-3 w-full'>
          <div className='flex items-center justify-between bg-[#FEF6EF] rounded-2xl px-4 py-3'>
            <div className='flex items-center gap-2 text-[#6B7280] text-sm'>
              <ShoppingBag size={16} className='text-orange-400' />
              {t(StringKey.ORDERS)}
            </div>
            <span className='text-orange-400 font-semibold'>
              {user?.successfulOrdersCount ?? 0}
            </span>
          </div>

          <div className='flex items-center justify-between bg-[#F0F9FF] rounded-2xl px-4 py-3'>
            <div className='flex items-center gap-2 text-[#6B7280] text-sm'>
              <PiggyBank size={16} className='text-[#8ECAE6]' />
              {t(StringKey.SAVED)}
            </div>
            <span className='text-[#8ECAE6] font-semibold'>${user?.totalSavings ?? 0}</span>
          </div>
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
                <Icon className={cn('w-5 h-5', activeRoute ? 'text-white' : 'text-[#4B5563]')} />
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
                <Icon className={cn('w-5 h-5', activeRoute ? 'text-white' : 'text-[#4B5563]')} />
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
