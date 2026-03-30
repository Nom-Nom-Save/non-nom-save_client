import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({ checked = false, onChange, disabled = false }: ToggleProps) => {
  const [isOn, setIsOn] = useState(checked);

  const handleToggle = () => {
    if (disabled) {
      return;
    }

    const next = !isOn;
    setIsOn(next);
    onChange?.(next);
  };

  return (
    <button
      type='button'
      onClick={handleToggle}
      className={cn(
        'relative w-16 h-8 rounded-full border-[1.5px] transition-colors duration-250 cursor-pointer shrink-0',
        isOn ? 'bg-brand-green border-brand-green' : 'bg-gray-200 border-gray-300',
        disabled && 'disabled:opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white border-[1.5px] shadow-sm transition-transform duration-250',
          isOn ? 'translate-x-8 border-black/10' : 'translate-x-0 border-gray-300'
        )}
      />
    </button>
  );
};

export default Toggle;
