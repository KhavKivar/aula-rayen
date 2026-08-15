## Context

El frontend usa Next.js 16 con App Router y ya posee `app`, `components`, `config`, `features` y `lib`, pero los límites entre esas áreas no están automatizados. La autenticación constituye el único feature actual y mezcla correctamente varios subtipos (`api`, `components`, `errors`, `schemas`), por lo que la migración debe consolidar ese patrón sin reescribir funcionalidad estable.

El repositorio es un monorepo sin `package.json` raíz: frontend y backend gestionan sus propias dependencias. El hook de Git debe vivir en la raíz aun cuando Husky sea una dependencia de desarrollo del frontend. Véase `proposal.md` para la motivación y `specs/frontend-development-architecture/spec.md` para el contrato verificable.

## Goals / Non-Goals

**Goals:**

- Adaptar la arquitectura de Bulletproof React a las convenciones obligatorias de Next.js App Router.
- Hacer verificables las direcciones de dependencias y el aislamiento entre features.
- Incorporar una base mínima de tests de integración que cubra el comportamiento existente.
- Instalar y ejecutar el hook desde el paquete frontend sin convertir la raíz en un workspace de paquetes.
- Mantener pequeño el conjunto de dependencias nuevas.

**Non-Goals:**

- Copiar la aplicación de ejemplo o reemplazar convenciones de rutas de Next.js.
- Añadir Storybook, E2E con Playwright, mocks con MSW, Zustand o generación con Plop.
- Rediseñar pantallas, cambiar endpoints o modificar el backend.
- Exigir cobertura numérica en esta primera migración.

## Decisions

### 1. Capas adaptadas a Next.js

La dirección será `shared → features → app`:

```text
src/app/          composición, rutas, layouts, providers y route handlers
src/features/     módulos de dominio autocontenidos
src/components/   UI compartida sin conocimiento del dominio
src/config/       entorno y constantes globales
src/lib/          clientes y adaptadores compartidos
src/hooks/        hooks realmente compartidos, cuando existan
src/types/        tipos globales, cuando existan
src/testing/      setup, render con providers y fixtures compartidos
```

No se crearán directorios vacíos. Los archivos específicos de un feature permanecen dentro de ese feature. Se evitarán barrel files generales; los consumidores importarán módulos concretos para conservar dependencias explícitas.

Alternativa considerada: reproducir exactamente `app/routes` del ejemplo Vite. Se descarta porque duplicaría el router de archivos de Next.js y haría la estructura menos idiomática.

### 2. Límites automatizados con ESLint

Se incorporará `eslint-plugin-import` y su resolver de TypeScript para configurar `import/no-restricted-paths`. Las zonas impedirán:

- que `features` o módulos compartidos importen desde `app`;
- que `components`, `config`, `hooks`, `lib`, `testing`, `types` o `utils` importen desde `features` o `app`;
- imports cruzados entre features conocidos.

Las rutas y providers en `app` podrán importar desde cualquier capa inferior. Al crear un feature nuevo se añadirá su zona de aislamiento a ESLint hasta que una regla dinámica fiable reemplace esa lista.

Alternativa considerada: documentar los límites sin lint. Se descarta porque no satisface la detección automática y tiende a degradarse con el tiempo.

### 3. Vitest y Testing Library como base de testing

Se añadirán como dependencias de desarrollo `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` y `@testing-library/user-event`. La configuración reutilizará el alias `@/`, cargará un setup global y usará `jsdom`.

`src/testing/test-utils.tsx` expondrá un render que envuelva componentes con los providers globales. Las primeras pruebas cubrirán una unidad pura representativa y al menos un flujo de formulario de autenticación, priorizando conducta observable sobre detalles internos.

Los scripts serán:

```text
pnpm test          modo interactivo de Vitest
pnpm test:run      una ejecución determinista
```

Alternativa considerada: Jest, por estar presente en el backend. Se elige Vitest porque el frontend es ESM moderno, ofrece una configuración más ligera y es la recomendación del proyecto de referencia.

### 4. Husky en un monorepo sin paquete raíz

Husky será una dependencia de desarrollo de `frontend`. El script `prepare` cambiará temporalmente a la raíz Git para instalar el directorio de hooks del monorepo. El hook raíz `.husky/pre-commit` ejecutará:

```bash
pnpm --dir frontend test:run
```

Así el hook funciona independientemente del directorio desde el que se invoque `git commit`. No se usará `lint-staged`: el usuario pidió tests y la suite inicial será suficientemente pequeña para ejecutarse completa.

Alternativa considerada: crear un `package.json` raíz solo para Husky. Se descarta para no introducir un workspace parcial ni una tercera fuente de scripts y lockfile.

### 5. Migración incremental sin cambios funcionales

Primero se instalará tooling y se capturará comportamiento con tests. Después se ajustarán ubicaciones e imports en pequeñas etapas, ejecutando lint, tipos y tests tras cada una. Finalmente se actualizará `frontend/AGENTS.md` con una guía concisa centrada en librerías y límites.

## Risks / Trade-offs

- [La suite completa hace más lentos los commits al crecer] → Mantener tests rápidos; evaluar ejecución por archivos afectados solo cuando exista una medición que lo justifique.
- [Las reglas por feature requieren mantenimiento] → Documentar que cada feature nuevo debe añadir su zona ESLint y cubrir la configuración con una validación negativa.
- [El script `prepare` se ejecuta en CI sin necesidad de hooks] → Usar la inicialización estándar de Husky, que no afecta el build, y verificar el flujo de instalación congelada usado por GitHub Actions.
- [Tests de componentes Next.js necesitan mocks de router] → Centralizar adaptadores mínimos en `src/testing` y no dispersar mocks por pruebas.
- [Una reorganización grande genera conflictos] → Mover solo módulos que incumplan la dirección acordada y preservar exports y contratos durante cada paso.

## Migration Plan

1. Añadir configuración de tests y tests de caracterización sobre el código actual.
2. Añadir reglas de límites arquitectónicos y resolver infracciones existentes.
3. Reubicar únicamente módulos que no correspondan a su capa y actualizar imports.
4. Instalar Husky y comprobar manualmente el éxito y fallo del pre-commit.
5. Actualizar `frontend/AGENTS.md` y ejecutar lint, tipos, tests y build.

Rollback: revertir el cambio como una unidad restaura scripts, dependencias, configuración e imports anteriores. La migración no altera datos ni contratos externos.
