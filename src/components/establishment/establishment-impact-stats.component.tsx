import { StringKey } from '@/consts/string-key.consts';
import type { EstablishmentProfile } from '@/types/establishment.types';
import { Leaf, MapPin, ShoppingBag } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

interface EstablishmentImpactStatsProps {
  establishment: EstablishmentProfile;
}

const EstablishmentImpactStats: FC<EstablishmentImpactStatsProps> = ({ establishment }) => {
  const { t } = useTranslation();

  return (
    <aside className='flex flex-col gap-6 lg:sticky lg:top-[90px]'>
      <div className='bg-white rounded-3xl p-6 shadow-sm'>
        <h3 className='text-[17px] font-bold font-playfair mb-5'>{t(StringKey.LOCATION)}</h3>
        <div className='rounded-2xl overflow-hidden mb-4 border border-border'>
          <iframe
            width='100%'
            height='200'
            style={{ border: 0 }}
            loading='lazy'
            src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_EMBEDED_MAPS_KEY}&q=${establishment.latitude},${establishment.longitude}`}
          ></iframe>
        </div>
        <div className='flex items-center gap-1.5 text-xs text-foreground/50'>
          <MapPin size={14} />
          <span>{establishment.address ?? '—'}</span>
        </div>
      </div>
      <div className='bg-white rounded-3xl p-6 shadow-sm'>
        <h3 className='text-[17px] font-bold font-playfair mb-5'>{t(StringKey.IMPACT_TOGETHER)}</h3>
        <div className='grid grid-cols-2 gap-3'>
          <div className='p-4 bg-brand-green/5 border border-border rounded-[14px] text-center'>
            <div className='border border-border rounded-full p-2.5 bg-white w-fit mx-auto mb-1.5'>
              <ShoppingBag size={28} className='text-brand-green' />
            </div>
            <p className='text-[22px] font-black text-brand-green'>{establishment.bagsSold}</p>
            <p className='text-[11px] font-semibold text-foreground/50 uppercase tracking-wide'>
              {t(StringKey.BAGS_SOLD)}
            </p>
          </div>
          <div className='p-4 bg-[#52B788]/5 border border-border rounded-[14px] text-center'>
            <div className='border border-border rounded-full p-2.5 bg-white w-fit mx-auto mb-1.5'>
              <Leaf size={28} className='text-brand-green' />
            </div>

            <p className='text-[22px] font-black text-brand-green'>{establishment.foodSaved}</p>
            <p className='text-[11px] font-semibold text-foreground/50 uppercase tracking-wide'>
              {t(StringKey.FOOD_SAVED)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default EstablishmentImpactStats;
