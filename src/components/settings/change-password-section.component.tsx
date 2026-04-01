import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';

export const ChangePasswordSection = () => {
  const { t } = useTranslation();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          {t(StringKey.CURRENT_PASSWORD)}
        </label>
        <div className='relative'>
          <Lock
            size={18}
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35'
          />
          <FormInput
            variant='settings'
            type={showOld ? 'text' : 'password'}
            disabled
            placeholder={t(StringKey.ENTER_CURRENT_PASSWORD)}
            className='bg-muted pl-11 pr-10'
          />
          <button
            type='button'
            onClick={() => setShowOld(!showOld)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40'
          >
            {showOld ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col gap-2'>
          <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
            {t(StringKey.NEW_PASSWORD)}
          </label>
          <div className='relative'>
            <FormInput
              variant='settings'
              type={showNew ? 'text' : 'password'}
              disabled
              placeholder={t(StringKey.PASSWORD_MIN_HINT)}
              className='bg-muted pr-10'
            />
            <button
              type='button'
              onClick={() => setShowNew(!showNew)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40'
            >
              {showNew ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
            {t(StringKey.CONFIRM_PASSWORD)}
          </label>
          <div className='relative'>
            <FormInput
              variant='settings'
              type={showConfirm ? 'text' : 'password'}
              disabled
              placeholder={t(StringKey.REPEAT_NEW_PASSWORD)}
              className='bg-muted pr-10'
            />
            <button
              type='button'
              onClick={() => setShowConfirm(!showConfirm)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40'
            >
              {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>
      </div>

      <Button type='button' variant='outline-pill' size='pill-sm' disabled className='self-start'>
        <Lock size={16} />
        {t(StringKey.UPDATE_PASSWORD)}
      </Button>
    </div>
  );
};
