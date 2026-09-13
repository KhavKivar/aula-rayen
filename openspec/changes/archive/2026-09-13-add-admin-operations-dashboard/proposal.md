## Why

El dashboard actual separa el catálogo del CRUD de cursos, pero no ofrece una vista administrativa unificada para entender compradores y pagos. Se necesita validar ahora la arquitectura de información y los flujos comerciales mediante una UI navegable antes de definir contratos y autorización backend.

## What Changes

- **BREAKING (UI)**: retira la pestaña "Gestionar cursos" del dashboard general y traslada las funciones administrativas a `/dashboard/admin`, visible solo para sesiones cuyo rol sea `admin`.
- Amplía el dashboard existente con una experiencia diferenciada de administración y navegación adaptable a escritorio y móvil.
- Reutiliza el CRUD visual de cursos y añade vistas para consultar los usuarios compradores de cada curso.
- Añade una sección de pagos con resumen, búsqueda, filtros, tabla de transacciones y detalle de una operación.
- Incorpora datos mock tipados para compradores y pagos, con filtros y estados representativos sin conectarse a nuevas APIs.
- Presenta el panel como exclusivo para administradores, pero mantiene fuera de esta fase la implementación de RBAC y cualquier garantía real de autorización.

## Capabilities

### New Capabilities
- `admin/operations-dashboard`: Panel administrativo UI para gestionar cursos y consultar compradores y pagos con datos simulados.

### Modified Capabilities

<!-- No se modifican capacidades publicadas en openspec/specs; se amplía la UI implementada por el cambio completo course-management-panel. -->

## Impact

- **Frontend**: `apps/web` — composición del dashboard, nueva navegación administrativa, vistas de compradores y pagos, datos mock y pruebas de componentes.
- **UI existente**: se reutilizan `CourseManagementPanel`, los formularios de curso y el lenguaje visual actual de Aula Rayen.
- **API y base de datos**: sin cambios; la información de compradores y pagos se representa exclusivamente con mocks en esta fase.
- **Autorización**: el diseño asume un usuario administrador, pero no añade guards, roles ni protección de endpoints.
- **Contratos y dependencias**: sin cambios en `packages/contracts` y sin nuevas dependencias salvo necesidad justificada durante implementación.
- **Compatibilidad**: el catálogo y el flujo de compra permanecen disponibles; cambia únicamente la ubicación y visibilidad del panel de gestión.
