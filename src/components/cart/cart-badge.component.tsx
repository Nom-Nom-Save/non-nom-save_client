import { useCartStore } from '@/store/cart.store';
import type { FC } from 'react';

const CartBadge: FC<{ inline?: boolean }> = ({ inline }) => {
  const items = useCartStore(store => store.items);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity === 0) {
    return null;
  }

  if (inline) {
    return (
      <span className='ml-auto bg-brand-green text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
        {totalQuantity > 99 ? '99+' : totalQuantity}
      </span>
    );
  }

  return (
    <span className='absolute -top-1 -right-1 bg-brand-green text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none'>
      {totalQuantity > 99 ? '99+' : totalQuantity}
    </span>
  );
};

export default CartBadge;
