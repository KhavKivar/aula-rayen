# Full-Stack Learning Platform

A production-oriented learning platform implemented as a pnpm monorepo. It combines a TanStack Start frontend, a NestJS API, shared TypeScript contracts, authentication, course delivery, and payment workflows.

## Highlights

- File-based web routing with TanStack Start and React 19
- NestJS API with typed configuration and health checks
- Shared contracts consumed by both applications
- Email/password and Google authentication flows
- Course catalog, enrollment dashboard, and Transbank integration
- Docker Compose development environment
- Unit, integration, and end-to-end test suites

## Repository layout

```text
apps/
  api/        NestJS API and database access
  web/        TanStack Start web application
packages/
  contracts/  Shared schemas and TypeScript types
  config/     Shared project configuration
```

## Getting started

Requirements: Node.js 20+, pnpm 10+, and PostgreSQL.

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm build
```

Populate the local environment files before starting the applications. All committed environment files contain placeholders only.

```bash
pnpm --filter @aula-rayen/api start:dev
pnpm --filter @aula-rayen/web dev
```

The API listens on `http://localhost:3000` and the web application on `http://localhost:3001` by default.

## Docker

```bash
docker compose up --build
```

## Validation

```bash
pnpm typecheck
pnpm test
pnpm build
```

This repository is a portfolio snapshot. Deployment credentials, production environment values, and third-party secrets are intentionally excluded.
