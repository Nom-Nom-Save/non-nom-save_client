import { Pause, Play, CircleOff, Pencil, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MenuStatus } from '@/types/menu.types';
import type { MenuItemResponse } from '@/types/menu.types';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

interface MenuItemCardProps {
  item: MenuItemResponse;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDeactivate: (id: string) => void;
  onEdit: (item: MenuItemResponse) => void;
}

const STATUS_BADGE_STYLES: Record<MenuStatus, string> = {
  [MenuStatus.ACTIVE]: 'bg-brand-green-muted text-brand-green',
  [MenuStatus.SOLD_OUT]: 'bg-orange-50 text-orange-600',
  [MenuStatus.INACTIVE]: 'bg-amber-50 text-amber-700',
};

const STATUS_DOT_COLORS: Record<MenuStatus, string> = {
  [MenuStatus.ACTIVE]: 'bg-brand-green',
  [MenuStatus.SOLD_OUT]: 'bg-orange-400',
  [MenuStatus.INACTIVE]: 'bg-amber-400',
};

const STATUS_LABELS: Record<MenuStatus, StringKey> = {
  [MenuStatus.ACTIVE]: StringKey.STATUS_ACTIVE,
  [MenuStatus.SOLD_OUT]: StringKey.STATUS_SOLD_OUT,
  [MenuStatus.INACTIVE]: StringKey.STATUS_INACTIVE,
};

