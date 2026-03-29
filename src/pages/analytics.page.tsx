import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

const AnalyticsPage = () => {
  const { t } = useTranslation();

  return (
    <div className='max-w-[1320px] mx-auto px-4 py-6 sm:px-8 sm:py-10'>
      <h1 className='text-2xl sm:text-[2rem] font-bold font-playfair text-foreground mb-2'>
        {t(StringKey.ANALYTICS_TITLE)}
      </h1>

      <div className='flex flex-col items-center justify-center py-12 sm:py-24 text-center'>
        <div className='w-16 h-16 rounded-full bg-brand-green-muted flex items-center justify-center mb-6'>
          <BarChart3 size={32} className='text-brand-green' />
        </div>
        <p className='text-lg font-semibold text-foreground mb-2'>{t(StringKey.COMING_SOON)}</p>
        <p className='text-sm text-foreground/50 max-w-md'>{t(StringKey.ANALYTICS_COMING_SOON)}</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
