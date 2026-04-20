import { useCartStore } from '@/store/cart.store';
import { useGetEstablishmentsByIdsQuery } from '@/queries/establishments.queries';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { isEstablishmentOpen } from '@/utils/working-hours.utils';
import CartPageSkeleton from '@/components/cart/cart-page-skeleton.component';
import CartEstablishmentItem from '@/components/cart/cart-establishment-item.component';

const CartPage = () => {
  const { t } = useTranslation();
  const { items } = useCartStore();

  const establishmentIds = [...new Set(items.map(item => item.establishmentId))];

  const { data, isLoading } = useGetEstablishmentsByIdsQuery(establishmentIds);
  const cartEstablishments = data?.establishments ?? [];

  if (isLoading) {
    return <CartPageSkeleton />;
  }

  if (items.length === 0) {
    return (
      <section className='my-6 px-4'>
        <h1 className='font-playfair font-bold text-3xl text-brand-green mb-2'>
          {t(StringKey.MY_CART)}
        </h1>
        <p className='text-muted-foreground text-sm'>{t(StringKey.CART_EMPTY)}</p>
      </section>
    );
  }

  return (
    <section className='my-6 px-4'>
      <h1 className='font-playfair font-bold text-3xl text-brand-green mb-1'>
        {t(StringKey.MY_CART)}
      </h1>
      <p className='text-muted-foreground text-sm mb-6'>
        {t(StringKey.CART_ESTABLISHMENTS_COUNT, { count: establishmentIds.length })}
      </p>

      <ul className='flex flex-col gap-4'>
        {cartEstablishments.map(establishment => {
          const establishmentItems = items.filter(
            item => item.establishmentId === establishment.id
          );
          const totalQuantity = establishmentItems.reduce((sum, item) => sum + item.quantity, 0);
          const isOpen = isEstablishmentOpen(establishment.workingHours);
          const total = establishmentItems.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0
          );

          return (
            <CartEstablishmentItem
              key={establishment.id}
              establishment={establishment}
              isOpen={isOpen}
              total={total}
              totalQuantity={totalQuantity}
            />
          );
        })}
      </ul>
    </section>
  );
};

export default CartPage;
