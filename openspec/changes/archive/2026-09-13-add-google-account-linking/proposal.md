## Why

Users who created an unverified email-and-password account cannot safely sign in with a matching Google identity because Better Auth correctly rejects implicit linking with `account_not_linked`. The product needs an authenticated, explicit linking flow so the password holder can connect Google without weakening the account-takeover protections.

## What Changes

- Explain the recovery path when Google sign-in encounters an existing but unlinked account: sign in with the existing password, then connect Google from the dashboard.
- Show authenticated users whether Google is connected and provide a "Conectar Google" action when it is not.
- Start Better Auth's explicit Google linking flow from the authenticated dashboard and return to the dashboard after a successful callback.
- Show accessible pending, success, and failure feedback without reusing a consumed OAuth callback state.
- Keep implicit linking's local-email verification requirement enabled; this change does not globally trust matching email addresses.
- Add focused tests for account status, linking initiation, callback outcomes, and recovery guidance.

## Capabilities

### New Capabilities

- `authentication/google-account-linking`: Securely connect a Google identity to an already authenticated account and guide users whose implicit Google sign-in is rejected.

### Modified Capabilities

None.

## Impact

- Affects web authentication APIs/components and the authenticated dashboard under `apps/web/src/features/auth/` and `apps/web/src/features/course-dashboard/`.
- Uses the existing Better Auth client, Google provider configuration, auth proxy route, and account table; no new provider or database model is required.
- Preserves the API's existing secure Better Auth account-linking defaults and does not enable `requireLocalEmailVerified: false`.
- Adds no dependency, shared HTTP contract, or environment variable.
