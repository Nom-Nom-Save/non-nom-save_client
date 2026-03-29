import type { WorkingHours, DaySchedule } from '@/types/establishment.types';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const SHORT_DAYS: Record<(typeof DAYS)[number], string> = {
  monday: 'mon',
  tuesday: 'tue',
  wednesday: 'wed',
  thursday: 'thu',
  friday: 'fri',
  saturday: 'sat',
  sunday: 'sun',
};

const LONG_DAYS: Record<string, (typeof DAYS)[number]> = {
  mon: 'monday',
  tue: 'tuesday',
  wed: 'wednesday',
  thu: 'thursday',
  fri: 'friday',
  sat: 'saturday',
  sun: 'sunday',
};

const DEFAULT_SCHEDULE: DaySchedule = { open: '09:00', close: '18:00', isOpen: true };

export const getDefaultHours = (): WorkingHours =>
  Object.fromEntries(DAYS.map(day => [day, { ...DEFAULT_SCHEDULE }])) as WorkingHours;

/**
 * Compact format: "mon=09:00-18:00|tue=09:00-18:00|wed=closed|..."
 * Max ~154 chars for 7 days — fits 255 DB limit.
 */
export const serializeWorkingHours = (hours: WorkingHours): string =>
  DAYS.map(day => {
    const schedule = hours[day];
    const short = SHORT_DAYS[day];
    return schedule.isOpen ? `${short}=${schedule.open}-${schedule.close}` : `${short}=closed`;
  }).join('|');

export const parseWorkingHours = (raw: string | null): WorkingHours => {
  if (!raw) return getDefaultHours();

  // Compact format: "mon=09:00-18:00|tue=closed|..."
  if (raw.includes('|') || raw.includes('=')) {
    const result = getDefaultHours();
    for (const part of raw.split('|')) {
      const eqIndex = part.indexOf('=');
      if (eqIndex === -1) continue;

      const shortDay = part.slice(0, eqIndex);
      const times = part.slice(eqIndex + 1);
      const fullDay = LONG_DAYS[shortDay];
      if (!fullDay) continue;

      if (times === 'closed') {
        result[fullDay] = { open: '09:00', close: '18:00', isOpen: false };
      } else {
        const [open, close] = times.split('-') as [string, string];
        result[fullDay] = { open, close, isOpen: true };
      }
    }
    return result;
  }

  // Fallback: try JSON (legacy)
  try {
    return JSON.parse(raw) as WorkingHours;
  } catch {
    return getDefaultHours();
  }
};
