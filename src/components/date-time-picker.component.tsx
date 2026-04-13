import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAYS_OF_WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  min?: string;
  max?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

const parseValue = (value: string) => {
  if (!value) return { date: null, h: 0, m: 0 };
  const [datePart, timePart = '00:00'] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [h, m] = timePart.split(':').map(Number);
  return { date: new Date(year, month - 1, day), h, m: Math.round(m / 5) * 5 };
};

const toValue = (date: Date, h: number, m: number) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(h)}:${pad(m)}`;

const formatDisplay = (value: string) => {
  const { date, h, m } = parseValue(value);
  if (!date) return '';
  return `${pad(date.getDate())} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${pad(h)}:${pad(m)}`;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const DateTimePicker = ({ value, onChange, hasError, min, max }: DateTimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = parseValue(value);
  const fallback = new Date();

  const [viewMonth, setViewMonth] = useState(parsed.date?.getMonth() ?? fallback.getMonth());
  const [viewYear, setViewYear] = useState(parsed.date?.getFullYear() ?? fallback.getFullYear());
  const [selDate, setSelDate] = useState<Date | null>(parsed.date);
  const [selH, setSelH] = useState(parsed.h);
  const [selM, setSelM] = useState(parsed.m);

  useEffect(() => {
    const p = parseValue(value);
    if (p.date) {
      const date = p.date;
      const h = p.h;
      const m = p.m;
      requestAnimationFrame(() => {
        setSelDate(date);
        setViewMonth(date.getMonth());
        setViewYear(date.getFullYear());
        setSelH(h);
        setSelM(m);
      });
    }
  }, [value]);

  useEffect(() => {
    const handleOut = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOut);
    return () => document.removeEventListener('mousedown', handleOut);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = (() => {
    const d = new Date(viewYear, viewMonth, 1).getDay();
    return d === 0 ? 6 : d - 1;
  })();
  const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;

  const minParsed = min ? parseValue(min) : null;
  const maxParsed = max ? parseValue(max) : null;

  const isDayDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (minParsed?.date) {
      const minD = new Date(
        minParsed.date.getFullYear(),
        minParsed.date.getMonth(),
        minParsed.date.getDate()
      );
      if (d < minD) return true;
    }
    if (maxParsed?.date) {
      const maxD = new Date(
        maxParsed.date.getFullYear(),
        maxParsed.date.getMonth(),
        maxParsed.date.getDate()
      );
      if (d > maxD) return true;
    }
    return false;
  };

  const isHourValid = (h: number) => {
    if (!selDate) return true;
    if (minParsed?.date && isSameDay(selDate, minParsed.date) && h < minParsed.h) return false;
    if (maxParsed?.date && isSameDay(selDate, maxParsed.date) && h > maxParsed.h) return false;
    return true;
  };

  const isMinuteValid = (m: number) => {
    if (!selDate) return true;
    if (minParsed?.date && isSameDay(selDate, minParsed.date)) {
      if (selH < minParsed.h) return false;
      if (selH === minParsed.h && m < minParsed.m) return false;
    }
    if (maxParsed?.date && isSameDay(selDate, maxParsed.date)) {
      if (selH > maxParsed.h) return false;
      if (selH === maxParsed.h && m > maxParsed.m) return false;
    }
    return true;
  };

  useEffect(() => {
    if (!selDate) return;
    const hours = HOURS.filter(isHourValid);
    if (hours.length && !hours.includes(selH)) {
      const clamped = hours[0];
      setSelH(clamped);
      onChange(toValue(selDate, clamped, selM));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max, selDate]);

  useEffect(() => {
    if (!selDate) return;
    const minutes = MINUTES.filter(isMinuteValid);
    if (minutes.length && !minutes.includes(selM)) {
      const clamped = minutes[0];
      setSelM(clamped);
      onChange(toValue(selDate, selH, clamped));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selH, min, max, selDate]);

  const handleDayClick = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    setSelDate(d);
    onChange(toValue(d, selH, selM));
  };

  const handleHour = (h: number) => {
    setSelH(h);
    if (selDate) onChange(toValue(selDate, h, selM));
  };

  const handleMinute = (m: number) => {
    setSelM(m);
    if (selDate) onChange(toValue(selDate, selH, m));
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else setViewMonth(m => m + 1);
  };

  const today = new Date();

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        onClick={() => setIsOpen(o => !o)}
        className={cn(
          'w-full flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors bg-white text-left cursor-pointer',
          isOpen && !hasError && 'border-brand-green ring-2 ring-brand-green/20',
          hasError ? 'border-destructive' : !isOpen && 'border-border',
          !value && 'text-foreground/40'
        )}
      >
        <Calendar size={15} className='text-foreground/40 shrink-0' />
        <span className='flex-1 truncate'>{value ? formatDisplay(value) : '— — —'}</span>
      </button>

      {isOpen && (
        <div className='absolute z-50 mt-1.5 left-0 w-[296px] bg-white rounded-2xl border border-border shadow-xl overflow-hidden'>
          <div className='p-4 pb-3'>
            <div className='flex items-center justify-between mb-4'>
              <button
                type='button'
                onClick={prevMonth}
                className='w-7 h-7 flex items-center justify-center rounded-lg hover:bg-brand-cream transition-colors cursor-pointer'
              >
                <ChevronLeft size={15} className='text-foreground/60' />
              </button>
              <span className='text-[13px] font-bold font-playfair text-foreground'>
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                type='button'
                onClick={nextMonth}
                className='w-7 h-7 flex items-center justify-center rounded-lg hover:bg-brand-cream transition-colors cursor-pointer'
              >
                <ChevronRight size={15} className='text-foreground/60' />
              </button>
            </div>

            <div className='grid grid-cols-7 mb-1'>
              {DAYS_OF_WEEK.map(d => (
                <div
                  key={d}
                  className='text-center text-[10px] font-bold text-foreground/35 py-0.5'
                >
                  {d}
                </div>
              ))}
            </div>

            <div className='grid grid-cols-7 gap-y-0.5'>
              {Array.from({ length: totalCells }, (_, i) => {
                const day = i - firstDow + 1;
                const inMonth = day >= 1 && day <= daysInMonth;
                if (!inMonth) return <div key={i} />;

                const d = new Date(viewYear, viewMonth, day);
                const isSelected = selDate ? isSameDay(selDate, d) : false;
                const isToday = isSameDay(today, d);
                const disabled = isDayDisabled(day);

                return (
                  <button
                    key={i}
                    type='button'
                    disabled={disabled}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      'h-8 w-full text-[13px] rounded-lg transition-colors font-medium',
                      isSelected
                        ? 'bg-brand-green text-white font-bold'
                        : disabled
                          ? 'text-foreground/20 cursor-not-allowed'
                          : isToday
                            ? 'border border-brand-green text-brand-green hover:bg-brand-green-muted'
                            : 'hover:bg-brand-green-muted text-foreground cursor-pointer'
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className='border-t border-border px-4 py-3 bg-brand-cream/60 flex items-center gap-2.5'>
            <Clock size={14} className='text-foreground/45 shrink-0' />

            <select
              value={selH}
              onChange={e => handleHour(Number(e.target.value))}
              className='rounded-lg border border-border bg-white px-2 py-1.5 text-sm font-medium outline-none focus:border-brand-green cursor-pointer'
            >
              {HOURS.filter(isHourValid).map(h => (
                <option key={h} value={h}>
                  {pad(h)}
                </option>
              ))}
            </select>

            <span className='text-foreground/40 font-bold text-sm'>:</span>

            <select
              value={selM}
              onChange={e => handleMinute(Number(e.target.value))}
              className='rounded-lg border border-border bg-white px-2 py-1.5 text-sm font-medium outline-none focus:border-brand-green cursor-pointer'
            >
              {MINUTES.filter(isMinuteValid).map(m => (
                <option key={m} value={m}>
                  {pad(m)}
                </option>
              ))}
            </select>

            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='ml-auto px-3.5 py-1.5 text-xs font-bold bg-brand-green text-white rounded-lg hover:bg-brand-green-hover transition-colors cursor-pointer'
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
