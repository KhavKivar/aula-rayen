# 0001 - Webpay create

- Fecha: 2026-09-11
- Estado: aceptada
- Ámbito: api

## Contexto

Iniciar Webpay Plus sin confiar en el cliente y con trazabilidad antes de redirigir.

## Decisión

- `buyOrder = nanoid(26)` (máx. Transbank). Es PK en `webpay_sessions.buy_order`, por tanto único. Con 26 chars la probabilidad de colisión es despreciable.
- `sessionId = userId:courseId` solo como metadata para Transbank. Igual se guarda la data propia en DB: `buyOrderId, userId, courseId, amount, tokenWs`.
- Precio siempre desde DB, nunca del cliente.

## Alternativas consideradas

- `amount` desde cliente o `buyOrder` secuencial: descartadas por manipulación y colisiones.

## Consecuencias

- Sesión pendiente (`committedAt = null`) hasta commit. `buyOrder` es la clave de correlación.
