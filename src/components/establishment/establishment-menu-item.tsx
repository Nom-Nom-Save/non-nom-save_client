import { StringKey } from '@/consts/string-key.consts';
import { cn } from '@/lib/utils';
import type { MenuItemResponse } from '@/types/menu.types';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import AddToCartModal from '../cart/add-to-cart-modal.component';
import { useCartStore } from '@/store/cart.store';
import { toast } from 'sonner';

interface EstablishmentMenuItemProps {
  menuItem: MenuItemResponse;
}

const EstablishmentMenuItem: FC<EstablishmentMenuItemProps> = ({ menuItem }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const { items } = useCartStore();

  const hasDiscount = menuItem.priceData.discountPrice > 0;
  const displayPrice = hasDiscount
    ? menuItem.priceData.discountPrice
    : menuItem.priceData.originalPrice;

  const quantity = menuItem.priceData.availableQuantity;
  const isSoldOut = quantity === 0;
  const isLow = quantity > 0 && quantity <= 5;

  const handleOpenModal = () => {
    const existingItem = items.find(item => item.id === menuItem.id);
    const alreadyInCart = existingItem?.quantity ?? 0;
    const remainingQuantity = quantity > 0 ? quantity - alreadyInCart : 99;

    if (remainingQuantity <= 0) {
      toast.warning(t(StringKey.MAX_QUANTITY_REACHED), {
        description: t(StringKey.ALREADY_MAX_IN_CART),
      });
      return;
    }

    setShowModal(true);
  };

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

      <div className='flex items-end justify-between gap-3'>
        <div className='flex flex-col gap-1'>
          {hasDiscount && (
            <p className='text-sm text-muted-foreground line-through'>
              ${menuItem.priceData.originalPrice.toFixed(2)}
            </p>
          )}
          <p className='text-brand-green font-bold text-xl'>${displayPrice.toFixed(2)}</p>
          <span
            className={cn(
              'text-xs font-semibold px-2.5 py-1 rounded-full w-fit',
              isSoldOut
                ? 'bg-destructive/10 text-destructive'
                : isLow
                  ? 'bg-orange-50 text-orange-600'
                  : 'bg-brand-green-muted text-brand-green'
            )}
          >
            {isSoldOut ? t(StringKey.STATUS_SOLD_OUT) : `${quantity} ${t(StringKey.ITEMS_LEFT)}`}
          </span>
        </div>
        <button
          onClick={handleOpenModal}
          className='shrink-0 bg-brand-green text-white text-sm font-semibold rounded-full px-4 py-2.5 hover:bg-brand-green/90 transition-colors cursor-pointer'
        >
          {t(StringKey.ADD_TO_CART)}
        </button>
      </div>

      {showModal && <AddToCartModal menuItem={menuItem} onClose={() => setShowModal(false)} />}
    </li>
  );
};

export default EstablishmentMenuItem;
