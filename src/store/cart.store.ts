import type { CartItem } from '@/types/cart.types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  addItem: (
    id: string,
    menuPriceId: string,
    establishmentId: string,
    unitPrice: number,
    originalPrice: number
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    set => ({
      items: [],
      addItem: (id, menuPriceId, establishmentId, unitPrice, originalPrice) =>
        set(state => {
          const existing = state.items.find(item => item.id === id);

          if (existing) {
            return {
              items: state.items.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { id, menuPriceId, establishmentId, quantity: 1, unitPrice, originalPrice },
            ],
          };
        }),
      removeItem: id => set(state => ({ items: state.items.filter(item => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set(state => ({
          items:
            quantity <= 0
              ? state.items.filter(item => item.id !== id)
              : state.items.map(item => (item.id === id ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
