import { Bell, Map, Tag } from 'lucide-react';
import logoUrl from '@/assets/NomNomSave-Logo.svg';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

interface RegistrationLeftPanelProps {
  accountType: 'buyer' | 'business';
}

export const RegistrationLeftPanel = ({ accountType }: RegistrationLeftPanelProps) => {
  const { t } = useTranslation();

  const features = [
    { icon: Tag, label: t(StringKey.FEATURE_DISCOUNTS_SHORT) },
    { icon: Bell, label: t(StringKey.FEATURE_REAL_TIME_SHORT) },
    { icon: Map, label: t(StringKey.FEATURE_MAP) },
  ];

  return (
    <div
      className='hidden md:flex flex-col w-2/5 min-w-[400px] min-h-screen relative overflow-hidden'
      style={{
        background: 'linear-gradient(165deg, var(--brand-green) 0%, oklch(0.30 0.08 154) 100%)',
      }}
    >
      <div className='absolute inset-0 pointer-events-none' aria-hidden='true'>
        <div
          className='absolute rounded-full'
          style={{
            width: '480px',
            height: '480px',
            top: '50%',
            left: '50%',
            transform: 'translate(-30%, -55%)',
            background: 'oklch(1 0 0 / 4%)',
          }}
        />
        <div
          className='absolute rounded-full'
          style={{
            width: '320px',
            height: '320px',
            top: '50%',
            left: '50%',
            transform: 'translate(10%, -30%)',
            background: 'oklch(1 0 0 / 5%)',
          }}
        />
      </div>

      <div className='flex-1 flex flex-col justify-center px-14 py-16 relative z-10'>
        <div className='flex flex-col gap-10 '>
          <img src={logoUrl} alt='NomNomSave' className='w-72 h-auto -ml-15' />

          <h2 className='text-white font-bold text-[3.25rem] leading-[1.15]'>
            {accountType === 'buyer'
              ? t(StringKey.JOIN_COMMUNITY_BUYER)
                  .split(' ')
                  .reduce<React.ReactNode[]>((acc, word, i, arr) => {
                    acc.push(word);
                    if (i === 1) acc.push(<br key={i} />);
                    else if (i < arr.length - 1) acc.push(' ');
                    return acc;
                  }, [])
              : t(StringKey.JOIN_COMMUNITY_BUSINESS)
                  .split(' ')
                  .reduce<React.ReactNode[]>((acc, word, i) => {
                    acc.push(word);
                    if (i === 1 || i === 3) acc.push(<br key={i} />);
                    else acc.push(' ');
                    return acc;
                  }, [])}
          </h2>

          <ul className='flex flex-col gap-5'>
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className='flex items-center gap-4 text-white text-base'>
                <span
                  className='flex items-center justify-center w-11 h-11 rounded-xl shrink-0'
                  style={{ background: 'oklch(1 0 0 / 15%)' }}
                >
                  <Icon size={20} className='text-white' />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
