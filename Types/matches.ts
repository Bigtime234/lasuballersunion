import { z } from 'zod';

export const createMatchSchema = z.object({
  seasonId: z.number().optional(),
  homeFacultyId: z.number().min(1, 'Home faculty is required'),
  awayFacultyId: z.number().min(1, 'Away faculty is required'),
  category: z.enum(['men', 'women']).default('men'),
  matchDate: z.string().min(1, 'Match date is required'),
  venue: z.string().min(1, 'Venue is required').max(255),
  importance: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.awayFacultyId === data.homeFacultyId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Away faculty must be different from home faculty',
      path: ['awayFacultyId'],
    });
  }
});

export const updateScoreSchema = z.object({
  scoreHome: z.number().min(0, 'Score cannot be negative').max(999),
  scoreAway: z.number().min(0, 'Score cannot be negative').max(999),
  matchMinute: z.number().min(0, 'Minute cannot be negative').max(200),
  status: z.enum(['PENDING', 'LIVE', 'FINISHED']),
});

export const updateMatchSchema = createMatchSchema.partial();

export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type UpdateScoreInput = z.infer<typeof updateScoreSchema>;
export type UpdateMatchInput = z.infer<typeof updateMatchSchema>;