export const MenuItemCard = ({
  item,
  onPause,
  onResume,
  onDeactivate,
  onEdit,
}: MenuItemCardProps) => {
  const { t } = useTranslation();
  const { priceData, itemDetails, status, id } = item;

  const startTime = new Date(priceData.startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = new Date(priceData.endTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const discountPercent = Math.round((1 - priceData.discountPrice / priceData.originalPrice) * 100);

  const isInactive = status === MenuStatus.INACTIVE;
  const isSoldOut = status === MenuStatus.SOLD_OUT;

  const statusBadge = (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap',
        STATUS_BADGE_STYLES[status]
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_DOT_COLORS[status])} />
      {t(STATUS_LABELS[status])}
    </span>
  );

  const actionButtons = (
    <div className='flex items-center gap-2'>
      {status === MenuStatus.ACTIVE && (
        <Button
          type='button'
          variant='ghost-circle'
          size='icon-circle'
          onClick={() => onPause(id)}
          title={t(StringKey.PAUSE)}
        >
          <Pause size={16} className='text-foreground/50' />
        </Button>
      )}
      {status === MenuStatus.INACTIVE && (
        <>
          <Button
            type='button'
            variant='ghost-circle'
            size='icon-circle'
            onClick={() => onResume(id)}
            title={t(StringKey.RESUME)}
          >
            <Play size={16} className='text-foreground/50' />
          </Button>
          <Button
            type='button'
            variant='ghost-circle'
            size='icon-circle'
            onClick={() => onEdit(item)}
            title={t(StringKey.EDIT)}
          >
            <Pencil size={16} className='text-foreground/50' />
          </Button>
        </>
      )}
      {status === MenuStatus.SOLD_OUT && (
        <>
          <Button
            type='button'
            variant='ghost-circle-destructive'
            size='icon-circle'
            onClick={() => onDeactivate(id)}
            title={t(StringKey.DEACTIVATE)}
          >
            <CircleOff size={16} className='text-foreground/50' />
          </Button>
          <Button
            type='button'
            variant='ghost-circle'
            size='icon-circle'
            onClick={() => onEdit(item)}
            title={t(StringKey.EDIT)}
          >
            <Pencil size={16} className='text-foreground/50' />
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        'bg-white px-4 py-4 sm:px-5 rounded-[1.25rem] border-[1.5px] border-border shadow-sm transition-colors hover:border-brand-green',
        (isInactive || isSoldOut) && 'opacity-60 bg-muted/30'
      )}
    >
      {/* Desktop layout */}
      <div className='hidden sm:flex items-center gap-5'>
        <div className='w-[52px] h-[52px] rounded-[14px] bg-brand-green-muted flex items-center justify-center shrink-0 text-2xl'>
          📦
        </div>

        <div className='flex-1 min-w-0'>
          <h3 className='text-[17px] font-bold font-playfair text-foreground mb-0.5 truncate'>
            {itemDetails.name}
          </h3>
          <p className='text-[13px] text-foreground/50 truncate'>{itemDetails.description}</p>
        </div>

        <div className='text-center min-w-[120px] shrink-0'>
          <p className='text-[11px] text-foreground/50 mb-1'>{t(StringKey.PICKUP_WINDOW)}</p>
          <div className='flex items-center gap-1.5 justify-center'>
            <Clock size={14} className='text-brand-green' />
            <span className='text-[13px] font-bold'>
              {startTime} — {endTime}
            </span>
          </div>
        </div>

        <div className='text-center min-w-[90px] shrink-0'>
          <p className='text-[11px] text-foreground/50 mb-1'>{t(StringKey.QUANTITY)}</p>
          <span className={cn('text-[13px] font-bold', isSoldOut && 'text-orange-600')}>
            {priceData.availableQuantity}{' '}
            <span className='text-foreground/35 font-normal'>/ {priceData.totalQuantity}</span>
          </span>
        </div>

        <div className='text-right min-w-[100px] shrink-0'>
          <p className='text-[11px] text-foreground/50 mb-0.5'>{t(StringKey.ORIGINAL_PRICE)}</p>
          <p className='text-[13px] font-semibold text-foreground/50 line-through'>
            €{priceData.originalPrice.toFixed(2)}
          </p>
        </div>

        <div className='text-right min-w-[100px] shrink-0'>
          <p className='text-[11px] text-foreground/50 mb-0.5'>{t(StringKey.DISCOUNT)}</p>
          <p className='text-base font-black text-brand-green'>
            €{priceData.discountPrice.toFixed(2)}
          </p>
          <p className='text-[10px] text-brand-green font-bold'>
            −{discountPercent}% {t(StringKey.OFF)}
          </p>
        </div>

        <div className='min-w-[90px] flex justify-center shrink-0'>{statusBadge}</div>

        {actionButtons}
      </div>

      {/* Mobile layout */}
      <div className='sm:hidden flex flex-col gap-3'>
        <div className='flex items-start gap-3'>
          <div className='w-12 h-12 rounded-[14px] bg-brand-green-muted flex items-center justify-center shrink-0 text-xl'>
            📦
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between gap-2 mb-0.5'>
              <h3 className='text-[16px] font-bold font-playfair text-foreground truncate flex-1'>
                {itemDetails.name}
              </h3>
              {statusBadge}
            </div>
            <p className='text-[13px] text-foreground/50 truncate'>{itemDetails.description}</p>
          </div>
        </div>

        <div className='flex items-center justify-between flex-wrap gap-2 pt-2.5 border-t border-border/60'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1'>
              <Clock size={13} className='text-brand-green' />
              <span className='text-[12px] font-bold'>
                {startTime}—{endTime}
              </span>
            </div>
            <span className={cn('text-[12px] font-bold', isSoldOut && 'text-orange-600')}>
              {priceData.availableQuantity}
              <span className='text-foreground/35 font-normal'>/{priceData.totalQuantity}</span>
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-[13px] font-semibold text-foreground/50 line-through'>
              €{priceData.originalPrice.toFixed(2)}
            </span>
            <span className='text-[15px] font-black text-brand-green'>
              €{priceData.discountPrice.toFixed(2)}
            </span>
            <span className='text-[10px] text-brand-green font-bold'>−{discountPercent}%</span>
          </div>

          {actionButtons}
        </div>
      </div>
    </div>
  );
};
