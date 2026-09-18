## Why

La landing actual solo permite agendar por WhatsApp/Instagram ("coordinamos
directamente con Pamela"). El backend ya expone booking y availability, pero el
visitante no tiene un flujo de reserva self-service. Este cambio agrega la
interfaz pública de reserva (`/reservar`) con datos mock, como primer paso antes
de conectar la API real y el pago con Webpay.

## What Changes

- Nueva ruta pública-reservada `/reservar` que requiere sesión (redirect a
  `/login` con `?redirect=/reservar` si no hay sesión).
- Nueva feature `features/booking` con: picker de fecha y slots de horas,
  resumen de selección (modalidad online, fecha, hora, precio placeholder) y
  botón "Pagar con Webpay" en estado deshabilitado/placeholder.
- Slots renderizados desde fixtures locales (mismo shape que
  `availabilitySlotResponseSchema`), sin llamadas al backend.
- El picker de fechas/y horarios reutiliza los componentes existentes de
  `admin-reservations` (`date-picker`, grid estilo
  `schedule-preview-grid`).
- Link "Reservar" desde el CTA `#agenda` de la landing; WhatsApp/Instagram se
  mantienen como canal alternativo.

## Capabilities

### New Capabilities

- `booking-ui`: comportamiento del flujo de UI de `/reservar`: acceso con
  sesión, selección de modalidad online, picker de slots con datos mock,
  resumen de selección, estado placeholder de pago.

### Modified Capabilities

## Impact

- `apps/web/src/routes/reservar.tsx` (nuevo).
- `apps/web/src/features/booking/` (nuevo, con fixtures y tests de componentes).
- `apps/web/src/features/landing/components/landing-cta.tsx` (agregar link).
- Sin cambios en `packages/contracts` ni en `apps/api` (queda para el cambio
  siguiente de integración).
