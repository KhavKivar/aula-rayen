## Context

Ver `proposal.md` para motivación. Estado actual: `apps/web` mantiene un catch-all TanStack Start `src/app/api/auth/$.ts` que delega en `src/lib/auth-proxy.ts` (`proxyAuthRequest`). Ese proxy reenvía método, query, headers y body a `VITE_PUBLIC_API_URL` con `duplex: half` y `redirect: manual`, eliminando `host`/`content-length`. El cliente Better Auth en `src/lib/auth-client.ts` usa `baseURL = VITE_PUBLIC_SITE_URL` en SSR y `window.location.origin` en browser, forzando el paso por el proxy same-origin. El backend NestJS (`apps/api/src/modules/auth/auth.ts`, `src/main.ts`) confía en `FRONTEND_URL`/`BETTER_AUTH_URL` y, desde `enable-cross-subdomain-cookies`, emite cookies con `crossSubDomainCookies: { domain: psicologarayen.cl }`. Arquitectura final: el Worker same-origin se descartó y la API se consume directo en `api.psicologarayen.cl` con CORS y cookies cross-subdominio, por lo que el proxy es redundante.

Restricciones: TanStack Start SSR corre en Cloudflare Worker; Better Auth necesita `credentials: include` y cookies `HttpOnly` visibles para el API; OAuth y password-reset redirigen vía `FRONTEND_URL`; y `routeTree.gen.ts` es generado y no se edita manualmente.

## Goals / Non-Goals

**Goals:**

- Eliminar completamente el proxy frontend y hacer que `auth-client` hable directo con la API.
- Mantener paridad funcional de login, registro, sesión, logout, Google OAuth, recovery y pago.
- Conservar atributos de cookie (`Secure`, `HttpOnly`, `SameSite=Lax`, `Domain`) y comportamiento `crossSubDomainCookies`.
- Alinear `VITE_PUBLIC_API_URL`, `BETTER_AUTH_URL`, `FRONTEND_URL` y CORS/`trustedOrigins` con el origen directo de la API.
- Simplificar el SSR de sesión tras el cambio.
- Limpiar tests, `routeTree`, docs y workflows que asumen proxy.

**Non-Goals:**

- Cambiar el esquema de cookies o rotar `BETTER_AUTH_SECRET`.
- Mover lógica de Webpay o contratos `packages/contracts`.
- Reemplazar Better Auth por otro proveedor.
- Introducir un BFF genérico o reintroducir rewrites del frontend Worker.
- Modificar `crossSubDomainCookies` salvo ajustes documentales (compatible con el transporte directo cross-origin).

## Decisions

### 1. Eliminar `auth-proxy.ts` y `src/app/api/auth/$.ts`; no dejar shim

Borrar ambos archivos y su test. `proxyAuthRequest` hace streaming y borra headers manualmente; con el transporte directo ese código no aporta y es deuda. Alternativa considerada: dejar shim que redirija 301 a `VITE_PUBLIC_API_URL`. Rechazada porque Better Auth y `fetch` ya resuelven directo; un shim solo retrasa la limpieza y confunde `routeTree`.

### 2. `auth-client.ts` apunta a `VITE_PUBLIC_AUTH_URL`

Cambiar:
```ts
export const authClient = createAuthClient({
  baseURL: env.VITE_PUBLIC_AUTH_URL, // https://api.psicologarayen.cl/auth en prod
});
```
La URL dedicada evita que Better Auth trate `/api` como su ruta final: producción usa `https://api.psicologarayen.cl/auth` (donde `BASE_PATH=/auth`) y desarrollo llama directamente a `http://localhost:3000/auth`.

Verificación: confirmar que `better-auth/react` soporta `fetchOptions.credentials`; si no, envolver `fetch` con `credentials: "include"`.

### 3. `env.ts` separa las URLs de API, autenticación y site

Prod: `VITE_PUBLIC_API_URL=https://api.psicologarayen.cl`, `VITE_PUBLIC_AUTH_URL=https://api.psicologarayen.cl/auth`, `VITE_PUBLIC_SITE_URL=https://psicologarayen.cl`. En desarrollo, auth usa `http://localhost:3000/auth`.

### 4. Backend: ajustar `BETTER_AUTH_URL`, `FRONTEND_URL`, CORS y `trustedOrigins`

- `BETTER_AUTH_URL` en prod pasa a `https://api.psicologarayen.cl` (antes `https://api.*`).
- `FRONTEND_URL=https://psicologarayen.cl` (sin `/api`).
- `auth.trustedOrigins` usa `allowedOrigins`: en producción solo `env.FRONTEND_URL`; en desarrollo incluye `http://localhost:3001`.
- `app.enableCors({ origin: allowedOrigins, credentials: true })` idem.
- `GOOGLE_REDIRECT_URI` pasa a `https://api.psicologarayen.cl/auth/callback/google`; validar contra consola Google.

Alternativa: dejar `BETTER_AUTH_URL` en un subdominio de API separado. Rechazada porque no elimina el proxy por sí sola; CORS y cookies cross-subdominio ya cubren el flujo directo.

### 5. Sesión en SSR (`/_authenticated`)

