import { z } from 'zod';

export const brandImagesSchema = z.object({
  logo: z.string().url().optional().or(z.literal('')),
  banner: z.string().url().optional().or(z.literal('')),
});

export type BrandImagesFormData = z.infer<typeof brandImagesSchema>;
