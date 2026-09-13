## Why

The frontend and backend currently define Course payloads independently, which allows HTTP contract drift and obscures important differences between database entities and public responses. A shared, framework-neutral contract package will provide compile-time and runtime agreement without exposing Drizzle internals to the frontend.

## What Changes

- Convert the repository root to a pnpm workspace and organize the applications under `apps/web` and `apps/api`.
- Add a private `@aula-rayen/contracts` package under `packages/contracts` containing Zod schemas and inferred TypeScript types for Course HTTP requests and responses.
- Define distinct contracts for catalog items, purchased-course details, course creation, course updates, and API errors rather than exposing one database-shaped Course type.
- Make the backend validate Course request payloads and map persistence values such as `Date` into their HTTP representation.
- Make the frontend consume shared Course types and validate Course API responses at runtime.
- Consolidate dependency resolution into a root workspace lockfile and update repository documentation and CI commands accordingly.

## Capabilities

### New Capabilities

- `course-api-contracts`: Shared, runtime-validatable contracts for Course API requests and responses across the backend and frontend.

### Modified Capabilities

None.

## Impact

- Adds root pnpm workspace configuration, moves the applications under `apps/`, and adds the new `packages/contracts` package.
- Changes Course DTO, controller response mapping, frontend API client typing, and Course-related tests.
- Replaces the two application lockfiles with one root workspace lockfile.
- Requires frontend and backend build/test workflows to build or resolve `@aula-rayen/contracts` first.
- Does not expose database schemas or add Turborepo.
