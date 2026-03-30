import AvailableNow from '@/components/landing/available-now.component';
import HowItWorks from '@/components/landing/how-it-works.component';
import LandingPromo from '@/components/landing/landing-promo.component';

const HomePage = () => {
  return (
    <div className='px-6 min-h-screen bg-brand-cream'>
      <LandingPromo />
      <HowItWorks />
      <AvailableNow />
    </div>
  );
};

export default HomePage;
