import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { Logger } from '@nestjs/common';
import { db } from '@/db'; // your drizzle instance
import { env } from '@/config/env';
import { passwordResetMailer } from './password-reset-mailer';

export const PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS = 60 * 60;
export const PASSWORD_RESET_RATE_LIMIT = {
  window: 60,
  max: 3,
} as const;

export function getCrossSubDomainCookies(domain?: string) {
  return domain ? { enabled: true, domain } : undefined;
}

const passwordResetLogger = new Logger('PasswordResetEmail');

export function queuePasswordResetEmail({
  user,
  url,
  token,
}: {
  user: { email: string };
  url: string;
  token: string;
}) {
  void passwordResetMailer
    .send({ recipient: user.email, resetUrl: url, token })
    .catch((error: unknown) => {
      passwordResetLogger.error({
        event: 'password_reset_email_delivery_failed',
        errorType: error instanceof Error ? error.name : 'UnknownError',
      });
    });
}

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: env.BASE_PATH,
  trustedOrigins: [env.FRONTEND_URL, 'http://localhost:3001'],
  advanced: {
    ...(env.BETTER_AUTH_COOKIE_DOMAIN
      ? {
          crossSubDomainCookies: getCrossSubDomainCookies(
            env.BETTER_AUTH_COOKIE_DOMAIN,
          ),
        }
      : {}),
    ipAddress: {
      ipAddressHeaders: ['cf-connecting-ip'],
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: (data) => {
      queuePasswordResetEmail(data);
      return Promise.resolve();
    },
    resetPasswordTokenExpiresIn: PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS,
    revokeSessionsOnPasswordReset: true,
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      '/sign-in/email': {
        window: 15,
        max: 15,
      },
      '/request-password-reset': PASSWORD_RESET_RATE_LIMIT,
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectURI: env.GOOGLE_REDIRECT_URI,
    },
  },
});
