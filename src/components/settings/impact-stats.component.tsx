import { ShoppingBag, Leaf, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { SubscriptionStatus } from '@/types/subscription.types';
import { useEstablishmentProfileQuery } from '@/queries/establishment.queries';
import { formatDate } from '@/utils/time.utils';
import { UnlockPremiumButton } from '@/components/subscription/unlock-premium-button.component';

export const ImpactStats = () => {
  const { t } = useTranslation();
  const { data: profile } = useEstablishmentProfileQuery();
  const isPremium = profile?.subscription?.status === SubscriptionStatus.ACTIVE;

  return (
    <div className='bg-white rounded-3xl border-[1.5px] border-border p-6 shadow-sm'>
      <p className='text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2'>
        {t(StringKey.IMPACT)}
      </p>
      <h3 className='text-[17px] font-bold font-playfair mb-5'>
        {t(StringKey.YOUR_IMPACT_TOGETHER)}
      </h3>
      <div className='grid grid-cols-2 gap-3 mb-4'>
        <div className='p-4 bg-brand-cream rounded-[14px] text-center'>
          <ShoppingBag size={28} className='text-brand-green mx-auto mb-1.5' />
          <p className='text-[22px] font-black text-brand-green'>{profile?.bagsSold || 0}</p>
          <p className='text-[11px] font-semibold text-foreground/50 uppercase tracking-wide'>
            {t(StringKey.BAGS_SOLD)}
          </p>
        </div>
        <div className='p-4 bg-brand-cream rounded-[14px] text-center'>
          <Leaf size={28} className='text-brand-green mx-auto mb-1.5' />
          <p className='text-[22px] font-black text-brand-green'>{profile?.foodSaved || 0}</p>
          <p className='text-[11px] font-semibold text-foreground/50 uppercase tracking-wide'>
            {t(StringKey.FOOD_SAVED)}
          </p>
        </div>
      </div>

      {isPremium && profile?.subscription ? (
        <div className='flex items-start gap-3 bg-brand-green/8 border border-brand-green/20 rounded-[14px] px-4 py-3'>
          <Crown size={18} className='text-brand-green shrink-0 mt-0.5' />
          <div className='min-w-0'>
            <p className='text-sm font-semibold text-brand-green'>
              {profile.subscription.planName}
            </p>
            <p className='text-xs text-foreground/50 mt-0.5'>
              {t(StringKey.SUBSCRIPTION_ACTIVE_THANK_YOU)}
            </p>
            <p className='text-xs text-foreground/40 mt-0.5'>
              {t(StringKey.PLAN_EXPIRES)} {formatDate(profile.subscription.endDate)}
            </p>
          </div>
        </div>
      ) : (
        <UnlockPremiumButton />
      )}
    </div>
  );
};
