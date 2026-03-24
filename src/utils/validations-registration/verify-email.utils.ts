import { z } from 'zod';
import i18next from 'i18next';
import { StringKey } from '@/consts/string-key.consts';

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(4, {
      error: i18next.t(StringKey.CODE_LENGTH),
    })
    .regex(/^\d{4}$/, {
      error: i18next.t(StringKey.CODE_DIGITS_ONLY),
    }),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
