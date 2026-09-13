## Why

Las personas autenticadas necesitan un punto de entrada claro donde descubrir los cursos disponibles y reconocer cómo iniciarían una compra. Un mockup navegable permitirá validar la jerarquía, el contenido y la intención de pago antes de integrar catálogo o Webpay reales.

## What Changes

- Añadir un dashboard visible después del inicio de sesión.
- Presentar un catálogo visual de cursos disponibles con la información esencial para decidir una compra.
- Incluir una llamada a la acción de Webpay por curso y representar únicamente su interacción visual.
- Mostrar estados UI útiles del catálogo, incluido el estado sin cursos.
- Mantener fuera de alcance la consulta a una API, la creación de órdenes, la redirección a Webpay y cualquier procesamiento de pagos.

## Capabilities

### New Capabilities

- `course-dashboard-mockup`: Dashboard autenticado que muestra cursos disponibles y una llamada a la acción simulada para pagar mediante Webpay.

### Modified Capabilities

Ninguna.

## Impact

- Afecta únicamente a la interfaz del `frontend/` y su navegación posterior al inicio de sesión.
- Utiliza datos locales de demostración y componentes visuales; no modifica contratos HTTP, base de datos, autenticación ni backend.
- No añade una dependencia ni integración real con Webpay.
