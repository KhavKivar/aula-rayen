# 0002 - Webpay commit

- Fecha: 2026-09-11
- Estado: aceptada
- Ámbito: api

## Contexto

Transbank retorna a `GET /webpay/commit` con `token_ws`, `TBK_TOKEN` o nada (abandono/timeout). Hay que confirmar una sola vez, no otorgar acceso en pagos rechazados y soportar reintentos sin doble cobro.

## Decisión

Contrato en `@aula-rayen/contracts/webpay` (`CommitResult { paymentStatus: ok | pending | canceled }`, `CommitRedirect { url }`, `PaymentResultStatus success | rejected | timeout`). Flujo en `checkCommit` + `commit`:

- Sin `token_ws` se devuelve `canceled` sin llamar a Transbank.
- Sesión inexistente → `WEBPAY_SESSION_NOT_FOUND`. Sesión con `committedAt` → `ok` idempotente sin re-llamar ni reescribir.
- Antes de consumir el token se adquiere un claim atómico con `takeSession` (`takenAt IS NULL`). El ganador continúa; un callback concurrente que pierde el claim devuelve `pending`, porque todavía no conoce el resultado final, y no llama a Transbank.
- El ganador ejecuta `commit(token)` una sola vez y valida la respuesta con `CommitResponseSchema`; una respuesta inválida produce `WEBPAY_INVALID_RESPONSE`.
- Autorizado solo si `responseCode === 0 && tbStatus === 'AUTHORIZED'` **y** `buyOrder` coincide **y** `tbAmount === amount` de create.
- No autorizado o mismatch → `recordAttempt` (solo si `committedAt IS NULL`, nunca otorga curso) → `canceled`.
- Autorizado → `completeAuthorizedPayment` en transacción (update + `committedAt` + insert `course_purchases` con `onConflictDoNothing`) → `ok`.
- El controller mapea (`mapCommitToRedirectStatus`) y redirige 302 a `/payment-result?status=...`: `ok→success`, `canceled + tokens→rejected`, `canceled sin tokens→timeout`, `pending→timeout`.

## Alternativas consideradas

- Confirmar solo por `tbStatus` sin validar `amount`/`buyOrder`: descartada, permite monto alterado.
- Re-llamar a `commit` en cada reintento: descartada, riesgo de doble procesamiento y costo extra.
- Otorgar acceso y luego revertir si falla: descartada, deja accesos fantasma.

## Consecuencias

- El commit es idempotente y auditable: intentos fallidos quedan en `webpay_sessions` sin `committedAt`.
- Una fila completada nunca es sobrescrita por `recordAttempt`.
- El frontend solo interpreta `success | rejected | timeout`, no detalles de Transbank.
