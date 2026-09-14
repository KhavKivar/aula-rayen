# Análisis de refactorización — apps/web

> Registro del análisis previo a `openspec/changes/refactor-web-ui-patterns/`
> y de los patrones aplicados. Útil como mapa para futuras mejoras.

## Patrón base

`src/components/ui/` sigue el estilo **shadcn**: primitivas sobre Base UI con la
convención `data-slot`, variantes con `class-variance-authority` y clases
combinadas vía `cn()` (`tailwind-merge`). El refactor extendió ese mismo espíritu
con **compound components** (wrappers que componen primitivas), **slots** (props
`children`/`footer`/`labelAction` para contenido del consumidor) y **single
responsibility** (una responsabilidad por módulo).

## Hallazgos y lo aplicado

### 1. Boilerplate de diálogos (×6 duplicaciones) → compuesto

Cada diálogo repetía la pirámide `Dialog > Portal > Backdrop > Viewport >
Popup > Header > Title/Description + Close`. Ahora:

- `ui/confirm-dialog.tsx` — footer Cancelar/Confirmar, `isPending`, `destructive`,
  variantes `centered | sheet` y tamaños `sm–xl`. Consumidores:
  `delete-course-dialog`, borrado por día (`week-availability-grid`).
- `ui/form-dialog.tsx` — scaffolding para formularios; el `<form>` completo va
  como `children` (el botón submit debe vivir dentro del form), `footer` es slot
  para contenido no-form. Consumidores: `course-form-dialog`,
  `single-schedule-dialog`, `purchasers-dialog`, `payment-detail-dialog`.
- Los bottom-sheets móviles (`items-end p-0 sm:items-center`) quedaron cubiertos
  por `variant="sheet"` en vez de clases copiadas.

### 2. Estados loading/error (×6 duplicaciones) → `ui/query-state.tsx`

`<QueryState query loading error errorDescription? errorAction? onRetry?
loadingClassName? errorClassName?>` renderiza spinner (isPending), alerta +
Reintentar (`isLoadingError`) o `children`. El uso de `isLoadingError` preserva
el comportamiento de mostrar datos cacheados cuando un refetch de fondo falla
(test de `payments-panel`).

Normalizaciones visuales aceptadas (documentadas, no rompen tests):
- `reservations-panel` mantiene su `<p>` simple de carga (se usó `QueryState`
  solo para el error para no introducir spinner nuevo); su error pasa de un
  bloque ad-hoc a `QueryState`.
- `course-content` usa `QueryState` a pantalla completa con `errorDescription`
  y `errorAction` (CTA propia "Volver al panel") en vez del botón Reintentar.
- `purchasers-dialog` mantiene sus clases compactas vía `loadingClassName`/
  `errorClassName`.

### 3. Wiring de campos TanStack Form (×14 duplicaciones) → `ui/form.tsx`

`@tanstack/react-form@1.33` trae el patrón oficial de campos compuestos:
`createFormHook` + `createFormHookContexts`. Se creó:

- `useAppForm` (reemplaza a `useForm` donde se usan los campos ligados).
- `TextField` / `TextareaField`: leen el campo vía `useFieldContext()` y
  encapsulan `error`, `aria-invalid`, `aria-describedby` sobre `FormField`.
  Se renderizan dentro de `<form.AppField name="…">{() => <TextField …/>}</form.AppField>`.

¿Por qué no pasar `form` por prop? Los 12 generics de `FormApi` v1 son
invariantes (`in out`): perder la inferencia del schema al sub-tipar. El patrón
de contexto evita eso y es el camino oficial de la librería.

Consumidores migrados: `login-form`, `register-form`, `forgot-password-form`,
`reset-password-form`, `use-course-form` + `course-form-fields` (el campo
`price` con conversión numérica quedó manual a propósito).

Efecto: los formularios auth bajaron de ~190 a ~140 líneas cada uno y el wiring
de accesibilidad vive en un solo lugar.

### 4. `schedule-builder.tsx` (437 → 3 archivos + compositor)

División por responsabilidad, con el mismo contract público (`schedules`,
`onSave`, `onDelete`, `onDeleteDay`):

```
schedule-builder.tsx          → compositor (~35 líneas): <section> + 2 hijos
├── schedule-generator-form   → header + form (días/fechas/horas) + errores + preview
├── schedule-preview-grid     → bloques generados + "Guardar todos"
└── week-availability-grid    → navegación semanal + DayScheduleCard + ConfirmDialog
```

El modelo puro (`schedule-model.ts`) no cambió. El estado se co-locó donde se
usa (`previewVisible`/`error` en el generador; `weekOffset`/`deleteDay` en la
grilla).

### 5. Puntuales en admin-dashboard

- `MetricCard` (en `payments-panel.tsx`) con `variant="highlight"` reemplazó el
  estilado condicional por índice (`index === 0`).
- `formatDate("es-CL")` en `payment-format.ts` centralizó el formato de fechas
  (`purchasers-dialog`, `payment-detail-dialog`).

## Convenciones para mantener

- Antes de crear una primitiva nueva, revisar `ui/`: si hay 3+ copias de un
  patrón, extráelo ahí (props limitados a lo usado; lo variable → slots).
- Los wrappers de diálogo no aceptan props nuevos especulativos: si un caso no
  encaja, úsese `form-dialog`/`confirm-dialog` con `children` o primitivas Base
  directamente.
- Mantener `QueryState` sobre flags (`isPending`/`isLoadingError`), no migrar a
  Suspense sin un change propio.

## Trabajo futuro (no aplicado)

- **Nav móvil duplicado**: el toggle Menu/X con `aria-expanded`/`aria-controls`
  se repite en `ui/navbar.tsx` y `admin-shell.tsx` → candidato a
  `MobileNavToggle` compuesto.
- **`course-dashboard.tsx`**: su `ErrorBoundary` + `Suspense` manual podría
  migrar a un `AsyncBoundary` compartido si se adopta `useSuspenseQuery` en más
  vistas.
- **`Card` compound**: los paneles hand-roll `rounded-[2rem] border bg-card
  px-6 py-16`; `ui/card.tsx` existe y podría adoptarse gradualmente.
- **Landing**: componentes independientes y correctos, pero sus secciones podrían
  beneficiarse de un `Section` compuesto (`kicker`, `title`, `children`) si
  crece.
- **`reservations-panel`**: migrar su loading simple a `QueryState` completo
  cuando se quiera estandarizar el spinner card.
