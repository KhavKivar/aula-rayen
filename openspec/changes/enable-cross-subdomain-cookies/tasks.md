## 1. Environment Configuration

- [x] 1.1 Add `BETTER_AUTH_COOKIE_DOMAIN` to the API environment schema as an optional hostname-only value for non-production environments.
- [x] 1.2 Require `BETTER_AUTH_COOKIE_DOMAIN` when `NODE_ENV=production` and reject schemes, ports, paths, and malformed hostnames.
- [x] 1.3 Document the variable with a neutral example value in `apps/api/.env.example` without exposing deployment-specific domains or changing the local default behavior.
- [x] 1.4 Add focused environment-validation tests for valid production, missing production, local omission, and invalid URL-like values.

## 2. Better Auth Configuration

- [x] 2.1 Configure `advanced.crossSubDomainCookies` only when the validated cookie domain is present while preserving the existing IP-address configuration.
- [x] 2.2 Extend the Better Auth configuration tests to assert cross-subdomain sharing is enabled with the configured domain.
- [x] 2.3 Add coverage confirming omitted non-production configuration leaves Better Auth's host-only cookie behavior unchanged.

## 3. Security And Migration Readiness

- [x] 3.1 Inventory active subdomains of the production parent domain and confirm no untrusted application or dangling DNS record would receive the shared session cookie.
- [x] 3.2 Document the rollout requirement to clear old host-only cookies and establish a fresh session, including how to inspect duplicate cookie names.
- [x] 3.3 Document rollback steps that disable sharing, expire the domain-scoped cookie, and renew host-only sessions.
- [x] 3.4 Configure `BETTER_AUTH_COOKIE_DOMAIN` with the parent domain in the external production API environment before deployment.

## 4. Verification

- [x] 4.1 Run API ESLint, unit tests, and production build from `apps/api`.
- [ ] 4.2 Verify a fresh production login emits the configured parent `Domain`, `Secure`, `HttpOnly`, `SameSite=Lax`, and `Path=/`.
- [ ] 4.3 Verify the browser sends the shared cookie to the API subdomain and a credentialed protected request no longer returns `401` because of a missing session.
- [ ] 4.4 Regression-test proxied session lookup, email login, logout, password recovery, and Google OAuth callback behavior.
- [ ] 4.5 Record the observed coexistence behavior of old host-only and new domain-scoped cookies before proposing any direct-browser API transport change.
