## 1. Feature booking con fixtures

- [x] 1.1 Crear `apps/web/src/features/booking/` con estructura
  `components/`, `api/` y fixtures de availability slots (shape de
  `availabilitySlotResponseSchema`, solo `available`, fechas relativas al día
  actual)
- [x] 1.2 Envolver/reutilizar `DatePicker` y el estilo de grid de horas de
  `admin-reservations` e implementar el picker de fecha + hora filtrando slots
  `available` con estado vacío cuando no hay horarios
- [x] 1.3 Implementar `booking-summary` (modalidad Online fija, fecha/hora,
  precio placeholder, estados placeholder sin selección)

## 2. Página /reservar con guard de sesión

- [x] 2.1 Crear route `apps/web/src/routes/reservar.tsx` con guard de sesión
  igual al patrón de `routes/_authenticated/` (redirect a
  `/login?redirect=/reservar` sin sesión) y armar el layout
  `booking-page` (picker + resumen + botón "Pagar con Webpay" deshabilitado)
- [x] 2.2 Agregar link "Reservar" al CTA `#agenda` en `landing-cta.tsx`
  manteniendo WhatsApp/Instagram

## 3. Validación

- [x] 3.1 Tests de componentes: acceso con guard, selección fecha/hora con
  mocks, resumen actualizado, botón de pago deshabilitado, estado vacío
- [x] 3.2 `pnpm lint`, `pnpm exec tsc --noEmit` y `pnpm build` en `apps/web`
