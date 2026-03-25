import { z } from 'zod';

const mediaSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO']),
  url: z.string().url(),
  order: z.number().int().optional(),
});

export const createPropertySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  pricePerM2: z.number().optional(),
  totalPrice: z.number().optional(),
  currencyId: z.number().int().optional(),
  typeId: z.number().int().optional(),
  statusId: z.number().int().optional(),
  areaM2: z.number().optional(),
  builtAreaM2: z.number().optional(),
  frontM2: z.number().optional(),
  depthM2: z.number().optional(),
  address: z.string().optional(),
  cityId: z.number().int().optional(),
  zoneId: z.number().int().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  suites: z.number().int().optional(),
  parking: z.number().int().optional(),
  isDraft: z.boolean().optional(),
  agentId: z.string().uuid().optional(),
  media: z.array(mediaSchema).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();
