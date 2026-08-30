## Context

See `proposal.md` for motivation. Better Auth runs in the NestJS API and currently omits the cookie `Domain` attribute, while production serves the frontend and API from sibling hosts under a shared parent domain. Local development uses separate localhost ports and must not inherit production cookie scope.

The frontend currently routes Better Auth traffic through `/api/auth/*`, and authenticated course and Webpay operations use TanStack server functions. This change adds shared-cookie capability without removing either transport pattern.

## Goals / Non-Goals

**Goals:**

- Make the production cookie domain explicit, validated, and environment-specific.
- Enable Better Auth's supported cross-subdomain cookie behavior.
- Preserve secure cookie attributes and local host-only behavior.
- Provide a deterministic rollout and verification procedure for existing sessions.

**Non-Goals:**

- Removing the Better Auth proxy.
- Replacing TanStack server functions with direct browser API calls.
- Changing CORS policy or trusted origins.
- Sharing sessions outside the configured parent domain.
- Automatically migrating cookie scope in existing browser storage.

## Decisions

### Use Better Auth's cross-subdomain cookie option

Configure `advanced.crossSubDomainCookies` rather than manually overriding individual cookie definitions. This keeps cookie creation, refresh, and deletion behavior under Better Auth's supported mechanism.

Alternative considered: rewrite `Set-Cookie` in the frontend proxy. Rejected because it duplicates authentication-library behavior and can miss cookies produced by callbacks, refreshes, logout, or future plugins.

### Configure the parent domain through the API environment

Add `BETTER_AUTH_COOKIE_DOMAIN` as a hostname-only value. Production requires an explicit deployment-specific value; non-production environments may omit it, in which case the cross-subdomain option is absent and Better Auth retains host-only cookies.

Alternative considered: hard-code the production parent domain. Rejected because it couples application code to one deployment and would make preview, test, and local environments harder to operate safely.

### Fail fast on invalid production configuration

Environment validation rejects schemes, ports, paths, public-suffix-like malformed values, and a missing production value. Failing startup is preferable to silently deploying host-only cookies and rediscovering the issue through protected endpoint failures.

Alternative considered: treat the setting as optional in production. Rejected because silent fallback recreates the production incident this change addresses.

### Preserve existing proxy and server-function transports

Cookie sharing is introduced independently from request routing. Keeping the current transports limits blast radius and allows direct browser-to-API migration to be evaluated separately after cookie behavior is proven in production.

Alternative considered: restore the browser Axios client in the same change. Rejected because it combines authentication-cookie rollout with a broader networking architecture reversal.

### Renew rather than mutate existing browser cookies

Cookie scope is part of the browser's cookie identity and an existing host-only cookie cannot be converted in place. Rollout guidance will require a fresh login and explicitly check for duplicate old/new cookie names. If duplicates cause ambiguous server parsing, operators roll back and a follow-up migration will clear or version the old cookie before direct API traffic is enabled.

Alternative considered: include a temporary proxy response rewriter that expires host-only cookies. Deferred because direct API traffic is not enabled by this change and introducing cookie-name-specific migration code would increase risk.

## Risks / Trade-offs

- [Every subdomain of the configured parent domain receives the session cookie] → Inventory and trust all active subdomains, remove dangling DNS records, and keep third-party or untrusted applications on separate registrable domains.
- [Old host-only and new domain cookies can coexist] → Require reauthentication during verification, inspect browser cookie storage, and do not enable direct API traffic until duplicate-cookie behavior is understood.
- [Production configuration typo prevents startup] → Validate the exact deployment value before release and document `BETTER_AUTH_COOKIE_DOMAIN=example.com` as a non-production placeholder in the API environment example.
- [Cookie sharing can mask proxy architecture issues] → Test both proxied authentication operations and direct credentialed API access independently.
- [Rollback leaves domain-scoped cookies in browsers] → Roll back application configuration, expire the domain-scoped cookie through Better Auth logout or an operational cleanup response, then require a fresh login.

## Migration Plan

1. Add validation, Better Auth configuration, tests, and environment documentation.
2. Configure `BETTER_AUTH_COOKIE_DOMAIN` with the deployment's parent domain in the production API environment before deployment.
3. Deploy the API without changing frontend request routing.
4. Clear test-browser authentication cookies and establish a fresh email/password session.
5. Verify `Domain`, `Secure`, `HttpOnly`, `SameSite`, and `Path` attributes and confirm the cookie is sent to the API.
6. Verify session lookup, logout, password recovery, Google OAuth callback behavior, and protected endpoint access.
7. Inspect whether an old host-only cookie can coexist with the new domain cookie and document the observed behavior before any future direct-browser API migration.

Rollback: remove or disable the production domain setting, redeploy the API, expire the domain-scoped cookie, and require users to establish a new host-only session through the existing proxy.
