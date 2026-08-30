## Why

Con el túnel de Cloudflare `aula-rayen.vasvani.shop/api` → origen NestJS, frontend y API comparten origen en producción y el navegador puede alcanzar la API directamente. Antes de `01a7676` el frontend ya tenía transporte directo vía `apps/web/src/lib/api-client.ts` (axios `baseURL: NEXT_PUBLIC_API_URL`, `withCredentials: true`, interceptor `SessionExpiredError` para `401`). Ese archivo fue borrado en `01a7676 fix: forward sessions through server functions` y reemplazado por el proxy SSR `src/lib/backend-api.server.ts` (`requestBackendJson` con `getRequestHeader("cookie")` + `setResponseHeader("Cache-Control: no-store")` + `BackendApiError`) y wrappers `createServerFn` en `course-dashboard` (`get-courses`, `get-course`, `create-webpay`) y `course-management` (`create-course`, `update-course`, `delete-course`) para reenviar cookies en SSR. Con el Worker same-origin ese proxy ya no aporta valor: añade un hop, duplica lógica de fetch/validación, oculta errores y obliga a mantener `routeTree` y tests del hop. Restaurar la capa `apiClient` elimina el proxy SSR, reduce latencia y vuelve al patrón directo documentado en `AGENTS.md`, mismo movimiento ya aplicado al proxy de auth en `remove-frontend-auth-proxy`.

## What Changes

- **Restaurar capa API:** Recrear `apps/web/src/lib/api-client.ts` con `axios.create({ baseURL: env.NEXT_PUBLIC_API_URL, withCredentials: true, headers: { Accept: "application/json" } })` e interceptor que mapea `401` → `SessionExpiredError` (clase exportada). Reagregar `axios@^1.19.0` a `apps/web/package.json` (eliminado en `01a7676`).
- **BREAKING (transporte):** Eliminar `apps/web/src/lib/backend-api.server.ts` y `apps/web/src/lib/backend-api.server.test.ts` (`requestBackendJson`/`BackendApiError` dejan de existir).
- **BREAKING:** Eliminar `createServerFn` en todos los endpoints y migrarlos a `apiClient`:
  - `apps/web/src/features/course-dashboard/api/get-courses.ts` → `apiClient.get("/courses")` + `courseCatalogSchema.parse`
  - `apps/web/src/features/course-dashboard/api/get-course.ts` → `apiClient.get("/courses/:id")` con `z` validación previa (`courseIdSchema`) + `courseDetailSchema.parse`
  - `apps/web/src/features/course-dashboard/api/create-webpay.ts` → `apiClient.post("/webpay", dto)` con `createWebPayDtoSchema`/`createWebPayResponseSchema`, mapeo `axios.isAxiosError` → `CreateWebPayError` (array `message` → `join(" ")`)
  - `apps/web/src/features/course-management/api/create-course.ts` → `apiClient.post("/courses")`
  - `apps/web/src/features/course-management/api/update-course.ts` → `apiClient.patch("/courses/:id")` (o `post`+method según implementación actual, migrado a `apiClient`)
  - `apps/web/src/features/course-management/api/delete-course.ts` → `apiClient.delete("/courses/:id")`
  Todos con `withCredentials` heredado de `apiClient`, sin `getRequestHeader`/`setResponseHeader` SSR. Mantener validación de contracts (`@aula-rayen/contracts`).
- Todos los endpoints del dashboard y gestión pasan a usar exclusivamente `apiClient`; no queda `fetch` directo ni `requestBackendJson` en `apps/web/src`.
- Consumidores sin cambios de firma: `CourseDashboard` (`useQuery(getCourses)`), `CourseContent` (`getCourse`), `CourseCatalog` (`createWebPay`), `CourseManagementPanel` (`createCourse`/`updateCourse`/`deleteCourse`) siguen importando las mismas funciones.
- Tests: eliminar `backend-api.server.test.ts`; reescribir `course-api.test.ts`, `create-webpay.test.ts`, `course-management.test.ts` para mockear `apiClient` (`vi.mock("@/lib/api-client")`) en lugar de `requestBackendJson`/`fetch`; verificar `withCredentials` implícito y manejo de errores `SessionExpiredError`/`CreateWebPayError`.
- Documentación y env: confirmar `NEXT_PUBLIC_API_URL=https://aula-rayen.vasvani.shop/api` en prod y `http://localhost:3000` en dev (`apps/web/.env.example`, `README.md`, `AGENTS.md` integración); no se introduce nueva variable.
- Verificar que no queden imports de `@tanstack/react-start/server` ni `backend-api.server` en `apps/web/src`; `pnpm build` sin ruta serverFn huérfana.

## Capabilities

### New Capabilities

- `web/direct-backend-transport`: Transporte directo del frontend hacia la API de cursos/pagos/gestión vía `apiClient` (axios) sin helpers SSR ni `createServerFn` proxy, incluyendo `baseURL: NEXT_PUBLIC_API_URL`, `withCredentials: true`, interceptor `401` → `SessionExpiredError`, manejo de errores y validación de contratos.

### Modified Capabilities

- Ninguna capability existente bajo `openspec/specs/` requiere delta retroactivo (directorio base vacío). Esta capability es compatible con `auth/direct-transport` de `remove-frontend-auth-proxy`. Cubre dashboard y course-management en una sola capability.

## Impact

- **Código frontend:** `apps/web/src/lib/api-client.ts` (restaurado), `apps/web/src/lib/backend-api.server.ts` (eliminado), `apps/web/src/features/course-dashboard/api/*` (3 archivos migrados a `apiClient`), `apps/web/src/features/course-management/api/*` (3 archivos migrados a `apiClient`), `apps/web/package.json` (+axios), `apps/web/src/config/env.ts` (solo verificación).
- **Tests:** Eliminación `backend-api.server.test.ts`; reescritura `course-api.test.ts`, `create-webpay.test.ts`, `course-management.test.ts` y ajustes menores en `course-dashboard.test.tsx`/`course-content.test.tsx`/`course-management-panel.test.tsx` si mockeaban `createServerFn`.
- **Infra/Deploy:** Sin cambios de Worker; `aula-rayen.vasvani.shop/api` ya enruta `/api/*` al origen NestJS. No requiere nuevas variables ni cambios CORS (`auth/direct-transport` ya lo cubre).
- **Docs:** `apps/web/README.md`, `apps/web/AGENTS.md`, `.env.example`, `AGENTS.md` raíz (sección integración) — verificar que documenten `apiClient` con `withCredentials`.
- **Riesgo:** Cambio SSR → cliente directo: cookies ya no se reenvían manualmente sino vía `withCredentials` same-origin; requiere smoke de sesión, catálogo, detalle y Webpay en dev y prod. Rollback: `git revert` restaura `backend-api.server.ts` + serverFns.
