import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6).optional(),
  email: z.string().email().optional(),
});

export const updateContactSchema = createContactSchema.partial();