Las rutas privadas usan `ssr: false`, por lo que la sesión se resuelve en el cliente directamente contra la API (`authClient.getSession()` con `credentials: include`) y no hace falta forwarding manual de cookies.

### 6. `routeTree.gen.ts` y docs

El archivo es generado por TanStack Router; tras borrar `src/app/api/auth/$.ts` se regenera (`pnpm build` o `pnpm dev` regenera). No editar manualmente; solo verificar ausencia de `ApiAuthSplatRoute`. Actualizar `apps/web/README.md`, `docs/specs/tanstack-start-migration.md`, `AGENTS.md` y `apps/web/.env.example` para quitar menciones al proxy catch-all.

### 7. Tests

- Borrar `src/lib/auth-proxy.test.ts`.
- Actualizar `backend-api.server.test.ts` y tests que mockean `env.VITE_PUBLIC_API_URL` + `VITE_PUBLIC_SITE_URL` (ej. `course-dashboard.test.tsx`, `course-management-panel.test.tsx`) para esperar `baseURL = VITE_PUBLIC_API_URL`.
- Añadir tests de `auth-client` config (que `baseURL` es `VITE_PUBLIC_AUTH_URL`) y de `requestBackendJson` que sigue reenviando cookie.
- Verificar que `apps/api/src/config/env.spec.ts` y `auth.spec.ts` reflejan nuevo `BETTER_AUTH_URL`.

## Risks / Trade-offs

- [Direct `Set-Cookie` ahora viene de la API en `api.psicologarayen.cl`] → Verificar `Domain`, `Secure`, `SameSite` en prod; `Domain=.psicologarayen.cl` permite que el navegador envíe la cookie al subdominio de API.
- [CORS mal configurado bloquea `credentials: include`] → Probar login prod con `Access-Control-Allow-Credentials` y `Allow-Origin` exacto; fallback es re-agregar origen a `trustedOrigins`/CORS.
- [OAuth redirect URI cambia] → Actualizar consola Google antes de deploy; si se olvida, OAuth falla; mitigación: validar `GOOGLE_REDIRECT_URI` en staging.
- [SSR `getSession` sin cookie forwarding] → Asegurar que `beforeLoad` aún obtiene sesión; si falla, propagar `cookie` header explícitamente o envolver `fetch`.
- [Cookies host-only previas coexisten con domain cookies] → Tras el cambio a transporte directo, documentar renovación de sesión como en `enable-cross-subdomain-cookies` para limpiar duplicados.
- [Generación de `routeTree.gen.ts` no ejecutada] → CI falla si el archivo desactualizado queda versionado; incluir `pnpm build` en validación local.

## Migration Plan

1. Actualizar env y secrets: `VITE_PUBLIC_API_URL`, `VITE_PUBLIC_AUTH_URL` y `VITE_PUBLIC_SITE_URL` en `.env.example`, `.env.local` y GitHub Secrets.
2. Cambiar `src/lib/auth-client.ts` a `baseURL = VITE_PUBLIC_AUTH_URL`; actualizar `src/config/env.ts` documentación.
3. Ajustar `apps/api/src/modules/auth/auth.ts` y `src/main.ts` (CORS/trustedOrigins) y, si aplica, `env.schema.ts`.
4. Borrar `src/app/api/auth/$.ts`, `src/lib/auth-proxy.ts`, `auth-proxy.test.ts`; regenerar `src/routeTree.gen.ts` (`pnpm build`).
5. Revisar `src/routes/_authenticated.tsx` para confirmar que la sesión se resuelve en cliente y no depende de forwarding SSR.
6. Actualizar `apps/web/README.md`, `docs/specs/tanstack-start-migration.md`, `AGENTS.md`, y tests afectados.
7. Ejecutar validación: `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run`, `pnpm build` en `apps/web`; `pnpm exec eslint`, `pnpm test`, `pnpm build` en `apps/api`; `pnpm check:landing`.
8. Staging: desplegar la API NestJS en `api.psicologarayen.cl`, luego el frontend; verificar login/logout/refresh/session/OAuth/recovery/pago y atributos de cookie en DevTools.
9. Prod: desplegar API primero, luego web; comunicar renovación de sesión a usuarios con sesión previa host-only.
10. Verificación post-deploy: request directa `GET https://api.psicologarayen.cl/auth/session` con cookie incluye sesión; `GET https://api.psicologarayen.cl/courses` con sesión válida; logout expira cookie.

Rollback: restaurar `src/app/api/auth/$.ts` + `auth-proxy.ts`, revertir `auth-client` a `VITE_PUBLIC_SITE_URL`/`window.location.origin`, y redeplegar frontend; cookies ya emitidas con `Domain` siguen válidas hasta expiración/logout, no requieren migración adicional.

## Open Questions

Resueltas durante implementación:

- **Origen directo:** no hay Worker intermedio. `BETTER_AUTH_URL=https://api.psicologarayen.cl` con `BASE_PATH=/auth` y `GOOGLE_REDIRECT_URI=https://api.psicologarayen.cl/auth/callback/google`.
- **Cookie Domain:** `DOMAIN=psicologarayen.cl` (`Domain=.psicologarayen.cl`), lo que permite al navegador enviar la cookie de sesión al subdominio `api.psicologarayen.cl` en cada request autenticado.
