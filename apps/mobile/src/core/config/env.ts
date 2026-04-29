import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  EXPO_PUBLIC_ENV: z.enum(['development', 'staging', 'production']),
});

const parsed = envSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV ?? 'development',
});

if (!parsed.success) {
  console.error('Invalid env', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
export type Env = typeof env;
