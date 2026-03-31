import { z } from 'zod';
import i18next from 'i18next';
import { StringKey } from '@/consts/string-key.consts';

export const publishMenuSchema = z
  .object({
    totalQuantity: z
      .number()
      .int()
      .min(1, { error: i18next.t(StringKey.QUANTITY_MIN) }),
    originalPrice: z.number().positive({ error: i18next.t(StringKey.PRICE_POSITIVE) }),
    discountPrice: z.number().positive({ error: i18next.t(StringKey.PRICE_POSITIVE) }),
    startTime: z.string().min(1, { error: i18next.t(StringKey.START_TIME_REQUIRED) }),
    endTime: z.string().min(1, { error: i18next.t(StringKey.END_TIME_REQUIRED) }),
  })
  .refine(
    data => !data.startTime || !data.endTime || new Date(data.endTime) > new Date(data.startTime),
    {
      message: i18next.t(StringKey.END_TIME_AFTER_START),
      path: ['endTime'],
    }
  );

export type PublishMenuFormData = z.infer<typeof publishMenuSchema>;
