## Context

Actualmente el módulo `CourseController` ya expone `GET /courses` (requiere `@Session()`), `GET /courses/:id`, `POST`, `PATCH` y `DELETE` con validación Zod vía `ZodValidationPipe` y `toCourseDetail` mapper. El frontend `CourseDashboard` (`_protected.tsx` → `session` check) solo consume `getCourses`/`getCourse` mediante `createServerFn` + `requestBackendJson` y no ofrece mutaciones. El diseño de UI existe (tokens `#f7f4ec`, `#294944`, `rounded-[2rem]`, `shadcn`) y debe preservarse. No existe rol admin aún; por acuerdo la autorización es temporalmente abierta a cualquier usuario autenticado.

## Goals / Non-Goals

**Goals:**
- Reutilizar contratos Zod existentes sin duplicar validación.
- Añadir gestión CRUD completa al dashboard con cambio de pestañas sin enrutar.
- Mantener consistencia con TanStack Query + Server Functions y `BackendApiError` handling (preservar `status` y `message`).
- Garantizar accesibilidad, i18n español y manejo de errores no bloqueante.

**Non-Goals:**
- Introducir RBAC / guard admin (queda para siguiente cambio).
- Cambiar DB schema o añadir paginación/búsqueda.
- Crear rutas `/dashboard/manage` separadas (mismo layout, tabs locales).
- Migrar a otra librería de formularios o añadir dependencias nuevas sin justificar.

## Decisions

**1. Tabs con estado local vs rutas separadas**
- Decisión: estado local `useState<'catalog'|'manage'>` dentro de `CourseDashboard`, con `Base UI Tabs` o `shadcn Tabs`.
- Rationale: cumple requisito "panel que permite switch sin navegación", evita duplicar layout y guards, preserva cache de query.
- Alternativa rechazada: rutas hijas `/dashboard` y `/dashboard/manage` — añadiría complejidad de router innecesaria para esta fase y rompería el flujo `shared → features → app`.

**2. Nuevo feature `course-management` con server functions específicas**
- Decisión: crear `src/features/course-management/api/{create-course,update-course,delete-course}.ts` cada uno con `createServerFn` + `zod validator` + `requestBackendJson("/courses" …)` y parseo con schemas de contracts. Reutilizar `courseCatalog` queryKey `["courses"]` para invalidación.
- Rationale: respeta `shared → features → app` (no importar internals entre features), mantiene frontera BFF tipada, evita proxy genérico.
- Alternativa rechazada: reutilizar `api-client` (Axios) — ya fue eliminado; `fetch` vía `requestBackendJson` mantiene `Cookie` forwarding y `Cache-Control: no-store`.

**3. Formulario único para crear/editar (TanStack Form + Zod)**
- Decisión: componente `CourseForm` modal (`Dialog` de shadcn) con `useForm` de `@tanstack/react-form`, `zod` validators, campos controlados, `onSubmit` que delega a `createCourse` o `updateCourse` según `mode`.
- Rationale: TanStack Form es la librería recomendada en `apps/web/AGENTS.md`; Zod schemas ya existen; un solo formulario reduce duplicación y mantiene a11y.
- Validación: `createCourseRequestSchema` para crear (todos requeridos), `updateCourseRequestSchema` para editar (al menos un campo). Prevenir envío vacío en edición a nivel cliente antes de llamar al serverFn.

**4. Eliminación con `AlertDialog` y manejo de error in-modal**
- Decisión: `AlertDialog` de shadcn con `title`, `description` que incluye `course.title`, botones `Cancelar` / `Eliminar` (destructive). `deleteCourse` captura `BackendApiError` y retorna `{success, message, status}` para que el caller decida si cerrar o dejar abierto.
- Rationale: UX explícita, evita pérdida accidental; retener modal en error permite reintento sin perder contexto.

**5. Invalidación de queries y estados**
- Decisión: tras mutación exitosa `queryClient.invalidateQueries({queryKey: ["courses"]})` y `["course", id]` si aplica; toasts vía `sonner` o `Alert` inline existente, consistente con dashboard actual (`role="alert"`).
- Alternativa: actualización optimista manual — rechazada por riesgo de divergencia con `courseCatalogSchema` strict; invalidación es suficiente para catálogo pequeño.

## Risks / Trade-offs

- [CRUD abierto a cualquier usuario autenticado → creación/borrado accidental] → Mitigación: confirmar eliminación, dejar puerta abierta para guard admin en próximo cambio; documentar en README que es temporal.
- [Formulario edita `videoLink`/`fileLink` sensibles] → Mostrar campos con `type="url"` y helper text, validar `z.url()`, no exponer contenido sin `hasAccess` en catálogo público (ya protegido por `coursePublicFieldsSchema` omit).
- [Doble envío / race condition en mutaciones] → Deshabilitar botones durante `isPending`, usar `mutationFn` única con `isPending` de React Query.
- [Error de validación backend no mapeado 1:1] → `BackendApiError` ya une `message` array → string; mostrar en `formError` genérico además de field errors de Zod.
- [Tests acoplados a `createServerFn` mock] → Reutilizar patrón existente en `course-api.test.ts` (mock `requestBackendJson` + `createServerFn` builder).

## Migration Plan

1. Crear `course-management` feature y sus 3 serverFns + tests.
2. Crear componentes `CourseManagementPanel`, `CourseFormDialog`, `DeleteCourseDialog` + tests RTL.
3. Extender `CourseDashboard` con tabs, integrar panel y hooks.
4. Añadir zona ESLint para el feature si corresponde.
5. Verificar `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run`, `pnpm build` en `apps/web`; `pnpm test` en `apps/api` sigue pasando (sin cambios de contrato).
6. QA manual: login → dashboard → gestionar → crear → editar → eliminar con confirmación → verificar catálogo refleja cambios.

Rollback: revertir commits del feature; el dashboard vuelve a solo catálogo sin afectar datos.

## Open Questions

- Ninguna bloqueante. Confirmado: precio en CLP entero, duración como string libre, URLs absolutas.
