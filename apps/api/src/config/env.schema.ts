import { z } from 'zod';

const hostnameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/,
    'Debe ser un hostname sin protocolo, puerto ni ruta',
  );

export const envSchema = z
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
    BETTER_AUTH_COOKIE_DOMAIN: hostnameSchema.optional(),
    DOMAIN: hostnameSchema.optional(),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_REDIRECT_URI: z.url(),
    BASE_PATH: z.string().trim().startsWith('/'),
    RESEND_API_KEY: z.string().min(1),
    RESEND_FROM_EMAIL: z.string().min(1),
    TRANSBANK_ENVIRONMENT: z
      .enum(['integration', 'production'])
      .default('integration'),
    TRANSBANK_COMMERCE_CODE: z.string().min(1).optional(),
    TRANSBANK_API_KEY: z.string().min(1).optional(),
  })
  .superRefine((values, ctx) => {
    const authUrlPath = new URL(values.BETTER_AUTH_URL).pathname.replace(
      /\/$/,
      '',
    );
    const basePath = values.BASE_PATH.replace(/\/$/, '');

    if (authUrlPath && authUrlPath !== basePath) {
      ctx.addIssue({
        code: 'custom',
        path: ['BETTER_AUTH_URL'],
        message:
          'El path de BETTER_AUTH_URL debe coincidir con BASE_PATH; Better Auth prioriza el path de la URL',
      });
    }

    if (
      values.NODE_ENV === 'production' &&
      !values.BETTER_AUTH_COOKIE_DOMAIN &&
      !values.DOMAIN
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['BETTER_AUTH_COOKIE_DOMAIN'],
        message:
          'BETTER_AUTH_COOKIE_DOMAIN o DOMAIN es obligatorio en producción',
      });
    }

    if (values.TRANSBANK_ENVIRONMENT === 'production') {
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
    }
  })
  .transform((values) => ({
    ...values,
    TRANSBANK_COMMERCE_CODE: values.TRANSBANK_COMMERCE_CODE ?? '',
    TRANSBANK_API_KEY: values.TRANSBANK_API_KEY ?? '',
  }));
