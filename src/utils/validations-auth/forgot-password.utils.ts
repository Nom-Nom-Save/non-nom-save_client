import { StringKey } from '@/consts/string-key.consts';
import i18next from 'i18next';
import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.email({ error: i18next.t(StringKey.VALID_EMAIL) }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
