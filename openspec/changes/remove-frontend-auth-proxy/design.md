## Context

Ver `proposal.md` para motivación. Estado actual: `apps/web` mantiene un catch-all TanStack Start `src/app/api/auth/$.ts` que delega en `src/lib/auth-proxy.ts` (`proxyAuthRequest`). Ese proxy reenvía método, query, headers y body a `VITE_PUBLIC_API_URL` con `duplex: half` y `redirect: manual`, eliminando `host`/`content-length`. El cliente Better Auth en `src/lib/auth-client.ts` usa `baseURL = VITE_PUBLIC_SITE_URL` en SSR y `window.location.origin` en browser, forzando el paso por el proxy same-origin. El backend NestJS (`apps/api/src/modules/auth/auth.ts`, `src/main.ts`) confía en `FRONTEND_URL`/`BETTER_AUTH_URL` y, desde `enable-cross-subdomain-cookies`, emite cookies con `crossSubDomainCookies: { domain: vasvani.shop }`. El nuevo Worker en `aula-rayen.vasvani.shop/api/` hace que API y frontend compartan origen (path-based routing), por lo que el proxy es redundante.

Restricciones: TanStack Start SSR corre en Cloudflare Worker; Better Auth necesita `credentials: include` y cookies `HttpOnly` visibles para el API; OAuth y password-reset redirigen vía `FRONTEND_URL`; y `routeTree.gen.ts` es generado y no se edita manualmente.

## Goals / Non-Goals

**Goals:**

- Eliminar completamente el proxy frontend y hacer que `auth-client` hable directo al Worker API.
- Mantener paridad funcional de login, registro, sesión, logout, Google OAuth, recovery y pago.
- Conservar atributos de cookie (`Secure`, `HttpOnly`, `SameSite=Lax`, `Domain`) y comportamiento `crossSubDomainCookies`.
- Alinear `VITE_PUBLIC_API_URL`, `BETTER_AUTH_URL`, `FRONTEND_URL` y CORS/`trustedOrigins` con el nuevo origen Worker.
- Simplificar `backend-api.server.ts` y SSR `getSession` tras el cambio.
- Limpiar tests, `routeTree`, docs y workflows que asumen proxy.

**Non-Goals:**

- Cambiar el esquema de cookies o rotar `BETTER_AUTH_SECRET`.
- Mover lógica de Webpay o contratos `packages/contracts`.
- Reemplazar Better Auth por otro proveedor.
- Introducir un BFF genérico o reintroducir rewrites del frontend Worker.
- Modificar `crossSubDomainCookies` salvo ajustes documentales (sigue compatible con same-origin).

## Decisions

### 1. Eliminar `auth-proxy.ts` y `src/app/api/auth/$.ts`; no dejar shim

Borrar ambos archivos y su test. `proxyAuthRequest` hace streaming y borra headers manualmente; con Worker same-origin ese código no aporta y es deuda. Alternativa considerada: dejar shim que redirija 301 a `VITE_PUBLIC_API_URL`. Rechazada porque Better Auth y `fetch` ya resuelven directo; un shim solo retrasa la limpieza y confunde `routeTree`.

### 2. `auth-client.ts` apunta directo a `VITE_PUBLIC_API_URL` con `credentials: include`

Cambiar:
```ts
export const authClient = createAuthClient({
  baseURL: env.VITE_PUBLIC_API_URL, // https://aula-rayen.vasvani.shop/api en prod
  fetchOptions: { credentials: "include" },
});
```
Antes usaba `VITE_PUBLIC_SITE_URL` (SSR) vs `window.location.origin` (browser) divergentes. Nueva opción unifica ambos entornos; Better Auth `fetch` respeta `credentials`. Alternativa considerada: mantener `window.location.origin` y configurar Worker rewrite `/api/*` → API. Rechazada porque acopla despliegue del frontend al backend y oculta CORS; usar `VITE_PUBLIC_API_URL` es explícito y funciona tanto local (`http://localhost:3000`) como prod.

Verificación: confirmar que `better-auth/react` soporta `fetchOptions.credentials`; si no, envolver `fetch` con `credentials: "include"`.

### 3. `env.ts` mantiene `VITE_PUBLIC_API_URL` como origen API, `VITE_PUBLIC_SITE_URL` como origen site

