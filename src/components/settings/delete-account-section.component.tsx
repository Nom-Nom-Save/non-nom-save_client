import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

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
      <button
        type='button'
        disabled
        className='flex items-center gap-2 px-6 py-[11px] rounded-full bg-white border-[1.5px] border-destructive/30 text-destructive text-sm font-bold cursor-not-allowed opacity-60 transition-colors'
      >
        <Trash2 size={18} />
        {t(StringKey.DELETE_ESTABLISHMENT)}
      </button>
    </div>
  );
};
