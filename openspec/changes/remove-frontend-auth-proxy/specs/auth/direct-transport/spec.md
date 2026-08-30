## Purpose

Permite al frontend TanStack Start autenticarse directamente contra el backend expuesto en `aula-rayen.vasvani.shop/api` via Cloudflare Worker, eliminando el proxy intermedio `/api/auth/*` y manteniendo cookies, SSR y OAuth consistentes.

## ADDED Requirements

### Requirement: Frontend authenticates directly without proxy
The system SHALL route all Better Auth operations (sign-in, sign-up, sign-out, session, password reset, OAuth) directly to the backend Worker at the configured API origin instead of through a frontend catch-all proxy route.

#### Scenario: Email sign-in goes directly to API
- **WHEN** a user submits email/password on `/login`
- **THEN** the frontend issues a request to `{VITE_PUBLIC_API_URL}/api/auth/sign-in/email` with `credentials: include` and without traversing `src/app/api/auth/$`

#### Scenario: Proxy route no longer exists
- **WHEN** a browser requests `GET /api/auth/session` on the frontend origin
- **THEN** the frontend does NOT handle it via a server route; the request is either 404 or is handled by the Worker route to the API, and no `proxyAuthRequest` code is executed

#### Scenario: OAuth callback uses direct backend URL
- **WHEN** a user initiates Google sign-in
- **THEN** `signIn.social` uses a `callbackURL` and `errorCallbackURL` built from `window.location.origin` but Better Auth redirects through the direct API origin, and no proxy rewrites the OAuth flow

### Requirement: Auth client baseURL points to direct API origin
The system SHALL configure the Better Auth client `baseURL` to the canonical API origin (`VITE_PUBLIC_API_URL`, e.g. `https://aula-rayen.vasvani.shop/api` in production, `http://localhost:3000` in development) consistently for SSR and browser, instead of `VITE_PUBLIC_SITE_URL` / `window.location.origin` proxy mode.

#### Scenario: Browser client resolves baseURL to API
- **WHEN** the auth client runs in the browser
- **THEN** its `baseURL` equals `VITE_PUBLIC_API_URL` (or derived API URL) and requests include credentials

#### Scenario: SSR client resolves baseURL to API
- **WHEN** the auth client or `authClient.getSession()` runs on the server (SSR / `beforeLoad` in `/_protected`)
- **THEN** it fetches the session directly from the API origin with forwarded cookies, without proxy hop

### Requirement: Authenticated requests include credentials and preserve cookies
The system SHALL send authentication cookies with `credentials: include` (or equivalent `fetch` option) and preserve `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, and optional `Domain=.vasvani.shop` attributes as configured in the backend.

#### Scenario: Login sets cookie visible to API
- **WHEN** a user logs in via direct transport
- **THEN** the backend `Set-Cookie` response is stored by the browser with the expected attributes and is sent on subsequent credentialed requests to `aula-rayen.vasvani.shop/api/*`

#### Scenario: SSR forwards cookie to API
- **WHEN** an SSR loader calls the API (e.g., `requestBackendJson` or `authClient.getSession` on server)
- **THEN** the server forwards the incoming `cookie` header to the direct API URL and applies `Cache-Control: no-store`

### Requirement: Backend CORS and trustedOrigins allow direct frontend origin
The system SHALL configure the NestJS API CORS and Better Auth `trustedOrigins` to accept the direct frontend origin (`https://aula-rayen.vasvani.shop` and `http://localhost:3001` in dev) with `credentials: true`, so direct browser requests are not blocked.

#### Scenario: Browser login succeeds with CORS credentials
- **WHEN** the browser POSTs to `https://aula-rayen.vasvani.shop/api/api/auth/sign-in/email` from `https://aula-rayen.vasvani.shop`
- **THEN** the response includes `Access-Control-Allow-Credentials: true` and `Access-Control-Allow-Origin: https://aula-rayen.vasvani.shop`, and the login completes

#### Scenario: Preflight is handled
- **WHEN** the browser sends an `OPTIONS` preflight for an authenticated cross-origin request
- **THEN** the API responds with allowed methods/headers and credentials support

### Requirement: Error and session semantics remain unchanged
The system SHALL preserve observable auth semantics: `toAuthError` mapping, session shape returned by `authClient.getSession()`, password-reset and OAuth error messages, and `401` for unauthenticated access, regardless of transport.

#### Scenario: Failed login surfaces same error
- **WHEN** direct sign-in returns a Better Auth error payload
- **THEN** the UI shows the same mapped `AuthError` message as with the proxy (e.g., "No fue posible iniciar sesión.")

#### Scenario: Expired session redirects to login
- **WHEN** `/_protected` `beforeLoad` finds no session via direct fetch
- **THEN** it redirects to `/login?redirect=...` identically to the proxied flow

### Requirement: Environment configuration documents direct API origin
The system SHALL document `VITE_PUBLIC_API_URL` as the direct API Worker origin and `VITE_PUBLIC_SITE_URL` as the site origin, with distinct values in production (`https://aula-rayen.vasvani.shop/api` vs `https://aula-rayen.vasvani.shop`) and matching localhost values in development.

#### Scenario: Production env example reflects Worker URL
- **WHEN** a developer reads `apps/web/.env.example` and `apps/api/.env.example`
- **THEN** the examples show `VITE_PUBLIC_API_URL=https://aula-rayen.vasvani.shop/api` (or equivalent), `VITE_PUBLIC_SITE_URL=https://aula-rayen.vasvani.shop`, `BETTER_AUTH_URL=https://aula-rayen.vasvani.shop/api`, and `FRONTEND_URL=https://aula-rayen.vasvani.shop`

#### Scenario: Local env still works without proxy
- **WHEN** the frontend runs locally with `VITE_PUBLIC_API_URL=http://localhost:3000` and `VITE_PUBLIC_SITE_URL=http://localhost:3001`
- **THEN** direct auth requests reach `http://localhost:3000/api/auth/*` and local cookies remain host-only

### Requirement: Removal is verifiable and does not leave dead code
The system SHALL remove `src/lib/auth-proxy.ts`, `src/lib/auth-proxy.test.ts`, `src/app/api/auth/$.ts`, and all imports/references to them, and the generated `routeTree.gen.ts` SHALL no longer contain the `/api/auth/$` route.

#### Scenario: Codebase contains no proxy references
- **WHEN** searching for `proxyAuthRequest` or `ApiAuthSplatRoute`
- **THEN** no matches exist outside archived change history and documentation of the removal

#### Scenario: Route tree regenerates without auth splat
- **WHEN** running `pnpm build` or regenerating TanStack Router routes
- **THEN** `src/routeTree.gen.ts` does not declare `'/api/auth/$'`