Prod: `VITE_PUBLIC_API_URL=https://aula-rayen.vasvani.shop/api`, `VITE_PUBLIC_SITE_URL=https://aula-rayen.vasvani.shop`. Dev: `http://localhost:3000` vs `http://localhost:3001`. No unificar en una sola variable; se usan en lugares distintos (API fetch vs redirects/OG). Alternativa: colapsarlas. Rechazada porque rompería `redirectTo` de OAuth/recovery que debe apuntar al site.

### 4. Backend: ajustar `BETTER_AUTH_URL`, `FRONTEND_URL`, CORS y `trustedOrigins`

- `BETTER_AUTH_URL` en prod pasa a `https://aula-rayen.vasvani.shop/api` (antes `https://api.*`).
- `FRONTEND_URL=https://aula-rayen.vasvani.shop` (sin `/api`).
- `auth.trustedOrigins=[env.FRONTEND_URL, "http://localhost:3001"]` sin cambios estructurales, pero verificar que incluya el nuevo origen prod.
- `app.enableCors({ origin: [env.FRONTEND_URL, "http://localhost:3001"], credentials: true })` idem.
- `GOOGLE_REDIRECT_URI` si estaba en `https://api.../api/auth/callback/google` pasa a `https://aula-rayen.vasvani.shop/api/api/auth/callback/google` o `https://aula-rayen.vasvani.shop/api/auth/callback/google` según Workers mapping; validar contra consola Google.

Alternativa: dejar `BETTER_AUTH_URL` en subdominio API separado. Rechazada porque contradice el Worker path-based y reintroduciría CORS innecesario.

### 5. SSR (`backend-api.server.ts` + `/_protected.tsx`)

`requestBackendJson` hoy hace `getRequestHeader("cookie")` → `fetch(new URL(path, VITE_PUBLIC_API_URL))`. Con Worker same-origin sigue funcionando; solo cambia que `VITE_PUBLIC_API_URL` ya no es cross-subdominio sino same-site. Mantener forwarding de `cookie` en SSR porque el fetch SSR no tiene cookies de browser automáticamente. `authClient.getSession()` en `beforeLoad` de `/_protected` ahora usa `baseURL` directo, pero sigue necesitando `fetch` con cookie header en SSR; verificar que `better-auth` SSR lee `cookie` del request o si hay que pasar `headers`.

Alternativa: eliminar `backend-api.server.ts` y usar `fetch` directo con `credentials: include` también en SSR. Rechazada porque en SSR `credentials: include` no propaga cookies del request entrante sin forwarding explícito.

### 6. `routeTree.gen.ts` y docs

El archivo es generado por TanStack Router; tras borrar `src/app/api/auth/$.ts` se regenera (`pnpm build` o `pnpm dev` regenera). No editar manualmente; solo verificar ausencia de `ApiAuthSplatRoute`. Actualizar `apps/web/README.md`, `docs/specs/tanstack-start-migration.md`, `AGENTS.md` y `apps/web/.env.example` para quitar menciones al proxy catch-all.

### 7. Tests

- Borrar `src/lib/auth-proxy.test.ts`.
- Actualizar `backend-api.server.test.ts` y tests que mockean `env.VITE_PUBLIC_API_URL` + `VITE_PUBLIC_SITE_URL` (ej. `course-dashboard.test.tsx`, `course-management-panel.test.tsx`) para esperar `baseURL = VITE_PUBLIC_API_URL`.
- Añadir tests de `auth-client` config (que `baseURL` es `VITE_PUBLIC_API_URL` y `credentials` es `include`) y de `requestBackendJson` que sigue reenviando cookie.
- Verificar que `apps/api/src/config/env.spec.ts` y `auth.spec.ts` reflejan nuevo `BETTER_AUTH_URL`.

## Risks / Trade-offs

