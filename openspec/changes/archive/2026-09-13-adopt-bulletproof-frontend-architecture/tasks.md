## 1. Testing foundation

- [x] 1.1 Add Vitest, jsdom, Testing Library, user-event, Husky, ESLint import tooling and the `test`/`test:run` scripts to the frontend package, then update the pnpm lockfile.
- [x] 1.2 Create the Vitest configuration and global setup with jsdom, jest-dom matchers, the `@/` alias and deterministic cleanup.
- [x] 1.3 Add `src/testing/test-utils.tsx` with a render helper that supplies fresh application providers per test, and verify it with a minimal component test.

## 2. Characterization coverage

- [x] 2.1 Add unit tests for the authentication schemas and error mapping, covering valid input and representative failures.
- [x] 2.2 Add an integration test for the email login form using Testing Library and user-event, covering validation, pending state, success navigation and an API error.
- [x] 2.3 Add an integration test for the registration form covering its principal successful and invalid-input flows.
- [x] 2.4 Run `pnpm test:run` and make the suite independent of the real backend and external identity providers.

## 3. Architectural boundaries

- [x] 3.1 Configure ESLint import resolution for TypeScript and the `@/` alias.
- [x] 3.2 Add restricted-path zones enforcing shared-to-feature-to-app flow and preventing direct cross-feature imports.
- [x] 3.3 Audit current source placement and imports, moving only files that violate the documented layers while preserving routes and public behavior.
- [x] 3.4 Verify the boundary rules with temporary invalid imports or an equivalent automated lint fixture, then remove the invalid fixture.

## 4. Pre-commit enforcement

- [x] 4.1 Configure the frontend `prepare` script to initialize Husky from the monorepo root without adding a root package manifest.
- [x] 4.2 Add the root `.husky/pre-commit` hook invoking `pnpm --dir frontend test:run`.
- [x] 4.3 Verify that a passing suite permits a test commit and a deliberately failing test blocks it, then remove all temporary verification changes.

## 5. Documentation and final validation

- [x] 5.1 Update `frontend/AGENTS.md` with the final layer boundaries, direct-import rule, preferred libraries, testing commands and Husky behavior; explicitly omit Storybook guidance.
- [x] 5.2 Run `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run` and `pnpm build` from `frontend/` and resolve all failures.
- [x] 5.3 Confirm that login, registration, the landing page, the auth proxy and Cloudflare build configuration retain their existing routes and contracts.
