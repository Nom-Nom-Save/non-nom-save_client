import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface RemoveCartItemDialogProps {
  itemName: string | undefined;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RemoveCartItemDialog: FC<RemoveCartItemDialogProps> = ({
  itemName,
  open,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[520px] bg-brand-cream mx-4 sm:mx-auto'>
        <DialogHeader>
          <DialogTitle>{t(StringKey.REMOVE_FROM_CART)}</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <p className='mb-2'>{t(StringKey.SURE_YOU_WANT_TO_REMOVE_FROM_CART)}</p>
          {itemName && (
            <div className='border-l-2 border-muted-foreground/30 pl-3 py-1 bg-muted/40 rounded-r-lg'>
              <p className='text-sm text-muted-foreground italic'>{itemName}</p>
            </div>
          )}
        </DialogDescription>

        <DialogFooter className='flex-col-reverse sm:flex-row gap-2'>
          <DialogClose asChild>
            <Button
              type='button'
              variant='outline'
              className='flex-1 rounded-xl py-2.5 text-sm font-medium cursor-pointer'
            >
              {t(StringKey.CANCEL)}
            </Button>
          </DialogClose>

          <Button
            type='button'
            variant='destructive'
            className='flex-1 rounded-xl py-2.5 text-sm font-medium cursor-pointer'
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {t(StringKey.REMOVE)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveCartItemDialog;
