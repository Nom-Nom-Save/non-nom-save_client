import { ShoppingBag, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

export const ImpactStats = () => {
  const { t } = useTranslation();

  return (
    <div className='bg-white rounded-3xl border-[1.5px] border-border p-6 shadow-sm'>
      <p className='text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2'>
        {t(StringKey.IMPACT)}
      </p>
      <h3 className='text-[17px] font-bold font-playfair mb-5'>
        {t(StringKey.YOUR_IMPACT_TOGETHER)}
      </h3>
      <div className='grid grid-cols-2 gap-3'>
        <div className='p-4 bg-brand-cream rounded-[14px] text-center'>
          <ShoppingBag size={28} className='text-brand-green mx-auto mb-1.5' />
          <p className='text-[22px] font-black text-brand-green'>—</p>
          <p className='text-[11px] font-semibold text-foreground/50 uppercase tracking-wide'>
            {t(StringKey.BAGS_SOLD)}
          </p>
        </div>
        <div className='p-4 bg-brand-cream rounded-[14px] text-center'>
          <Leaf size={28} className='text-brand-green mx-auto mb-1.5' />
          <p className='text-[22px] font-black text-brand-green'>—</p>
          <p className='text-[11px] font-semibold text-foreground/50 uppercase tracking-wide'>
            {t(StringKey.FOOD_SAVED)}
          </p>
        </div>
      </div>
    </div>
  );
};
