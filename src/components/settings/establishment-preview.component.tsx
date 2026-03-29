import { MapPin } from 'lucide-react';
import { useEstablishmentStore } from '@/store/establishment.store';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

export const EstablishmentPreview = () => {
  const { t } = useTranslation();
  const profile = useEstablishmentStore(s => s.profile);

  return (
    <div className='bg-white rounded-3xl border-[1.5px] border-border p-6 shadow-sm'>
      <p className='text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2'>
        {t(StringKey.PREVIEW)}
      </p>
      <h3 className='text-[17px] font-bold font-playfair mb-4'>
        {t(StringKey.HOW_CUSTOMERS_SEE_YOU)}
      </h3>

      <div className='rounded-2xl overflow-hidden border border-border'>
        <div className='h-20 bg-gradient-to-br from-orange-100 via-brand-green-muted to-amber-100 overflow-hidden'>
          {profile?.banner ? (
            <img src={profile.banner} alt='' className='w-full h-full object-cover' />
          ) : null}
        </div>
        <div className='p-4'>
          <div className='flex items-start gap-2.5 -mt-7 mb-3'>
            <div className='w-11 h-11 rounded-xl bg-brand-green-muted border-[3px] border-white overflow-hidden flex items-center justify-center text-xl shrink-0'>
              {profile?.logo ? (
                <img src={profile.logo} alt='' className='w-full h-full object-cover' />
              ) : (
                '🏪'
              )}
            </div>
            <div className='pt-3.5'>
              <p className='text-sm font-bold'>{profile?.name ?? '—'}</p>
            </div>
          </div>
          <p className='text-xs text-foreground/55 leading-relaxed mb-3 line-clamp-3'>
            {profile?.description ?? '—'}
          </p>
          <div className='flex items-center gap-1.5 text-xs text-foreground/50'>
            <MapPin size={14} />
            {profile?.address ?? '—'}
          </div>
        </div>
      </div>
    </div>
  );
};
