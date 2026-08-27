## Context

See `proposal.md` for motivation. Google sign-in already sends failures back to `/login` through Better Auth's `errorCallbackURL`, but the route no longer validates or presents the returned error. Better Auth intentionally rejects unsafe implicit same-email linking with `account_not_linked`. The dashboard Google-linking control has been removed and must not be reintroduced.

## Goals / Non-Goals

**Goals:**

- Convert the known account conflict into concise Spanish recovery guidance.
- Keep OAuth callback data constrained to an allowlist before rendering it.
- Preserve normal Google and password sign-in behavior.
- Keep authentication error handling inside the authentication feature and compose it from the login route.

**Non-Goals:**

- Linking Google to an existing password account.
- Changing Better Auth's account-linking security policy.
- Modifying provider credentials, backend authentication configuration, or persistence.
- Restoring Google status or connection UI on the dashboard.

## Decisions

### Validate callback errors at the route boundary

The login route will validate its search parameters with a schema that preserves only supported OAuth error codes. The authentication feature will map the validated code to a fixed user-facing message.

Alternative considered: render the raw query parameter directly. Rejected because provider and framework details are not stable user-facing contracts and may disclose unintended callback data.

### Treat `account_not_linked` as a recoverable password-login outcome

The dedicated message will state that an account already exists and direct the user to use email and password. It will not promise that Google can be connected later because the dashboard linking feature is intentionally absent.

Alternative considered: enable implicit same-email linking. Rejected because it weakens the existing account-takeover protection and changes identity ownership semantics.

### Use a generic fallback for other callback failures

Recognized non-conflict failures and unknown values will produce safe generic guidance rather than provider details. The alert will use accessible error semantics and appear before the login form.

Alternative considered: define detailed messages for every Better Auth error. Rejected because this change only needs an actionable account-conflict path and broad mappings are more likely to drift across dependency versions.

## Risks / Trade-offs

- [Better Auth changes the callback error identifier] → Keep the mapping focused and cover the supported identifier with a route-level regression test.
- [The message reveals that an account exists] → The signal appears only after control of the matching Google identity has been demonstrated; avoid exposing account lookup through a public form endpoint.
- [Users without a password cannot follow the guidance] → Existing password-recovery remains available from the same form.
- [Unknown callback failures become less specific] → Prefer a safe generic error while retaining internal diagnostics outside the rendered query value.

## Migration Plan

Deploy the frontend route validation, mapper, alert, and tests together. No data migration or backend rollout is required. Rollback consists of removing the presentation layer while leaving the existing Google callback destination unchanged.
