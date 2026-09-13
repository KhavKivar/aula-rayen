## Why

El dashboard actual solo permite ver y consumir cursos; no existe una interfaz para crear, editar o eliminar cursos desde la web. Se necesita un panel de gestión integrado al dashboard para que usuarios autenticados puedan administrar el catálogo completo sin depender de scripts o acceso directo a la API.

## What Changes

- Expone el CRUD de cursos existente (`POST /courses`, `PATCH /courses/:id`, `DELETE /courses/:id`) como flujo autenticado pero sin restricción de rol (público para `users`, el control admin se añadirá después). Mantiene `GET /courses` y `GET /courses/:id` autenticados.
- Añade panel de gestión dentro de `/dashboard` con pestañas para alternar entre vista de catálogo (`Ver cursos`) y gestión (`Gestionar cursos`), sin crear rutas separadas.
- Implementa interfaz de creación/edición con formulario validado con Zod (`title`, `description`, `videoLink`, `fileLink`, `duration`, `price`), reutilizando `createCourseRequestSchema` / `updateCourseRequestSchema`.
- Implementa eliminación con modal de confirmación y mensajes de éxito/error en español, con actualización optimista vía TanStack Query.
- Añade validaciones, estados de carga, manejo de errores y accesibilidad consistente con el diseño actual.

## Capabilities

### New Capabilities
- `course-management-panel`: Panel dentro del dashboard que permite a usuarios autenticados listar, crear, editar y eliminar cursos, alternando entre vista de catálogo y vista de gestión.

### Modified Capabilities
<!-- No se modifican capacidades existentes; la API ya expone el CRUD y el dashboard solo gana nueva UI. -->

## Impact

- **Frontend**: `apps/web` — nuevo feature `course-management`, extensión de `CourseDashboard` con tabs, nuevos `serverFn` / hooks de mutación, tests y estados.
- **API**: `apps/api` — sin cambios de contrato; se documenta que el CRUD es autenticado y temporalmente abierto a todos los usuarios autenticados.
- **Contracts**: `packages/contracts` — sin cambios; se reutilizan schemas existentes.
- **No breaking changes**; el catálogo actual sigue funcionando igual.

