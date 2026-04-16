import { createFileRoute, redirect } from '@tanstack/react-router';
import SubscriptionsPlansPage from '@/pages/subscriptions-plans.page';
import { useAuthStore } from '@/store/auth.store';

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? (match[2] ?? null) : null;
};

export const Route = createFileRoute('/subscriptions/plans')({
  beforeLoad: () => {
    const storedToken = localStorage.getItem('token');
    const cookieToken = getCookie('access_token');
    const token = storedToken ?? cookieToken;

    if (!token) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' });
    }

    // Token came from mobile WebView cookie — hydrate auth store
    if (!storedToken && cookieToken) {
      useAuthStore.getState().setAuth(cookieToken, 'user');
    }
  },
  component: SubscriptionsPlansPage,
});
