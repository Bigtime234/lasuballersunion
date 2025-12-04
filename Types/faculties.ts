import { z } from 'zod';

export const createFacultySchema = z.object({
  name: z.string().min(2, 'Faculty name must be at least 2 characters'). max(100),
  abbreviation: z.string().min(1, 'Abbreviation is required').max(5),
  colorPrimary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color').default('#3B82F6'),
  colorSecondary: z.string(). regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color').default('#1E40AF'),
  logo: z.string().url('Must be a valid URL'). optional(). or(z.literal('')),
});

export const updateFacultySchema = createFacultySchema;

export type CreateFacultyInput = z. infer<typeof createFacultySchema>;
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;