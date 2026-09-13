# 0005 - Contratos compartidos con build dual ESM/CJS

- Fecha: 2026-09-13
- Estado: aceptada
- Ámbito: contracts

## Contexto

API NestJS (CommonJS) y web Vite (ESM) deben validar los mismos payloads HTTP. Sin un
paquete compartido, los tipos y esquemas se duplican y se desincronizan.

## Decisión

- `packages/contracts` (`@aula-rayen/contracts`, privado) es la fuente de verdad con
  esquemas Zod y tipos inferidos.
- Build dual: ESM en `dist/` (`tsconfig.json`) y CJS en `dist-cjs/`
  (`tsconfig.cjs.json` + `package.cjs.json`).
- `exports` mapea `types`/`import`/`require` para cada subpath; los consumidores usan
  `workspace:*`.
- La sincronización es obligatoria vía `prebuild`/`pretest`/`typecheck` en ambos
  consumidores, que recompilan contracts antes de usarlos.
- `dist/` y `dist-cjs/` están ignorados en git y nunca se versionan.

## Alternativas consideradas

- Publicar el paquete en un registry con versionado semántico: descartado; el
  monorepo ya garantiza la consistencia y no se consume fuera.
- Solo ESM: descartado; rompe la resolución CommonJS de NestJS.
- Duplicar esquemas por aplicación: descartado; la deriva ya había causado bugs.

## Consecuencias

- El build CJS no emite declaraciones propias (`declaration: false`); los tipos salen
  del build ESM. Es deuda menor si algún consumidor CJS estricto lo requiere.
- Todo cambio de contrato activa el despliegue web y afecta a la API: hay que
  verificar ambos consumidores antes del push.
- No hay tests de contracts ejecutándose en CI; los corre cada consumidor en su
  `pretest`.
