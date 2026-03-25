import { z } from 'zod';

const socialAccountSchema = z.object({
  provider: z.enum(['WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK']),
  handle: z.string().min(1),
  isVerified: z.boolean().optional(),
});

export const createUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(6).optional(),
  documentNumber: z.string().min(4).optional(),
  address: z.string().min(3).optional(),
  cityId: z.number().int().optional(),
  roleId: z.number().int().optional(),
  branchId: z.number().int().optional(),
  hireDate: z.string().datetime().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  isVerified: z.boolean().optional(),
  socialAccounts: z.array(socialAccountSchema).optional(),
});

export const updateUserSchema = createUserSchema.partial();
