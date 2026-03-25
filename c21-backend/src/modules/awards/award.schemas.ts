import { z } from 'zod';

export const createAwardSchema = z.object({
  name: z.string().min(1),
  receivedAt: z.string().datetime(),
  imageUrl: z.string().url().optional(),
});

export const updateAwardSchema = createAwardSchema.partial();
