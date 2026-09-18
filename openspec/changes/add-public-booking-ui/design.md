## Context

El backend ya expone booking y availability (`apps/api/src/modules/booking`,
`availability`) con contratos en `packages/contracts/src/{booking,availability}.ts`,
pero la landing (`apps/web/src/features/landing`) solo agenda por WhatsApp.
Este change agrega únicamente la UI de `/reservar` con datos mock; la
integración con la API y el pago Webpay quedan para el change siguiente.
Ref: `specs/booking-ui/spec.md` para el comportamiento.

## Goals / Non-Goals

**Goals:**
- Ruta `/reservar` con sesión requerida, reutilizando el patrón de redirección
  de las rutas `_authenticated` existentes (dashboard usa redirect a login).
- Reutilizar componentes del panel admin: `DatePicker`
  (`features/admin-reservations/components/date-picker.tsx`) para fecha y el
  estilo de `schedule-preview-grid.tsx` para el grid de horas.
- Fixtures con el shape de `AvailabilitySlotResponse`, filtrando
  `status === "available"`; a futuro se reemplazan por fetchers reales en la
  misma carpeta `api/`.

**Non-Goals:**
- Conexión a la API real de availability/booking.
- Integración o generalización de Webpay (hoy `webpayCreateRequestSchema` pide
  `course_id`; se decidirá en el change de integración).
- Modalidad presencial (Iquique), reglas de expiración/hold de booking.

## Decisions

- **Página dedicada en lugar de modal/ sección inline** (decisión del usuario):
  `/reservar` como route de primer nivel, fuera de `_authenticated/guard` pero
  con guard de sesión propio igual a las dashboard routes. Alternativa
  descartada: modal desde `#agenda` (menos espacio para el flujo picker→resumen).
- **Feature `features/booking`** siguiendo bulletproof-frontend:
  `components/` + `api/` con fixtures que luego se cambian por fetchers sin
  tocar componentes. Alternativa descartada: meter todo en `features/landing`
  (mezcla responsabilidades).
- **Reuso de `DatePicker` y estilo del grid admin** (decisión del usuario):
  consistencia visual y menos código nuevo. Si el DatePicker admin tiene
  acoplamientos al panel, se extrae/duplica el mínimo necesario.
- **Precio placeholder en el resumen**: el booking aún no tiene precio en
  contracts; se muestra un valor fijo de UI sin dato del dominio.

## Risks / Trade-offs

- [Componentes admin acoplados al contexto admin] → envolverlos en
  componentes propios de `features/booking` y mantener mocks/test.
- [Fixture de fechas fijas puede expirar visualmente] → generar fixtures
  relativas a la fecha actual.
- [(redirección difiere del patrón `_auth` vs manual)] → seguir cómo lo hace
  `routes/_authenticated/` exactamente.

## Migration Plan

Solo frontend: despliegue normal de web. Rollback = revertir el release web.
Sin migraciones ni datos.

## Open Questions

Ninguna bloqueante para la UI. (El monto real, el hold `expiresAt` y el
acoplamiento de webpay se resuelven en el change de integración.)
