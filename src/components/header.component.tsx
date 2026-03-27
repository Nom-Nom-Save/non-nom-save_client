import { StringKey } from '@/consts/string-key.consts';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import logoUrl from '@/assets/NomNomSave-Logo.svg';

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className='flex justify-between items-center bg-brand-cream py-5 px-6 border-b border-border'>
      <div className='flex gap-2 items-center'>
        <img src={logoUrl} alt='NomNomSave' className='w-12 h-auto' />
        <h1 className='text-2xl text-brand-green font-playfair font-bold'>
          {t(StringKey.NOM_NOM_SAVE)}
        </h1>
      </div>
      <div className='flex flex-col sm:flex-row gap-3 items-center'>
        <Link to='/register'>
          <button
            type='button'
            className='rounded-xl py-2 px-5 text-md font-semibold text-brand-green border border-brand-green transition-colors cursor-pointer hover:bg-brand-green hover:text-white'
          >
            {t(StringKey.LOG_IN)}
          </button>
        </Link>
        <Link to='/login'>
          <button
            type='button'
            className='rounded-xl py-2 px-5 text-md font-semibold text-white transition-colors cursor-pointer bg-brand-green hover:bg-brand-green-hover'
          >
            {t(StringKey.SING_IN)}
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
