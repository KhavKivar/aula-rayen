import { envSchema } from './env.schema';

const validEnvironment = {
  DATABASE_URL: 'postgresql://user:password@localhost:5432/database',
  BETTER_AUTH_SECRET: 'a'.repeat(32),
  BETTER_AUTH_URL: 'http://localhost:3000',
  GOOGLE_CLIENT_ID: 'google-client',
  GOOGLE_CLIENT_SECRET: 'google-secret',
  GOOGLE_REDIRECT_URI: 'http://localhost:3000/api/auth/callback/google',
  BASE_PATH: '/auth',
  RESEND_API_KEY: 'resend-key',
  RESEND_FROM_EMAIL: 'sender@example.com',
};

describe('environment configuration', () => {
  it('accepts and normalizes a production cookie parent hostname', () => {
    const result = envSchema.parse({
      ...validEnvironment,
      NODE_ENV: 'production',
      BETTER_AUTH_COOKIE_DOMAIN: 'Example.COM',
    });

    expect(result.BETTER_AUTH_COOKIE_DOMAIN).toBe('example.com');
  });

  it('allows local development to omit the cookie domain', () => {
    const result = envSchema.parse(validEnvironment);

    expect(result.NODE_ENV).toBe('development');
    expect(result.BETTER_AUTH_COOKIE_DOMAIN).toBeUndefined();
  });

  it('accepts an auth URL whose path matches the mounted path', () => {
    const result = envSchema.safeParse({
      ...validEnvironment,
      BETTER_AUTH_URL: 'https://api.example.com/auth',
    });

    expect(result.success).toBe(true);
  });

  it('rejects an auth URL whose path differs from the mounted path', () => {
    const result = envSchema.safeParse({
      ...validEnvironment,
      BETTER_AUTH_URL: 'https://example.com/api/auth',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ['BETTER_AUTH_URL'] }),
        ]),
      );
    }
  });

  it('requires the cookie domain in production', () => {
    const result = envSchema.safeParse({
      ...validEnvironment,
      NODE_ENV: 'production',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ['BETTER_AUTH_COOKIE_DOMAIN'] }),
        ]),
      );
    }
  });

  it.each([
    'https://example.com',
    'example.com:443',
    'example.com/path',
    'localhost',
    '-invalid.example.com',
  ])('rejects invalid cookie domain %s', (domain) => {
    const result = envSchema.safeParse({
      ...validEnvironment,
      BETTER_AUTH_COOKIE_DOMAIN: domain,
    });

    expect(result.success).toBe(false);
  });
});
