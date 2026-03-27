import { StringKey } from '@/consts/string-key.consts';
import { useTranslation } from 'react-i18next';
import orangePattern from '@/assets/landing-orange-pattern.svg';
import greenPattern from '@/assets/landing-green-pattern.svg';
import googlePlayLogo from '@/assets/google-play-logo.svg';
import phoneImage from '@/assets/phone.png';
import phoneProductImage from '@/assets/phone-product.png';

const LandingPromo = () => {
  const { t } = useTranslation();

  return (
    <section className='flex flex-col lg:flex-row justify-between gap-6 pt-3'>
      <div className='flex flex-col gap-1 mb-4 mt-10 lg:mt-0 justify-center lg:max-w-[500px]'>
        <h2 className='font-playfair text-4xl sm:text-[3.25rem] leading-[1.15] font-bold mb-6'>
          {t(StringKey.GOOD_FOOD)},{' '}
          <span className='text-brand-green block italic'>{t(StringKey.GREAT_PRICES)}.</span>
        </h2>
        <h4 className='font-playfair text-muted-foreground'>
          {t(StringKey.RESCUE_FOOD_DESCRIPTION)}
        </h4>
      </div>
      <div className='bg-[#F4F9F4] lg:w-1/2 rounded-4xl border-white border-2 relative p-6 overflow-hidden'>
        <div className='flex flex-col sm:flex-row'>
          <div className='flex flex-col gap-1 mb-4 justify-center z-10'>
            <h3 className='text-brand-green text-3xl font-playfair font-medium'>
              {t(StringKey.NOM_NOM)}
            </h3>
            <h3 className='text-brand-green text-3xl font-playfair font-medium'>
              {t(StringKey.SAVE)}
            </h3>
            <h3 className='text-brand-green text-3xl font-playfair font-medium'>
              {t(StringKey.ON_THE_GO)}
            </h3>
            <p className='text-muted-foreground mb-8'>{t(StringKey.MOBILE_PROMO_DESCRIPTION)}</p>
            <button className='flex items-center gap-4 pl-4 pr-8 py-2.5 cursor-pointer bg-black text-white rounded-md w-fit'>
              <img src={googlePlayLogo} alt='Google Play Logo' />
              <div>
                <p className='text-xs text-muted-foreground text-start'>{t(StringKey.GET_IN_ON)}</p>
                <p className='font-medium'>{t(StringKey.GOOGLE_PLAY)}</p>
              </div>
            </button>
          </div>
          <div className='relative z-10 flex justify-center sm:justify-end mt-6 sm:mt-0'>
            <img src={phoneImage} alt='Phone Image' className='w-64 sm:w-80 lg:w-96 h-auto' />
            <img
              src={phoneProductImage}
              alt='Product Image'
              className='absolute bottom-0 right-0'
            />
          </div>
        </div>
        <img src={orangePattern} className='absolute top-0 right-0 pointer-events-none' />
        <img src={greenPattern} className='absolute bottom-0 left-0 pointer-events-none' />
      </div>
    </section>
  );
};

export default LandingPromo;
