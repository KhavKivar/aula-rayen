## Why

La aplicación web ya contiene pruebas con Vitest y Testing Library, pero carece de un contrato común que determine qué probar en cada nivel y cómo evitar pruebas frágiles acopladas a la implementación. Establecer esta estrategia ahora permitirá ampliar la cobertura funcional con pruebas que protejan comportamiento observable y sigan siendo mantenibles a medida que crezcan las features.

## What Changes

- Establecer una pirámide de pruebas para `apps/web`: unit tests para lógica pura compleja, pruebas de componente/integración para la mayor parte del comportamiento React y pocos E2E para flujos críticos.
- Definir que las pruebas de interfaz interactúen mediante roles, nombres accesibles, labels y texto visible, priorizando contratos de usuario sobre estructura DOM o clases CSS.
- Limitar `data-testid`, mocks, spies y sustitución de hooks o componentes hijos a casos justificados donde no exista una frontera pública más adecuada.
- Consolidar utilidades compartidas de render y configuración para que las pruebas usen providers reales y dobles únicamente en fronteras externas controladas.
- Incorporar pruebas representativas de autenticación y otros flujos web prioritarios, incluyendo estados exitosos, validaciones, errores y navegación observable.
- Añadir una capa E2E para una selección pequeña de recorridos críticos, comenzando por autenticación y acceso posterior a una ruta protegida.
- Documentar y automatizar los comandos de validación necesarios para ejecutar cada nivel de pruebas localmente y en CI.

## Capabilities

### New Capabilities

- `web/testing-strategy`: Define los niveles de prueba, los contratos observables, las fronteras permitidas para mocks y la validación automatizada de los flujos críticos de la aplicación web.

### Modified Capabilities

Ninguna.

## Impact

- Afecta exclusivamente a `apps/web`, principalmente su configuración de pruebas, utilidades bajo `src/testing`, archivos de prueba cercanos a features y scripts de validación.
- Puede incorporar una herramienta E2E como dependencia de desarrollo y su configuración asociada.
- Los workflows de CI que validan la web deberán ejecutar las suites apropiadas sin alterar contratos HTTP ni comportamiento de producción.
- No requiere cambios en `apps/api` ni en `packages/contracts`; las dependencias externas del frontend se simularán en fronteras explícitas o se usarán mediante un entorno E2E controlado.
