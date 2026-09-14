## 1. Primitivas compartidas (`src/components/ui/`)

- [x] 1.1 Crear `confirm-dialog.tsx`: wrapper con `open`, `onOpenChange`, `title`, `description?`, `confirmLabel`, `cancelLabel?`, `onConfirm`, `isPending?`, `variant? ("centered"|"sheet")`, `destructive?`; footer Cancelar/Confirmar con spinner pending; error del consumidor via slot `children`.
- [x] 1.2 Crear `form-dialog.tsx`: wrapper con `open`, `onOpenChange`, `title`, `description?`, `variant?`, `children` (contenido) y `footer` (slot); usa scaffolding completo de dialog.
- [x] 1.3 Crear `query-state.tsx`: `<QueryState query loading error onRetry?>` que renderiza bloque spinner (isPending) o alerta+Reintentar (isLoadingError) con las clases actuales; children en caso éxito.
- [x] 1.4 Crear `form-text-field.tsx`: campo ligado a TanStack Form (props `form`, `name`, `label`, `labelAction?`, `placeholder?`, `type?`, `autoComplete?`, `multiline?`, `className?`, `inputClassName?`); wiring interno de `meta.errors`, `aria-invalid`, `aria-describedby`, reusa `FormField`.
- [x] 1.5 Verificar `pnpm exec tsc --noEmit` y `pnpm lint` tras crear las 4 primitivas.

## 2. Consumidores de diálogos

- [x] 2.1 Refactorizar `delete-course-dialog.tsx` y el diálogo de eliminar día de `schedule-builder.tsx` a `ConfirmDialog` (destructive, isPending, children=error).
- [x] 2.2 Refactorizar `course-form-dialog.tsx` y `single-schedule-dialog.tsx` a `FormDialog`.
- [x] 2.3 Refactorizar `purchasers-dialog.tsx` y `payment-detail-dialog.tsx` a los wrappers con `variant="sheet"`.
- [x] 2.4 Ejecutar `pnpm test:run` (diálogos) y ajustar solo selectores si el DOM compartido lo requiere.

## 3. Consumidores de estados de query

- [x] 3.1 Refactorizar `course-management-panel.tsx`, `payments-panel.tsx`, `reservations-panel.tsx`, `purchasers-dialog.tsx` (loading/error interno) a `QueryState`.
- [x] 3.2 Refactorizar `course-content.tsx` (pantalla completa) a `QueryState` manteniendo su layout `main`.
- [x] 3.3 Ejecutar `pnpm test:run` y `pnpm exec tsc --noEmit`.

## 4. Consumidores de campos de formulario

- [x] 4.1 Refactorizar `login-form.tsx`, `register-form.tsx`, `forgot-password-form.tsx`, `reset-password-form.tsx` a `FormTextField` (conservar Google button, divider, footer links y mensajes).
- [x] 4.2 Refactorizar `course-form-fields.tsx` a `FormTextField` (incluye multiline y select/date donde corresponda; lo no estandarizado queda manual).
- [x] 4.3 Ejecutar `pnpm test:run` (formularios) y `pnpm exec tsc --noEmit`.

## 5. Split de schedule-builder

- [x] 5.1 Extraer `ScheduleGeneratorForm` (form de generación + errores + botón Generar vista previa) y `SchedulePreviewGrid` (bloques generados + Guardar todos) a archivos propios.
- [x] 5.2 Extraer `WeekAvailabilityGrid` + `DayScheduleCard` (calendario semanal con bloques y acciones) a archivos propios.
- [x] 5.3 Extraer `DeleteDayDialog` reutilizando `ConfirmDialog`; `schedule-builder.tsx` queda como compositor (<100 líneas) con el mismo contract público.
- [x] 5.4 Ejecutar `pnpm test:run` (reservations) y `pnpm exec tsc --noEmit`.

## 6. Limpieza puntual de admin-dashboard

- [x] 6.1 Extraer `MetricCard` con `variant="highlight"` y eliminar el condicional `index === 0` en `payments-panel.tsx`.
- [x] 6.2 Añadir `formatDate` a `payment-format.ts` y usarlo en `purchasers-dialog.tsx` y `payment-detail-dialog.tsx`.
- [x] 6.3 Ejecutar `pnpm test:run` y `pnpm exec tsc --noEmit`.

## 7. Validación final y documentación

- [x] 7.1 Ejecutar `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run` y `pnpm build` desde `apps/web/`.
- [x] 7.2 Escribir `apps/web/REFACTORING.md` con el análisis (hallazgos, patrones aplicados, trabajo futuro: nav móvil duplicado, landing, AsyncBoundary).
