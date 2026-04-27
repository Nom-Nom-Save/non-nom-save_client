import { type FC, useState } from 'react';
import type { MenuItemResponse } from '@/types/menu.types';
import { useCartStore } from '@/store/cart.store';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { X, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface AddToCartModalProps {
  menuItem: MenuItemResponse;
  onClose: () => void;
}

const AddToCartModal: FC<AddToCartModalProps> = ({ menuItem, onClose }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const { addItem, items, updateQuantity } = useCartStore();

  const hasDiscount = menuItem.priceData.discountPrice > 0;
  const unitPrice = hasDiscount
    ? menuItem.priceData.discountPrice
    : menuItem.priceData.originalPrice;
  const total = (unitPrice * quantity).toFixed(2);

  const existingItem = items.find(item => item.id === menuItem.id);
  const alreadyInCart = existingItem?.quantity ?? 0;
  const maxQuantity = menuItem.priceData.availableQuantity;
  const remainingQuantity = maxQuantity > 0 ? maxQuantity - alreadyInCart : 99;

  const handleAddToCart = () => {
    const existingItem = items.find(item => item.id === menuItem.id);

    if (existingItem) {
      updateQuantity(menuItem.id, existingItem.quantity + quantity);
    } else {
      addItem(
        menuItem.id,
        menuItem.priceData.id,
        menuItem.establishmentId,
        unitPrice,
        menuItem.priceData.originalPrice
      );
      if (quantity > 1) {
        updateQuantity(menuItem.id, quantity);
      }
    }

    const alreadyInCart = existingItem?.quantity ?? 0;
    const remainingQuantity = maxQuantity > 0 ? maxQuantity - alreadyInCart - quantity : 99;

    if (remainingQuantity <= 0) {
      toast.success(t(StringKey.ADDED_TO_CART), {
        description: `${menuItem.itemDetails.name} — ${t(StringKey.NO_MORE_AVAILABLE)}`,
      });
    } else {
      toast.success(t(StringKey.ADDED_TO_CART), {
        description: `${menuItem.itemDetails.name}`,
      });
    }

    onClose();
  };

  if (remainingQuantity <= 0) {
    onClose();
    return null;
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-3xl w-full max-w-sm mx-4 p-6 shadow-xl'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-14 h-14 rounded-2xl bg-orange-50 overflow-hidden flex items-center justify-center shrink-0'>
              {menuItem.itemDetails.picture ? (
                <img
                  src={menuItem.itemDetails.picture}
                  alt={menuItem.itemDetails.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-2xl'>🎁</span>
              )}
            </div>
            <div>
              <h2 className='font-playfair font-bold text-lg leading-tight'>
                {menuItem.itemDetails.name}
              </h2>
              <div className='flex items-center gap-2 mt-1'>
                <span className='text-[11px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded'>
                  {menuItem.itemType}
                </span>
                <span className='text-brand-green font-bold text-base'>
                  ${unitPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        <hr className='border-border mb-5' />

        <p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3'>
          {t(StringKey.HOW_MANY)}
        </p>

        <div className='flex items-center justify-center gap-0 rounded-2xl bg-muted overflow-hidden mb-4'>
          <button
            className='w-16 h-14 flex items-center justify-center text-xl font-bold text-brand-green hover:bg-border transition-colors disabled:opacity-40'
            onClick={() => setQuantity(quantity => Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className='flex-1 text-center text-xl font-bold'>{quantity}</span>
          <button
            className='w-16 h-14 flex items-center justify-center text-xl font-bold text-brand-green hover:bg-border transition-colors disabled:opacity-40'
            onClick={() => setQuantity(quantity => Math.min(maxQuantity || 99, quantity + 1))}
            disabled={quantity >= remainingQuantity}
          >
            +
          </button>
        </div>

        <div className='flex items-center justify-between bg-muted rounded-2xl px-5 py-4 mb-5'>
          <span className='text-muted-foreground text-sm'>{t(StringKey.TOTAL)}</span>
          <span className='text-brand-green font-bold text-lg'>${total}</span>
        </div>

        <button
          onClick={handleAddToCart}
          className='w-full bg-brand-green text-white font-semibold rounded-full py-3.5 flex items-center justify-center gap-2 hover:bg-brand-green/90 transition-colors'
        >
          <ShoppingCart className='w-5 h-5' />
          {t(StringKey.ADD_TO_CART)}
        </button>
      </div>
    </div>
  );
};

export default AddToCartModal;
