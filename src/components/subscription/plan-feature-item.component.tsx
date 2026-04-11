import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanFeatureItemProps {
  label: string;
  locked?: boolean;
  variant?: 'default' | 'sponsor';
}

export const PlanFeatureItem = ({
  label,
  locked = false,
  variant = 'default',
}: PlanFeatureItemProps) => {
  const iconBg = locked ? 'bg-muted' : variant === 'sponsor' ? 'bg-amber-100' : 'bg-brand-green';

  const iconColor = locked
    ? 'text-muted-foreground'
    : variant === 'sponsor'
      ? 'text-amber-600'
      : 'text-white';

  return (
    <div
      className={cn(
        'flex items-start gap-2.5 text-sm font-medium leading-[1.5]',
        locked ? 'text-muted-foreground' : 'text-foreground'
      )}
    >
      <div
        className={cn(
          'w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-0.5',
          iconBg
        )}
      >
        {locked ? (
          <X size={10} className={iconColor} strokeWidth={3} />
        ) : (
          <Check size={10} className={iconColor} strokeWidth={3} />
        )}
      </div>
      {label}
    </div>
  );
};
