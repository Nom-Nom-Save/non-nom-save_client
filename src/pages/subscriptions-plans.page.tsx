import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { useAuthStore } from '@/store/auth.store';
import {
  useSubscriptionPlansQuery,
  useCreateSubscriptionOrderMutation,
} from '@/queries/subscription.queries';
import { PlanCard } from '@/components/subscription/plan-card.component';
import { SubscriptionTrust } from '@/components/subscription/subscription-trust.component';
import { SubscriptionFaq } from '@/components/subscription/subscription-faq.component';
import type { PlanFeature } from '@/components/subscription/plan-card.component';
import { PlanName, SubscriptionStatus } from '@/types/subscription.types';
import { useQuery } from '@tanstack/react-query';
import { userKeys } from '@/queries/user.queries';
import { establishmentKeys } from '@/queries/establishment.queries';
import { getUserInfo } from '@/api/user.api';
import { getEstablishmentProfile } from '@/api/establishment.api';
import type { User } from '@/types/user.types';
import type { EstablishmentProfile } from '@/types/establishment.types';

const SubscriptionsPlansPage = () => {
  const { t } = useTranslation();
  const loginType = useAuthStore(s => s.loginType);
  const isEstablishment = loginType === 'establishment';
  const { data: plans } = useSubscriptionPlansQuery();
  const createOrderMutation = useCreateSubscriptionOrderMutation();

  const { data: user } = useQuery<User>({
    queryKey: userKeys.profile(),
    queryFn: getUserInfo,
    enabled: !isEstablishment,
  });

  const { data: estProfile } = useQuery<EstablishmentProfile>({
    queryKey: establishmentKeys.profile(),
    queryFn: getEstablishmentProfile,
    enabled: isEstablishment,
  });

  const subscription = isEstablishment ? estProfile?.subscription : user?.subscription;
  const isSubscriptionActive = subscription?.status === SubscriptionStatus.ACTIVE;
  const currentPlanName = isSubscriptionActive
    ? (subscription?.planName ?? PlanName.Free)
    : PlanName.Free;

  const proPlan = plans?.[0];
  const sponsorPlan = plans?.[1];

  const proPrice = proPlan ? `$${proPlan.price}` : '—';
  const proPeriod = proPlan ? t(StringKey.PER_MONTH) : undefined;
  const proPricePerDay = proPlan
    ? `$${(parseFloat(proPlan.price) / proPlan.durationDays).toFixed(2)}`
    : null;

  const sponsorPrice = sponsorPlan ? `$${sponsorPlan.price}` : '—';
  const sponsorPeriod = sponsorPlan ? t(StringKey.PER_MONTH) : undefined;
  const sponsorPricePerDay = sponsorPlan
    ? `$${(parseFloat(sponsorPlan.price) / sponsorPlan.durationDays).toFixed(2)}`
    : null;

  const handleSubscribe = (planId: string) => {
    createOrderMutation.mutate(
      { subscriptionPlanId: planId },
      {
        onSuccess: data => {
          const paypalBase = import.meta.env.VITE_PAYPAL_BASE_URL as string;
          window.location.href = `${paypalBase}/checkoutnow?token=${data.id}`;
        },
      }
    );
  };

  const isSubscribing = createOrderMutation.isPending;

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

  const isFreeCurrent = currentPlanName === PlanName.Free;
  const isProCurrent = currentPlanName === PlanName.Pro;
  const isSponsorCurrent = currentPlanName === PlanName.Sponsor;
  // Paid plans are only purchaseable from Free (no cross-upgrades for now)
  const canSubscribe = isFreeCurrent;

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

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch'>
          {isEstablishment ? (
            <>
              <PlanCard
                emoji='🌱'
                name={t(StringKey.PLAN_FREE_NAME)}
                price='$0'
                period={t(StringKey.FREE_FOREVER).replace('$0 ', '')}
                description={t(StringKey.EST_FREE_DESCRIPTION)}
                features={estFreeFeatures}
                buttonLabel={isFreeCurrent ? t(StringKey.CURRENT_PLAN_BTN) : undefined}
                isButtonDisabled
                isCurrentPlan={isFreeCurrent}
              />
              <PlanCard
                emoji='🚀'
                name={proPlan?.name ?? t(StringKey.PLAN_PRO_NAME)}
                price={proPrice}
                period={proPeriod}
                pricePerDay={proPricePerDay ?? undefined}
                description={t(StringKey.EST_PRO_DESCRIPTION)}
                features={estProFeatures}
                buttonLabel={
                  isProCurrent
                    ? t(StringKey.CURRENT_PLAN_BTN)
                    : canSubscribe
                      ? t(StringKey.SUBSCRIBE_WITH_PAYPAL)
                      : undefined
                }
                isButtonDisabled={isProCurrent || isSubscribing}
                isCurrentPlan={isProCurrent}
                isFeatured
                onSubscribe={
                  canSubscribe && proPlan ? () => handleSubscribe(proPlan.id) : undefined
                }
              />
              <PlanCard
                emoji='⭐'
                name={sponsorPlan?.name ?? t(StringKey.PLAN_SPONSOR_NAME)}
                price={sponsorPrice}
                period={sponsorPeriod}
                pricePerDay={sponsorPricePerDay ?? undefined}
                description={t(StringKey.EST_SPONSOR_DESCRIPTION)}
                features={estSponsorFeatures}
                buttonLabel={
                  isSponsorCurrent
                    ? t(StringKey.CURRENT_PLAN_BTN)
                    : canSubscribe
                      ? t(StringKey.SUBSCRIBE_WITH_PAYPAL)
                      : undefined
                }
                isButtonDisabled={isSponsorCurrent || isSubscribing}
                isCurrentPlan={isSponsorCurrent}
                variant='sponsor'
                onSubscribe={
                  canSubscribe && sponsorPlan ? () => handleSubscribe(sponsorPlan.id) : undefined
                }
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
                buttonLabel={isFreeCurrent ? t(StringKey.CURRENT_PLAN_BTN) : undefined}
                isButtonDisabled
                isCurrentPlan={isFreeCurrent}
              />
              <PlanCard
                emoji='⚡'
                name={proPlan?.name ?? t(StringKey.PLAN_PREMIUM_NAME)}
                price={proPrice}
                period={proPeriod}
                pricePerDay={proPricePerDay ?? undefined}
                description={t(StringKey.BUYER_PREMIUM_DESCRIPTION)}
                features={buyerPremiumFeatures}
                buttonLabel={
                  isProCurrent
                    ? t(StringKey.CURRENT_PLAN_BTN)
                    : canSubscribe
                      ? t(StringKey.SUBSCRIBE_WITH_PAYPAL)
                      : undefined
                }
                isButtonDisabled={isProCurrent || isSubscribing}
                isCurrentPlan={isProCurrent}
                isFeatured
                onSubscribe={
                  canSubscribe && proPlan ? () => handleSubscribe(proPlan.id) : undefined
                }
              />
              <PlanCard
                emoji='⭐'
                name={sponsorPlan?.name ?? t(StringKey.PLAN_SPONSOR_NAME)}
                price={sponsorPrice}
                period={sponsorPeriod}
                pricePerDay={sponsorPricePerDay ?? undefined}
                description={t(StringKey.BUYER_SPONSOR_DESCRIPTION)}
                features={buyerSponsorFeatures}
                buttonLabel={
                  isSponsorCurrent
                    ? t(StringKey.CURRENT_PLAN_BTN)
                    : canSubscribe
                      ? t(StringKey.SUBSCRIBE_WITH_PAYPAL)
                      : undefined
                }
                isButtonDisabled={isSponsorCurrent || isSubscribing}
                isCurrentPlan={isSponsorCurrent}
                variant='sponsor'
                onSubscribe={
                  canSubscribe && sponsorPlan ? () => handleSubscribe(sponsorPlan.id) : undefined
                }
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
