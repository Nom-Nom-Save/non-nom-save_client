import { useState } from 'react';
import { toast } from 'sonner';
import { MenuItemCard } from '@/components/menu/menu-item-card.component';
import { EditMenuItemDialog } from '@/components/menu/edit-menu-item-dialog.component';
import { useMenuItemsQuery, useUpdateMenuStatusMutation } from '@/queries/menu.queries';
import { MenuStatus, ItemType } from '@/types/menu.types';
import type { MenuItemResponse } from '@/types/menu.types';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { cn } from '@/lib/utils';

enum MenuTab {
  PRODUCTS = 'products',
  BOXES = 'boxes',
}

const STATUS_FILTERS = [
  { value: 'all', labelKey: StringKey.ALL_STATUSES, dot: '' },
  { value: MenuStatus.ACTIVE, labelKey: StringKey.STATUS_ACTIVE, dot: 'bg-brand-green' },
  { value: MenuStatus.INACTIVE, labelKey: StringKey.STATUS_INACTIVE, dot: 'bg-amber-400' },
  { value: MenuStatus.SOLD_OUT, labelKey: StringKey.STATUS_SOLD_OUT, dot: 'bg-orange-400' },
] as const;

const MenuPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<MenuTab>(MenuTab.PRODUCTS);
  const [statusFilter, setStatusFilter] = useState<MenuStatus | 'all'>('all');
  const [editingItem, setEditingItem] = useState<MenuItemResponse | null>(null);

  const { data: menuData, isLoading } = useMenuItemsQuery();
  const { mutate: updateStatus } = useUpdateMenuStatusMutation();

  const items = menuData?.menu ?? [];

  const productItems = items.filter(i => i.itemType === ItemType.PRODUCT);
  const boxItems = items.filter(i => i.itemType === ItemType.BOX);
  const currentItems = activeTab === MenuTab.PRODUCTS ? productItems : boxItems;

  const filteredItems =
    statusFilter === 'all'
      ? currentItems
      : currentItems.filter(item => item.status === statusFilter);

  const activeCount = items.filter(i => i.status === MenuStatus.ACTIVE).length;
  const inactiveCount = items.filter(i => i.status === MenuStatus.INACTIVE).length;
  const soldOutCount = items.filter(i => i.status === MenuStatus.SOLD_OUT).length;

  const handleStatusUpdate = (id: string, status: MenuStatus, successKey: StringKey) => {
    updateStatus(
      { id, data: { status } },
      {
        onSuccess: () => toast.success(t(successKey)),
        onError: (error: Error) => {
          if (error instanceof ApiError) {
            toast.error(t(StringKey.FAILED_TO_UPDATE_STATUS), { id: 'status-error' });
          }
        },
      }
    );
  };

  const handlePause = (id: string) =>
    handleStatusUpdate(id, MenuStatus.INACTIVE, StringKey.ITEM_PAUSED);
  const handleResume = (id: string) =>
    handleStatusUpdate(id, MenuStatus.ACTIVE, StringKey.ITEM_RESUMED);
  const handleDeactivate = (id: string) =>
    handleStatusUpdate(id, MenuStatus.INACTIVE, StringKey.ITEM_DEACTIVATED);

  return (
    <main className='max-w-[1320px] mx-auto px-4 py-6 sm:px-8 sm:py-10'>
      <div className='flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-start sm:mb-8'>
        <div>
          <h1 className='text-2xl sm:text-[2rem] font-bold font-playfair text-foreground mb-1.5'>
            {t(StringKey.ACTIVE_MENU)}
          </h1>
          <p className='text-sm text-foreground/50'>{t(StringKey.ACTIVE_MENU_DESCRIPTION)}</p>
        </div>

        <div className='flex gap-2 flex-wrap items-center'>
          <SummaryPill
            dotColor='bg-brand-green'
            count={activeCount}
            label={t(StringKey.STATUS_ACTIVE)}
          />
          <SummaryPill
            dotColor='bg-amber-400'
            count={inactiveCount}
            label={t(StringKey.STATUS_INACTIVE)}
          />
          <SummaryPill
            dotColor='bg-orange-400'
            count={soldOutCount}
            label={t(StringKey.STATUS_SOLD_OUT)}
          />
        </div>
      </div>

      <div className='flex gap-1 mb-6 bg-white p-1 rounded-full border border-border w-fit'>
        <button
          type='button'
          onClick={() => setActiveTab(MenuTab.PRODUCTS)}
          className={cn(
            'px-[26px] py-[9px] rounded-full text-sm font-semibold cursor-pointer transition-colors border-none',
            activeTab === MenuTab.PRODUCTS
              ? 'bg-brand-green text-white font-bold'
              : 'bg-transparent text-foreground/50'
          )}
        >
          📦 {t(StringKey.PRODUCTS)} ({productItems.length})
        </button>
        <button
          type='button'
          onClick={() => setActiveTab(MenuTab.BOXES)}
          className={cn(
            'px-[26px] py-[9px] rounded-full text-sm font-semibold cursor-pointer transition-colors border-none',
            activeTab === MenuTab.BOXES
              ? 'bg-brand-green text-white font-bold'
              : 'bg-transparent text-foreground/50'
          )}
        >
          ✨ {t(StringKey.MAGIC_BOXES)} ({boxItems.length})
        </button>
      </div>

      <div className='flex gap-2 mb-7 flex-wrap'>
        {STATUS_FILTERS.map(filter => (
          <button
            key={filter.value}
            type='button'
            onClick={() => setStatusFilter(filter.value)}
            className={cn(
              'px-4 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer transition-colors border-none',
              statusFilter === filter.value
                ? 'bg-brand-green text-white font-bold'
                : 'bg-white border-[1.5px] border-border text-foreground'
            )}
          >
            {filter.dot && (
              <span className={cn('inline-block w-2 h-2 rounded-full mr-1.5', filter.dot)} />
            )}
            {t(filter.labelKey)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className='flex flex-col gap-2.5'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='h-[84px] rounded-[1.25rem] bg-white/60 animate-pulse' />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className='text-center py-16 text-foreground/50'>
          <p className='text-lg font-medium'>{t(StringKey.NO_MENU_ITEMS)}</p>
          <p className='text-sm mt-1'>{t(StringKey.PUBLISH_FROM_TEMPLATES)}</p>
        </div>
      ) : (
        <div className='flex flex-col gap-2.5'>
          {filteredItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onPause={handlePause}
              onResume={handleResume}
              onDeactivate={handleDeactivate}
              onEdit={setEditingItem}
            />
          ))}
        </div>
      )}

      <EditMenuItemDialog
        open={!!editingItem}
        onOpenChange={open => {
          if (!open) setEditingItem(null);
        }}
        menuItem={editingItem}
      />
    </main>
  );
};

interface SummaryPillProps {
  dotColor: string;
  count: number;
  label: string;
}

const SummaryPill = ({ dotColor, count, label }: SummaryPillProps) => (
  <div className='flex items-center gap-2 px-[18px] py-2.5 rounded-full bg-white border-[1.5px] border-border'>
    <span className={cn('w-2 h-2 rounded-full', dotColor)} />
    <span className='text-[13px] font-bold'>
      {count} {label}
    </span>
  </div>
);

export default MenuPage;
