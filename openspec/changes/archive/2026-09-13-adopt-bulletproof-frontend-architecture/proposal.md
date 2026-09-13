## Why

El frontend ya agrupa parte del código por funcionalidad, pero todavía no existe un contrato arquitectónico verificable que defina dependencias, ubicación de módulos y estrategia de pruebas. Adoptar una versión ajustada de Bulletproof React permitirá que el proyecto crezca con límites predecibles y que los errores se detecten antes de integrar cambios.

## What Changes

- Definir una arquitectura frontend unidireccional inspirada en Bulletproof React y adaptada a Next.js App Router.
- Organizar el código en capas compartidas, features y aplicación, manteniendo cada feature autocontenida.
- Impedir mediante ESLint imports desde capas inferiores hacia `app` e imports directos entre features.
- Estandarizar las herramientas existentes para UI, formularios, validación, datos remotos, HTTP y autenticación.
- Incorporar Vitest, Testing Library y jsdom para pruebas unitarias y de integración, junto con utilidades compartidas de testing.
- Incorporar Husky con un hook pre-commit que ejecute la suite de tests del frontend.
- Reorganizar el código actual sin cambiar rutas, experiencia de usuario ni contratos HTTP.
- Actualizar `frontend/AGENTS.md` para convertir estas decisiones en instrucciones de mantenimiento.
- Excluir Storybook, Playwright, MSW, gestores de estado global y generadores de código de este cambio.

## Capabilities

### New Capabilities

- `frontend-development-architecture`: Define límites de módulos, selección de librerías, infraestructura de pruebas y validación pre-commit para el frontend.

### Modified Capabilities

Ninguna.

## Impact

- Afecta la estructura y los imports bajo `frontend/src`, la configuración de ESLint, los scripts y dependencias de `frontend/package.json`, el lockfile, Husky y `frontend/AGENTS.md`.
- Añade herramientas de desarrollo y tests, sin añadir dependencias al bundle de producción.
- No modifica endpoints, modelos de datos, rutas públicas ni código del backend.
- Los commits del monorepo que involucren el frontend quedarán sujetos al hook local de tests cuando las dependencias se hayan instalado.
