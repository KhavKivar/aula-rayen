## Why

`apps/web` creció con duplicación estructural en tres ejes: 6 diálogos repiten ~15 líneas
de scaffolding idéntico (`Dialog > Portal > Backdrop > Viewport > Popup > Header`), 6
vistas repiten bloques de loading/error casi idénticos, y 14 campos de TanStack Form
repiten el mismo wiring de errores/aria. Además `schedule-builder.tsx` (437 líneas)
mezcla 4 responsabilidades. Esto encarece mantener consistencia visual y accesible:
cada ajuste de diálogo, estado de carga o campo se copia a mano en 5+ lugares.

## What Changes

- Añadir primitivas compartidas en `src/components/ui/` (sin dependencias nuevas):
  - `ConfirmDialog`: compone Portal/Backdrop/Viewport/Popup/Header/Close + footer
    Cancelar/Confirmar con estado pending y variante destructive.
  - `FormDialog`: compone el scaffolding de diálogo para formularios con slots de
    contenido y footer.
  - `QueryState`: render de loading (spinner + mensaje) y error (alerta + Reintentar)
    a partir de un estado de query de TanStack Query.
  - `FormTextField`: campo ligado a TanStack Form que encapsula error + aria + FormField.
- Refactorizar los 6 diálogos existentes para usar las primitivas (misma UX, misma
  estructura DOM observable razonable, clases equivalentes).
- Refactorizar las 6 vistas con loading/error para usar `QueryState`.
- Refactorizar formularios auth + course-form-fields para usar `FormTextField`.
- Dividir `schedule-builder.tsx` en `ScheduleGeneratorForm`, `SchedulePreviewGrid`,
  `WeekAvailabilityGrid` y `DeleteDayDialog`; `ScheduleBuilder` queda como compositor.
- Extraer `MetricCard` con `variant="highlight"` en `payments-panel` (elimina estilado
  por índice mágico) y centralizar `formatDate("es-CL")` en `payment-format.ts`.
- Documentar el análisis y los patrones en `apps/web/REFACTORING.md`.

Sin cambios de comportamiento observable: mismos flujos, textos, atributos ARIA
esenciales y rutas. Los tests existentes deben seguir pasando (con ajustes de
selectores solo si el DOM compartido los requiere).

## Capabilities

### New Capabilities

(ninguna — refactor puro sin cambios de requisitos)

### Modified Capabilities

(ninguna — `.openspec.yaml` declara `skip_specs: true`)

## Impact

- **Código**: `apps/web/src/components/ui/` (nuevas primitivas),
  `features/{auth,course-management,admin-dashboard,admin-reservations,course-dashboard}/components/*`.
- **Tests**: los tests existentes de diálogos, formularios y paneles deben seguir
  verdes; se actualizan solo selectores si el scaffolding compartido cambia clases.
- **Riesgo bajo**: sin cambios de API, dependencias, rutas ni contratos; validación
  con `pnpm lint`, `tsc --noEmit`, `pnpm test:run` y `pnpm build`.
