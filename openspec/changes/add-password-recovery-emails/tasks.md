## 1. Resend Configuration and Mailer

- [x] 1.1 Add the `resend` dependency to `apps/api` and validate required `RESEND_API_KEY` and `RESEND_FROM_EMAIL` configuration without exposing secrets.
- [x] 1.2 Document the Resend API key and verified sender requirements in `apps/api/.env.example` and deployment documentation.
- [x] 1.3 Implement a focused password-reset mailer with Spanish HTML/plain-text content, a SHA-256-derived idempotency key, and explicit Resend `{ data, error }` handling.
- [x] 1.4 Add mailer unit tests for message content, verified sender usage, idempotency, accepted delivery, provider rejection, and network failure without logging reset tokens or recipient addresses.

## 2. Better Auth Recovery Configuration

- [x] 2.1 Configure Better Auth to send reset emails through the mailer with a one-hour expiry and session revocation after reset.
- [x] 2.2 Add a dedicated `/request-password-reset` rate-limit rule and regression coverage for the authentication security settings.
- [x] 2.3 Add structured asynchronous delivery-failure logging that exposes neither the reset token, reset URL, nor recipient address.

## 3. Frontend Recovery API and Validation

- [x] 3.1 Add tested auth-feature API functions for requesting a reset with the configured frontend redirect and submitting a new password with a token.
- [x] 3.2 Add tested Zod schemas for request email validation and matching eight-character minimum passwords.
- [x] 3.3 Add a validated reset-route search schema that accepts only a non-empty token or the known invalid-token outcome.

## 4. Password Request Experience

- [x] 4.1 Replace the login placeholder with a typed link to `/forgot-password`.
- [x] 4.2 Build and test the forgot-password form with accessible validation, pending-state deduplication, and the same generic confirmation for all accepted requests.
- [x] 4.3 Add the `/forgot-password` route using existing authentication card and navigation patterns.

## 5. Password Reset Experience

- [x] 5.1 Build and test the reset-password form for password confirmation, pending submission, successful reset, and invalid or reused token responses.
- [x] 5.2 Add the `/reset-password` route with valid-token form state and accessible request-new-link guidance for missing, expired, invalid, or consumed tokens.
- [x] 5.3 After success, communicate session revocation and provide navigation to sign in with the new password.

## 6. Verification

- [x] 6.1 Run focused API mailer/auth tests and frontend recovery tests, resolving security, behavior, and accessibility regressions.
- [x] 6.2 Run `pnpm exec eslint src test`, `pnpm test`, and `pnpm build` from `apps/api/`.
- [x] 6.3 Run `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run`, and `pnpm build` from `apps/web/`.
- [x] 6.4 Verify a non-production Resend delivery end to end using an official Resend test address without committing credentials.
