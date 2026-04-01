import { useState } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { TimePicker } from '@/components/time-picker.component';
import { useUpdateEstablishmentProfileMutation } from '@/queries/establishment.queries';
import { useEstablishmentStore } from '@/store/establishment.store';
import { serializeWorkingHours } from '@/utils/working-hours.utils';
import type { WorkingHours, DaySchedule } from '@/types/establishment.types';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

    const hasInvalidHours = DAYS.some(
      day => hours[day].isOpen && hours[day].close <= hours[day].open
    );

    if (hasInvalidHours) {
      toast.error(t(StringKey.CLOSE_TIME_AFTER_OPEN), { id: 'hours-invalid' });
      return;
    }

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

            <TimePicker
              value={hours[day].open}
              onChange={v => updateDay(day, 'open', v)}
              disabled={!hours[day].isOpen}
              isHighlighted={isToday}
            />

            <TimePicker
              value={hours[day].close}
              onChange={v => updateDay(day, 'close', v)}
              min={hours[day].open || undefined}
              disabled={!hours[day].isOpen}
              isHighlighted={isToday}
            />

            <Switch
              checked={hours[day].isOpen}
              onCheckedChange={checked => updateDay(day, 'isOpen', checked)}
            />
          </div>
        );
      })}

      <Button type='button' variant='brand' size='settings' onClick={handleSave} disabled={isPending} className='w-full sm:w-auto mt-2'>
        {isPending ? t(StringKey.SAVING) : t(StringKey.SAVE_HOURS)}
      </Button>
    </div>
  );
};
