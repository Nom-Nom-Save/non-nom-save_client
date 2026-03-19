import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Mail } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { VerifyEmailLeftPanel } from '@/components/verify-email/verify-email-left-panel.component';
import { VerifyEmailForm } from '@/components/verify-email/verify-email-form.component';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const email = useAuthStore(s => s.pendingVerificationEmail);

  if (!email) {
    void navigate({ to: '/register' });
    return null;
  }

  const maskedEmail = email.replace(
    /(.{2})(.*)(@.*)/,
    (_: string, a: string, b: string, c: string) => a + b.replace(/./g, '•') + c
  );

  return (
    <div className='flex min-h-screen bg-(--brand-cream)'>
      <VerifyEmailLeftPanel />

      {/* Right panel */}
      <div className='flex-1 overflow-y-auto'>
        <div className='min-h-full flex flex-col justify-center py-12 px-10'>
          <div className='max-w-[640px] mx-auto w-full'>
            <Link
              to='/register'
              className='inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-10'
            >
              <ArrowLeft size={16} />
              Back to registration
            </Link>

            {/* Icon */}
            <div
              className='flex items-center justify-center w-16 h-16 rounded-2xl mb-8'
              style={{ background: 'oklch(0.94 0.025 154)' }}
            >
              <Mail size={28} style={{ color: 'var(--brand-green)' }} />
            </div>

            <h1 className='text-[2.5rem] font-bold text-foreground mb-3'>Verify your email</h1>
            <p className='text-muted-foreground text-base mb-10 leading-relaxed'>
              We sent a 4-digit code to{' '}
              <span className='font-semibold text-foreground'>{maskedEmail}</span>.
              <br />
              Enter it below to activate your account.
            </p>

            <VerifyEmailForm email={email} />

            <p className='text-center text-sm text-muted-foreground mt-8'>
              Didn&apos;t receive the code?{' '}
              <button
                type='button'
                className='font-bold text-(--brand-green) hover:text-(--brand-green-hover) transition-colors cursor-pointer'
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
