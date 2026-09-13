## Why

Authenticated users can enter their dashboard from the landing navigation, but they have no visible way to end their session. A logout action is needed so users can securely leave a shared device and understand when sign-out is in progress or unsuccessful.

## What Changes

- Show a Spanish "Cerrar sesión" action in the landing navigation when a session is active.
- End the Better Auth session when the user activates the action.
- Prevent repeated submissions while logout is in progress and provide accessible progress feedback.
- Keep the user on or return the user to the public landing page after successful logout, with the navigation reflecting the signed-out state.
- Preserve the active session and allow retry when logout fails.
- Add focused component tests for visibility, successful logout, pending behavior, and failure recovery.

## Capabilities

### New Capabilities

- `authentication/logout-control`: User-visible control and behavior for ending an authenticated web session.

### Modified Capabilities

None.

## Impact

- Affects the authenticated state of the web landing navbar and its component tests under `apps/web/src/components/ui/`.
- Uses the existing Better Auth client exported by `apps/web/src/lib/auth-client.ts` and existing TanStack Router navigation facilities.
- Does not change backend endpoints, shared HTTP contracts, environment variables, or dependencies.
