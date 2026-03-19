import { create } from 'zustand';
import type { LoginType } from '@/types/auth.types';

interface AuthState {
  /** Email сохраняется после регистрации и передаётся на страницу верификации */
  pendingVerificationEmail: string | null;
  setPendingVerificationEmail: (email: string) => void;
  clearPendingVerificationEmail: () => void;

  /** Email сохраняется после forgot-password и передаётся на страницу reset-password */
  pendingResetEmail: string | null;
  setPendingResetEmail: (email: string) => void;
  clearPendingResetEmail: () => void;

  /** accessToken хранится в памяти; в localStorage только для persistence между вкладками */
  accessToken: string | null;
  loginType: LoginType | null;
  setAuth: (accessToken: string, loginType: LoginType) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  pendingVerificationEmail: null,
  setPendingVerificationEmail: email => set({ pendingVerificationEmail: email }),
  clearPendingVerificationEmail: () => set({ pendingVerificationEmail: null }),

  pendingResetEmail: null,
  setPendingResetEmail: email => set({ pendingResetEmail: email }),
  clearPendingResetEmail: () => set({ pendingResetEmail: null }),

  accessToken: localStorage.getItem('token'),
  loginType: localStorage.getItem('loginType') as LoginType | null,
  setAuth: (accessToken, loginType) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('loginType', loginType);
    set({ accessToken, loginType });
  },
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginType');
    set({ accessToken: null, loginType: null });
  },
}));
