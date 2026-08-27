## Why

When Google sign-in returns to the login page because its verified email already belongs to an unlinked password account, the user currently receives no actionable explanation. The login flow should communicate this safe account-protection outcome while preserving Google sign-in for accounts that can authenticate normally.

## What Changes

- Interpret an allowlisted OAuth error returned to the login route.
- Show a clear Spanish message for `account_not_linked` that directs the user to sign in with the existing email and password.
- Show a safe generic message for unknown OAuth failures without exposing provider details.
- Keep the existing `Continuar con Google` action and the current protection against implicit same-email account linking.
- Do not restore Google account linking or connection controls on the authenticated dashboard.

## Capabilities

### New Capabilities

- `authentication/google-sign-in`: Defines safe, actionable feedback when Google sign-in cannot use an email that belongs to an existing unlinked account.

### Modified Capabilities

None.

## Impact

- Frontend login route search validation and error presentation.
- Authentication feature error mapping and focused tests.
- Existing Better Auth Google provider and callback behavior remain unchanged.
- No API, database, dependency, or dashboard account-linking changes.
