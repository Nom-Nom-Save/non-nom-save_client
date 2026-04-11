import { Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';

export const UnlockPremiumButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    void navigate({ to: '/subscriptions/plans' });
  };

  return (
    <Button variant='brand' size='settings' className='w-full' onClick={handleClick}>
      <Crown size={15} />
      {t(StringKey.UNLOCK_PREMIUM)}
    </Button>
  );
};
