import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  itemName: string;
}

export const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  itemName,
}: DeleteConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[400px] bg-brand-cream'>
        <DialogHeader>
          <DialogTitle>{t(StringKey.CONFIRM_DELETE)}</DialogTitle>
        </DialogHeader>

        <p className='text-sm text-muted-foreground'>
          {t(StringKey.DELETE_CONFIRMATION)}{' '}
          <span className='font-medium text-foreground'>{itemName}</span>?
        </p>

        <div className='flex gap-3 mt-4'>
          <Button
            type='button'
            variant='outline'
            className='flex-1 rounded-xl py-2.5 text-sm font-medium cursor-pointer'
            onClick={() => onOpenChange(false)}
          >
            {t(StringKey.CANCEL)}
          </Button>
          <Button
            type='button'
            variant='destructive'
            className='flex-1 rounded-xl py-2.5 text-sm font-medium cursor-pointer'
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? t(StringKey.DELETING) : t(StringKey.DELETE)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
