import { z } from 'zod';
import i18next from 'i18next';
import { StringKey } from '@/consts/string-key.consts';

export const boxSchema = z.object({
  name: z
    .string()
    .min(2, { error: i18next.t(StringKey.PRODUCT_NAME_MIN) })
    .max(100, { error: i18next.t(StringKey.PRODUCT_NAME_MAX) }),
  description: z
    .string()
    .min(10, { error: i18next.t(StringKey.DESCRIPTION_MIN) })
    .max(500, { error: i18next.t(StringKey.DESCRIPTION_MAX) }),
  recommendedPrice: z.number().positive({ error: i18next.t(StringKey.PRICE_POSITIVE) }),
  quantityOfItems: z.number().int().min(1).optional(),
  picture: z.string().optional(),
  typeIds: z.array(z.string()).optional(),
  productIds: z.array(z.string()).optional(),
});

export type BoxFormData = z.infer<typeof boxSchema>;
