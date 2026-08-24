import 'dotenv/config';
import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().min(1),
    BASE_URL: z.url().default('http://localhost:3000'),
    FRONTEND_URL: z.url().default('http://localhost:3001'),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_REDIRECT_URI: z.url(),
    TRANSBANK_ENVIRONMENT: z
      .enum(['integration', 'production'])
      .default('integration'),
    TRANSBANK_COMMERCE_CODE: z.string().min(1).optional(),
    TRANSBANK_API_KEY: z.string().min(1).optional(),
  })
  .superRefine((values, ctx) => {
    if (values.TRANSBANK_ENVIRONMENT !== 'production') return;

    for (const field of [
      'TRANSBANK_COMMERCE_CODE',
      'TRANSBANK_API_KEY',
    ] as const) {
      if (!values[field]) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: `${field} es obligatorio en producción`,
        });
      }
    }
  })
  .transform((values) => ({
    ...values,
    TRANSBANK_COMMERCE_CODE: values.TRANSBANK_COMMERCE_CODE ?? '',
    TRANSBANK_API_KEY: values.TRANSBANK_API_KEY ?? '',
  }));

export const env = envSchema.parse(process.env);
