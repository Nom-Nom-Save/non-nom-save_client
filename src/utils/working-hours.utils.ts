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

export const serializeWorkingHours = (hours: WorkingHours): string =>
  DAYS.map(day => {
    const schedule = hours[day];
    const short = SHORT_DAYS[day];
    return schedule.isOpen ? `${short}=${schedule.open}-${schedule.close}` : `${short}=closed`;
  }).join('|');

export const parseWorkingHours = (raw: string | null): WorkingHours => {
  if (!raw) return getDefaultHours();

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

  try {
    return JSON.parse(raw) as WorkingHours;
  } catch {
    return getDefaultHours();
  }
};

export const isEstablishmentOpen = (
  workingHoursRaw: string | null | undefined,
  targetDate: Date = new Date()
): boolean => {
  if (!workingHoursRaw) {
    return false;
  }

  const parsedHours = parseWorkingHours(workingHoursRaw);

  const dayName = targetDate
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as (typeof DAYS)[number];

  const todaySchedule = parsedHours[dayName];

  if (!todaySchedule || !todaySchedule.open || !todaySchedule.close) {
    return false;
  }

  const [openHour, openMinute] = todaySchedule.open.split(':').map(Number);
  const [closeHour, closeMinute] = todaySchedule.close.split(':').map(Number);

  const openTime = new Date(targetDate);
  openTime.setHours(openHour, openMinute, 0, 0);

  const closeTime = new Date(targetDate);
  closeTime.setHours(closeHour, closeMinute, 0, 0);

  if (closeTime <= openTime) {
    closeTime.setDate(closeTime.getDate() + 1);
  }

  return targetDate >= openTime && targetDate < closeTime;
};
