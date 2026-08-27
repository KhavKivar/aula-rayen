## Context

See `proposal.md` for motivation and `specs/authentication/password-recovery/spec.md` for behavior. Better Auth already owns credential hashing, verification records, reset-token generation, and the reset endpoints. The web app proxies `/api/auth/*` to NestJS, while the login page currently renders a placeholder forgot-password anchor. The API has no mail-delivery abstraction or Resend configuration.

## Goals / Non-Goals

**Goals:**

- Keep token generation, validation, consumption, password hashing, and session revocation inside Better Auth.
- Introduce one small server-only Resend mailer with deterministic unit tests.
- Keep account existence and provider delivery details out of browser responses.
- Use validated TanStack routes and auth-feature forms for request and reset states.

**Non-Goals:**

- Adding email verification, magic-link login, marketing email, or a general notification platform.
- Building a visual email-template editor or adding React Email.
- Recovering accounts that only have a social identity and no credential password.
- Exposing Resend delivery IDs, reset tokens, or provider errors to the browser.
- Managing DNS/domain verification through application code.

## Decisions

### Delegate reset-token lifecycle to Better Auth

Configure `emailAndPassword.sendResetPassword`, `resetPasswordTokenExpiresIn: 3600`, and `revokeSessionsOnPasswordReset: true`. The web client will call Better Auth's `requestPasswordReset` and `resetPassword` methods through the existing proxy.

Alternative considered: create custom reset tables and endpoints. Rejected because it would duplicate token hashing, expiry, one-time use, password hashing, and session cleanup with more security-sensitive code.

### Send through a server-only Resend adapter

Add `resend` only to `apps/api`. A focused mailer accepts the recipient and Better Auth-generated URL, then calls `resend.emails.send` with `RESEND_FROM_EMAIL`, Spanish HTML, and plain text. It checks the SDK's `{ data, error }` result and throws an internal delivery error when Resend rejects the message.

Alternative considered: call Resend directly inside `auth.ts`. Rejected because client construction, content, idempotency, error handling, and tests would be coupled to Better Auth configuration.

Alternative considered: add React Email. Rejected because a single transactional template does not justify another rendering dependency.

### Keep reset request responses non-enumerating

The UI always transitions to the same generic confirmation after Better Auth accepts a syntactically valid request. The server callback starts delivery without making response content depend on account existence or Resend acceptance. Delivery failures are logged asynchronously with a stable event name and no token, reset URL, or recipient address.

Alternative considered: report "email not found" or delivery failure to the browser. Rejected because both leak account/provider state and encourage enumeration.

### Use an idempotency key derived from the token

Hash the Better Auth reset token with SHA-256 and use a namespaced key such as `password-reset/<digest>` as the Resend idempotency key. This prevents duplicate delivery when a callback is retried without placing the bearer token in provider metadata.

Alternative considered: use the raw token or recipient email in the key. Rejected because both expose sensitive identifiers to provider metadata and logs.

### Require explicit email configuration

Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to API environment validation and `.env.example`. Production setup must use a sender on a domain already verified in Resend; no test-only `onboarding@resend.dev` fallback will exist.

Alternative considered: make email configuration optional. Rejected because the app would advertise recovery while silently being unable to deliver it.

### Add dedicated request and reset routes

Create `/forgot-password` and `/reset-password`. The reset route validates allowlisted search state: a non-empty token enables the form, while Better Auth's invalid-token error shows request-new-link guidance. Forms use TanStack React Form, Zod schemas, TanStack Query mutations, and existing UI primitives.

Alternative considered: embed all states into `/login`. Rejected because token-bearing reset links and multi-step form state make the login route harder to validate and test.

### Apply a dedicated reset-request rate limit

Add a Better Auth custom rate-limit rule for `/request-password-reset`, more restrictive than the global limit. The frontend still uses the generic confirmation contract and does not interpret rate limiting as proof of account existence.

## Risks / Trade-offs

- [Asynchronous delivery can fail after the browser receives confirmation] -> Log structured delivery failures and monitor Resend; the browser message already says delivery occurs only if an account exists.
- [A process can terminate before a fire-and-forget send completes] -> Keep the send promise attached to the long-running Nest process and document that a future serverless deployment must provide a background-task primitive or queue.
- [Reset URL origin can be misconfigured] -> Build the browser redirect from the configured frontend origin and test the resulting URL passed to Better Auth.
- [Email HTML can become an injection surface] -> Use fixed template content and escape every interpolated value; do not include user-supplied display names.
- [Repeated requests can generate multiple valid links] -> Rely on Better Auth verification-token behavior and Resend idempotency per token, plus endpoint rate limiting.
- [Session revocation signs the user out on every device] -> State this behavior in the success UI; prioritize credential-compromise recovery over session continuity.

## Migration Plan

1. Verify the production sending domain in Resend and create a least-privilege sending API key.
2. Configure `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in each API environment before deployment.
3. Deploy the API mailer and Better Auth reset configuration, then deploy the web routes and forms.
4. Verify delivery, expiry, one-time use, session revocation, generic unknown-email responses, and rate limiting with Resend test addresses in non-production.
5. Roll back by removing the web entry point and Better Auth send callback; no schema or data rollback is required, and outstanding tokens will expire naturally.
