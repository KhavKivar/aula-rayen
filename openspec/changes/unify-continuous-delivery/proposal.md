## Why

Hoy la web tiene un CD propio que valida y publica en cada push, mientras la API
compila en el VPS con `:latest` y sin CI. Como `packages/contracts/**` dispara a
ambas aplicaciones de forma independiente y sin orden, un contrato nuevo puede
convivir durante minutos con una web vieja (o al revés). Este change unifica la
entrega continua de API y web: un gate de validación en PR, artefactos inmutables
para ambos, y un despliegue coordinado que **verifica que la API quedó arriba antes
de publicar la web**.

## What Changes

- Añadir `ci.yml` que valide `packages/contracts`, `apps/api` y `apps/web` (lint,
  typecheck, tests, build y `check:landing`) en cada PR, con cache de pnpm. El gate
  deja de correr solo post-merge.
- API: publicar una imagen inmutable en GHCR (`sha-<commit>`, más tag móvil `main`,
  nunca `latest`) y hacer que Dokploy la ejecute sin `docker build` en el VPS.
- API: `GET /health` expone la versión desplegada para que el pipeline pueda
  verificar el despliegue en lugar de asumirlo.
- Web: etiquetar cada Worker Version con el commit (`wrangler deploy --tag/--message`),
  eliminar tests/build duplicados y añadir un smoke test contra producción después del deploy.
- Coordinación: un workflow `deploy.yml` en push a `main` detecta qué áreas cambiaron
  y ordena los jobs; cuando cambian contratos o archivos compartidos, la API se
  despliega y se verifica por `/health` **antes** de desplegar la web.
- Concurrency único de producción para que no existan dos despliegues simultáneos.
- Política explícita de contratos retrocompatibles (expand/contract) para que el
  orden API→web sea seguro.
- Documentar rollback de ambas aplicaciones por commit y actualizar ADRs/docs.

## Capabilities

### New Capabilities

- `deployment/api-continuous-delivery`: la API como imagen inmutable publicada por
  CI y ejecutada por Dokploy, con migraciones, gate previo, versión en `/health` y
  rollback por tag.
- `deployment/web-continuous-delivery`: validación y publicación del Worker con
  versiones etiquetadas por commit, smoke post-deploy y rollback nativo.
- `deployment/release-coordination`: detección de áreas, orden API→web, verificación
  de salud, carril único de despliegue y trazabilidad de ambos artefactos al mismo commit.

### Modified Capabilities

- Ninguna: no cambian requisitos funcionales de autenticación, cursos o pagos; el
  pipeline es infraestructura y el único cambio observable es la versión en `/health`.

## Impact

- CI/CD: se reemplazan `deploy-web.yml` y el propuesto `deploy-api.yml` por un
  orquestador `deploy.yml` con jobs ordenados; nuevo `ci.yml` para PRs.
- API: `apps/api/src/app.controller.ts` (versión en `/health`), `env.schema.ts`,
  `docker-compose.yml` (imagen publicada en lugar de `build:`), `README`, `.env.example`.
- Web: `.github` deploy con tag/smoke; sin cambios de código salvo lo necesario para
  el smoke (si se decide exponer la versión del Worker).
- Secretos: `DOKPLOY_API_KEY`/webhook y credenciales GHCR en GitHub; los secretos de
  ejecución de la API siguen solo en Dokploy.
- Este change **absorbe y reemplaza** el alcance de `rework-api-continuous-delivery`
  (ya commiteado); sus artefactos viven ahora en este directorio.
- Riesgo principal: el pipeline depende de GHCR, del endpoint de Dokploy y de que
  `/health` reporte la versión; requiere un despliegue de prueba de extremo a extremo
  y verificación de rollback antes de confiar en él.
