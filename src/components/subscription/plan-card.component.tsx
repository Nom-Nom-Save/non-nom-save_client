import paypalIcon from '@/assets/paypal-icon.svg';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PlanFeatureItem } from '@/components/subscription/plan-feature-item.component';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

export interface PlanFeature {
  label: string;
  locked?: boolean;
}

interface PlanCardProps {
  emoji: string;
  name: string;
  price: string;
  period?: string;
  pricePerDay?: string;
  description: string;
  features: PlanFeature[];
  buttonLabel?: string;
  isButtonDisabled?: boolean;
  isFeatured?: boolean;
  isCurrentPlan?: boolean;
  variant?: 'default' | 'sponsor';
  onSubscribe?: () => void;
}

export const PlanCard = ({
  emoji,
  name,
  price,
  period,
  pricePerDay,
  description,
  features,
  buttonLabel,
  isButtonDisabled = false,
  isFeatured = false,
  isCurrentPlan = false,
  variant = 'default',
  onSubscribe,
}: PlanCardProps) => {
  const { t } = useTranslation();
  const isPaypal = !isButtonDisabled && !!onSubscribe;
  const isSponsored = variant === 'sponsor';

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-3xl border-2 p-8 transition-all duration-200',
        isFeatured && [
          'border-brand-green',
          'shadow-[0_16px_48px_rgba(10,80,43,0.14)]',
          '-translate-y-2',
          'hover:-translate-y-3',
        ],
        !isFeatured &&
          !isSponsored && [
            'border-border',
            'bg-white',
            'hover:border-brand-green',
            'hover:shadow-[0_12px_40px_rgba(10,80,43,0.1)]',
            'hover:-translate-y-1',
          ],
        isCurrentPlan && ['bg-white hover:translate-y-0 hover:shadow-none hover:border-border'],
        isSponsored && [
          'border-amber-300',
          'bg-linear-to-br from-yellow-50 to-white',
          'hover:border-amber-400',
          'hover:shadow-[0_12px_40px_rgba(255,196,57,0.2)]',
          'hover:-translate-y-1',
        ]
      )}
    >
      <div className='mb-6'>
        <div className='flex items-center gap-2.5 mb-2'>
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center text-xl',
              isSponsored ? 'bg-amber-100' : 'bg-brand-green-muted'
            )}
          >
            {emoji}
          </div>
          {isCurrentPlan && (
            <span className='text-[13px] font-bold px-3 py-1 rounded-full bg-muted text-muted-foreground'>
              {t(StringKey.CURRENT_PLAN_BADGE)}
            </span>
          )}
        </div>
        <h2
          className={cn(
            'font-playfair text-[26px] font-black mb-1.5',
            isSponsored ? 'text-amber-700' : isFeatured ? 'text-brand-green' : 'text-foreground'
          )}
        >
          {name}
        </h2>
        <p className='text-sm text-muted-foreground leading-relaxed'>{description}</p>
      </div>

      <div className='pb-6 mb-6 border-b border-border'>
        <div className='flex items-baseline gap-1'>
          <span
            className={cn(
              'font-playfair text-[42px] font-black',
              isSponsored ? 'text-amber-700' : isFeatured ? 'text-brand-green' : 'text-foreground'
            )}
          >
            {price}
          </span>
          {period && <span className='text-[15px] text-muted-foreground'>{period}</span>}
        </div>
        {pricePerDay && (
          <p
            className={cn(
              'text-xs font-semibold mt-1',
              isSponsored ? 'text-amber-500' : 'text-brand-green'
            )}
          >
            ≈ {pricePerDay} {t(StringKey.PER_DAY)}
          </p>
        )}
      </div>

      <div className={cn('flex flex-col gap-3 flex-1', buttonLabel && 'mb-8')}>
        {features.map(feature => (
          <PlanFeatureItem
            key={feature.label}
            label={feature.label}
            locked={feature.locked}
            variant={isSponsored ? 'sponsor' : 'default'}
          />
        ))}
      </div>

      {buttonLabel &&
        (isPaypal ? (
          <Button
            variant='paypal'
            size='plan'
            onClick={onSubscribe}
            disabled={isButtonDisabled}
            className='mt-8'
          >
            <img src={paypalIcon} alt='' className='w-4 h-4' />
            {buttonLabel}
          </Button>
        ) : (
          <Button
            variant={isFeatured && !isButtonDisabled ? 'brand' : 'outline'}
            size='plan'
            disabled={isButtonDisabled}
            onClick={onSubscribe}
            className='mt-8'
          >
            {buttonLabel}
          </Button>
        ))}
    </div>
  );
};
