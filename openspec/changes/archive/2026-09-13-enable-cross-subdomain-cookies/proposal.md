## Why

Production serves the frontend and API from sibling subdomains, but Better Auth currently issues a host-only session cookie. Direct browser requests to the API subdomain therefore cannot carry a session established through the frontend subdomain, resulting in authenticated endpoints returning `401`.

## What Changes

- Configure Better Auth to share its session cookie across trusted subdomains of the configured parent domain in production.
- Introduce validated environment configuration for the parent cookie domain while preserving host-only cookies in local development.
- Document the production value and verify the resulting cookie security attributes and authenticated cross-subdomain behavior.
- Define rollout checks for pre-existing host-only cookies so users can establish an unambiguous shared session after deployment.

## Capabilities

### New Capabilities

- `cross-subdomain-auth-session`: Defines how a Better Auth session is shared securely between the frontend and API sibling subdomains while retaining local host-only behavior.

### Modified Capabilities

None.

## Impact

- Affects Better Auth configuration and environment validation in `apps/api`.
- Adds a production deployment variable for the cookie parent domain.
- Changes the browser-visible scope of authentication cookies to all subdomains of the configured parent domain.
- Requires API tests plus production verification of cookie attributes, login, logout, session lookup, protected API access, password recovery, and Google OAuth.
- Does not remove the existing authentication proxy or TanStack server functions as part of this change.
