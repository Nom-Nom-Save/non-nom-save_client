import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

const pad = (n: number) => String(n).padStart(2, '0');

const parseTime = (value: string) => {
  if (!value) return { h: 0, m: 0 };
  const [h, m] = value.split(':').map(Number);
  return { h: h ?? 0, m: Math.round((m ?? 0) / 5) * 5 };
};

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  disabled?: boolean;
  isHighlighted?: boolean;
}

export const TimePicker = ({ value, onChange, min, disabled, isHighlighted }: TimePickerProps) => {
  const { h, m } = parseTime(value);
  const minParsed = min ? parseTime(min) : null;

  const isHourDisabled = (hour: number) => {
    if (!minParsed) return false;
    return hour < minParsed.h;
  };

  const isMinuteDisabled = (minute: number) => {
    if (!minParsed) return false;
    if (h > minParsed.h) return false;
    return h === minParsed.h && minute <= minParsed.m;
  };

  const handleHour = (newH: number) => {
    onChange(`${pad(newH)}:${pad(m)}`);
  };

  const handleMinute = (newM: number) => {
    onChange(`${pad(h)}:${pad(newM)}`);
  };

  const selectClass = cn(
    'appearance-none rounded-lg border bg-white px-2 py-1.5 text-sm font-medium outline-none transition-colors text-center',
    isHighlighted
      ? 'border-brand-green focus:border-brand-green'
      : 'border-border focus:border-brand-green',
    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
  );

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-xl border-[1.5px] px-2.5 py-1.5 bg-brand-cream transition-colors',
        isHighlighted ? 'border-brand-green' : 'border-border',
        disabled && 'opacity-30'
      )}
    >
      <Clock size={13} className='text-foreground/40 shrink-0' />

      <select
        value={h}
        disabled={disabled}
        onChange={e => handleHour(Number(e.target.value))}
        className={selectClass}
      >
        {HOURS.map(hour => (
          <option key={hour} value={hour} disabled={isHourDisabled(hour)}>
            {pad(hour)}
          </option>
        ))}
      </select>

      <span className='text-foreground/40 font-bold text-sm'>:</span>

      <select
        value={m}
        disabled={disabled}
        onChange={e => handleMinute(Number(e.target.value))}
        className={selectClass}
      >
        {MINUTES.map(minute => (
          <option key={minute} value={minute} disabled={isMinuteDisabled(minute)}>
            {pad(minute)}
          </option>
        ))}
      </select>
    </div>
  );
};
