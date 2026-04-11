import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { useAuthStore } from '@/store/auth.store';
import { useSubscriptionPlansQuery } from '@/queries/subscription.queries';
import { PlanCard } from '@/components/subscription/plan-card.component';
import { SubscriptionTrust } from '@/components/subscription/subscription-trust.component';
import { SubscriptionFaq } from '@/components/subscription/subscription-faq.component';
import type { PlanFeature } from '@/components/subscription/plan-card.component';

const SubscriptionsPlansPage = () => {
  const { t } = useTranslation();
  const loginType = useAuthStore(s => s.loginType);
  const { data: plans } = useSubscriptionPlansQuery();
  const plan = plans?.[0];

  const pricePerDay = plan ? `$${(parseFloat(plan.price) / plan.durationDays).toFixed(2)}` : null;

  const apiCardPrice = plan ? `$${plan.price}` : '—';
  const apiCardPeriod = plan ? t(StringKey.PER_MONTH) : undefined;

  const buyerFreeFeatures: PlanFeature[] = [
    { label: t(StringKey.BUYER_FREE_FEAT_1) },
    { label: t(StringKey.BUYER_FREE_FEAT_2) },
    { label: t(StringKey.BUYER_FREE_FEAT_3) },
    { label: t(StringKey.BUYER_FREE_LOCKED_1), locked: true },
    { label: t(StringKey.BUYER_FREE_LOCKED_2), locked: true },
    { label: t(StringKey.BUYER_FREE_LOCKED_3), locked: true },
  ];

  const buyerPremiumFeatures: PlanFeature[] = [
    { label: t(StringKey.BUYER_PREMIUM_FEAT_1) },
    { label: t(StringKey.BUYER_PREMIUM_FEAT_2) },
    { label: t(StringKey.BUYER_PREMIUM_FEAT_3) },
    { label: t(StringKey.BUYER_PREMIUM_FEAT_4) },
    { label: t(StringKey.BUYER_PREMIUM_FEAT_5) },
  ];

  const buyerSponsorFeatures: PlanFeature[] = [
    { label: t(StringKey.BUYER_SPONSOR_FEAT_1) },
    { label: t(StringKey.BUYER_SPONSOR_FEAT_2) },
    { label: t(StringKey.BUYER_SPONSOR_FEAT_3) },
    { label: t(StringKey.BUYER_SPONSOR_FEAT_4) },
    { label: t(StringKey.BUYER_SPONSOR_FEAT_5) },
  ];

  const estFreeFeatures: PlanFeature[] = [
    { label: t(StringKey.EST_FREE_FEAT_1) },
    { label: t(StringKey.EST_FREE_FEAT_2) },
    { label: t(StringKey.EST_FREE_FEAT_3) },
    { label: t(StringKey.EST_FREE_LOCKED_1), locked: true },
    { label: t(StringKey.EST_FREE_LOCKED_2), locked: true },
    { label: t(StringKey.EST_FREE_LOCKED_3), locked: true },
    { label: t(StringKey.EST_FREE_LOCKED_4), locked: true },
  ];

  const estProFeatures: PlanFeature[] = [
    { label: t(StringKey.EST_PRO_FEAT_1) },
    { label: t(StringKey.EST_PRO_FEAT_2) },
    { label: t(StringKey.EST_PRO_FEAT_3) },
    { label: t(StringKey.EST_PRO_FEAT_4) },
    { label: t(StringKey.EST_PRO_FEAT_5) },
    { label: t(StringKey.EST_PRO_LOCKED_1), locked: true },
    { label: t(StringKey.EST_PRO_LOCKED_2), locked: true },
  ];

  const estSponsorFeatures: PlanFeature[] = [
    { label: t(StringKey.EST_SPONSOR_FEAT_1) },
    { label: t(StringKey.EST_SPONSOR_FEAT_2) },
    { label: t(StringKey.EST_SPONSOR_FEAT_3) },
    { label: t(StringKey.EST_SPONSOR_FEAT_4) },
    { label: t(StringKey.EST_SPONSOR_FEAT_5) },
    { label: t(StringKey.EST_SPONSOR_FEAT_6) },
  ];

  const isEstablishment = loginType === 'establishment';

  return (
    <div className='min-h-screen bg-brand-cream'>
      <div className='max-w-[1160px] mx-auto px-8 py-16 pb-24'>
        <div className='text-center mb-14'>
          <span className='inline-block px-4 py-1.5 rounded-full bg-brand-green-muted text-brand-green text-xs font-extrabold tracking-widest uppercase mb-4'>
            {t(StringKey.SUBSCRIPTION_PLANS)}
          </span>
          <h1 className='font-playfair text-[clamp(2.4rem,4vw,3.5rem)] font-black text-brand-green leading-tight mb-4'>
            {t(StringKey.SUBSCRIPTION_PLANS_TITLE)}
          </h1>
          <p className='text-[17px] text-muted-foreground max-w-[520px] mx-auto leading-relaxed'>
            {t(StringKey.SUBSCRIPTION_PLANS_SUBTITLE)}
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-start'>
          {isEstablishment ? (
            <>
              <PlanCard
                emoji='🌱'
                name={t(StringKey.PLAN_FREE_NAME)}
                price='$0'
                period={t(StringKey.FREE_FOREVER).replace('$0 ', '')}
                description={t(StringKey.EST_FREE_DESCRIPTION)}
                features={estFreeFeatures}
                buttonLabel={t(StringKey.CURRENT_PLAN_BTN)}
                isButtonDisabled
                isCurrentPlan
              />
              <PlanCard
                emoji='🚀'
                name={plan?.name ?? t(StringKey.PLAN_PRO_NAME)}
                price={apiCardPrice}
                period={apiCardPeriod}
                pricePerDay={pricePerDay ?? undefined}
                description={t(StringKey.EST_PRO_DESCRIPTION)}
                features={estProFeatures}
                buttonLabel={t(StringKey.SUBSCRIBE_WITH_PAYPAL)}
                isFeatured
              />
              <PlanCard
                emoji='⭐'
                name={t(StringKey.PLAN_SPONSOR_NAME)}
                price={t(StringKey.COMING_SOON)}
                description={t(StringKey.EST_SPONSOR_DESCRIPTION)}
                features={estSponsorFeatures}
                buttonLabel={t(StringKey.COMING_SOON)}
                isButtonDisabled
                variant='sponsor'
              />
            </>
          ) : (
            <>
              <PlanCard
                emoji='🌱'
                name={t(StringKey.PLAN_FREE_NAME)}
                price='$0'
                period={t(StringKey.FREE_FOREVER).replace('$0 ', '')}
                description={t(StringKey.BUYER_FREE_DESCRIPTION)}
                features={buyerFreeFeatures}
                buttonLabel={t(StringKey.CURRENT_PLAN_BTN)}
                isButtonDisabled
                isCurrentPlan
              />
              <PlanCard
                emoji='⚡'
                name={plan?.name ?? t(StringKey.PLAN_PREMIUM_NAME)}
                price={apiCardPrice}
                period={apiCardPeriod}
                pricePerDay={pricePerDay ?? undefined}
                description={t(StringKey.BUYER_PREMIUM_DESCRIPTION)}
                features={buyerPremiumFeatures}
                buttonLabel={t(StringKey.SUBSCRIBE_WITH_PAYPAL)}
                isFeatured
              />
              <PlanCard
                emoji='⭐'
                name={t(StringKey.PLAN_SPONSOR_NAME)}
                price={t(StringKey.COMING_SOON)}
                description={t(StringKey.BUYER_SPONSOR_DESCRIPTION)}
                features={buyerSponsorFeatures}
                buttonLabel={t(StringKey.COMING_SOON)}
                isButtonDisabled
                variant='sponsor'
              />
            </>
          )}
        </div>

        <SubscriptionTrust />
        <SubscriptionFaq />
      </div>
    </div>
  );
};

export default SubscriptionsPlansPage;
