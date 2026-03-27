import AvailableNow from '@/components/landing/available-now.component';
import HowItWorks from '@/components/landing/how-it-works.component';
import LandingPromo from '@/components/landing/landing-promo.component';

const HomePage = () => {
  return (
    <div className='bg-brand-cream px-6'>
      <LandingPromo />
      <HowItWorks />
      <AvailableNow />
    </div>
  );
};

export default HomePage;
