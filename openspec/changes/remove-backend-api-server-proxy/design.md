## Context

Ver `proposal.md` — la API NestJS ya es alcanzable misma-origen vía Cloudflare Tunnel `aula-rayen.vasvani.shop/api`. Antes de `01a7676` el frontend usaba `src/lib/api-client.ts` (axios `baseURL: NEXT_PUBLIC_API_URL`, `withCredentials: true`, interceptor `401 → SessionExpiredError`). En `01a7676 fix: forward sessions through server functions` se borró `api-client.ts` (y `axios` de `package.json`) y se introdujo el proxy SSR `src/lib/backend-api.server.ts` (`requestBackendJson` con `getRequestHeader("cookie")` + `setResponseHeader`) y wrappers `createServerFn` en `course-dashboard` (`get-courses`, `get-course`, `create-webpay`) y `course-management` (`create-course`, `update-course`, `delete-course`). El change previo `remove-frontend-auth-proxy` eliminó el proxy de auth; queda por eliminar este segundo proxy SSR restaurando `apiClient` para **todos** los endpoints (no solo dashboard). Hoy todos esos módulos delegan en `requestBackendJson`; los tests mockean `requestBackendJson` y `createServerFn`. `NEXT_PUBLIC_API_URL` ya es canónico (`https://aula-rayen.vasvani.shop/api` en prod, `http://localhost:3000` en dev).

## Goals / Non-Goals

**Goals:**
- Restaurar `src/lib/api-client.ts` (axios) como única capa de transporte y migrar **todos** los endpoints (`course-dashboard` + `course-management`) a `apiClient`, eliminando `backend-api.server.ts` y toda dependencia de `@tanstack/react-start/server` para datos.
- Reagregar `axios` y preservar `SessionExpiredError` (interceptor 401) y validación de contracts (`@aula-rayen/contracts`); no cambiar UX de `CourseDashboard`, `CourseContent`, `CourseCatalog`, `CourseManagementPanel`.
- Actualizar tests para mockear `apiClient` (`vi.mock("@/lib/api-client")`) en lugar de `requestBackendJson`/`fetch`.

**Non-Goals:**
- No cambiar backend NestJS ni CORS/`trustedOrigins` (ya cubierto por `auth/direct-transport`).
- No introducir `fetch` directo por función; la decisión es usar `apiClient` central para todos los endpoints.
- No mover `NEXT_PUBLIC_API_URL` a secret runtime ni añadir rewrites en `apps/web`.
- No refactorizar UI/estilos ni cambiar contratos HTTP.

## Decisions

### Decisión 1: Restaurar `apiClient` (axios) vs. `fetch` directo por función
**Elegido:** Restaurar `src/lib/api-client.ts` con `axios.create({ baseURL: env.NEXT_PUBLIC_API_URL, withCredentials: true, headers: { Accept: "application/json" } })` + interceptor `401 → SessionExpiredError`, y que **todos** los endpoints importen `apiClient`.  
**Alternativa considerada:** Cada función hace su propio `fetch(new URL(path, env.NEXT_PUBLIC_API_URL), { credentials: "include" })`. Descartada porque: (a) ya existía `apiClient` antes de `01a7676` y el equipo pidió explícitamente reutilizarlo para todos los endpoints; (b) centraliza `baseURL`/`withCredentials`/headers y el manejo `401`; (c) reduce duplicación y facilita mock en tests (`vi.mock` una sola capa). `fetch` requeriría replicar join de `message` array y parsing en cada archivo.  
**Por qué:** Restaura el patrón probado previo a `01a7676`, pedido explícito del usuario ("que use apiclient todas los endpoints"), y minimiza drift respecto al historial.

### Decisión 2: Alcance — todos los endpoints en este change
**Elegido:** Incluir `course-dashboard` (3 archivos) **y** `course-management` (3 archivos) en el mismo change. El usuario confirmó "todos los endpoints". No hay modo condicional/exclusión.  
**Alternativa:** Dejar `course-management` para follow-up. Descartada por requisito explícito.  
**Implicación:** `tasks.md` no tiene ramas opcionales; las 6 migraciones son obligatorias.

### Decisión 3: Manejo de errores — `SessionExpiredError` + `CreateWebPayError` vía `AxiosError`
**Elegido:** `apiClient` mapea `401` → `SessionExpiredError` en interceptor (comportamiento previo). `createWebPay` (y mutaciones si lo necesitan) capturan `axios.isAxiosError<ApiErrorResponse>` y extraen `response.data.message` (`string | string[]` → `join(" ")`) y `response.status` para lanzar `CreateWebPayError`. Lecturas (`getCourses`/`getCourse`/`createCourse` etc.) pueden dejar que `SessionExpiredError`/`AxiosError` burbujee o mapear a `Error` con `status` según UI existente. No reexportar ni usar `BackendApiError`.  
**Alternativa:** Mantener `BackendApiError` movido a `lib`. Descartada: nombre ligado a SSR confunde y `AxiosError` ya trae `response`.  
**Por qué:** Preserva contrato observable (tests esperan `message` + `status`) con la semántica axios previa.

