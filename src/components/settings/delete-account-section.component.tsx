import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';

export const DeleteAccountSection = () => {
  const { t } = useTranslation();

  return (
    <div className='bg-white rounded-3xl border-[1.5px] border-destructive/30 p-8 shadow-sm'>
      <p className='text-[11px] font-bold tracking-[.18em] uppercase text-destructive mb-2'>
        {t(StringKey.DANGER_ZONE)}
      </p>
      <h2 className='text-xl font-bold font-playfair mb-2.5'>{t(StringKey.DELETE_ACCOUNT)}</h2>
      <p className='text-sm text-foreground/55 leading-relaxed mb-5'>
        {t(StringKey.DELETE_ESTABLISHMENT_WARNING)}
      </p>
      <Button type='button' variant='danger-outline' size='pill-sm' disabled className='self-start'>
        <Trash2 size={18} />
        {t(StringKey.DELETE_ESTABLISHMENT)}
      </Button>
    </div>
  );
};
