import { z } from 'zod';
import i18next from 'i18next';
import { StringKey } from '@/consts/string-key.consts';

export const userProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      error: i18next.t(StringKey.FULL_NAME_MIN),
    })
    .max(100, {
      error: i18next.t(StringKey.FULL_NAME_MAX),
    }),
  email: z.email({
    error: i18next.t(StringKey.VALID_EMAIL),
  }),
  notifyNearby: z.boolean(),
  notifyClosingSoon: z.boolean(),
  notifyNewItems: z.boolean(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
