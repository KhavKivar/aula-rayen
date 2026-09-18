# 0002 - Webpay commit

- Fecha: 2026-09-11
- Estado: aceptada
- Ámbito: api

## Contexto

El callback de Transbank debe procesarse una sola vez y nunca otorgar acceso por un pago rechazado.

## Decisión

- Sin `token_ws`, el resultado es `canceled` y no se llama a Transbank.
- `takeSession` usa `takenAt` como claim atómico. Solo el ganador confirma; los demás retornan `pending`.
- Un callback repetido sobre una sesión ya completada responde `ok` sin volver a llamar a Transbank.
- Un pago es válido únicamente si está autorizado y coinciden la orden y el monto guardados.
- El pago autorizado y el acceso al curso se guardan en una transacción.
- Los intentos rechazados se registran sin otorgar acceso.
- El frontend recibe `success`, `rejected` o `timeout` mediante redirect.

## Consecuencias

- El token se consume una sola vez y un callback concurrente no duplica la compra.
