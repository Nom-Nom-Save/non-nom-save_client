import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

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
          <button
            type='button'
            onClick={() => onOpenChange(false)}
            className='flex-1 rounded-xl border border-border py-2.5 bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer'
          >
            {t(StringKey.CANCEL)}
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={isPending}
            className='flex-1 rounded-xl py-2.5 text-sm font-medium text-white bg-destructive hover:bg-destructive/90 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {isPending ? t(StringKey.DELETING) : t(StringKey.DELETE)}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
