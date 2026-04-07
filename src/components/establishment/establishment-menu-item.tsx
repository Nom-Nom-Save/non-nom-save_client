import { StringKey } from '@/consts/string-key.consts';
import type { MenuItemResponse } from '@/types/menu.types';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface EstablishmentMenuItemProps {
  menuItem: MenuItemResponse;
}

const EstablishmentMenuItem: FC<EstablishmentMenuItemProps> = ({ menuItem }) => {
  const { t } = useTranslation();

  const hasDiscount = menuItem.priceData.discountPrice > 0;
  const displayPrice = hasDiscount
    ? menuItem.priceData.discountPrice
    : menuItem.priceData.originalPrice;

  return (
    <li className='bg-white rounded-2xl p-8 shadow-sm'>
      <div className='relative mb-4'>
        <img
          className='h-48 rounded-2xl w-full object-cover'
          src={menuItem.itemDetails.picture}
          alt={`${menuItem.itemDetails.name} picture`}
        />
        <p className='absolute top-3 right-2 bg-white p-2 rounded-md text-sm font-semibold'>
          {menuItem.itemType}
        </p>
      </div>

      {menuItem.itemDetails.types.length > 0 && (
        <div className='flex flex-wrap gap-1.5 mb-3'>
          {menuItem.itemDetails.types.map(type => (
            <span
              key={type}
              className='text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium'
            >
              {type}
            </span>
          ))}
        </div>
      )}

      <h3 className='font-bold font-playfair text-2xl mb-2'>{menuItem.itemDetails.name}</h3>
      <p className='text-sm text-muted-foreground mb-2'>{menuItem.itemDetails.weightInfo}</p>
      <p className='text-base text-muted-foreground mb-3'>{menuItem.itemDetails.description}</p>

      {menuItem.itemDetails.allergens && menuItem.itemDetails.allergens.length > 0 && (
        <div className='flex items-center gap-1.5 mb-4 flex-wrap'>
          <span className='text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium'>
            {t(StringKey.ALLERGENS)}:
          </span>
          <span className='text-xs text-muted-foreground'>
            {menuItem.itemDetails.allergens.join(' · ')}
          </span>
        </div>
      )}

      <div className='flex flex-col gap-3'>
        <div className='flex flex-col items-baseline'>
          {hasDiscount && (
            <p className='text-sm text-muted-foreground line-through'>
              ${menuItem.priceData.originalPrice.toFixed(2)}
            </p>
          )}
          <p className='text-brand-green font-bold text-xl'>${displayPrice.toFixed(2)}</p>
        </div>
        <button className='self-end bg-brand-green text-white text-sm font-semibold rounded-full px-4 py-2.5 hover:bg-brand-green/90 transition-colors cursor-pointer'>
          {t(StringKey.ADD_TO_CART)}
        </button>
      </div>
    </li>
  );
};

export default EstablishmentMenuItem;
