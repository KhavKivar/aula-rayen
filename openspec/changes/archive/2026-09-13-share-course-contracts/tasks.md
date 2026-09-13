## 1. Workspace Foundation

- [x] 1.1 Add the root private `package.json` and `pnpm-workspace.yaml`, move the applications to `apps/web` and `apps/api`, and include `packages/*`.
- [x] 1.2 Create the compiled `packages/contracts` TypeScript package named `@aula-rayen/contracts`, with Zod as its only runtime dependency and explicit package exports.
- [x] 1.3 Add `@aula-rayen/contracts` as a `workspace:*` dependency to frontend and backend and add scripts that build it before dependent builds and type checks.
- [x] 1.4 Generate and inspect one root `pnpm-lock.yaml`, then remove the application lockfiles after a clean workspace install succeeds.

## 2. Course Contract Package

- [x] 2.1 Implement strict Zod schemas and inferred types for Course catalog items, catalog arrays, purchased details, creation requests, non-empty partial update requests, mutation responses, and API errors.
- [x] 2.2 Encode ISO timestamp, non-negative integer price, required-field, and unknown-property constraints in the schemas.
- [x] 2.3 Add package tests proving catalog schemas exclude private links, detail schemas require content links, mutations enforce their constraints, and API errors accept expected Nest response shapes.
- [x] 2.4 Build the types package and verify its JavaScript, declaration files, exports, and lack of backend or Drizzle dependencies.

## 3. Backend Course Boundary

- [x] 3.1 Add a backend-local Nest Zod validation pipe that converts schema failures into the shared API error envelope without adding Nest dependencies to `@aula-rayen/contracts`.
- [x] 3.2 Replace duplicated Course mutation validation with the shared create and update schemas while retaining Spanish client-facing validation messages.
- [x] 3.3 Add explicit Course response mappers that convert persistence dates to ISO strings and produce catalog-safe versus purchased-detail payloads.
- [x] 3.4 Apply the shared request and response contracts to Course controller endpoints without changing routes, authorization rules, or service persistence behavior.
- [x] 3.5 Extend Course E2E tests to parse catalog, purchased detail, successful mutation, invalid mutation, not-found, and purchase-conflict responses with shared schemas and verify private links never appear in catalog responses.

## 4. Frontend Course Boundary

- [x] 4.1 Replace the frontend-local Course wire types with imports inferred from `@aula-rayen/contracts` while preserving feature dependency boundaries.
- [x] 4.2 Parse Course catalog and purchased-detail Axios responses with their shared schemas inside the Course API functions before values enter TanStack Query or UI components.
- [x] 4.3 Update Course component fixtures and tests to use contract-conforming values, including ISO timestamps and endpoint-specific fields.
- [x] 4.4 Add frontend API tests proving valid Course responses are returned and incompatible responses are rejected at the API boundary.

## 5. Automation and Documentation

- [x] 5.1 Update web and API GitHub workflows and path filters for `apps/web` and `apps/api`, install from the workspace root, and build `@aula-rayen/contracts` before application validation and deployment.
- [x] 5.2 Update repository instructions to document the shared workspace, root lockfile, package boundaries, and application-specific validation commands.
- [x] 5.3 Run contracts tests/build, backend lint/tests/E2E/build, and frontend lint/typecheck/tests/build from a clean workspace installation.
- [x] 5.4 Inspect the final diff to confirm deployment path filters remain application-specific and no database, authentication, or Webpay internals were moved into the contracts package.
