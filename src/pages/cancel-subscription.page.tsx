import { useNavigate } from '@tanstack/react-router';
import { XCircle, CheckCircle, Lock, Crown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

const CancelSubscriptionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const accessItems = [
    { label: t(StringKey.BUYER_FREE_FEAT_1), locked: false },
    { label: t(StringKey.BUYER_FREE_FEAT_2), locked: false },
    { label: t(StringKey.BUYER_FREE_FEAT_3), locked: false },
    { label: t(StringKey.CANCEL_SUB_LOCKED_ITEM), locked: true },
  ];

  return (
    <div className='min-h-screen bg-brand-cream flex items-center justify-center px-4 py-20'>
      <div className='max-w-[560px] w-full text-center'>
        <div className='w-[100px] h-[100px] rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-7'>
          <XCircle size={52} className='text-destructive' />
        </div>

        <span className='inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-extrabold tracking-widest uppercase mb-4'>
          {t(StringKey.PAYMENT_CANCELLED_BADGE)}
        </span>

        <h1 className='font-playfair text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-foreground leading-tight mb-3'>
          {t(StringKey.NO_CHARGE_MADE)}
        </h1>
        <p className='text-base text-muted-foreground leading-relaxed mb-10 max-w-[420px] mx-auto'>
          {t(StringKey.PAYMENT_CANCELLED_DESC)}
        </p>

        <div className='bg-white border-[1.5px] border-border rounded-[20px] p-7 mb-9 text-left'>
          <p className='text-[13px] font-bold text-muted-foreground uppercase tracking-[.08em] mb-4'>
            {t(StringKey.YOU_STILL_HAVE_ACCESS)}
          </p>
          <div className='flex flex-col gap-2.5'>
            {accessItems.map(item => (
              <div
                key={item.label}
                className={`flex items-start gap-2.5 px-4 py-3.5 bg-white border border-border rounded-[14px] text-sm font-medium ${item.locked ? 'opacity-45' : ''}`}
              >
                {item.locked ? (
                  <Lock size={18} className='text-muted-foreground shrink-0' />
                ) : (
                  <CheckCircle size={18} className='text-brand-green shrink-0' strokeWidth={2} />
                )}
                <span className={item.locked ? 'text-muted-foreground' : 'text-foreground'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='border-[1.5px] border-brand-green/20 rounded-[20px] p-7 mb-9 text-left bg-linear-to-br from-brand-green-muted to-white'>
          <div className='flex items-center gap-2 mb-2'>
            <Crown size={18} className='text-brand-green shrink-0' />
            <p className='font-playfair text-xl font-bold text-brand-green'>
              {t(StringKey.STILL_THINKING)}
            </p>
          </div>
          <p className='text-sm text-muted-foreground leading-relaxed mb-5'>
            {t(StringKey.UPSELL_DESC)}
          </p>
          <Button
            variant='brand'
            size='settings'
            onClick={() => void navigate({ to: '/subscriptions/plans' })}
          >
            {t(StringKey.SEE_PLANS_AGAIN)}
          </Button>
        </div>

        <Button
          variant='ghost'
          size='sm'
          className='gap-2 text-muted-foreground hover:text-brand-green hover:bg-transparent'
          onClick={() => void navigate({ to: '/dashboard' })}
        >
          <ArrowLeft size={18} />
          {t(StringKey.GO_TO_DASHBOARD)}
        </Button>
      </div>
    </div>
  );
};

export default CancelSubscriptionPage;
