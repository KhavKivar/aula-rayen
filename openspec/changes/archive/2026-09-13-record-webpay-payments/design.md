## Context

Ver `proposal.md` (Why) y `specs/admin/payment-records/spec.md` (requisitos). Estado actual verificado en código:

- `POST /webpay` crea la transacción Transbank e inserta `webpay_sessions` (intento).
- `GET /webpay/commit` confirma con Transbank; solo el caso autorizado persiste (`committedAt` + campos de pasarela) y crea `course_purchases` en transacción con `onConflictDoNothing`.
- Los casos no autorizados / timeout retornan `payment: false` sin escribir nada; el panel Pagos usa `demoTransactions`.
- Restricción dura del usuario: **sin cambios al schema de la base de datos** (sin migraciones).
- `WebPayController.findAll` (`GET /webpay`) hoy no exige rol; `CourseController` sí usa `@Roles(['admin'])` a nivel de clase.

## Goals / Non-Goals

**Goals:**

- Registrar intentos rechazados con respuesta Transbank en columnas existentes, sin `committedAt` ni compra.
- Exponer lectura admin de pagos reales mapeados desde `webpay_sessions` + `user` + `courses`.
- Panel Pagos con datos reales, mismos filtros/métricas/detalle, sin demo cuando hay datos.

**Non-Goals:**

- Migraciones o columnas nuevas; paginación server-side (se ordena y limita, el filtrado fino sigue en cliente); conciliación contable; reintentos automáticos de cobro; abortos pre-commit sin respuesta Transbank (quedan como pendientes envejecidos).

## Decisions

1. **Derivar estado, no almacenarlo.** `approved = committedAt != null AND responseCode = 0 AND tbStatus = 'AUTHORIZED'`; `rejected = committedAt IS NULL AND` hay respuesta de commit (`responseCode`/`tbStatus` presentes); resto `pending`. Alternativa (columna `status`) descartada por la restricción de no cambiar el schema.
2. **Guardas de escritura en repositorio.** Nueva escritura de intento solo si `committedAt IS NULL`; nunca limpiar `committedAt`; compra solo en autorizado con `buyOrder` y monto coincidentes. Alternativa (lógica en servicio sin guarda SQL) descartada por carreras ante reintentos del callback.
3. **Endpoint admin separado (`GET /webpay/payments`) con `@Roles(['admin'])`** en vez de reutilizar `GET /webpay`, que hoy no exige rol y devuelve filas crudas. Se audita ese hueco pero no se cambia su comportamiento en este change.
4. **Contrato de respuesta en `packages/contracts`** (nuevo schema de pago admin) aunque no haya cambio DB: es cambio de contrato HTTP y dispara ambos deploys; se documenta en el plan de migración.
5. **Enmascarado en el mapeo**: UI recibe `maskedCard` (`•••• últimos 4`) y nunca el PAN completo; el formateo CLP/es-CL existente se reutiliza.

## Risks / Trade-offs

- [Reintento del callback `commit` tras un rechazo] → Las guardas (`committedAt IS NULL`, compra solo en autorizado coincidente, `onConflictDoNothing`) lo hacen idempotente; tests de doble commit.
- [Aborto en Transbank sin `token_ws` (`TBK_TOKEN`)] → Sin respuesta commiteable no hay nada que persistir; queda `pending` envejecido. Se documenta en UI como pendiente, no como rechazado.
- [`GET /webpay` sin auth aparente] → No se usa para el panel; se deja nota de seguimiento, fuera de alcance cambiarlo aquí.
- [Volumen] → El endpoint ordena por fecha descendente con límite; si crece, sigue paginación server-side como change posterior.

## Migration Plan

1. Deploy backend + contracts (nuevo endpoint inactivo para UI hasta el deploy web; sin migraciones, rollback = revert).
2. Deploy web (panel consume endpoint; fixtures demo quedan como fallback solo sin datos o ante error).
3. QA manual: compra aprobada real en integración Transbank, rechazo, timeout y doble callback; verificar métricas y detalle enmascarado.

## Open Questions

- Ninguna que bloquee: el comportamiento ante aborto pre-commit y el límite del listado quedan fijados en specs/tasks.
