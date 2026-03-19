import { Link } from '@tanstack/react-router';
import { LoginLeftPanel } from '@/components/login/login-left-panel.component';
import { LoginForm } from '@/components/login/login-form.component';

const LoginPage = () => {
  return (
    <div className='flex min-h-screen bg-(--brand-cream)'>
      <LoginLeftPanel />

      {/* Right panel */}
      <div className='flex-1 overflow-y-auto'>
        <div className='min-h-full flex flex-col justify-center py-12 px-10'>
          <div className='max-w-[640px] mx-auto w-full'>
            <h1 className='text-[2.5rem] font-bold text-foreground mb-10'>
              Log in to your account
            </h1>

            <LoginForm />

            <p className='text-center text-sm text-muted-foreground mt-7'>
              Don&apos;t have an account?{' '}
              <Link
                to='/register'
                className='font-bold text-(--brand-green) hover:text-(--brand-green-hover) transition-colors'
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
