## 1. Contrato de pagos admin

- [x] 1.1 Añadir schema de pago admin en `packages/contracts` (orden, comprador, curso, monto, fecha, estado, tarjeta enmascarada, autorización opcional) con tests.
- [x] 1.2 Ejecutar `pnpm test:run` y `pnpm build` en `packages/contracts`.

## 2. Registro de intentos en backend (sin migraciones)

- [x] 2.1 Persistir la respuesta de commit no autorizada en columnas existentes de `webpay_sessions`, sin `committedAt` ni compra.
- [x] 2.2 Blindar reescrituras: no tocar filas con `committedAt` presente; compra solo en autorizado con `buyOrder` y monto coincidentes.
- [x] 2.3 Añadir tests de servicio/repositorio: rechazo guarda intento sin acceso, doble commit idempotente, mismatch no otorga acceso.
- [x] 2.4 Ejecutar `pnpm exec eslint src test`, `pnpm test` y `pnpm build` en `apps/api`.

## 3. Endpoint admin de pagos

- [x] 3.1 Crear `GET /webpay/payments` con `@Roles(['admin'])`, mapeo a contrato (estado derivado, tarjeta enmascarada), orden descendente y límite.
- [x] 3.2 Añadir tests del endpoint (admin ve pagos, no-admin denegado, tarjeta nunca completa).
- [x] 3.3 Dejar nota de seguimiento sobre `GET /webpay` sin rol (fuera de alcance cambiarlo aquí).

## 4. Panel Pagos con datos reales

- [ ] 4.1 Crear query `payments` en `admin-dashboard` y consumirla en `PaymentsPanel`, manteniendo filtros, métricas y detalle.
- [ ] 4.2 Retirar el badge demo cuando hay datos reales; mantener fixtures solo como fallback sin datos o ante error.
- [ ] 4.3 Actualizar/añadir tests de panel (lista real, filtros, vacío, detalle enmascarado).
- [ ] 4.4 Ejecutar `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run` y `pnpm build` en `apps/web`.

## 5. QA y despliegue

- [ ] 5.1 QA manual en integración Transbank: aprobado, rechazado, timeout y doble callback; verificar métricas y acceso otorgado/sin acceso.
- [ ] 5.2 Push por etapas (contracts+api, luego web) considerando que el contrato dispara ambos deploys.
