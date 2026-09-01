const sendMock = jest.fn();
const loggerErrorMock = jest.fn();
const betterAuthMock = jest.fn((options: unknown) => options);

jest.mock('@/config/env', () => ({
  env: {
    BETTER_AUTH_SECRET: 'a'.repeat(32),
    BETTER_AUTH_URL: 'http://localhost:3000',
    DOMAIN: 'example.com',
    FRONTEND_URL: 'http://localhost:3001',
    GOOGLE_CLIENT_ID: 'google-client',
    GOOGLE_CLIENT_SECRET: 'google-secret',
    GOOGLE_REDIRECT_URI: 'http://localhost:3000/auth/callback/google',
    BASE_PATH: '/auth',
  },
}));
jest.mock('@/db', () => ({ db: {} }));
jest.mock('better-auth', () => ({ betterAuth: betterAuthMock }));
jest.mock('better-auth/adapters/drizzle', () => ({
  drizzleAdapter: jest.fn(() => ({ id: 'drizzle-adapter' })),
}));
jest.mock('./password-reset-mailer', () => ({
  passwordResetMailer: { send: sendMock },
}));
jest.mock('@nestjs/common', () => ({
  Logger: jest.fn().mockImplementation(() => ({ error: loggerErrorMock })),
}));

import {
  PASSWORD_RESET_RATE_LIMIT,
  PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS,
  auth,
  queuePasswordResetEmail,
} from './auth';

describe('password recovery auth settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses the required token expiry and dedicated request limit', () => {
    const options = auth as unknown as {
      emailAndPassword: {
        resetPasswordTokenExpiresIn: number;
        revokeSessionsOnPasswordReset: boolean;
      };
      rateLimit: {
        customRules: Record<string, { window: number; max: number }>;
      };
    };

    expect(PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS).toBe(3600);
    expect(PASSWORD_RESET_RATE_LIMIT).toEqual({ window: 60, max: 3 });
    expect(options.emailAndPassword.resetPasswordTokenExpiresIn).toBe(3600);
    expect(options.emailAndPassword.revokeSessionsOnPasswordReset).toBe(true);
    expect(options.rateLimit.customRules['/request-password-reset']).toEqual({
      window: 60,
      max: 3,
    });
  });

  it('mounts Better Auth at the configured backend path', () => {
    expect((auth as unknown as { basePath: string }).basePath).toBe('/auth');
  });

  it('shares cookies with the configured parent domain', () => {
    const options = auth as unknown as {
      advanced: {
        crossSubDomainCookies: { enabled: boolean; domain: string };
        ipAddress: { ipAddressHeaders: string[] };
      };
    };

    expect(options.advanced.crossSubDomainCookies).toEqual({
      enabled: true,
      domain: 'example.com',
    });
    expect(options.advanced.ipAddress.ipAddressHeaders).toEqual([
      'cf-connecting-ip',
    ]);
  });

  it('queues delivery without awaiting the provider', () => {
    sendMock.mockReturnValue(new Promise(() => undefined));

    expect(
      queuePasswordResetEmail({
        user: { email: 'person@example.com' },
        url: 'https://app.example/reset?token=secret',
        token: 'secret',
      }),
    ).toBeUndefined();
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it('logs only structured, non-sensitive delivery failure data', async () => {
    sendMock.mockRejectedValue(new Error('private provider detail'));

    queuePasswordResetEmail({
      user: { email: 'private@example.com' },
      url: 'https://app.example/reset?token=private-token',
      token: 'private-token',
    });
    await Promise.resolve();

    expect(loggerErrorMock).toHaveBeenCalledWith({
      event: 'password_reset_email_delivery_failed',
      errorType: 'Error',
    });
    const logged = JSON.stringify(loggerErrorMock.mock.calls);
    expect(logged).not.toContain('private@example.com');
    expect(logged).not.toContain('private-token');
    expect(logged).not.toContain('private provider detail');
  });
});
