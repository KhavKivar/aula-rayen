## Why

El panel Pagos del admin muestra transacciones de demostración (`demoTransactions`) mientras el flujo real de Webpay ya persiste los pagos autorizados. Cuando alguien paga, el registro existe en `webpay_sessions` + `course_purchases`, pero los intentos rechazados no se guardan y no hay endpoint admin para ver pagos reales. Sin eso, la pantalla Pagos no puede salir de demo.

## What Changes

- Persistir el resultado del commit Transbank también cuando NO es autorizado, usando solo columnas existentes de `webpay_sessions` (sin cambiar el schema): se guardan los campos de la pasarela, se deja `committedAt` en null y no se crea compra.
- Proteger la escritura: nunca sobrescribir una fila ya confirmada (`committedAt` presente) y solo crear `course_purchases` en pagos autorizados con `buyOrder` y monto coincidentes.
- Nuevo endpoint admin de lectura que mapea `webpay_sessions` + usuario + curso a pagos (`orderId`, comprador, curso, monto, fecha, estado derivado, tarjeta enmascarada, código de autorización), con `@Roles(['admin'])`, orden y límite.
- El panel Pagos consume pagos reales manteniendo filtros, métricas y detalle existentes; el badge "Datos de demostración" se retira cuando hay datos reales.
- Añadir `code` de error estable ya existe (Etapa D); sin cambios de schema de base de datos.

## Capabilities

### New Capabilities

- `admin/payment-records`: registro y lectura de pagos Webpay reales para el panel administrativo (estados derivados approved/pending/rejected, enmascarado de tarjeta, endpoint admin, UI con datos reales).

### Modified Capabilities

- Ninguna: no cambian requisitos de specs existentes (el dashboard admin sigue mostrando las mismas secciones con datos reales en vez de demo).

## Impact

- Backend: `WebPayService.checkCommit`, `WebPayRepository` (nueva escritura de intento + lectura mapeada), nuevo endpoint en `WebPayController` con rol admin, contrato de respuesta en `packages/contracts` (dispara ambos deploys).
- Frontend: `admin-dashboard` (query + panel con datos reales, retiro de fixtures demo de pagos), sin cambios visuales salvo datos.
- Sin migraciones de base de datos. Riesgo principal: reintentos del callback `commit` e intentos abortados sin respuesta Transbank (quedan como pendientes envejecidos).
