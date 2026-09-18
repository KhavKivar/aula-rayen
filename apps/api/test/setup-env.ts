const defaults: Record<string, string> = {
  DATABASE_URL: 'postgresql://user:password@localhost:5432/database',
  BETTER_AUTH_SECRET: 'a'.repeat(32),
  BETTER_AUTH_URL: 'http://localhost:3000',
  GOOGLE_CLIENT_ID: 'google-client',
  GOOGLE_CLIENT_SECRET: 'google-secret',
  GOOGLE_REDIRECT_URI: 'http://localhost:3000/auth/callback/google',
  BASE_PATH: '/auth',
  RESEND_API_KEY: 'resend-key',
  RESEND_FROM_EMAIL: 'sender@example.com',
};

for (const [key, value] of Object.entries(defaults)) {
  process.env[key] ??= value;
}
