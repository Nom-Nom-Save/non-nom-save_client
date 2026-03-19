import { Tag, Zap, Map } from 'lucide-react';
import logoUrl from '@/assets/NomNomSave-Logo.svg';

const features = [
  { icon: Tag, label: '70% Discounts on Surplus' },
  { icon: Zap, label: 'Real-time Local Offers' },
  { icon: Map, label: 'Premium Map Access' },
];

export const LoginLeftPanel = () => {
  return (
    <div
      className='hidden md:flex flex-col w-2/5 min-w-[400px] min-h-screen relative overflow-hidden'
      style={{
        background: 'linear-gradient(165deg, var(--brand-green) 0%, oklch(0.30 0.08 154) 100%)',
      }}
    >
      {/* Decorative circles */}
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
        <div className='flex flex-col gap-10'>
          <img src={logoUrl} alt='NomNomSave' className='w-72 h-auto -ml-15' />

          <h2 className='text-white font-bold text-[3.25rem] leading-[1.15]'>
            Welcome
            <br />
            Back
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

          <p className='text-white/50 text-sm italic'>
            &ldquo;Saving the planet, one delicious bite at a time.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
