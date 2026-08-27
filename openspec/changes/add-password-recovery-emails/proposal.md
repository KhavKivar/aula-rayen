## Why

The login page displays "¿La olvidaste?" but does not provide a working recovery path, leaving users locked out when they forget their password. Password recovery should use Better Auth's token lifecycle and Resend delivery while protecting account existence and active sessions.

## What Changes

- Replace the login placeholder with a password-recovery route where users can request a reset email.
- Send branded Spanish password-reset emails through Resend from a verified sender domain.
- Always show the same request confirmation whether or not the email belongs to an account, preventing account enumeration.
- Add a reset-password route that validates the one-time token, enforces password requirements, and handles expired, invalid, or reused links.
- Revoke existing sessions after a successful password reset and direct the user to sign in with the new password.
- Rate-limit password-reset requests through Better Auth and prevent duplicate form submissions in the UI.
- Document required Resend configuration and add backend/frontend tests for delivery, request, reset, and error states.

## Capabilities

### New Capabilities

- `authentication/password-recovery`: Secure email-based password reset requests, delivery, token handling, and password replacement.

### Modified Capabilities

None.

## Impact

- Affects Better Auth configuration and a new Resend mailer in `apps/api/src/modules/auth/`, plus API environment validation and documentation.
- Adds the `resend` package to `apps/api/` and requires `RESEND_API_KEY` and `RESEND_FROM_EMAIL` secrets/configuration.
- Adds password-recovery API functions, schemas, forms, and routes under `apps/web/src/features/auth/` and `apps/web/src/app/`.
- Uses existing Better Auth verification storage and auth proxy routes; no new database table or shared HTTP contract is required.
