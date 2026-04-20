import { useCartStore } from '@/store/cart.store';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetEstablishmentsQuery } from '@/queries/establishments.queries';
import { useGetEstablishmentMenu } from '@/queries/menu.queries';
import { isEstablishmentOpen } from '@/utils/working-hours.utils';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import RemoveCartItemDialog from '@/components/cart/remove-cart-item-dialog.component';
import EstablishmentCartSkeleton from '@/components/cart/establishment-cart-skeleton.component';
import { useCreateOrderMutation } from '@/queries/order.queries';
import { toast } from 'sonner';
import CartItem from '@/components/cart/cart-item.component';
import { ApiError } from '@/api/client';

const EstablishmentCartPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { establishmentId } = useParams({ from: '/cart/$establishmentId' });

  const { items, removeItem } = useCartStore();
  const establishmentItems = items.filter(item => item.establishmentId === establishmentId);

  const { data: establishmentsData, isLoading: isEstablishmentsLoading } =
    useGetEstablishmentsQuery({ page: 1 });
  const establishment = establishmentsData?.establishments.find(
    establishment => establishment.id === establishmentId
  );

  const { data: menuData, isLoading: isMenuLoading } = useGetEstablishmentMenu(establishmentId);
  const total = establishmentItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const isOpen = establishment ? isEstablishmentOpen(establishment.workingHours) : false;

  const [itemToRemove, setItemToRemove] = useState<{ id: string; name: string } | null>(null);

  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrderMutation();

  const handleCreateOrder = () => {
    const orderItems = establishmentItems.map(item => ({
      menuPriceId: item.menuPriceId,
      quantity: item.quantity,
    }));

    createOrder(orderItems, {
      onSuccess: () => {
        establishmentItems.forEach(item => removeItem(item.id));
        toast.success(t(StringKey.ORDER_PLACED_SUCCESS));
        navigate({ to: '/my-cart' });
      },
      onError: error => {
        if (error instanceof ApiError && error.status === 400) {
          const message = (error.data as any)?.message;

          toast.error(message, {
            style: { whiteSpace: 'pre-line' },
          });
        } else {
          toast.error(t(StringKey.ORDER_PLACED_ERROR));
        }
      },
    });
  };

  if (isMenuLoading || isEstablishmentsLoading) {
    return <EstablishmentCartSkeleton />;
  }

  return (
    <section className='min-h-screen'>
      <div className='py-4 flex items-center gap-4'>
        <button
          onClick={() => navigate({ to: '/my-cart' })}
          className='flex items-center gap-2 bg-white border border-border rounded-full px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors cursor-pointer'
        >
          <ArrowLeft className='w-4 h-4' />
          {t(StringKey.BACK_TO_CART)}
        </button>

        {establishment && (
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-orange-50 overflow-hidden'>
              {establishment.logo ? (
                <img
                  src={establishment.logo}
                  alt={`${establishment.name} logo`}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-lg flex items-center justify-center h-full'>🏪</span>
              )}
            </div>
            <div>
              <p className='font-playfair font-bold text-brand-green leading-tight'>
                {establishment.name}
              </p>
              <p className='text-xs text-muted-foreground'>{establishment.address}</p>
            </div>
            <span
              className={cn(
                'text-xs font-semibold px-3 py-1 rounded-full ml-2',
                isOpen
                  ? 'bg-brand-green-muted text-brand-green'
                  : 'bg-destructive/10 text-destructive'
              )}
            >
              {isOpen ? t(StringKey.OPEN_NOW) : t(StringKey.CLOSED)}
            </span>
          </div>
        )}
      </div>

      <div className='py-6 flex flex-col lg:flex-row gap-6'>
        <ul className='flex-1 flex flex-col gap-4'>
          {establishmentItems.map(cartItem => {
            const menuItem = menuData?.menu.find(menu => menu.id === cartItem.id);

            if (!menuItem) {
              return null;
            }

            return (
              <CartItem
                key={cartItem.id}
                cartItem={cartItem}
                menuItem={menuItem}
                setItemToRemove={setItemToRemove}
              />
            );
          })}
        </ul>

        <div className='lg:w-80 shrink-0'>
          <div className='bg-white rounded-2xl border border-border shadow-sm p-6 sticky top-4'>
            <h2 className='font-playfair font-bold text-xl mb-5'>{t(StringKey.ORDER_SUMMARY)}</h2>

            <ul className='flex flex-col gap-2 mb-4'>
              {establishmentItems.map(cartItem => {
                const menuItem = menuData?.menu.find(m => m.id === cartItem.id);

                return (
                  <li key={cartItem.id} className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      {menuItem?.itemDetails.name}
                      {cartItem.quantity > 1 && <span> ×{cartItem.quantity}</span>}
                    </span>
                    <span className='font-medium'>
                      ${(cartItem.unitPrice * cartItem.quantity).toFixed(2)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className='flex justify-between items-center border-t border-border pt-3'>
              <span className='font-bold text-lg'>Total</span>
              <span className='font-bold text-brand-green text-2xl'>${total.toFixed(2)}</span>
            </div>

            <button
              disabled={isCreatingOrder || establishmentItems.length === 0}
              onClick={handleCreateOrder}
              className='w-full mt-5 bg-brand-green text-white font-semibold rounded-full py-4 flex items-center justify-center gap-2 hover:bg-brand-green/90 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {isCreatingOrder ? (
                <>
                  <span className='h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin' />
                  {t(StringKey.PLACING_ORDER)}
                </>
              ) : (
                <>
                  <CheckCircle className='w-5 h-5' />
                  {t(StringKey.PLACE_ORDER)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <RemoveCartItemDialog
        open={!!itemToRemove}
        itemName={itemToRemove?.name}
        onClose={() => setItemToRemove(null)}
        onConfirm={() => itemToRemove && removeItem(itemToRemove.id)}
      />
    </section>
  );
};

export default EstablishmentCartPage;
