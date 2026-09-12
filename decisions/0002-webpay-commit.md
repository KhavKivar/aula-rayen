# 0002 - Webpay commit

- Fecha: 2026-09-11
- Estado: aceptada
- Ámbito: api

## Contexto

Transbank retorna a `GET /webpay/commit` con `token_ws`, `TBK_TOKEN` o nada (abandono/timeout). Hay que confirmar una sola vez, no otorgar acceso en pagos rechazados y soportar reintentos sin doble cobro.

## Decisión

En `WebPayService.checkCommit` (`apps/api/src/modules/webpay/webpay.service.ts:166-228`) y `WebPayController.commit` (`apps/api/src/modules/webpay/webpay.controller.ts:39-57`):

- Sin `token_ws` se devuelve `{ payment: false }` sin llamar a Transbank. El controller mapea a `status=timeout`, con `token_ws` o `TBK_TOKEN` a `rejected`, y redirige 302 a `/payment-result?status=...`.
- Se busca la sesión por `buyOrderId`, si no existe se lanza `WEBPAY_SESSION_NOT_FOUND`.
- Idempotencia: si `committedAt` ya existe se devuelve `{ payment: true }` sin re-llamar a `commit` ni reescribir.
- Se llama `webpayTransaction.commit(token)` una vez y se valida con `CommitResponseSchema`, si falla se lanza `WEBPAY_INVALID_RESPONSE`.
- Solo es autorizado si `responseCode === 0 && tbStatus === 'AUTHORIZED'` **y** `buyOrder` coincide **y** `tbAmount === amount` guardado en create.
- Si no autoriza o hay mismatch: `repository.recordAttempt` (`webpay.repository.ts:107-123`) que solo actualiza si `committedAt IS NULL`, no otorga curso, devuelve `{ payment: false }`.
- Si autoriza: `repository.completeAuthorizedPayment` (`webpay.repository.ts:74-100`) en transacción DB: update `webpay_sessions` + `committedAt = now()` e insert en `course_purchases` con `onConflictDoNothing`.

## Alternativas consideradas

- Confirmar solo por `tbStatus` sin validar `amount`/`buyOrder`: descartada, permite monto alterado.
- Re-llamar a `commit` en cada reintento: descartada, riesgo de doble procesamiento y costo extra.
- Otorgar acceso y luego revertir si falla: descartada, deja accesos fantasma.

## Consecuencias

- El commit es idempotente y auditable: intentos fallidos quedan en `webpay_sessions` sin `committedAt`.
- Una fila completada nunca es sobrescrita por `recordAttempt`.
- El frontend solo interpreta `success | rejected | timeout`, no detalles de Transbank.
