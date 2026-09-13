## Context

See `proposal.md` for motivation and `specs/authentication/google-account-linking/spec.md` for behavior. Better Auth 1.7 defaults `account.accountLinking.requireLocalEmailVerified` to true. Existing credential registrations are not email-verified, so a matching Google sign-in is rejected even when Google verifies its email. The authenticated dashboard is already protected by `DashboardGate`, and all browser auth requests pass through the TanStack Start auth proxy.

## Goals / Non-Goals

**Goals:**

- Use Better Auth's authenticated account-linking protocol rather than changing account rows directly.
- Keep account status and linking behavior inside the authentication feature, composed into the dashboard.
- Route OAuth outcomes to stable application pages with actionable Spanish feedback.
- Preserve one-time OAuth state semantics and the existing session on linking failure.

**Non-Goals:**

- Disabling local-email verification for implicit linking or globally trusting Google by provider name.
- Adding email delivery or a complete email-verification workflow.
- Supporting unlinking, additional OAuth providers, or account merging across different emails.
- Changing Better Auth database tables or backend account-linking policy.
- Addressing the independent client-IP forwarding warning.

## Decisions

### Use explicit `linkSocial` from an authenticated dashboard

The dashboard action will invoke Better Auth's explicit social-linking endpoint with Google and a dashboard callback URL. The endpoint binds OAuth state to the active user and checks that the returned identity can be linked.

Alternative considered: set `requireLocalEmailVerified: false`. Rejected because an attacker could register a victim's unverified email and retain password access after the victim's Google identity is linked.

Alternative considered: update the `account` table directly. Rejected because it bypasses provider identity verification, OAuth state validation, account collision checks, and token handling.

### Isolate account-linking logic in the authentication feature

Create authentication API functions/components that list linked accounts and initiate Google linking, then compose the control into `CourseDashboard`. This follows the repository dependency direction (`shared -> features -> app`) and prevents course components from owning Better Auth response handling.

Alternative considered: call the auth client directly throughout `CourseDashboard`. Rejected because provider errors, account status mapping, and tests would become coupled to course rendering.

### Derive status from Better Auth account records

The UI will query the current user's linked accounts and consider Google connected when an account record has `providerId === "google"`. After callback navigation, the dashboard query runs again so persisted server state is authoritative.

Alternative considered: persist a local browser flag after starting OAuth. Rejected because initiation does not prove callback success and browser state can become stale.

### Handle OAuth errors on stable routes

Google sign-in will use the login page as its error destination so `account_not_linked` can be translated into recovery guidance. Explicit linking will use the dashboard as callback/error destination so cancellation or failure does not send an authenticated user through the sign-in flow. Error query values will be allowlisted and mapped to user-safe Spanish messages; raw provider details will not be rendered.

Alternative considered: rely only on server logs. Rejected because users need an actionable path and may otherwise refresh a consumed callback, causing `state_mismatch`.

## Risks / Trade-offs

- [OAuth redirects unmount the pending UI quickly, making pending-state tests timing-sensitive] -> Test that initiation is called once and that the control disables while the promise remains unresolved.
- [A stale account-status query may still show "Conectar Google" immediately after callback] -> Invalidate or refetch account status on dashboard entry and after any non-redirecting completion.
- [Provider cancellation and protocol errors have different codes] -> Map known codes to concise messages and use one safe fallback that tells the user to start a new attempt.
- [An existing Google identity may belong to another user] -> Let Better Auth reject the collision; never merge or reassign identities in frontend code.
- [The dashboard currently mixes header and course content] -> Add a small composed auth control rather than introducing a broad dashboard-layout refactor.

## Migration Plan

1. Deploy the frontend account-status and explicit-linking flow without changing backend linking policy or schema.
2. Verify password sign-in followed by Google linking, subsequent Google sign-in, cancellation, and callback replay rejection.
3. Roll back by removing the dashboard control and recovery messaging; existing linked account records remain valid and require no data rollback.
