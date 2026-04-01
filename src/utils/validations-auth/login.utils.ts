import { z } from 'zod';
import i18next from 'i18next';
import { StringKey } from '@/consts/string-key.consts';

export const loginSchema = z.object({
  email: z.email({ error: i18next.t(StringKey.VALID_EMAIL) }),

  password: z.string().min(1, { error: i18next.t(StringKey.PASSWORD_REQUIRED) }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
