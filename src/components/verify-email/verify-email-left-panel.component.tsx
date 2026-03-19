import logoUrl from '@/assets/NomNomSave-Logo.svg';

export const VerifyEmailLeftPanel = () => {
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
            Almost
            <br />
            there!
          </h2>
          <p className='text-white/80 text-lg leading-relaxed max-w-[280px]'>
            Check your inbox — we&apos;ve sent a 4-digit code to confirm your email address.
          </p>
        </div>
      </div>
    </div>
  );
};
