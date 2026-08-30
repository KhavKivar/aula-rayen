## 1. API - Verificación y documentación (sin cambios de contrato)

- [x] 1.1 Verificar que `POST /courses`, `PATCH /courses/:id`, `DELETE /courses/:id` siguen autenticados y abiertos a cualquier usuario autenticado (sin guard admin) y confirmar con `pnpm test` en `apps/api`
- [x] 1.2 Documentar en comentario o README que el CRUD es temporalmente público para usuarios autenticados y que el control admin se añadirá después

## 2. Feature `course-management` - Server Functions y contratos

- [x] 2.1 Crear `src/features/course-management/api/create-course.ts` con `createServerFn({method:"POST"}).validator(createCourseRequestSchema)` + `requestBackendJson("/courses", {method:"POST", body})` y manejo `BackendApiError`
- [x] 2.2 Crear `src/features/course-management/api/update-course.ts` con `createServerFn({method:"POST"}).validator(z.object({id, data: updateCourseRequestSchema}))` + `PATCH /courses/:id`
- [x] 2.3 Crear `src/features/course-management/api/delete-course.ts` con `createServerFn({method:"POST"}).validator(z.object({id}))` + `DELETE /courses/:id`
- [x] 2.4 Añadir tests unitarios para las 3 serverFns mockeando `requestBackendJson` y `createServerFn` (patrón existente), cubriendo éxito, validación, error de backend

## 3. UI - Panel de gestión y formularios

- [x] 3.1 Crear `src/features/course-management/components/course-management-panel.tsx` con query `["courses"]`, tabla/cards, botón "Crear curso", estados pending/error/empty y acciones Editar/Eliminar
- [x] 3.2 Crear `src/features/course-management/components/course-form-dialog.tsx` reutilizable para crear/editar (TanStack Form + Zod), con campos title/description/videoLink/fileLink/duration/price, validación inline en español y preservación de datos en error
- [x] 3.3 Crear `src/features/course-management/components/delete-course-dialog.tsx` con `AlertDialog`, confirmación con nombre del curso, estados loading/disabled y manejo de error sin cerrar
- [x] 3.4 Añadir tests RTL para panel, formulario (validación, envío) y diálogo de eliminación (confirmar/cancelar/error)

## 4. Integración en Dashboard

- [x] 4.1 Extender `CourseDashboard` con tabs `Ver cursos` / `Gestionar cursos` (estado local, `aria-selected`, foco visible), por defecto en "Ver cursos", sin crear rutas nuevas
- [x] 4.2 Integrar `CourseManagementPanel` en la pestaña de gestión, con invalidación de `["courses"]` tras mutaciones y toasts/alerts en español
- [x] 4.3 Añadir zona ESLint para `course-management` si el proyecto la requiere y asegurar imports `@/` y `shared → features → app`

## 5. Validación

- [x] 5.1 Ejecutar `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run`, `pnpm build` en `apps/web` y corregir
- [x] 5.2 QA manual: login → /dashboard → pestaña Gestionar → crear curso válido → editar precio → eliminar con modal → verificar catálogo en "Ver cursos" refleja cambios sin recarga
