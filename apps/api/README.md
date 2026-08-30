# Learning Platform API

NestJS service for authentication, courses, enrollment, payments, and password-recovery email delivery. See the [root README](../../README.md) for full setup and architecture notes.

```bash
cp .env.example .env
pnpm start:dev
pnpm test
```

Use development-only credentials locally. Production secrets must be supplied by the deployment platform.

## Cross-subdomain sessions

Production deployments whose frontend and API use sibling subdomains must set
`BETTER_AUTH_COOKIE_DOMAIN` to their shared parent hostname. Use a hostname only,
without a protocol, port, or path. Local development should leave the variable
unset so Better Auth continues to issue host-only cookies.

Before enabling the setting, inventory every subdomain under the parent domain.
Do not share session cookies when an untrusted application, third-party service,
or dangling DNS record exists within that scope.

Cookies created before this setting is enabled remain host-only. During rollout:

1. Clear the old authentication cookies in a test browser.
2. Sign in again to establish a domain-scoped session.
3. Inspect browser storage for cookies with the same name but different domains.
4. Verify `Domain`, `Secure`, `HttpOnly`, `SameSite=Lax`, and `Path=/` before
   enabling direct browser-to-API traffic.

To roll back, remove the production setting, redeploy the API, expire the
domain-scoped session cookie through logout or an operational cleanup response,
and require users to sign in again to establish host-only sessions.
