import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { TemplateCard } from '@/components/templates/template-card.component';
import { CreateProductDialog } from '@/components/templates/create-product-dialog.component';
import { CreateBoxDialog } from '@/components/templates/create-box-dialog.component';
import { PublishDialog } from '@/components/templates/publish-dialog.component';
import { DeleteConfirmDialog } from '@/components/templates/delete-confirm-dialog.component';
import { useProductsQuery, useDeleteProductMutation } from '@/queries/product.queries';
import { useBoxesQuery, useDeleteBoxMutation } from '@/queries/box.queries';
import { useMenuItemsQuery } from '@/queries/menu.queries';
import type { ProductResponse } from '@/types/product.types';
import type { BoxResponse } from '@/types/box.types';
import { ItemType } from '@/types/menu.types';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

enum TemplateTab {
  PRODUCTS = 'products',
  BOXES = 'boxes',
}

const TemplatesPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TemplateTab>(TemplateTab.PRODUCTS);

  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [createBoxOpen, setCreateBoxOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [editingBox, setEditingBox] = useState<BoxResponse | null>(null);

  const [publishItem, setPublishItem] = useState<{
    id: string;
    type: ItemType;
    price: number;
    name: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
    type: 'product' | 'box';
  } | null>(null);

  const { data: products = [], isLoading: productsLoading } = useProductsQuery();
  const { data: boxes = [], isLoading: boxesLoading } = useBoxesQuery();
  const { data: menuData } = useMenuItemsQuery();
  const { mutate: deleteProduct, isPending: isDeletingProduct } = useDeleteProductMutation();
  const { mutate: deleteBox, isPending: isDeletingBox } = useDeleteBoxMutation();

  const publishedItemIds = new Set(menuData?.menu?.map(item => item.itemId) ?? []);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    const onSuccess = () => {
      toast.success(t(StringKey.DELETED_SUCCESSFULLY));
      setDeleteTarget(null);
    };
    const onError = (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(t(StringKey.FAILED_TO_DELETE), { id: 'delete-error' });
      }
    };

    if (deleteTarget.type === 'product') {
      deleteProduct(deleteTarget.id, { onSuccess, onError });
    } else {
      deleteBox(deleteTarget.id, { onSuccess, onError });
    }
  };

  const isLoading = activeTab === TemplateTab.PRODUCTS ? productsLoading : boxesLoading;
  const items = activeTab === TemplateTab.PRODUCTS ? products : boxes;

  return (
    <main className='max-w-[1320px] mx-auto px-4 py-6 sm:px-8 sm:py-10'>
      <div className='flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-start sm:mb-8'>
        <div>
          <h1 className='text-2xl sm:text-[2rem] font-bold font-playfair text-foreground mb-1.5'>
            {t(StringKey.TEMPLATES_LIBRARY)}
          </h1>
          <p className='text-sm text-foreground/50'>{t(StringKey.TEMPLATES_LIBRARY_DESCRIPTION)}</p>
        </div>
        <div className='flex gap-2 flex-wrap sm:flex-nowrap'>
          <Button
            type='button'
            variant='brand-outline'
            size='pill-sm'
            onClick={() => setCreateProductOpen(true)}
            className='flex-1 sm:flex-none'
          >
            <Plus size={18} />
            {t(StringKey.NEW_PRODUCT)}
          </Button>
          <Button
            type='button'
            variant='brand-outline'
            size='pill-sm'
            onClick={() => setCreateBoxOpen(true)}
            className='flex-1 sm:flex-none'
          >
            <Sparkles size={18} />
            {t(StringKey.NEW_BOX)}
          </Button>
        </div>
      </div>

      <div className='flex gap-1 mb-6 bg-white p-1 rounded-full border border-border w-fit'>
        <button
          type='button'
          onClick={() => setActiveTab(TemplateTab.PRODUCTS)}
          className={cn(
            'px-[26px] py-[9px] rounded-full text-sm font-semibold cursor-pointer transition-colors border-none',
            activeTab === TemplateTab.PRODUCTS
              ? 'bg-brand-green text-white font-bold'
              : 'bg-transparent text-foreground/50'
          )}
        >
          📦 {t(StringKey.PRODUCTS)} ({products.length})
        </button>
        <button
          type='button'
          onClick={() => setActiveTab(TemplateTab.BOXES)}
          className={cn(
            'px-[26px] py-[9px] rounded-full text-sm font-semibold cursor-pointer transition-colors border-none',
            activeTab === TemplateTab.BOXES
              ? 'bg-brand-green text-white font-bold'
              : 'bg-transparent text-foreground/50'
          )}
        >
          ✨ {t(StringKey.MAGIC_BOXES)} ({boxes.length})
        </button>
      </div>

      {isLoading ? (
        <div className='flex flex-col gap-2.5'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='h-[84px] rounded-[1.25rem] bg-white/60 animate-pulse' />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className='text-center py-16 text-foreground/50'>
          <p className='text-lg font-medium'>
            {activeTab === TemplateTab.PRODUCTS ? t(StringKey.NO_PRODUCTS) : t(StringKey.NO_BOXES)}
          </p>
          <p className='text-sm mt-1'>
            {activeTab === TemplateTab.PRODUCTS
              ? t(StringKey.CREATE_FIRST_PRODUCT)
              : t(StringKey.CREATE_FIRST_BOX)}
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-2.5'>
          {activeTab === TemplateTab.PRODUCTS
            ? products.map(product => (
                <TemplateCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  recommendedPrice={product.recommendedPrice}
                  types={product.types}
                  picture={product.picture}
                  weight={product.weight}
                  isPublished={publishedItemIds.has(product.id)}
                  onEdit={() => setEditingProduct(product)}
                  onPublish={() =>
                    setPublishItem({
                      id: product.id,
                      type: ItemType.PRODUCT,
                      price: product.recommendedPrice,
                      name: product.name,
                    })
                  }
                  onDelete={() =>
                    setDeleteTarget({ id: product.id, name: product.name, type: 'product' })
                  }
                />
              ))
            : boxes.map(box => (
                <TemplateCard
                  key={box.id}
                  id={box.id}
                  name={box.name}
                  description={box.description}
                  recommendedPrice={box.recommendedPrice}
                  types={box.types ?? []}
                  picture={box.picture}
                  isPublished={publishedItemIds.has(box.id)}
                  onEdit={() => setEditingBox(box)}
                  onPublish={() =>
                    setPublishItem({
                      id: box.id,
                      type: ItemType.BOX,
                      price: box.recommendedPrice,
                      name: box.name,
                    })
                  }
                  onDelete={() => setDeleteTarget({ id: box.id, name: box.name, type: 'box' })}
                />
              ))}
        </div>
      )}

      <CreateProductDialog
        open={createProductOpen || !!editingProduct}
        onOpenChange={open => {
          if (!open) {
            setCreateProductOpen(false);
            setEditingProduct(null);
          }
        }}
        editingProduct={editingProduct}
      />

      <CreateBoxDialog
        open={createBoxOpen || !!editingBox}
        onOpenChange={open => {
          if (!open) {
            setCreateBoxOpen(false);
            setEditingBox(null);
          }
        }}
        editingBox={editingBox}
      />

      {publishItem && (
        <PublishDialog
          open={!!publishItem}
          onOpenChange={open => {
            if (!open) setPublishItem(null);
          }}
          itemId={publishItem.id}
          itemType={publishItem.type}
          originalPrice={publishItem.price}
          itemName={publishItem.name}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        isPending={isDeletingProduct || isDeletingBox}
        itemName={deleteTarget?.name ?? ''}
      />
    </main>
  );
};

export default TemplatesPage;
