## 1. Alcance y preparación

- [x] 1.1 Verificar estado base: `pnpm exec tsc --noEmit` y `pnpm test` en `apps/web` en verde antes de tocar código.
- [x] 1.2 Auditar usos actuales del proxy SSR: `grep -r "backend-api.server\|requestBackendJson\|BackendApiError\|createServerFn" apps/web/src --include="*.ts" --include="*.tsx"` y listar afectados (deben ser `course-dashboard/api/*` (3), `course-management/api/*` (3), tests y `backend-api.server.ts`).
- [x] 1.3 Revisar historial `01a7676^:apps/web/src/lib/api-client.ts` y confirmar versión previa de `axios` (`^1.19.0`) para restauración.

## 2. Restaurar capa apiClient

- [x] 2.1 Crear `apps/web/src/lib/api-client.ts` con `axios.create({ baseURL: env.NEXT_PUBLIC_API_URL, withCredentials: true, headers: { Accept: "application/json" } })`, exportar `SessionExpiredError` y registrar interceptor `response.use(r=>r, (e: AxiosError)=> e.response?.status===401 ? Promise.reject(new SessionExpiredError()) : Promise.reject(e))` (paridad con archivo previo a `01a7676`).
- [x] 2.2 Agregar `axios@^1.19.0` a `apps/web/package.json` `dependencies` y ejecutar `pnpm install` (regenerar `pnpm-lock.yaml`).
- [x] 2.3 Añadir o actualizar test de `api-client` si se desea: verificar `baseURL` usa `env.NEXT_PUBLIC_API_URL`, `withCredentials: true` y que `401` mapea a `SessionExpiredError`. — Omitido: cubierto por interceptor y tests de apiClient; no requiere test dedicado en este change.

## 3. Migrar `course-dashboard` a apiClient

- [x] 3.1 Reescribir `apps/web/src/features/course-dashboard/api/get-courses.ts`: eliminar `createServerFn`/`requestBackendJson`, importar `apiClient`, implementar `export async function getCourses(): Promise<CourseCatalog>` con `const { data } = await apiClient.get<unknown>("/courses")` y `courseCatalogSchema.parse(data)`, sin `getRequestHeader`.
- [x] 3.2 Reescribir `apps/web/src/features/course-dashboard/api/get-course.ts`: mantener `courseIdSchema` (zod) validando antes de red, implementar `apiClient.get<unknown>("/courses/${courseId}")` + `courseDetailSchema.parse`, sin `createServerFn`.
- [x] 3.3 Reescribir `apps/web/src/features/course-dashboard/api/create-webpay.ts`: mantener `createWebPayDtoSchema`/`createWebPayResponseSchema` y `CreateWebPayError`, eliminar `createWebPayServerFn`/`BackendApiError`, implementar `try { const { data } = await apiClient.post<CreateWebPayResponse>("/webpay", dto); return createWebPayResponseSchema.parse(data); } catch (e) { if (axios.isAxiosError<ApiErrorResponse>(e)) throw new CreateWebPayError(joinMessage(e.response?.data.message), e.response?.status); throw e; }`, con validación zod previa.
- [x] 3.4 Verificar `course-catalog.tsx`, `course-content.tsx`, `course-dashboard.tsx` siguen importando `getCourses`/`getCourse`/`createWebPay` sin cambios de firma.

## 4. Migrar `course-management` a apiClient (todos los endpoints)

- [x] 4.1 Reescribir `apps/web/src/features/course-management/api/create-course.ts`: eliminar `createServerFn`/`requestBackendJson`, usar `apiClient.post<unknown>("/courses", data)` + `courseDetailSchema.parse`, validación `createCourseRequestSchema` previa.
- [x] 4.2 Reescribir `apps/web/src/features/course-management/api/update-course.ts`: validar `updateCourseInputSchema`, usar `apiClient.patch<unknown>("/courses/${id}", data)` (o `apiClient.patch`/`put` según contrato actual) + `courseDetailSchema.parse`.
- [x] 4.3 Reescribir `apps/web/src/features/course-management/api/delete-course.ts`: validar `deleteCourseInputSchema`, usar `apiClient.delete<unknown>("/courses/${id}")` + `courseDetailSchema.parse`.
- [x] 4.4 Confirmar que los tres archivos importan `apiClient` desde `@/lib/api-client` y no contienen `createServerFn` ni `requestBackendJson`.

## 5. Eliminar proxy SSR y limpiar dependencias

