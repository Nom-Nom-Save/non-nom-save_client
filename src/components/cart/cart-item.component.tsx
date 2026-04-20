import { useCartStore } from '@/store/cart.store';
import { Trash2 } from 'lucide-react';
import type { FC } from 'react';
import type { CartItem as CartItemType } from '@/types/cart.types';
import type { MenuItemResponse } from '@/types/menu.types';

interface CartItemProps {
  cartItem: CartItemType;
  menuItem: MenuItemResponse;
  setItemToRemove: (data: { id: string; name: string }) => void;
}

const CartItem: FC<CartItemProps> = ({ cartItem, menuItem, setItemToRemove }) => {
  const { updateQuantity } = useCartStore();

  return (
    <li className='bg-white rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4'>
      <div className='w-16 h-16 rounded-xl bg-amber-50 overflow-hidden shrink-0'>
        {menuItem.itemDetails.picture ? (
          <img src={menuItem.itemDetails.picture} alt='' className='w-full h-full object-cover' />
        ) : (
          <span className='text-2xl flex items-center justify-center h-full'>🎁</span>
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 flex-wrap'>
          <h3 className='font-bold font-playfair text-lg'>{menuItem.itemDetails.name}</h3>
          <span className='text-[11px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded'>
            {menuItem.itemType}
          </span>
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <span className='text-brand-green font-bold text-lg'>
            ${cartItem.unitPrice.toFixed(2)}
          </span>
          {cartItem.originalPrice > cartItem.unitPrice && (
            <>
              <span className='text-muted-foreground text-sm line-through'>
                ${cartItem.originalPrice.toFixed(2)}
              </span>
              <span className='text-xs font-semibold bg-brand-green-muted text-brand-green px-2 py-0.5 rounded-full'>
                -{Math.round((1 - cartItem.unitPrice / cartItem.originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>
      </div>

      <div className='flex flex-col items-end gap-2 shrink-0'>
        <div className='flex items-center gap-0 rounded-xl bg-muted overflow-hidden'>
          <button
            className='w-10 h-10 flex items-center justify-center font-bold text-lg hover:bg-border transition-colors cursor-pointer'
            onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
          >
            −
          </button>
          <span className='w-10 text-center font-bold'>{cartItem.quantity}</span>
          <button
            className='w-10 h-10 flex items-center justify-center font-bold text-lg hover:bg-border transition-colors disabled:opacity-40 cursor-pointer'
            onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
            disabled={cartItem.quantity >= menuItem.priceData.availableQuantity}
          >
            +
          </button>
        </div>
        <button
          className='p-2 hover:text-destructive transition-colors text-muted-foreground cursor-pointer'
          onClick={() =>
            setItemToRemove({
              id: cartItem.id,
              name: menuItem.itemDetails.name,
            })
          }
        >
          <Trash2 className='w-4 h-4' />
        </button>
      </div>
    </li>
  );
};

export default CartItem;
