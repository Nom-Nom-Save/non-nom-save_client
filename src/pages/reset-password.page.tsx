import { useState } from 'react';
import { ShieldCheck, LockKeyhole } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/auth.store';
import { LoginLeftPanel } from '@/components/login/login-left-panel.component';
import { ResetPasswordForm } from '@/components/forgot-password/reset-password-form.component';
import { ResetPasswordStep } from '@/consts/auth.consts';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const email = useAuthStore(s => s.pendingResetEmail);
  const [step, setStep] = useState<ResetPasswordStep>(ResetPasswordStep.CODE);

  if (!email) {
    void navigate({ to: '/forgot-password' });
    return null;
  }

  const maskedEmail = email.replace(
    /(.{2})(.*)(@.*)/,
    (_: string, a: string, b: string, c: string) => a + b.replace(/./g, '•') + c
  );

  return (
    <div className='flex min-h-screen bg-brand-cream'>
      <LoginLeftPanel />

      <div className='flex-1 overflow-y-auto'>
        <div className='min-h-full flex flex-col justify-center py-12 px-10'>
          <div className='max-w-[640px] mx-auto w-full'>
            <div
              className='flex items-center justify-center w-16 h-16 rounded-2xl mb-8'
              style={{ background: 'oklch(0.94 0.025 154)' }}
            >
              {step === ResetPasswordStep.CODE ? (
                <ShieldCheck size={28} style={{ color: 'var(--brand-green)' }} />
              ) : (
                <LockKeyhole size={28} style={{ color: 'var(--brand-green)' }} />
              )}
            </div>

            <h1 className='text-[2.5rem] font-bold text-foreground mb-3'>
              {t(
                step === ResetPasswordStep.CODE
                  ? StringKey.VERIFY_RESET_CODE
                  : StringKey.SET_NEW_PASSWORD
              )}
            </h1>
            <p className='text-muted-foreground text-base mb-10 leading-relaxed'>
              {step === ResetPasswordStep.CODE ? (
                <>
                  {t(StringKey.ENTER_FOUR_DIGIT_CODE)}{' '}
                  <span className='font-semibold text-foreground'>{maskedEmail}</span>.
                </>
              ) : (
                t(StringKey.CHOOSE_A_STRONG_PASSWORD)
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
