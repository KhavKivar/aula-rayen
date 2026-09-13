## 1. Configuración y origen directo de la API

- [x] 1.1 Documentar el valor canónico de `BETTER_AUTH_URL` y `GOOGLE_REDIRECT_URI` para producción contra el origen directo de la API (`api.psicologarayen.cl`), sin Worker intermedio.
- [x] 1.2 Decidir política de `DOMAIN`: mantener `.psicologarayen.cl` para compartir sesión entre subdominios; registrar decisión en `design.md` y en `.env.example`.

## 2. Entorno y variables públicas

- [x] 2.1 Actualizar `apps/web/src/config/env.ts` y `apps/web/.env.example` para documentar `VITE_PUBLIC_API_URL`, `VITE_PUBLIC_AUTH_URL` y `VITE_PUBLIC_SITE_URL` en producción y desarrollo.
- [x] 2.2 Actualizar `apps/api/.env.example`, `apps/api/src/config/env.schema.ts` (si aplica default de `BETTER_AUTH_URL`/`GOOGLE_REDIRECT_URI`) y `apps/api/src/config/env.spec.ts` con los orígenes directos del frontend y la API.
- [x] 2.3 Actualizar secrets de `.github/workflows/deploy-web.yml`: verificar `VITE_PUBLIC_API_URL`, `VITE_PUBLIC_AUTH_URL` y `VITE_PUBLIC_SITE_URL`.

## 3. Backend — CORS y Better Auth

- [x] 3.1 Ajustar `apps/api/src/modules/auth/auth.ts`: `baseURL = env.BETTER_AUTH_URL` (API directa), `trustedOrigins` restringido al frontend (`env.FRONTEND_URL` y localhost fuera de producción) y verificar `crossSubDomainCookies` coherente con decisión 1.2.
- [x] 3.2 Ajustar `apps/api/src/main.ts` `enableCors({ origin: [env.FRONTEND_URL, "http://localhost:3001"], credentials: true })`.
- [x] 3.3 Actualizar `apps/api/src/modules/auth/auth.spec.ts` para reflejar nuevos fixtures de `BETTER_AUTH_URL`/`FRONTEND_URL`.

## 4. Frontend — cliente Better Auth directo

- [x] 4.1 Reescribir `apps/web/src/lib/auth-client.ts`: `baseURL = env.VITE_PUBLIC_AUTH_URL` (único para SSR y browser). Verificar tipo y bundling.
- [x] 4.2 Revisar `apps/web/src/lib/backend-api.server.ts`: confirmar reenvío de `cookie` header en SSR hacia `VITE_PUBLIC_API_URL` sigue correcto con origen same-site; añadir `credentials: "include"` si el fetch SSR lo requiere, y mantener `Cache-Control: no-store`.
- [x] 4.3 Revisar `apps/web/src/app/_protected.tsx` (`beforeLoad` con `authClient.getSession()`): asegurar que la sesión se obtiene directa contra API con cookies reenviadas en SSR y sin proxy.

## 5. Eliminación del proxy

- [x] 5.1 Borrar `apps/web/src/app/api/auth/$.ts`, `apps/web/src/lib/auth-proxy.ts` y `apps/web/src/lib/auth-proxy.test.ts`.
- [x] 5.2 Eliminar imports de `proxyAuthRequest` y `ApiAuthSplatRoute`; verificar que ningún feature (`features/auth/api/*`, `features/course-dashboard/*`) importa el proxy.
- [x] 5.3 Regenerar `apps/web/src/routeTree.gen.ts` (ej. `pnpm build` / `pnpm dev` regenera) y verificar que `'/api/auth/$'` desaparece de `FileRoutesByFullPath`/`FileRoutesByTo`.
- [x] 5.4 Buscar `proxyAuthRequest`/`ApiAuthSplatRoute`/`/api/auth/\$` en repo y limpiar referencias residuales (fuera de histórico de cambios).

## 6. Tests frontend

- [x] 6.1 Actualizar `apps/web/src/lib/backend-api.server.test.ts` para esperar `fetch` directo a `VITE_PUBLIC_API_URL` con forwarding de `cookie`.
- [x] 6.2 Actualizar el test de `auth-client` para usar `VITE_PUBLIC_AUTH_URL` como `baseURL`.
- [x] 6.3 Añadir/actualizar tests de `auth-client` (config `baseURL`/`credentials`) y de `_protected` `beforeLoad` que verifica redirección a `/login` cuando `getSession` directa retorna `null`.
- [x] 6.4 Eliminar snapshots/expectativas ligadas al proxy (`routeTree` tests si existen, tests de `auth-proxy`).

## 7. Documentación y workflows

- [x] 7.1 Actualizar `apps/web/README.md` (sección Rutas y variables) para quitar mención a catch-all `src/app/api/auth/$.ts`.
- [x] 7.2 Actualizar `apps/web/docs/specs/tanstack-start-migration.md` y `AGENTS.md` (integración `VITE_PUBLIC_API_URL`/Better Auth/CORS).
- [x] 7.3 Verificar `apps/web/wrangler.jsonc` no tenga rewrites/route del proxy; limpiar si existe.

## 8. Validación local

- [x] 8.1 `apps/web`: `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run`, `pnpm build`.
- [x] 8.2 `apps/api`: `pnpm exec eslint src test`, `pnpm test`, `pnpm build`.
- [x] 8.3 `apps/web`: `pnpm check:landing` (preview prod) para confirmar que no hay regresión de routing tras eliminar `/api/auth/$`.

## 9. Verificación en producción (arquitectura final: sin Worker)

- [x] 9.1 Desplegar la API en `api.psicologarayen.cl` y el frontend en `psicologarayen.cl`; el Worker same-origin quedó descartado en `chore: retirar worker proxy de API en desuso`.
- [x] 9.2 Verificar con navegador: login email/password, registro, sesión, logout, `requestPasswordReset`/`resetPassword`, Google OAuth (callback y errorCallback), y acceso a endpoints protegidos (`/courses`, Webpay) contra `VITE_PUBLIC_AUTH_URL`/`VITE_PUBLIC_API_URL` directos.
- [x] 9.3 Inspeccionar `Set-Cookie` en DevTools: `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, `Domain=.psicologarayen.cl` (configurado vía `DOMAIN`).
- [x] 9.4 Verificar CORS: respuestas incluyen `Access-Control-Allow-Credentials: true` y `Access-Control-Allow-Origin: https://psicologarayen.cl`; en desarrollo `http://localhost:3001`.
- [x] 9.5 Confirmar que no coexisten cookies duplicadas con `Domain` distinto que causen `401` ambiguo.

## 10. Rollback y cierre

- [x] 10.1 Documentar procedimiento de rollback (`git revert` restaura `auth-proxy` y `auth-client` previos, revierte env y redeplega frontend) y criterios de disparo (falla OAuth, CORS o cookies tras 9.2-9.5).
- [x] 10.2 Cerrar la decisión en `AGENTS.md` y en `decisions/0004-retirar-proxy-worker-api.md`; no se restauró el proxy.
