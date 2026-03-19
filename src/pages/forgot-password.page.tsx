import { KeyRound } from 'lucide-react';
import { LoginLeftPanel } from '@/components/login/login-left-panel.component';
import { ForgotPasswordForm } from '@/components/forgot-password/forgot-password-form.component';

const ForgotPasswordPage = () => {
  return (
    <div className='flex min-h-screen bg-(--brand-cream)'>
      <LoginLeftPanel />

      {/* Right panel */}
      <div className='flex-1 overflow-y-auto'>
        <div className='min-h-full flex flex-col justify-center py-12 px-10'>
          <div className='max-w-[640px] mx-auto w-full'>
            {/* Icon */}
            <div
              className='flex items-center justify-center w-16 h-16 rounded-2xl mb-8'
              style={{ background: 'oklch(0.94 0.025 154)' }}
            >
              <KeyRound size={28} style={{ color: 'var(--brand-green)' }} />
            </div>

            <h1 className='text-[2.5rem] font-bold text-foreground mb-3'>Forgot Password</h1>
            <p className='text-muted-foreground text-base mb-10 leading-relaxed'>
              No worries, it happens! Enter your email address and we&apos;ll send you a code to
              reset your password.
            </p>

            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