### Decisión 4: Validación y `withCredentials`
**Elegido:** Validar input con zod **antes** de `apiClient` (`courseIdSchema`, `createWebPayDtoSchema`, `createCourseRequestSchema`, `updateCourseInputSchema`, `deleteCourseInputSchema`), luego `apiClient.get/post/patch/delete` con `withCredentials` heredado. En prod el Worker es same-origin así que `withCredentials` envía `better-auth.session_token` automáticamente; en dev `localhost:3000` vs `localhost:3001` es cross-site pero `withCredentials` + CORS ya configurado lo permite. No usar `getRequestHeader`/`setResponseHeader`.  
**Alternativa:** Mantener `Cache-Control: no-store` vía header. Innecesario: `useQuery` controla caché.  
**Por qué:** Paridad con `api-client.ts` previo y con `auth/direct-transport`.

### Decisión 5: Tests — mock de `apiClient`
**Elegido:** Reescribir `course-api.test.ts`, `create-webpay.test.ts`, `course-management.test.ts` para `vi.mock("@/lib/api-client", () => ({ apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() }, SessionExpiredError }))` o `vi.spyOn(apiClient, "get")`. Verificar `apiClient.get`/`post` llamado con path, payload, y que `SessionExpiredError` se mapea, y manejo de `message` array. Eliminar `backend-api.server.test.ts`. Tests de componentes que mockeaban `createServerFn` pasan a mockear `getCourses`/`createWebPay`/`createCourse` directamente.  
**Alternativa:** Mock de `fetch` global o MSW. Descartadas: `apiClient` es la capa real; mockearla es más fiel y evita `axios` internals.

### Decisión 6: Dependencia `axios`
**Elegido:** Reagregar `axios@^1.19.0` a `apps/web/package.json` `dependencies` (exactamente la versión previa a `01a7676`) y regenerar lockfile.  
**Alternativa:** Usar `fetch` y no agregar dependencia. Descartada por decisión 1.

## Risks / Trade-offs

- **Cookies en SSR ya no se reenvían manualmente** → Mitigación: `useQuery` corre en browser, no en loader SSR; `apiClient` con `withCredentials` envía cookies same-origin automáticamente. Verificar que ningún `loader`/`beforeLoad` llame `getCourses`/`getCourse`; si existiera, ese loader debe usar `apiClient` en browser o pasar `headers`.
- **Cross-site localhost (3001 → 3000)** → Mitigación: `withCredentials: true` + CORS `allowCredentials: true` ya configurado para auth; smoke en dev.
- **Pérdida de `Cache-Control: no-store` del proxy** → Mitigación: `useQuery` controla `staleTime`; si se necesita no-cache, usar `staleTime: 0` o `cache: "no-store"` a nivel query.
- **Regresión de `SessionExpiredError`** → Mitigación: Interceptor restablece el mapeo `401` exacto previo; tests verifican que `getCourses` rechace con `SessionExpiredError` en `401`.
- **Bundle `axios`** → Trade-off aceptado: `axios` ya estuvo en el bundle antes de `01a7676`; el coste es menor que duplicar lógica `fetch` + parsing en 6 archivos y perder interceptor central.

## Migration Plan

1. Rama desde `main`; `pnpm exec tsc --noEmit` y `pnpm test` en verde.
2. Restaurar `apps/web/src/lib/api-client.ts` (axios + `SessionExpiredError` + interceptor) y agregar `axios@^1.19.0` a `apps/web/package.json` + `pnpm install`.
3. Migrar `course-dashboard`: reescribir `get-courses.ts`, `get-course.ts`, `create-webpay.ts` a `apiClient` (ver tasks 2.x); correr tests dashboard aislados.
4. Migrar `course-management`: reescribir `create-course.ts`, `update-course.ts`, `delete-course.ts` a `apiClient` (tasks 3.x).
5. Eliminar `src/lib/backend-api.server.ts` y `backend-api.server.test.ts`; `grep -r "backend-api.server\|requestBackendJson\|BackendApiError" apps/web/src --include="*.ts" --include="*.tsx"` → 0, y `grep -r "createServerFn" apps/web/src/features --include="*.ts"` → 0.
6. Actualizar tests a mocks de `apiClient` y ejecutar `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, `pnpm test` en `apps/web`.
7. Smoke dev (`NEXT_PUBLIC_API_URL=http://localhost:3000`) y prod/staging (`https://aula-rayen.vasvani.shop/api`): login, `/dashboard` catálogo, `/courses/:id`, Webpay `token/url`, y gestión (crear/editar/eliminar).
8. Rollback: `git revert` del commit; se restaura `backend-api.server.ts` + `createServerFn` sin cambios de infra.

## Open Questions

- Ninguna bloqueante. El scope "todos los endpoints usan `apiClient`" ya está confirmado por el usuario.
