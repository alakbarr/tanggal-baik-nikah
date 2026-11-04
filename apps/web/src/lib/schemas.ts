import { z } from 'zod';

export const coupleFormSchema = z.object({
  groomName: z.string().optional().default(''),
  groomBirthDate: z
    .string()
    .min(10, 'Tanggal lahir calon mempelai pria wajib diisi')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  groomBirthAfterSunset: z.boolean().default(false),
  groomChildOrder: z.union([z.number().int().min(1).max(20), z.literal('')]).optional(),

  brideName: z.string().optional().default(''),
  brideBirthDate: z
    .string()
    .min(10, 'Tanggal lahir calon mempelai wanita wajib diisi')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  brideBirthAfterSunset: z.boolean().default(false),
  brideChildOrder: z.union([z.number().int().min(1).max(20), z.literal('')]).optional(),

  weddingYear: z
    .number()
    .int()
    .min(2025, 'Tahun perencanaan minimal 2025')
    .max(2050, 'Tahun perencanaan maksimal 2050')
    .default(2027),
  weekendsOnly: z.boolean().default(true),
  traditionProfile: z.enum(['keraton', 'pati', 'populer', 'custom']).default('keraton'),

  // Optional Fiqh / Adat fields
  iddahEndDate: z.string().optional().default(''),
  dinaAlaVariant: z.enum(['both', 'J-26', 'J-27']).default('both'),
});

export type CoupleFormData = z.infer<typeof coupleFormSchema>;