- [Direct `Set-Cookie` ahora viene del Worker API, no del frontend Worker] → Verificar `Domain`, `Secure`, `SameSite` en prod; si `Domain=.vasvani.shop` se mantiene, same-origin `/api` sigue enviando cookie; si se quiere host-only, documentar que same-origin no necesita `Domain`.
- [CORS mal configurado bloquea `credentials: include`] → Probar login prod con `Access-Control-Allow-Credentials` y `Allow-Origin` exacto; fallback es re-agregar origen a `trustedOrigins`/CORS.
- [OAuth redirect URI cambia] → Actualizar consola Google antes de deploy; si se olvida, OAuth falla; mitigación: validar `GOOGLE_REDIRECT_URI` en staging.
- [SSR `getSession` sin cookie forwarding] → Asegurar que `beforeLoad` aún obtiene sesión; si falla, propagar `cookie` header explícitamente o envolver `fetch`.
- [Cookies host-only previas coexisten con domain cookies] → Tras el cambio same-origin, documentar renovación de sesión como en `enable-cross-subdomain-cookies` para limpiar duplicados.
- [Generación de `routeTree.gen.ts` no ejecutada] → CI falla si el archivo desactualizado queda versionado; incluir `pnpm build` en validación local.

## Migration Plan

1. Actualizar env y secrets: `VITE_PUBLIC_API_URL`, `VITE_PUBLIC_SITE_URL`, `BETTER_AUTH_URL`, `FRONTEND_URL`, `GOOGLE_REDIRECT_URI` en `.env.example`, `.env.local` y GitHub Secrets (`deploy-web.yml`, `deploy-api.yml`). Verificar `BETTER_AUTH_COOKIE_DOMAIN`.
2. Cambiar `src/lib/auth-client.ts` a `baseURL = VITE_PUBLIC_API_URL` + `credentials: include`; actualizar `src/config/env.ts` documentación.
3. Ajustar `apps/api/src/modules/auth/auth.ts` y `src/main.ts` (CORS/trustedOrigins) y, si aplica, `env.schema.ts`.
4. Borrar `src/app/api/auth/$.ts`, `src/lib/auth-proxy.ts`, `auth-proxy.test.ts`; regenerar `src/routeTree.gen.ts` (`pnpm build`).
5. Revisar `src/lib/backend-api.server.ts` y `src/app/_protected.tsx` para forwarding de cookies en SSR.
6. Actualizar `apps/web/README.md`, `docs/specs/tanstack-start-migration.md`, `AGENTS.md`, y tests afectados.
7. Ejecutar validación: `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run`, `pnpm build` en `apps/web`; `pnpm exec eslint`, `pnpm test`, `pnpm build` en `apps/api`; `pnpm check:landing`.
8. Staging: desplegar Worker API en `aula-rayen.vasvani.shop/api/`, luego frontend; verificar login/logout/refresh/session/OAuth/recovery/pago y atributos de cookie en DevTools.
9. Prod: desplegar API primero, luego web; comunicar renovación de sesión a usuarios con sesión previa host-only.
10. Verificación post-deploy: request directa `GET https://aula-rayen.vasvani.shop/api/auth/session` con cookie incluye sesión; `GET https://aula-rayen.vasvani.shop/api/courses` con sesión válida; logout expira cookie.

Rollback: restaurar `src/app/api/auth/$.ts` + `auth-proxy.ts`, revertir `auth-client` a `VITE_PUBLIC_SITE_URL`/`window.location.origin`, y redeplegar frontend; cookies ya emitidas con `Domain` siguen válidas hasta expiración/logout, no requieren migración adicional.

## Open Questions

Resueltas durante implementación:

- **Mapping Worker:** `workers/index.ts` confirma `url.pathname.replace(/^\/api/, "")`. Por tanto `BETTER_AUTH_URL=https://aula-rayen.vasvani.shop/api` y `GOOGLE_REDIRECT_URI=https://aula-rayen.vasvani.shop/api/api/auth/callback/google`, que el Worker reescribe a `https://app.vasvani.shop/api/auth/callback/google` (origen real NestJS). Visible doble `/api` es esperado por el stripping.
- **Cookie Domain:** Se mantiene `BETTER_AUTH_COOKIE_DOMAIN=vasvani.shop` (`Domain=.vasvani.shop`). Con Worker same-origin sigue permitiendo que el browser envíe la cookie tanto a `aula-rayen.vasvani.shop/api/*` como a futuros subdominios (`app.vasvani.shop`) si se accede directo; host-only se evaluará en un change separado si se quiere reducir alcance.
