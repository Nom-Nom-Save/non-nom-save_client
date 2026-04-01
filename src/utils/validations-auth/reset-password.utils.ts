import { z } from 'zod';
import i18next from 'i18next';
import { StringKey } from '@/consts/string-key.consts';

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, {
        error: i18next.t(StringKey.PASSWORD_MIN),
      })
      .max(100, {
        error: i18next.t(StringKey.PASSWORD_MAX),
      }),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: i18next.t(StringKey.PASSWORDS_DO_NOT_MATCH),
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
