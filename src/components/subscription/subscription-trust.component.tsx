import { useTranslation } from 'react-i18next';
import { Lock, X, RefreshCw, Leaf } from 'lucide-react';
import { StringKey } from '@/consts/string-key.consts';

const trustItems = [
  { icon: Lock, key: StringKey.TRUST_SECURE_PAYMENTS },
  { icon: X, key: StringKey.TRUST_CANCEL_ANYTIME },
  { icon: RefreshCw, key: StringKey.TRUST_AUTO_RENEWS },
  { icon: Leaf, key: StringKey.TRUST_ZERO_WASTE },
] as const;

export const SubscriptionTrust = () => {
  const { t } = useTranslation();

  return (
    <div className='flex justify-center gap-10 mt-14 flex-wrap'>
      {trustItems.map(({ icon: Icon, key }) => (
        <div key={key} className='flex items-center gap-2.5'>
          <Icon size={22} className='text-brand-green shrink-0' />
          <span className='text-sm font-semibold text-muted-foreground'>{t(key)}</span>
        </div>
      ))}
    </div>
  );
};
