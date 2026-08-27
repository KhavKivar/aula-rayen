import { z } from 'zod';

export const apiErrorSchema = z
  .object({
    statusCode: z.number().int().min(400).max(599),
    message: z.union([z.string(), z.array(z.string())]),
    error: z.string().optional(),
  })
  .strict();

export type ApiError = z.infer<typeof apiErrorSchema>;
