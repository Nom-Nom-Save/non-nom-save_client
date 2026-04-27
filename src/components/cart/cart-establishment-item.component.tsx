import { StringKey } from '@/consts/string-key.consts';
import type { EstablishmentProfile } from '@/types/establishment.types';
import { Link } from '@tanstack/react-router';
import { MapPin, Star } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface CartEstablishmentItemProps {
  establishment: EstablishmentProfile;
  isOpen: boolean;
  total: number;
  totalQuantity: number;
}

const CartEstablishmentItem: FC<CartEstablishmentItemProps> = ({
  establishment,
  isOpen,
  totalQuantity,
  total,
}) => {
  const { t } = useTranslation();

  return (
    <li className='bg-white rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4'>
      <div className='w-16 h-16 rounded-2xl bg-orange-50 overflow-hidden flex items-center justify-center shrink-0'>
        {establishment.logo ? (
          <img
            src={establishment.logo}
            alt={`${establishment.name} logo`}
            className='w-full h-full object-cover'
          />
        ) : (
          <span className='text-2xl'>🏪</span>
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 flex-wrap'>
          <h2 className='font-playfair font-bold text-xl'>{establishment.name}</h2>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isOpen
                ? 'bg-brand-green-muted text-brand-green'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {isOpen ? t(StringKey.OPEN_NOW) : t(StringKey.CLOSED)}
          </span>
        </div>
        <div className='flex items-center gap-1.5 mt-1 text-muted-foreground text-sm'>
          <MapPin className='w-3.5 h-3.5' />
          <span>{establishment.address}</span>
        </div>
        {establishment.rating && (
          <div className='flex items-center gap-1 mt-1'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className='w-3.5 h-3.5'
                fill={i < Math.round(+establishment.rating!) ? '#FBBF24' : 'transparent'}
                stroke='#FBBF24'
              />
            ))}
            <span className='text-sm font-medium ml-1'>{establishment.rating}</span>
            <span className='text-sm text-muted-foreground'>
              ({establishment.reviewCount} {t(StringKey.REVIEWS)})
            </span>
          </div>
        )}
      </div>

      <div className='flex items-center gap-4 shrink-0'>
        <div className='text-right'>
          <p className='text-xs text-muted-foreground'>Order total</p>
          <p className='text-brand-green font-bold text-2xl'>${total}</p>
          <p className='text-xs text-muted-foreground'>
            {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
          </p>
        </div>
        <Link to='/cart/$establishmentId' params={{ establishmentId: establishment.id }}>
          <button className='bg-brand-green text-white font-semibold rounded-full px-6 py-3 flex items-center gap-2 hover:bg-brand-green/90 transition-colors whitespace-nowrap cursor-pointer'>
            {t(StringKey.GO_TO_ORDER)} →
          </button>
        </Link>
      </div>
    </li>
  );
};

export default CartEstablishmentItem;
