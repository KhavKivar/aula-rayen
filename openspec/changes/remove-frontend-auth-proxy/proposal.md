## Why

El backend se movió a `https://aula-rayen.vasvani.shop/api/` mediante un Cloudflare Worker que enruta `/api/*` al origen NestJS. El frontend en `apps/web` sigue manteniendo un proxy TanStack Start en `src/app/api/auth/$.ts` + `src/lib/auth-proxy.ts` que reenvía `/api/auth/*` a `VITE_PUBLIC_API_URL` solo para mantener cookies same-origin. Con el Worker same-origin el proxy ya no aporta valor: duplica un hop, añade latencia y streaming manual (`duplex: half`, reescritura de headers), oculta errores del backend y obliga a mantener `routeTree.gen.ts`, tests y documentación desactualizada. Eliminar el proxy simplifica la arquitectura, alinea el cliente Better Auth con el origen directo y reduce superficie de mantenimiento.

## What Changes

- **BREAKING (comportamiento observable):** Eliminar la server route catch-all `src/app/api/auth/$.ts` y la utilidad `src/lib/auth-proxy.ts` (y `auth-proxy.test.ts`). Las peticiones de autenticación dejarán de pasar por el Worker del frontend.
- Reconfigurar `src/lib/auth-client.ts` para apuntar a `VITE_PUBLIC_AUTH_URL` (`https://aula-rayen.vasvani.shop/api/auth` en producción y `http://localhost:3000/auth` en desarrollo).
- Mantener `VITE_PUBLIC_API_URL` para la API general y documentar separadamente la URL pública de Better Auth.
- Ajustar CORS y `trustedOrigins` en `apps/api` (`src/modules/auth/auth.ts`, `src/main.ts`) para reflejar el nuevo origen same-parent-domain y mantener `credentials: true`. Verificar que `BETTER_AUTH_URL` y `FRONTEND_URL` siguen coherentes con el Worker.
- Revisar `src/lib/backend-api.server.ts` y server functions que hoy reenvían cookies SSR: confirmar si siguen necesarias con fetch directo same-origin o si se simplifican a `fetch` con `credentials: include` + `cookie` forwarding solo en SSR.
- Remover referencias al proxy en `src/routeTree.gen.ts` (regenerado), `apps/web/README.md`, `apps/web/docs/specs/tanstack-start-migration.md`, `apps/web/.env.example`, `.github/workflows/deploy-web.yml` y tests que asumen `/api/auth` proxied.
- Actualizar documentación de despliegue: el Worker de `apps/web` ya no necesita reenviar auth; el Worker de API (`aula-rayen.vasvani.shop/api/`) es el único punto de entrada.

## Capabilities

### New Capabilities

- `auth/direct-transport`: Define cómo el frontend TanStack Start consume Better Auth directamente contra el Worker `aula-rayen.vasvani.shop/api` sin proxy intermedio, incluyendo resolución de `baseURL`, manejo de cookies (`Secure`, `HttpOnly`, `SameSite`, `Domain`), `credentials: include`, y comportamiento SSR vs. browser.

### Modified Capabilities

- Ninguna existente bajo `openspec/specs/` (el directorio base está vacío). La capability `cross-subdomain-auth-session` creada en el change `enable-cross-subdomain-cookies` permanece válida y compatible: con Worker same-origin el cookie `Domain=.vasvani.shop` sigue funcionando, pero ya no es imprescindible para auth. No se introduce delta spec retroactivo para esa capability en este change; se documenta compatibilidad en `design.md`.

## Impact

- **Código frontend:** `apps/web/src/app/api/auth/$.ts`, `apps/web/src/lib/auth-proxy.ts`, `apps/web/src/lib/auth-client.ts`, `apps/web/src/config/env.ts`, `apps/web/src/lib/backend-api.server.ts`, features que usan `authClient` (`login`, `register`, `password-recovery`, `DashboardGate` en `apps/web/src/app/_protected.tsx`), `apps/web/wrangler.jsonc` si había rewrites.
- **Código backend:** `apps/api/src/modules/auth/auth.ts`, `apps/api/src/config/env.schema.ts` (si `BETTER_AUTH_URL` cambia a `https://aula-rayen.vasvani.shop/api`), `apps/api/src/main.ts` (CORS).
- **Infra/Deploy:** Worker/API en `aula-rayen.vasvani.shop/api/`, variables `VITE_PUBLIC_API_URL`, `VITE_PUBLIC_AUTH_URL` y `VITE_PUBLIC_SITE_URL` en `.env.example` y GitHub Actions.
- **Tests:** Eliminar/migrar `auth-proxy.test.ts`; actualizar tests de `login`, `register`, `password-recovery`, `course-dashboard`, `course-management`, `backend-api.server.test.ts` que mockean `VITE_PUBLIC_API_URL` vs proxy.
- **Docs:** `apps/web/README.md`, `apps/web/docs/specs/tanstack-start-migration.md`, `AGENTS.md` (sección integración frontend↔API).
- **Riesgo de compatibilidad:** Cambio observable en origen de `Set-Cookie` y `fetch` credentials; requiere verificación de login/logout, sesión, OAuth Google, recovery y pago en staging antes de prod.
