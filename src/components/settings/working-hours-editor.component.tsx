import { useState } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { useUpdateEstablishmentProfileMutation } from '@/queries/establishment.queries';
import { useEstablishmentStore } from '@/store/establishment.store';
import { serializeWorkingHours } from '@/utils/working-hours.utils';
import type { WorkingHours, DaySchedule } from '@/types/establishment.types';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { cn } from '@/lib/utils';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const DAY_LABELS: Record<(typeof DAYS)[number], StringKey> = {
  monday: StringKey.MONDAY,
  tuesday: StringKey.TUESDAY,
  wednesday: StringKey.WEDNESDAY,
  thursday: StringKey.THURSDAY,
  friday: StringKey.FRIDAY,
  saturday: StringKey.SATURDAY,
  sunday: StringKey.SUNDAY,
};

interface WorkingHoursEditorProps {
  initialHours: WorkingHours;
}

export const WorkingHoursEditor = ({ initialHours }: WorkingHoursEditorProps) => {
  const { t } = useTranslation();
  const profile = useEstablishmentStore(s => s.profile);
  const { mutate: updateProfile, isPending } = useUpdateEstablishmentProfileMutation();

  const [hours, setHours] = useState<WorkingHours>(initialHours);

  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as (typeof DAYS)[number];

  const updateDay = (
    day: (typeof DAYS)[number],
    field: keyof DaySchedule,
    value: string | boolean
  ) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSave = () => {
    if (!profile) return;

    updateProfile(
      {
        establishmentId: profile.id,
        data: { workingHours: serializeWorkingHours(hours) },
      },
      {
        onSuccess: () => toast.success(t(StringKey.HOURS_UPDATED)),
        onError: (error: Error) => {
          if (error instanceof ApiError) {
            toast.error(t(StringKey.FAILED_TO_UPDATE_HOURS), { id: 'hours-error' });
          }
        },
      }
    );
  };

  const timeInputClass = (isToday: boolean) =>
    cn(
      'px-3 py-2 border-[1.5px] rounded-xl bg-brand-cream text-sm font-medium outline-none transition-colors focus:border-brand-green focus:bg-white',
      isToday ? 'border-brand-green' : 'border-border'
    );

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-[80px_1fr_1fr_32px] gap-2 sm:grid-cols-[130px_1fr_1fr_40px] sm:gap-3 pb-2.5 border-b-[1.5px] border-border mb-1'>
        <p className='text-[11px] font-bold text-foreground/40 uppercase tracking-wider'>
          {t(StringKey.DAY)}
        </p>
        <p className='text-[11px] font-bold text-foreground/40 uppercase tracking-wider'>
          {t(StringKey.OPENS)}
        </p>
        <p className='text-[11px] font-bold text-foreground/40 uppercase tracking-wider'>
          {t(StringKey.CLOSES)}
        </p>
        <p className='text-[11px] font-bold text-foreground/40 uppercase tracking-wider'>
          {t(StringKey.OPEN)}
        </p>
      </div>

      {DAYS.map(day => {
        const isToday = day === today;
        return (
          <div
            key={day}
            className={cn(
              'grid grid-cols-[80px_1fr_1fr_32px] items-center gap-2 sm:grid-cols-[130px_1fr_1fr_40px] sm:gap-3 py-2.5 border-b border-border last:border-b-0',
              isToday && 'bg-brand-green-muted/25 rounded-xl px-2 sm:px-3 -mx-2 sm:-mx-3'
            )}
          >
            <div className='flex flex-col'>
              <span
                className={cn('text-sm font-semibold', !hours[day].isOpen && 'text-foreground/40')}
              >
                {t(DAY_LABELS[day])}
              </span>

              {isToday && (
                <span className='text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-green text-white uppercase w-fit'>
                  {t(StringKey.TODAY)}
                </span>
              )}
            </div>

            {hours[day].isOpen ? (
              <>
                <input
                  type='time'
                  value={hours[day].open}
                  onChange={e => updateDay(day, 'open', e.target.value)}
                  className={timeInputClass(isToday)}
                />
                <input
                  type='time'
                  value={hours[day].close}
                  onChange={e => updateDay(day, 'close', e.target.value)}
                  className={timeInputClass(isToday)}
                />
              </>
            ) : (
              <>
                <input type='time' disabled className={cn(timeInputClass(false), 'opacity-30')} />
                <input type='time' disabled className={cn(timeInputClass(false), 'opacity-30')} />
              </>
            )}

            <Switch
              checked={hours[day].isOpen}
              onCheckedChange={checked => updateDay(day, 'isOpen', checked)}
            />
          </div>
        );
      })}

      <button
        type='button'
        onClick={handleSave}
        disabled={isPending}
        className='w-full sm:w-auto self-start flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white bg-brand-green hover:bg-brand-green-hover transition-colors cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2'
      >
        {isPending ? t(StringKey.SAVING) : t(StringKey.SAVE_HOURS)}
      </button>
    </div>
  );
};
