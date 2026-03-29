import { z } from 'zod';
import i18next from 'i18next';
import { StringKey } from '@/consts/string-key.consts';

export const productSchema = z.object({
  name: z
    .string()
    .min(2, { error: i18next.t(StringKey.PRODUCT_NAME_MIN) })
    .max(100, { error: i18next.t(StringKey.PRODUCT_NAME_MAX) }),
  description: z
    .string()
    .min(10, { error: i18next.t(StringKey.DESCRIPTION_MIN) })
    .max(500, { error: i18next.t(StringKey.DESCRIPTION_MAX) }),
  recommendedPrice: z.number().positive({ error: i18next.t(StringKey.PRICE_POSITIVE) }),
  weight: z.number().min(0).optional(),
  picture: z.string().optional(),
  typeIds: z.array(z.string()).optional(),
  allergenIds: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
