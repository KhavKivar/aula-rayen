## 1. Authentication API and Error Mapping

- [x] 1.1 Add tested authentication-feature API functions that list the current user's linked accounts and start an authenticated Google `linkSocial` flow with dashboard callback and error destinations.
- [x] 1.2 Add an allowlisted OAuth error mapper with Spanish recovery guidance for `account_not_linked`, cancellation, invalid or consumed state, and unknown failures.
- [x] 1.3 Update Google sign-in initiation to send failures to the login route while preserving the existing successful dashboard callback.

## 2. Route Outcome Handling

- [x] 2.1 Define typed, validated login and dashboard search parameters for supported OAuth outcome codes without rendering raw provider-controlled values.
- [x] 2.2 Show accessible login-page guidance that tells an `account_not_linked` user to authenticate with the existing password and connect Google from the dashboard.
- [x] 2.3 Show accessible dashboard feedback for linking cancellation, failure, and invalid or consumed state, including instructions to start a new attempt.

## 3. Dashboard Account Linking

- [x] 3.1 Build a tested authentication-feature Google account control that loads linked-account status and renders loading, connected, unconnected, and error states.
- [x] 3.2 Implement the "Conectar Google" interaction with pending-state feedback and duplicate-initiation prevention.
- [x] 3.3 Compose the Google account control into the authenticated dashboard without coupling course catalog behavior to Better Auth responses.
- [x] 3.4 Refetch or invalidate linked-account status when the dashboard is entered after an OAuth callback so persisted server state determines the UI.

## 4. Security and Verification

- [x] 4.1 Add regression coverage confirming unauthenticated users cannot reach the linking control and implicit linking policy remains unchanged.
- [x] 4.2 Run focused authentication and dashboard tests, then resolve behavioral and accessibility regressions.
- [x] 4.3 Run `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run`, and `pnpm build` from `apps/web/`.
