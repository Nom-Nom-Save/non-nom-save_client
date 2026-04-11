import z from 'zod';
import i18next from 'i18next';
import { StringKey } from '@/consts/string-key.consts';

export const reviewSchema = z.object({
  comment: z
    .string()
    .min(10, {
      error: i18next.t(StringKey.COMMENT_MIN),
    })
    .max(500, {
      error: i18next.t(StringKey.COMMENT_MAX),
    }),
  rating: z
    .number({
      error: i18next.t(StringKey.RATING_REQUIRED),
    })
    .min(1, {
      error: i18next.t(StringKey.RATING_REQUIRED),
    }),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
