## 1. Logout Behavior Tests

- [x] 1.1 Extend the navbar tests to verify that "Cerrar sesión" is shown only for an active, resolved session.
- [x] 1.2 Add interaction tests covering a successful logout, disabled and accessible pending feedback, and prevention of duplicate requests.
- [x] 1.3 Add a failure test verifying that authenticated navigation remains visible, an accessible error is shown, and logout can be retried.

## 2. Logout Control Implementation

- [x] 2.1 Add the authenticated navbar logout control using the existing Better Auth client while preserving the dashboard link and responsive layout.
- [x] 2.2 Manage logout pending and failure state so duplicate requests are blocked, status is announced accessibly, and failure leaves the action retryable.
- [x] 2.3 After successful logout, navigate to the public landing page and ensure the navbar reflects the signed-out session state.

## 3. Verification

- [x] 3.1 Run the focused navbar test suite and resolve any behavioral or accessibility regressions.
- [x] 3.2 Run `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm test:run` from `apps/web/`.
