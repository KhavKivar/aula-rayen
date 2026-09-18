## Context

`apps/web` (TanStack Start + React 19, Tailwind, Base UI, TanStack Form/Query) ya
tiene primitivas shadcn-style en `src/components/ui/` con la convención `data-slot`,
`cva` para variantes y `cn()` para clases. Los consumidores duplican scaffolding en
tres niveles (diálogos, estados de query, campos de formulario) y un feature mezcla
4 responsabilidades. Ver proposal.md · Why. Constraints relevantes de AGENTS.md:
reutilizar `src/components/ui/` antes de crear primitivas, sin dependencias nuevas,
composición desde `routes`, y tests Vitest + Testing Library deben seguir verdes.

## Goals / Non-Goals

**Goals:**
- Una sola implementación por patrón repetido, dentro de `src/components/ui/`.
- Componentes compuestos con slots donde el consumidor necesita control (header,
  contenido, footer); wrappers de alto nivel (`ConfirmDialog`, `FormDialog`) donde
  el caso de uso es único.
- `schedule-builder.tsx` dividido por responsabilidad sin cambiar su contract
  público (`schedules`, `onSave`, `onDelete`, `onDeleteDay`).
- Tests existentes verdes; validación completa (`lint`, `tsc`, `test:run`, `build`).

**Non-Goals:**
- No se migran estilos ni se cambia el sistema de diseño (clases Tailwind existentes).
- No se tocan rutas, contratos HTTP ni features cruzando a la API.
- No se introduce Storybook ni dependencias nuevas.
- No se refactorizan `navbar.tsx`/`admin-shell` (nav móvil duplicado) ni la landing:
  se documentan como trabajo futuro en REFACTORING.md.

## Decisions

1. **ConfirmDialog y FormDialog como wrappers de alto nivel, no como recomposición
   de `Dialog*` existente.** Las primitivas Base UI actuales (`dialog.tsx`) se
   quedan intactas; los wrappers internamente usan `DialogPortal`, `DialogBackdrop`,
   `DialogViewport`, `DialogPopup`, `DialogHeader`, `DialogTitle`,
   `DialogDescription`, `DialogClose`. Alternativa considerada: un `DialogRoot`
   compuesto con slots `Dialog.Body/Footer` (estilo Radix-composites); se descarta
   porque los 6 casos actuales son suficientemente uniformes para 2 wrappers y el
   patrón de slots queda cubierto por `labelAction` (FormField) y los props de
   contenido de los wrappers. `DialogClose` se comporta igual en ambos.
2. **Variante bottom-sheet como prop del wrapper, no componente aparte.**
   `ConfirmDialog`/`FormDialog` aceptan `variant?: "centered" | "sheet"`; "sheet"
   aplica las clases que hoy duplican `purchasers-dialog` y `payment-detail-dialog`
   (`items-end p-0 sm:items-center sm:p-5` + radios inferiores). Alternativa: 4to
   componente `DialogSheet`: descartada por duplicar API.
3. **QueryState como componente controlado por flags del query, no Suspense.**
   `<QueryState query={q} loading="…" error="…" onRetry?>{children}</QueryState>`
   lee `isPending`/`isLoadingError` (patrón actual en las 6 vistas) y no exige
   migrar a `useSuspenseQuery` + ErrorBoundary. `errorDescription` y
   `errorAction` cubren pantallas con mensaje extendido o CTA propia
   (course-content). El boundary manual de `course-dashboard` se queda como
   está (ya funciona y es distinto en forma). `reservations-panel` mantiene su
   `<p>` simple de carga y usa QueryState solo para el error. Alternativa
   `AsyncBoundary` con Suspense: pospuesto, sería otro cambio.
4. **FormTextField con `createFormHook` (patrón oficial de TanStack Form v1.33).**
   `ui/form.tsx` exporta `useAppForm` (reemplazo directo de `useForm`) y los
   campos `TextField`/`TextareaField` que leen su campo vía `useFieldContext()`
   dentro de `<form.AppField>`. Se descartó pasar `form` por prop: los 12
   generics de `FormApi` v1 son invariantes (`in out`) y al sub-tipar se pierde
   la inferencia del schema (el wiring de errores/aria volvería a duplicarse o
   requeriría `any`). Campos no cubiertos (precio con conversión numérica,
   selects, DatePicker) siguen con `form.Field` manual.
5. **Split de schedule-builder por sección visual, contratos internos explícitos.**
   `ScheduleGeneratorForm` (form + errores + preview mediante props `onSave`),
   `SchedulePreviewGrid`, `WeekAvailabilityGrid` + `DayScheduleCard`,
   `DeleteDayDialog` (usa ConfirmDialog). El estado `weekOffset` y `deleteDay`
   permanecen donde se usan (co-locación), no se eleva estado global. El modelo
   puro (`schedule-model.ts`) no cambia.
6. **MetricCard con `variant="highlight"`.** Reemplaza el condicional `index === 0`
   en `payments-panel`; el array de métricas pasa a declarar su variante.
7. **formatDate en `payment-format.ts`.** Única fuente de formato de fecha para
   admin-dashboard; `purchasers-dialog` y `payment-detail-dialog` lo consumen.
   Alternativa util global en `lib/`: se limita a donde se usa hoy.

## Risks / Trade-offs

- [Tests acoplados a DOM interno] → Ejecutar suite tras cada extracción; ajustar
  solo selectores, nunca aserciones de comportamiento. `test:run` de Husky bloquea
  regresiones.
- [Wrappers que se vuelven prop-soup] → Limitar props a los usados hoy; lo que no
  encaja, se expone como slot/children, no como nuevo prop.
- [QueryState esconde detalles de TanStack Query] → Se mantiene tipado sobre
  `UseQueryResult` y solo acepta flags, no el objeto completo, si el tipado lo
  pide más limpio.
- [Split de schedule-builder toca el componente más complejo] → Movimiento mecánico
  (copiar JSX a subcomponentes, props explícitos), sin reescribir lógica; el modelo
  puro ya está testeado.

## Migration Plan

Orden de aplicar: primitivas → consumidores → split grande → docs. Cada paso
compila y pasa tests de forma independiente; no hay deploy especial (solo web,
mismo build). Rollback = revert del commit del paso; sin migraciones.

## Open Questions

(ninguno)
