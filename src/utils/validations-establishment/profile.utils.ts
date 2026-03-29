import { z } from 'zod';
import i18next from 'i18next';
import { StringKey } from '@/consts/string-key.consts';

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, { error: i18next.t(StringKey.BUSINESS_NAME_MIN) })
    .max(100, { error: i18next.t(StringKey.BUSINESS_NAME_MAX) }),
  description: z
    .string()
    .max(500, { error: i18next.t(StringKey.DESCRIPTION_MAX) })
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .min(5, { error: i18next.t(StringKey.ADDRESS_MIN) })
    .max(200, { error: i18next.t(StringKey.ADDRESS_MAX) }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
