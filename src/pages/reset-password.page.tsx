import { useState } from 'react';
import { ShieldCheck, LockKeyhole } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/auth.store';
import { LoginLeftPanel } from '@/components/login/login-left-panel.component';
import { ResetPasswordForm } from '@/components/forgot-password/reset-password-form.component';

type Step = 'code' | 'password';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const email = useAuthStore(s => s.pendingResetEmail);
  const [step, setStep] = useState<Step>('code');

  if (!email) {
    void navigate({ to: '/forgot-password' });
    return null;
  }

  const maskedEmail = email.replace(
    /(.{2})(.*)(@.*)/,
    (_: string, a: string, b: string, c: string) => a + b.replace(/./g, '•') + c
  );

  return (
    <div className='flex min-h-screen bg-(--brand-cream)'>
      <LoginLeftPanel />

      {/* Right panel */}
      <div className='flex-1 overflow-y-auto'>
        <div className='min-h-full flex flex-col justify-center py-12 px-10'>
          <div className='max-w-[640px] mx-auto w-full'>
            {/* Icon — changes per step */}
            <div
              className='flex items-center justify-center w-16 h-16 rounded-2xl mb-8'
              style={{ background: 'oklch(0.94 0.025 154)' }}
            >
              {step === 'code' ? (
                <ShieldCheck size={28} style={{ color: 'var(--brand-green)' }} />
              ) : (
                <LockKeyhole size={28} style={{ color: 'var(--brand-green)' }} />
              )}
            </div>

            <h1 className='text-[2.5rem] font-bold text-foreground mb-3'>
              {step === 'code' ? 'Verify reset code' : 'Set new password'}
            </h1>
            <p className='text-muted-foreground text-base mb-10 leading-relaxed'>
              {step === 'code' ? (
                <>
                  Enter the 4-digit code sent to{' '}
                  <span className='font-semibold text-foreground'>{maskedEmail}</span>.
                </>
              ) : (
                'Choose a strong password for your account.'
              )}
            </p>

            <ResetPasswordForm email={email} onStepChange={setStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
