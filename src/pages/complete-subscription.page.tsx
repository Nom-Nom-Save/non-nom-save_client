import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Route } from '@/routes/complete-subscription';
import { CheckCircle, Calendar, Star } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  useCaptureSubscriptionOrderMutation,
  useSubscriptionPlansQuery,
} from '@/queries/subscription.queries';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { useAuthStore } from '@/store/auth.store';

const CompleteSubscriptionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = Route.useSearch();
  const captureOrderMutation = useCaptureSubscriptionOrderMutation();
  const { data: plans } = useSubscriptionPlansQuery();
  const loginType = useAuthStore(s => s.loginType);

  const plan = plans?.[0];
  const planName =
    plan?.name ??
    (loginType === 'establishment' ? t(StringKey.PLAN_PRO_NAME) : t(StringKey.PLAN_PREMIUM_NAME));
  const planPrice = plan ? `$${plan.price}` : '—';

  const buyerFeatures = [
    t(StringKey.BUYER_PREMIUM_FEAT_2),
    t(StringKey.BUYER_PREMIUM_FEAT_3),
    t(StringKey.BUYER_PREMIUM_FEAT_4),
    t(StringKey.BUYER_PREMIUM_FEAT_5),
  ];

  const estFeatures = [
    t(StringKey.EST_PRO_FEAT_2),
    t(StringKey.EST_PRO_FEAT_3),
    t(StringKey.EST_PRO_FEAT_4),
    t(StringKey.EST_PRO_FEAT_5),
  ];

  const planFeatures = loginType === 'establishment' ? estFeatures : buyerFeatures;

  useEffect(() => {
    if (!token) {
      void navigate({ to: '/cancel-subscription' });
      return;
    }
    captureOrderMutation.mutate(
      { orderId: token },
      {
        onError: () => {
          void navigate({ to: '/cancel-subscription' });
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TEMP: redirect to cancel page after 10s for screenshots
  useEffect(() => {
    if (captureOrderMutation.isPending) return;
    const id = setTimeout(() => void navigate({ to: '/cancel-subscription' }), 10_000);
    return () => clearTimeout(id);
  }, [captureOrderMutation.isPending, navigate]);

  const nextBillingDate = format(addDays(new Date(), 30), 'MMMM d, yyyy');

  if (captureOrderMutation.isPending) {
    return (
      <div className='min-h-screen bg-brand-cream flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4' />
          <p className='text-muted-foreground'>{t(StringKey.CONFIRMING_SUBSCRIPTION)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-brand-cream flex items-center justify-center px-4 py-20'>
      <div className='max-w-[600px] w-full text-center'>
        <div className='w-[100px] h-[100px] rounded-full bg-brand-green-muted flex items-center justify-center mx-auto mb-7'>
          <CheckCircle size={52} className='text-brand-green' strokeWidth={1.5} />
        </div>

        <span className='inline-block px-4 py-1.5 rounded-full bg-brand-green-muted text-brand-green text-xs font-extrabold tracking-widest uppercase mb-4'>
          {t(StringKey.PAYMENT_SUCCESSFUL_BADGE)}
        </span>

        <h1 className='font-playfair text-[clamp(2rem,4vw,3rem)] font-bold text-brand-green leading-tight mb-3'>
          {t(StringKey.YOU_ARE_ALL_SET)}
        </h1>
        <p className='text-base text-muted-foreground leading-relaxed mb-9 max-w-[440px] mx-auto'>
          {t(StringKey.SUBSCRIPTION_ACTIVATED_DESC)}
        </p>

        <div className='bg-white border border-border rounded-[20px] p-7 mb-9 text-left'>
          <div className='flex items-center justify-between mb-5'>
            <div className='flex items-center gap-3'>
              <div className='w-11 h-11 rounded-xl bg-brand-green-muted flex items-center justify-center text-xl'>
                🌱
              </div>
              <div>
                <p className='font-playfair text-lg font-bold text-foreground'>{planName}</p>
                <p className='text-[13px] text-muted-foreground'>{t(StringKey.MONTHLY_RENEWS)}</p>
              </div>
            </div>
            <span className='text-xl font-black text-brand-green'>{planPrice}</span>
          </div>

          <div className='h-px bg-border mb-4' />

          <div className='flex flex-col gap-2.5 mb-5'>
            {planFeatures.map(feature => (
              <div
                key={feature}
                className='flex items-center gap-2.5 text-sm font-medium text-foreground'
              >
                <CheckCircle size={16} className='text-brand-green shrink-0' strokeWidth={2} />
                {feature}
              </div>
            ))}
          </div>

          <div className='flex items-center gap-2.5 px-4 py-3 bg-muted rounded-xl'>
            <Calendar size={16} className='text-muted-foreground shrink-0' />
            <p className='text-[13px] text-muted-foreground'>
              {t(StringKey.NEXT_BILLING_DATE)}{' '}
              <strong className='text-foreground'>{nextBillingDate}</strong>
            </p>
          </div>
        </div>

        <div className='mb-10'>
          <p className='text-[13px] font-bold text-muted-foreground uppercase tracking-widest mb-3.5'>
            {t(StringKey.WHAT_YOU_UNLOCKED)}
          </p>
          <div className='flex flex-wrap gap-2 justify-center'>
            {planFeatures.map(feature => (
              <span
                key={feature}
                className='inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-green-muted text-[13px] font-semibold text-brand-green'
              >
                <Star size={14} />
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className='flex gap-3 justify-center flex-wrap'>
          <Button
            variant='brand'
            size='settings'
            onClick={() => void navigate({ to: '/dashboard' })}
          >
            {t(StringKey.GO_TO_DASHBOARD)}
          </Button>
          <Button
            variant='outline'
            size='settings'
            onClick={() => void navigate({ to: '/subscriptions/plans' })}
          >
            {t(StringKey.VIEW_MY_PLAN)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompleteSubscriptionPage;
