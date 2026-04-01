import { StringKey } from '@/consts/string-key.consts';
import { useTranslation } from 'react-i18next';
import ordersBag from '@/assets/orders-bag.svg';
import money from '@/assets/money.svg';
import recycle from '@/assets/recycle.svg';
import { CheckCircle2, CircleX, Clock, QrCode as QrCodeIcon, Timer } from 'lucide-react';
import { useCancelOrder, useOrdersQuery } from '@/queries/order.queries';
import { useUserProfileQuery } from '@/queries/user.queries';
import { Loading } from '../loading.component';
import { formatTime, getTimeUntilExpiry } from '@/utils/time.utils';
import { toast } from 'sonner';
import { ApiError } from '@/api/client';
import { OrderStatus } from '@/types/orders.types';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import QRCode from 'react-qr-code';

const UserOrders = () => {
  const { t } = useTranslation();
  const { data: orders, isLoading } = useOrdersQuery();
  const { data: user } = useUserProfileQuery();
  const { mutate: cancelOrder, isPending } = useCancelOrder();

  const [cancelDialogOrderId, setCancelDialogOrderId] = useState<string | null>(null);
  const [qrDialogOrderId, setQrDialogOrderId] = useState<string | null>(null);

  const handleOrderCancel = (orderId: string) => {
    cancelOrder(orderId, {
      onSuccess: () => {
        toast.success(t(StringKey.ORDER_CANCELED));
        setCancelDialogOrderId(null);
      },
      onError: (error: Error) => {
        if (error instanceof ApiError) {
          toast.error(t(StringKey.FAILED_TO_CANCEL_ORDER));
        }
      },
    });
  };

  const pendingOrders = orders?.filter(order => order.orderStatus === OrderStatus.RESERVED) || [];
  const completedOrders =
    orders?.filter(order => order.orderStatus === OrderStatus.COMPLETED) || [];
  const cancelledOrExpiredOrders =
    orders?.filter(order =>
      [OrderStatus.CANCELLED, OrderStatus.EXPIRED].includes(order.orderStatus)
    ) || [];

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-brand-green font-bold font-playfair text-2xl sm:text-3xl mb-6'>
          {t(StringKey.MY_ORDERS)}
        </h2>

        <ul className='grid grid-cols-3 gap-2 sm:gap-4 w-full'>
          <li className='bg-white rounded-[1.25rem] border border-border p-3 sm:p-6 md:p-8 shadow-sm text-center flex-1'>
            <div className='w-10 h-10 sm:w-16 sm:h-16 bg-brand-status-success-bg rounded-full mx-auto mb-2 sm:mb-4 flex items-center justify-center'>
              <img src={ordersBag} alt='Bag Icon' className='w-5 h-5 sm:w-8 sm:h-8' />
            </div>
            <p className='text-[10px] sm:text-xs font-bold text-foreground/50 uppercase tracking-wider leading-tight'>
              {t(StringKey.TOTAL_ORDERS).toUpperCase()}
            </p>
            <p className='text-brand-green font-bold text-xl sm:text-3xl'>{orders?.length || 0}</p>
          </li>
          <li className='bg-white rounded-[1.25rem] border border-border p-3 sm:p-6 md:p-8 shadow-sm text-center flex-1'>
            <div className='w-10 h-10 sm:w-16 sm:h-16 bg-brand-blue-light rounded-full mx-auto mb-2 sm:mb-4 flex items-center justify-center'>
              <img src={money} alt='Money Icon' className='w-5 h-5 sm:w-8 sm:h-8' />
            </div>
            <p className='text-[10px] sm:text-xs font-bold text-foreground/50 uppercase tracking-wider leading-tight'>
              {t(StringKey.MONEY_SAVED).toUpperCase()}
            </p>
            <p className='text-brand-green font-bold text-xl sm:text-3xl'>${user?.totalSavings}</p>
          </li>
          <li className='bg-white rounded-[1.25rem] border border-border p-3 sm:p-6 md:p-8 shadow-sm text-center flex-1'>
            <div className='w-10 h-10 sm:w-16 sm:h-16 bg-brand-status-success-bg rounded-full mx-auto mb-2 sm:mb-4 flex items-center justify-center'>
              <img src={recycle} alt='Recycle Icon' className='w-5 h-5 sm:w-8 sm:h-8' />
            </div>
            <p className='text-[10px] sm:text-xs font-bold text-foreground/50 uppercase tracking-wider leading-tight'>
              {t(StringKey.WASTE_PREVENTED).toUpperCase()}
            </p>
            <p className='text-brand-green font-bold text-xl sm:text-3xl'>
              {user?.totalOrderedItems || 0}
            </p>
          </li>
        </ul>
      </div>

      <div>
        <h3 className='relative text-brand-green font-bold font-playfair text-xl sm:text-2xl pl-4 mb-6 before:content-[""] before:absolute before:left-0 before:top-0 before:h-full before:w-2 before:bg-brand-orange before:rounded-full'>
          {t(StringKey.UPCOMING_ORDERS)}
        </h3>

        <ul className='bg-white rounded-[1.25rem] border-[1.5px] border-border p-4 md:p-8 shadow-sm flex flex-col gap-6'>
          {isLoading ? (
            <div className='flex justify-center'>
              <Loading />
            </div>
          ) : pendingOrders && pendingOrders.length > 0 ? (
            pendingOrders.map(pendingOrder => {
              const pickupStart = formatTime(new Date(pendingOrder.reservedAt));
              const pickupEnd = formatTime(new Date(pendingOrder.expiresAt));
              const { hours, minutes, isExpired } = getTimeUntilExpiry(pendingOrder.expiresAt);

              const totalOrderPrice = pendingOrder.details.reduce(
                (acc, details) => acc + details.price * details.quantity,
                0
              );

              return (
                <li key={pendingOrder.id} className='border-b border-border p-3 last:border-b-0'>
                  <ul className='flex flex-col gap-4 sm:gap-6 mb-4'>
                    {pendingOrder.details.map(detail => (
                      <li key={detail.id} className='flex gap-4 sm:gap-8'>
                        <img
                          src={`${detail.itemPicture}`}
                          alt='Product image'
                          className='w-16 h-16 sm:w-22 sm:h-22 object-cover rounded-xl shrink-0'
                        />
                        <div className='min-w-0'>
                          <p className='font-playfair font-bold text-lg sm:text-2xl text-brand-green mb-1 sm:mb-2 truncate'>
                            {detail.itemName}
                          </p>
                          <p className='font-bold text-sm sm:text-base'>
                            {t(StringKey.QUANTITY)}:{' '}
                            <span className='font-normal'>{detail.quantity}</span>
                          </p>
                          <p className='font-bold text-sm sm:text-base'>
                            {t(StringKey.WEIGHT)}:{' '}
                            <span className='font-normal'>{detail.weight}</span>
                          </p>
                          <p className='font-bold text-sm sm:text-base'>
                            {t(StringKey.PRICE)}:{' '}
                            <span className='font-normal'>${detail.price}</span>
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className='flex flex-wrap items-center gap-2 mb-3'>
                    <Dialog
                      open={cancelDialogOrderId === pendingOrder.id}
                      onOpenChange={open => setCancelDialogOrderId(open ? pendingOrder.id : null)}
                    >
                      <DialogContent className='sm:max-w-[520px] bg-brand-cream'>
                        <DialogHeader>
                          <DialogTitle>{t(StringKey.CANCEL_ORDER)}</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>{t(StringKey.SURE_TO_CANCEL_ORDER)}</DialogDescription>
                        <DialogFooter>
                          <button
                            className='flex items-center gap-2 border border-destructive text-destructive px-4 py-3 rounded-full text-sm font-bold cursor-pointer'
                            onClick={() => handleOrderCancel(pendingOrder.id)}
                            disabled={isPending}
                          >
                            <CircleX />
                            <span>{t(StringKey.CANCEL)}</span>
                          </button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <button
                      className='flex items-center gap-2 border border-destructive text-destructive px-3 py-2 sm:px-4 sm:py-3 rounded-full text-sm font-bold cursor-pointer whitespace-nowrap'
                      onClick={() => setCancelDialogOrderId(pendingOrder.id)}
                      disabled={isPending}
                    >
                      <CircleX className='w-4 h-4' />
                      <span>{t(StringKey.CANCEL)}</span>
                    </button>

                    <div className='flex gap-1 items-center font-bold bg-brand-orange-light border border-brand-orange-border rounded-full px-3 py-2'>
                      <Timer className='text-brand-orange w-4 h-4' />
                      <span className='text-brand-orange text-sm'>
                        {isExpired ? t(StringKey.EXPIRED) : `${hours}h ${minutes}m`}
                      </span>
                    </div>

                    <Dialog
                      open={qrDialogOrderId === pendingOrder.id}
                      onOpenChange={open => setQrDialogOrderId(open ? pendingOrder.id : null)}
                    >
                      <DialogContent className='sm:max-w-[520px] bg-brand-cream'>
                        <DialogHeader>
                          <DialogTitle>{t(StringKey.QR_CODE)}</DialogTitle>
                        </DialogHeader>
                        <QRCode className='mx-auto' value={pendingOrder.qrCodeData} />
                      </DialogContent>
                    </Dialog>

                    <button
                      className='flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full text-sm font-bold text-white bg-brand-green hover:bg-brand-green-hover transition-colors cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap ml-auto'
                      onClick={() => setQrDialogOrderId(pendingOrder.id)}
                      disabled={isPending}
                    >
                      <QrCodeIcon className='w-4 h-4 sm:w-5 sm:h-5' />
                      <span>{t(StringKey.SHOW_QR)}</span>
                    </button>
                  </div>

                  <div className='flex flex-wrap justify-between items-center gap-2'>
                    <p className='flex items-center rounded-full gap-2 px-3 py-2 border border-border bg-muted text-sm'>
                      <Clock className='text-brand-green w-4 h-4 shrink-0' />
                      <span className='font-playfair'>{t(StringKey.PICKUP)}:</span>
                      <span className='text-brand-green font-bold'>
                        {pickupStart} - {pickupEnd}
                      </span>
                    </p>
                    <p className='font-bold text-2xl sm:text-3xl text-brand-green'>
                      ${totalOrderPrice}
                    </p>
                  </div>
                </li>
              );
            })
          ) : (
            <li className='text-center text-foreground/50 text-lg sm:text-2xl font-bold'>
              {t(StringKey.NO_UPCOMING_ORDERS)}
            </li>
          )}
        </ul>
      </div>

      <div>
        <h3 className='relative text-brand-green font-bold font-playfair text-xl sm:text-2xl pl-4 mb-6 before:content-[""] before:absolute before:left-0 before:top-0 before:h-full before:w-2 before:bg-brand-green before:rounded-full'>
          {t(StringKey.COMPLETED_ORDERS)}
        </h3>

        <ul className='bg-white rounded-[1.25rem] border-[1.5px] border-border p-4 md:p-8 shadow-sm flex flex-col gap-6'>
          {isLoading ? (
            <div className='flex justify-center'>
              <Loading />
            </div>
          ) : completedOrders.length > 0 ? (
            completedOrders.map(completedOrder => {
              const pickedUpAt = formatTime(new Date(completedOrder.completedAt));
              const pickedUpDate = new Date(completedOrder.completedAt).toLocaleDateString(
                'en-US',
                { month: 'short', day: 'numeric' }
              );

              const totalOrderPrice = completedOrder.details.reduce(
                (acc, details) => acc + details.price * details.quantity,
                0
              );

              return (
                <li key={completedOrder.id} className='border-b border-border p-3 last:border-b-0'>
                  <div className='flex justify-between items-start gap-3'>
                    <ul className='flex flex-col gap-4 sm:gap-6 mb-3 min-w-0 flex-1'>
                      {completedOrder.details.map(detail => (
                        <li key={detail.id} className='flex gap-4 sm:gap-8'>
                          <img
                            src={detail.itemPicture}
                            alt='Product image'
                            className='w-16 h-16 sm:w-22 sm:h-22 object-cover rounded-xl shrink-0'
                          />
                          <div className='min-w-0'>
                            <p className='font-playfair font-bold text-lg sm:text-2xl text-brand-green mb-1 sm:mb-2 truncate'>
                              {detail.itemName}
                            </p>
                            <p className='font-bold text-sm sm:text-base'>
                              {t(StringKey.QUANTITY)}:{' '}
                              <span className='font-normal'>{detail.quantity}</span>
                            </p>
                            <p className='font-bold text-sm sm:text-base'>
                              {t(StringKey.WEIGHT)}:{' '}
                              <span className='font-normal'>{detail.weight}</span>
                            </p>
                            <p className='font-bold text-sm sm:text-base'>
                              {t(StringKey.PRICE)}:{' '}
                              <span className='font-normal'>${detail.price}</span>
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className='flex flex-col items-end gap-2 shrink-0'>
                      <span className='flex items-center gap-1.5 bg-brand-status-success-bg border border-brand-status-success-border rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold text-brand-status-success-text whitespace-nowrap'>
                        <span className='w-2 h-2 rounded-full bg-brand-green shrink-0' />
                        {t(StringKey.COMPLETED)}
                      </span>
                      <p className='font-bold text-2xl sm:text-3xl text-brand-green'>
                        ${totalOrderPrice}
                      </p>
                    </div>
                  </div>

                  <div className='flex justify-end items-center mt-1'>
                    <p className='flex items-center gap-1.5 sm:gap-2 bg-brand-status-success-bg border border-brand-status-success-border rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold text-brand-status-success-text'>
                      <CheckCircle2 className='w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0' />
                      <span>
                        {t(StringKey.PICKED_UP)} · {pickedUpDate}, {pickedUpAt}
                      </span>
                    </p>
                  </div>
                </li>
              );
            })
          ) : (
            <li className='text-center text-foreground/50 text-lg sm:text-2xl font-bold'>
              {t(StringKey.NO_COMPLETED_ORDERS)}
            </li>
          )}
        </ul>
      </div>

      <div className='mb-6'>
        <Accordion
          type='single'
          collapsible
          defaultValue='item-1'
          className='bg-white rounded-[1.25rem] border-[1.5px] border-border p-4 md:p-8 shadow-sm flex flex-col gap-6'
        >
          <AccordionItem value='item-1'>
            <AccordionTrigger className='text-muted-foreground font-bold text-base sm:text-xl'>
              <div className='flex gap-2 items-center'>
                <CircleX className='w-5 h-5 shrink-0' />
                <span>
                  {t(StringKey.CANCELLED_OR_EXPIRED_ORDERS)} ({cancelledOrExpiredOrders.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className='bg-white rounded-[1.25rem] border-[1.5px] border-border p-4 md:p-8 shadow-sm flex flex-col gap-6'>
                {isLoading ? (
                  <div className='flex justify-center'>
                    <Loading />
                  </div>
                ) : cancelledOrExpiredOrders.length > 0 ? (
                  cancelledOrExpiredOrders.map(cancelledOrder => {
                    const totalOrderPrice = cancelledOrder.details.reduce(
                      (acc, details) => acc + details.price * details.quantity,
                      0
                    );
                    const isCancelled = cancelledOrder.orderStatus === OrderStatus.CANCELLED;

                    return (
                      <li
                        key={cancelledOrder.id}
                        className='border-b border-border p-3 last:border-b-0'
                      >
                        <div className='flex justify-between items-start gap-3'>
                          <ul className='flex flex-col gap-4 sm:gap-6 mb-3 min-w-0 flex-1'>
                            {cancelledOrder.details.map(detail => (
                              <li key={detail.id} className='flex gap-4 sm:gap-8'>
                                <img
                                  src={detail.itemPicture}
                                  alt='Product image'
                                  className='w-16 h-16 sm:w-22 sm:h-22 object-cover rounded-xl shrink-0'
                                />
                                <div className='min-w-0'>
                                  <p className='font-playfair font-bold text-lg sm:text-2xl text-brand-green mb-1 sm:mb-2 truncate'>
                                    {detail.itemName}
                                  </p>
                                  <p className='font-bold text-sm sm:text-base'>
                                    {t(StringKey.QUANTITY)}:{' '}
                                    <span className='font-normal'>{detail.quantity}</span>
                                  </p>
                                  <p className='font-bold text-sm sm:text-base'>
                                    {t(StringKey.WEIGHT)}:{' '}
                                    <span className='font-normal'>{detail.weight}</span>
                                  </p>
                                  <p className='font-bold text-sm sm:text-base'>
                                    {t(StringKey.PRICE)}:{' '}
                                    <span className='font-normal'>${detail.price}</span>
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <div className='flex flex-col items-end gap-2 shrink-0'>
                            <span
                              className={cn(
                                'flex items-center gap-1.5 border rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap',
                                isCancelled
                                  ? 'bg-destructive/10 border-destructive text-destructive'
                                  : 'bg-brand-orange-light border-brand-orange-border text-brand-orange'
                              )}
                            >
                              <span
                                className={cn(
                                  'w-2 h-2 rounded-full shrink-0',
                                  isCancelled ? 'bg-destructive' : 'bg-brand-orange'
                                )}
                              />
                              {t(isCancelled ? StringKey.CANCELLED : StringKey.EXPIRED)}
                            </span>
                            <p className='font-bold text-2xl sm:text-3xl text-brand-green'>
                              ${totalOrderPrice}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className='text-center text-foreground/50 text-lg sm:text-2xl font-bold'>
                    {t(StringKey.NO_CANCELLED_OR_EXPIRED_ORDERS)}
                  </li>
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default UserOrders;
