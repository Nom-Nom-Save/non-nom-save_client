import { StringKey } from '@/consts/string-key.consts';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import bagIcon from '@/assets/bag.svg';
import firecrackerIcon from '@/assets/firecracker.svg';

const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <section className='py-10 font-playfair'>
      <h2 className='text-[3.25rem] text-center font-bold '>{t(StringKey.HOW_IT_WORKS)}</h2>
      <h4 className='text-muted-foreground font-lg text-center mb-8'>
        {t(StringKey.SUSTAINABLE_EATING)}
      </h4>

      <div className='flex flex-col gap-6 md:flex-row md:gap-10'>
        <div className='border-4 rounded-4xl bg-white text-center p-10 border-[#EAF0ED]'>
          <div className='w-24 h-24 bg-[#EEF8F3] rounded-full mx-auto mb-4 flex items-center justify-center'>
            <Search className='text-brand-green w-12 h-12' />
          </div>
          <h5 className='font-bold text-3xl mb-2'>{t(StringKey.BROWSE_OFFERS)}</h5>
          <p className='text-muted-foreground text-sm'>{t(StringKey.BROWSE_OFFERS_DESCRIPTION)}</p>
        </div>

        <div className='border-4 rounded-4xl bg-white text-center p-10 border-[#EAF0ED]'>
          <div className='w-24 h-24 bg-[#FEF6EF] rounded-full mx-auto mb-4 flex items-center justify-center'>
            <img src={bagIcon} alt='Bag Icon' className='w-12 h-12' />
          </div>
          <h5 className='font-bold text-3xl mb-2'>{t(StringKey.RESERVE_BAG)}</h5>
          <p className='text-muted-foreground text-sm'>{t(StringKey.RESERVE_BAG_DESCRIPTION)}</p>
        </div>

        <div className='border-4 rounded-4xl bg-white text-center p-10 border-[#EAF0ED]'>
          <div className='w-24 h-24 bg-[#FDF9F0] rounded-full mx-auto mb-4 flex items-center justify-center'>
            <img src={firecrackerIcon} alt='Firecracker Icon' className='w-12 h-12' />
          </div>
          <h5 className='font-bold text-3xl mb-2'>{t(StringKey.PICK_UP_AND_SAVE)}</h5>
          <p className='text-muted-foreground text-sm'>
            {t(StringKey.PICK_UP_AND_SAVE_DESCRIPTION)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
