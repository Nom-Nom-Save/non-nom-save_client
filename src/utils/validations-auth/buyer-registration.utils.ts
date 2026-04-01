import { z } from 'zod';
import i18next from 'i18next';
import { StringKey } from '@/consts/string-key.consts';

export const buyerRegistrationSchema = z.object({
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
  password: z
    .string()
    .min(8, {
      error: i18next.t(StringKey.PASSWORD_MIN),
    })
    .max(100, {
      error: i18next.t(StringKey.PASSWORD_MAX),
    }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: i18next.t(StringKey.AGREE_TO_TERMS_REQUIRED),
  }),
});

export type BuyerRegistrationFormData = z.infer<typeof buyerRegistrationSchema>;
