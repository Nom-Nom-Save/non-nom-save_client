import { StringKey } from '@/consts/string-key.consts';

export const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const DAY_LABELS: Record<(typeof DAYS)[number], StringKey> = {
  monday: StringKey.MONDAY,
  tuesday: StringKey.TUESDAY,
  wednesday: StringKey.WEDNESDAY,
  thursday: StringKey.THURSDAY,
  friday: StringKey.FRIDAY,
  saturday: StringKey.SATURDAY,
  sunday: StringKey.SUNDAY,
};