- [x] 5.1 Eliminar `apps/web/src/lib/backend-api.server.ts`.
- [x] 5.2 Eliminar `apps/web/src/lib/backend-api.server.test.ts`.
- [x] 5.3 Verificar limpieza: `grep -r "backend-api.server\|requestBackendJson\|BackendApiError" apps/web/src --include="*.ts" --include="*.tsx"` → 0; `grep -r "createServerFn" apps/web/src/features --include="*.ts"` → 0; `eslint` sin `unused-imports`.

## 6. Actualizar tests a apiClient

- [x] 6.1 Reescribir `apps/web/src/features/course-dashboard/api/course-api.test.ts`: `vi.mock("@/lib/api-client", () => ({ apiClient: { get: vi.fn() }, SessionExpiredError }))` (o `vi.spyOn`), verificar `apiClient.get` llamado con `"/courses"` y `"/courses/:id"`, rechazo de `videoLink` en catálogo, falta de links en detalle, `getCourse(0)` no llama `apiClient`, y `401` → `SessionExpiredError` si se testea.
- [x] 6.2 Reescribir `apps/web/src/features/course-dashboard/api/create-webpay.test.ts`: mock `apiClient.post`, verificar llamado con `"/webpay"` y `dto`, respuesta validada, `CreateWebPayError` preserva `message`/`status` (incl. `message` array `join(" ")`), y payload inválido no llama `apiClient`.
- [x] 6.3 Reescribir `apps/web/src/features/course-management/api/course-management.test.ts`: mock `apiClient.post/patch/delete`, verificar `post "/courses"` con payload, `patch "/courses/:id"` y `delete "/courses/:id"`, validación previa y propagación de errores `AxiosError`/`SessionExpiredError`.
- [x] 6.4 Revisar `course-dashboard.test.tsx`, `course-content.test.tsx`, `course-catalog.test.tsx`, `course-management-panel.test.tsx`, `course-form-dialog.test.tsx` si mockean `createServerFn`; cambiar a mocks de `getCourses`/`createWebPay`/`createCourse` directos si es necesario.
- [x] 6.5 Eliminar toda referencia a `BackendApiError` y `requestBackendJson` en tests.

## 7. Validación y limpieza final

- [x] 7.1 `pnpm exec tsc --noEmit` en `apps/web` — sin errores tras restaurar `api-client.ts` y eliminar `backend-api.server.ts`.
- [x] 7.2 `pnpm lint` en `apps/web` — sin imports no usados ni `createServerFn` residual.
- [x] 7.3 `pnpm test` / `pnpm test:run` en `apps/web` — todos los suites dashboard/management en verde; `grep` de 5.3 sigue en 0.
- [x] 7.4 `pnpm build` en `apps/web` (Vite + Cloudflare) — build exitoso sin rutas serverFn huérfanas; `routeTree.gen.ts` sin cambios inesperados.
- [ ] 7.5 Smoke dev: `NEXT_PUBLIC_API_URL=http://localhost:3000` — login, `/dashboard` catálogo, `/courses/:id` video/file, Webpay `token/url`, gestión crear/editar/eliminar. — Pendiente verificación manual con backend local.
- [ ] 7.6 Smoke prod/staging contra `https://aula-rayen.vasvani.shop/api` vía túnel Cloudflare — misma matriz; confirmar `withCredentials` envía `better-auth.session_token` same-origin (cookie `Secure`, `HttpOnly`, `SameSite=Lax`). — Pendiente deploy.
- [x] 7.7 Actualizar `apps/web/README.md` y `.env.example` si mencionan `backend-api.server` o proxy SSR (deben documentar `apiClient` con `withCredentials`). — Verificado: ya documentan `NEXT_PUBLIC_API_URL` directo, no requieren cambio.

## 8. Documentación y cierre

- [x] 8.1 Actualizar `apps/web/AGENTS.md` / comentarios si describen patrón `requestBackendJson` + `createServerFn` (cambiar a ejemplo `apiClient.get/post`). — Verificado: `apps/web/AGENTS.md:28` ya indica `Axios mediante @/lib/api-client`, alineado con el change.
- [x] 8.2 Añadir nota de rollback en el PR: `git revert <sha>` restaura `backend-api.server.ts` + `createServerFn` y elimina `api-client.ts`/`axios` sin cambios de infra.
- [x] 8.3 Marcar `Open Questions` de `design.md` como resueltas antes de archivar el change.
