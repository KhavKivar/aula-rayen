## 1. Configuración y descubrimiento del Worker

- [x] 1.1 Confirmar mapping exacto del Cloudflare Worker en `aula-rayen.vasvani.shop/api/*` (¿preserva `/api` prefix o lo reescribe?) y documentar valor canónico de `BETTER_AUTH_URL` y `GOOGLE_REDIRECT_URI` para prod.
- [x] 1.2 Decidir política de `BETTER_AUTH_COOKIE_DOMAIN` con Worker same-origin: mantener `.vasvani.shop` vs. pasar a host-only; registrar decisión en `design.md` Open Questions y en `.env.example`.

## 2. Entorno y variables públicas

- [x] 2.1 Actualizar `apps/web/src/config/env.ts` y `apps/web/.env.example` para documentar `VITE_PUBLIC_API_URL=https://aula-rayen.vasvani.shop/api` (prod) y `VITE_PUBLIC_SITE_URL=https://aula-rayen.vasvani.shop`, manteniendo `http://localhost:3000/3001` en dev.
- [x] 2.2 Actualizar `apps/api/.env.example`, `apps/api/src/config/env.schema.ts` (si aplica default de `BETTER_AUTH_URL`/`GOOGLE_REDIRECT_URI`) y `apps/api/src/config/env.spec.ts` con nuevos orígenes Worker.
- [x] 2.3 Actualizar secrets de `.github/workflows/deploy-web.yml` (y `deploy-api.yml` si usa `BETTER_AUTH_URL`/`FRONTEND_URL`): verificar `VITE_PUBLIC_API_URL`, `VITE_PUBLIC_SITE_URL`, `BETTER_AUTH_URL`, `FRONTEND_URL`, `GOOGLE_REDIRECT_URI`, `BETTER_AUTH_COOKIE_DOMAIN`.

## 3. Backend — CORS y Better Auth

- [x] 3.1 Ajustar `apps/api/src/modules/auth/auth.ts`: `baseURL = env.BETTER_AUTH_URL` (Worker URL), `trustedOrigins = [env.FRONTEND_URL, "http://localhost:3001"]` y verificar `crossSubDomainCookies` coherente con decisión 1.2.
- [x] 3.2 Ajustar `apps/api/src/main.ts` `enableCors({ origin: [env.FRONTEND_URL, "http://localhost:3001"], credentials: true })`.
- [x] 3.3 Actualizar `apps/api/src/modules/auth/auth.spec.ts` para reflejar nuevos fixtures de `BETTER_AUTH_URL`/`FRONTEND_URL`.

## 4. Frontend — cliente Better Auth directo

- [x] 4.1 Reescribir `apps/web/src/lib/auth-client.ts`: `baseURL = env.VITE_PUBLIC_API_URL` (único para SSR y browser) y `fetchOptions: { credentials: "include" }` (o wrapper `fetch` con `credentials: "include"` si la versión de `better-auth` no soporta `fetchOptions`). Verificar tipo y bundling.
- [x] 4.2 Revisar `apps/web/src/lib/backend-api.server.ts`: confirmar reenvío de `cookie` header en SSR hacia `VITE_PUBLIC_API_URL` sigue correcto con origen same-site; añadir `credentials: "include"` si el fetch SSR lo requiere, y mantener `Cache-Control: no-store`.
- [x] 4.3 Revisar `apps/web/src/app/_protected.tsx` (`beforeLoad` con `authClient.getSession()`): asegurar que la sesión se obtiene directa contra API con cookies reenviadas en SSR y sin proxy.

## 5. Eliminación del proxy

- [x] 5.1 Borrar `apps/web/src/app/api/auth/$.ts`, `apps/web/src/lib/auth-proxy.ts` y `apps/web/src/lib/auth-proxy.test.ts`.
- [x] 5.2 Eliminar imports de `proxyAuthRequest` y `ApiAuthSplatRoute`; verificar que ningún feature (`features/auth/api/*`, `features/course-dashboard/*`) importa el proxy.
- [x] 5.3 Regenerar `apps/web/src/routeTree.gen.ts` (ej. `pnpm build` / `pnpm dev` regenera) y verificar que `'/api/auth/$'` desaparece de `FileRoutesByFullPath`/`FileRoutesByTo`.
- [x] 5.4 Buscar `proxyAuthRequest`/`ApiAuthSplatRoute`/`/api/auth/\$` en repo y limpiar referencias residuales (fuera de histórico de cambios).

## 6. Tests frontend

- [x] 6.1 Actualizar `apps/web/src/lib/backend-api.server.test.ts` para esperar `fetch` directo a `VITE_PUBLIC_API_URL` con forwarding de `cookie`.
- [x] 6.2 Actualizar tests que mockean env (`src/features/course-dashboard/components/course-dashboard.test.tsx`, `src/features/course-management/components/course-management-panel.test.tsx`, etc.) para usar `VITE_PUBLIC_API_URL` como `baseURL`.
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

## 9. Verificación en staging/producción

- [ ] 9.1 Desplegar API Worker en `aula-rayen.vasvani.shop/api/` primero; luego frontend.
- [ ] 9.2 Verificar con navegador: login email/password, registro, sesión (`GET /api/auth/session`), logout, `requestPasswordReset`/`resetPassword`, Google OAuth (callback y errorCallback), y acceso a endpoints protegidos (`/api/courses`, Webpay).
- [ ] 9.3 Inspeccionar `Set-Cookie` en DevTools: `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, `Domain=.vasvani.shop` (o host-only según decisión) y que se envía a `aula-rayen.vasvani.shop/api/*`.
- [ ] 9.4 Verificar CORS: respuestas incluyen `Access-Control-Allow-Credentials: true` y `Access-Control-Allow-Origin: https://aula-rayen.vasvani.shop`; repetir con `http://localhost:3001`.
- [ ] 9.5 Probar sesión heredada host-only: limpiar cookies, nuevo login, confirmar que no coexisten cookies duplicadas con `Domain` distinto que causen `401` ambiguo.

## 10. Rollback y cierre

- [ ] 10.1 Documentar procedimiento de rollback (restaurar `auth-proxy` + `auth-client` previo, revertir env y redeplegar frontend) y criterios de disparo (falla OAuth, CORS, o cookies tras 9.2-9.5).
- [ ] 10.2 Tras éxito, archivar decisión en `AGENTS.md` y cerrar referencias al proxy en backlog/issues.
