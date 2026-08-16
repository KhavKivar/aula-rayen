## 1. Integración del dashboard

- [x] 1.1 Revisar la navegación y el flujo de inicio de sesión existentes en `frontend/` para ubicar el dashboard sin alterar el contrato de autenticación
- [x] 1.2 Crear la ruta o pantalla autenticada del dashboard y establecerla como destino después de un inicio de sesión exitoso

## 2. Mockup del catálogo

- [x] 2.1 Definir datos locales tipados para cursos de demostración con título, descripción breve y precio en CLP
- [x] 2.2 Implementar tarjetas reutilizables y una cuadrícula adaptable para mostrar los cursos en móvil y escritorio
- [x] 2.3 Implementar el estado vacío en español para un catálogo local sin cursos

## 3. Interacción Webpay simulada

- [x] 3.1 Añadir a cada tarjeta un control accesible etiquetado para pagar con Webpay
- [x] 3.2 Implementar una respuesta visual local que identifique el curso seleccionado y deje claro que el pago es una demostración, sin redirecciones ni solicitudes de red

## 4. Verificación

- [x] 4.1 Añadir pruebas cercanas al comportamiento para el renderizado del catálogo, el estado vacío y la interacción Webpay simulada
- [x] 4.2 Verificar navegación por teclado, foco visible, mensajes en español y ausencia de desbordamiento horizontal en viewports móvil y escritorio
- [x] 4.3 Ejecutar `pnpm lint`, `pnpm exec tsc --noEmit` y `pnpm build` desde `frontend/`
