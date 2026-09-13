## 1. OAuth Error Contract

- [x] 1.1 Add an allowlisted login-route search schema and fixed Spanish message mapping for `account_not_linked` and generic OAuth failures.
- [x] 1.2 Add focused tests proving the known conflict is mapped correctly, unknown values are sanitized, and an absent error produces no message.

## 2. Login Presentation

- [x] 2.1 Add an accessible OAuth error alert to the authentication feature and compose it above the login form using validated route search data.
- [x] 2.2 Add route or component tests verifying the existing-account guidance is displayed without exposing raw callback values.
- [x] 2.3 Verify `Continuar con Google` remains available and no Google connection control is restored on the dashboard.

## 3. Validation

- [x] 3.1 Run frontend lint, TypeScript checks, and the focused authentication test suite.
- [x] 3.2 Run the complete frontend test suite and production build.
