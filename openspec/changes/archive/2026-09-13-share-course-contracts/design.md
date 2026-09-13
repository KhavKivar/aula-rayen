## Context

See `proposal.md` for motivation. The repository currently contains independent `frontend/` and `backend/` pnpm projects with separate lockfiles. Both use TypeScript and Zod 4, but Course HTTP shapes are handwritten independently; the backend persistence type uses `Date`, while the frontend correctly observes serialized strings. The frontend runs on TanStack Start and Cloudflare Workers, and the backend uses NestJS, class-validator, Drizzle, and PostgreSQL.

The change crosses package management, CI, backend request/response boundaries, and frontend API parsing, so it needs an explicit build and migration design.

## Goals / Non-Goals

**Goals:**

- Establish `@aula-rayen/contracts` as the sole shared definition of Course wire schemas and types.
- Keep the contracts package framework-neutral and usable in browser, Worker, Node.js, and test contexts.
- Preserve the current HTTP routes while making their payload shapes explicit and runtime-validatable.
- Keep fresh installs and CI deterministic through one workspace lockfile.
- Make the package build order explicit without introducing a task orchestrator.

**Non-Goals:**

- Sharing Drizzle schemas, repositories, authentication internals, or business services.
- Migrating Webpay or authentication contracts in this change.
- Introducing Turborepo, code generation, or OpenAPI as the contract source.
- Changing Course authorization rules or endpoint URLs.

## Decisions

### Use a conventional apps and packages workspace layout

Move the applications to `apps/web` and `apps/api`, add `pnpm-workspace.yaml` entries for `apps/*` and `packages/*`, and add a private root `package.json`. Generate one root `pnpm-lock.yaml` and remove the application lockfiles. Deployment paths and repository instructions are updated atomically.

This conventional layout makes application and shared-package boundaries explicit. Independent package installations were rejected because `workspace:*` dependency resolution and a single deterministic dependency graph are central to the shared package.

### Publish Course contracts as the private `@aula-rayen/contracts` package

Create a small TypeScript package with Zod as its only runtime dependency. It exports public entry points for Course contracts and shared API errors, and builds JavaScript plus declarations into `dist`. Consumers depend on it through `workspace:*`; root and application scripts ensure contracts are built before application builds and type checks.

Exporting TypeScript source directly was rejected because the Nest build uses NodeNext while the frontend uses bundler resolution. A compiled package gives both consumers stable package exports and avoids pulling sources outside each application's compilation boundary.

### Model endpoint-specific wire shapes instead of a universal Course

Define reusable base fields, then distinct schemas for catalog items, purchased details, create requests, update requests, mutation responses, and API errors. All inferred types are derived from schemas. Response schemas represent `createdAt` as an ISO string.

A universal `Course` matching Drizzle was rejected because it would model `Date` incorrectly over HTTP and make private links appear valid in catalog responses. Sharing Drizzle inference was rejected because it couples public consumers to storage and creates a data-exposure risk.

### Keep framework integration outside the contracts package

The backend adds a local Nest-compatible Zod validation pipe for Course mutations and explicit response mapping from persistence values to wire values. The contracts package imports neither NestJS nor Drizzle. Existing global validation remains available for endpoints not migrated in this change.

Keeping class-validator annotations as a second source of Course constraints was rejected because it permits runtime rules and shared schemas to drift. Adding a Nest-specific adapter to the shared package was rejected because it would make browser consumers install backend framework dependencies.

### Parse frontend responses at the API boundary

Course API functions parse Axios response data with the matching shared schema before returning it. UI components consume inferred contract types and do not parse again.

Type-only imports were rejected as insufficient because TypeScript cannot protect against a deployed backend returning an incompatible payload. Parsing in components was rejected because it duplicates validation and allows invalid values to travel through query state.

### Verify contracts at both HTTP boundaries

Backend E2E tests exercise real Course endpoints and parse successful and error responses with shared schemas. Frontend API tests verify successful parsing and rejection of incompatible payloads. Package-level schema tests cover field visibility, date formatting, mutation constraints, and unknown-key rejection.

This layered approach distinguishes schema behavior, backend conformance, and frontend enforcement while avoiding browser E2E coverage for purely structural contracts.

## Risks / Trade-offs

- [Workspace conversion changes install and lockfile behavior] → Update CI, documentation, and root scripts atomically; validate clean installation before removing application lockfiles.
- [Compiled contracts can be stale locally] → Make dependent build/typecheck scripts build `@aula-rayen/contracts` first and provide a watch script for concurrent development.
- [Strict response parsing can reveal existing payload mismatches] → Add contract tests before switching frontend parsing, then map backend responses explicitly rather than weakening schemas.
- [Zod validation error formatting may differ from current class-validator errors] → Preserve the shared API error envelope and Spanish user-visible messages while allowing a message list for field errors.
- [Workspace-wide dependency resolution may update transitive versions] → Generate the root lockfile from existing manifests, inspect lockfile changes, and run both applications' full validation commands.

## Migration Plan

1. Add root workspace files, move the applications under `apps/`, and add the compiled `@aula-rayen/contracts` package under `packages/contracts` while retaining existing application manifests.
2. Generate the root lockfile and wire `workspace:*` dependencies and build ordering.
3. Add Course schemas and package-level tests.
4. Migrate the backend Course request validation and response mapping, then prove endpoint conformance with E2E tests.
5. Migrate frontend Course API functions and UI types, then add response-parsing tests.
6. Update CI and repository instructions and run clean install, lint, typecheck, test, and build validation for both applications.
7. Remove the old application lockfiles only after the workspace validation succeeds.

Rollback consists of restoring the independent manifests and lockfiles and reverting consumers to local Course types. No database or persisted-data migration is involved.
