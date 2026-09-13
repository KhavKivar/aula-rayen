## Why

Hoy Dokploy construye la imagen de la API en el propio VPS a partir del repo y usa
`:latest`, así que cada despliegue compite por CPU/RAM con los servicios en
producción, no hay CI que bloquee código roto y no existe una forma fiable de
volver a una versión anterior. El cambio busca separar "construir" de "desplegar":
GitHub Actions construye y publica una imagen inmutable y Dokploy solo la ejecuta.

## What Changes

- Añadir `ci.yml` en GitHub Actions que valide `packages/contracts` y `apps/api`
  (lint, typecheck, test, build) en cada PR y en cada push a `main`, con cache de pnpm.
- Añadir `deploy-api.yml` que, tras el gate de tests, construya la imagen Docker de
  la API y la publique en GitHub Container Registry (GHCR) con tags inmutables:
  `sha-<short-sha>` más un tag móvil (`main`). No se publica `latest`.
- Cambiar el Compose de la API para consumir la imagen ya publicada
  (`image: ghcr.io/...:${IMAGE_TAG}`) y eliminar el `build:` del contexto del repo,
  de modo que Dokploy nunca recompile en el VPS.
- Disparar el redeploy de Dokploy al terminar el push de la imagen, enviando el
  `IMAGE_TAG` inmutable; el servicio `migrate` y `api` arrancan desde esa misma imagen.
- Mantener los secretos de la aplicación en Dokploy y añadir solo las credenciales
  de despliegue mínimas (API key de Dokploy y permiso de lectura de GHCR).
- Alinear la documentación (`apps/api/README.md`, `AGENTS.md`, ADR de infraestructura)
  con el nuevo mecanismo.

## Capabilities

### New Capabilities

- `deployment/api-continuous-delivery`: construcción, publicación y despliegue de la
  API como imagen inmutable en Dokploy, con gate de validación previo y rollback por tag.

### Modified Capabilities

- Ninguna: el comportamiento de la API no cambia; solo cambia cómo se construye y despliega.

## Impact

- CI/CD: nuevos `.github/workflows/ci.yml` y `deploy-api.yml`; secretos nuevos
  `DOKPLOY_API_KEY`/webhook y credenciales GHCR.
- Infra: `apps/api/docker-compose.yml` pasa de `build:` a `image:`; Dokploy almacena
  el `IMAGE_TAG` por despliegue.
- Documentación: `apps/api/README.md`, `AGENTS.md`, `decisions/0003` y nuevo ADR.
- Sin cambios de código de la API ni de contratos; no hay migraciones nuevas.
- Riesgo principal: dependencia de GHCR y del endpoint de despliegue de Dokploy;
  requiere un despliegue de prueba y verificación de rollback antes de confiar en él.
