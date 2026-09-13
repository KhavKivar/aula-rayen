## Context

Ver `proposal.md` (Why). Hoy Dokploy ejecuta un Compose que incluye `build:` con
contexto `../..`, por lo que el VPS instala dependencias y compila TypeScript en cada
despliegue, y la imagen resultante se referencia como `aula-rayen-api:latest`. El
repositorio ya tiene un Dockerfile multi-stage que produce un runtime `node:24-alpine`
con `pnpm deploy --legacy --prod`, y un servicio `migrate` que corre
`dist/db/migrate.js` desde esa misma imagen. `deploy-web.yml` ya define el patrón de
CI en GitHub Actions con `environment: production`, secretos validados temprano y
`concurrency`. Este diseño reutiliza ese patrón para la API.

## Goals / Non-Goals

**Goals:**
- Construir la imagen fuera del VPS y desplegarla sin `docker build` en producción.
- Que cada despliegue sea trazable a un commit y reversibles por tag.
- Bloquear el despliegue cuando falla la validación de contratos o API.
- Que el `pnpm-lock.yaml` del monorepo siga siendo la única fuente de versiones.

**Non-Goals:**
- Cambiar el código de la API, los contratos o el esquema de base de datos.
- Introducir blue-green, canary o despliegue multi-nodo; Dokploy recrea el servicio.
- Migrar de PostgreSQL local a un servicio gestionado.
- Sustituir `pnpm deploy --legacy` o el Dockerfile por otro sistema de empaquetado.

## Decisions

### 1. Publicar en GitHub Container Registry (GHCR) con el `GITHUB_TOKEN`
GHCR se autentica con el `GITHUB_TOKEN` del workflow, no exige un registro externo y
permite visibilidad privada. Alternativas: Docker Hub (requiere cuenta y token con
límites de pull) y un registry propio en el VPS (añade un servicio que mantener y
punto único de fallo). Se descartan.

### 2. Tags inmutables `sha-<short>` más un tag móvil `main`; sin `latest`
Dokploy recibe el tag del commit y ese mismo valor alimenta `IMAGE_TAG` en el Compose
para `api` y `migrate`. El tag móvil `main` sirve solo para inspección; producción usa
el tag del commit. Esto hace el rollback una operación de redeploy con un tag previo.
Alternativa: `latest` (descartado: no distingue versiones ni permite rollback fiable).

### 3. El Compose consume `image:` y elimina `build:`
`apps/api/docker-compose.yml` pasa a `image: ${API_IMAGE:?Set API_IMAGE}` (o
`ghcr.io/<owner>/<repo>-api:${IMAGE_TAG:?}`), sin `build:`. Dokploy queda como runner
de la imagen. Alternativa: dejar que Dokploy compile desde Git (el estado actual, que
es justo lo que se quiere eliminar) o mantener un Compose inline solo en Dokploy
(pierde revisión en el repo). Se mantiene el Compose versionado.

### 4. Disparar Dokploy por API/webhook al finalizar el push de la imagen
El workflow, tras publicar, llama al endpoint de despliegue de Dokploy con el
`IMAGE_TAG` del commit y una `DOKPLOY_API_KEY` guardada como secreto de GitHub. La
alternativa de auto-deploy por Git en Dokploy reconstruiría en el VPS; la de
Watchtower pondría el control de versión fuera del pipeline. Se elige el disparo
explícito porque garantiza que solo se despliega una imagen ya publicada.

### 5. Gate de tests en el mismo workflow de despliegue, más `ci.yml` para PRs
`deploy-api.yml` replica el patrón de `deploy-web.yml`: un job `test` (contratos +
API) que debe pasar antes del job `deploy`. `ci.yml` corre la misma validación en
`pull_request` para dar señal temprana y habilitar branch protection. Se acepta la
duplicación de cómputo entre PR y push porque `deploy-web.yml` ya la tiene y unifica
el criterio de merge.

### 6. Secretos separados por plano
Los secretos de ejecución de la API siguen solo en Dokploy. GitHub guarda únicamente
`DOKPLOY_API_KEY` (o URL de webhook) y usa el `GITHUB_TOKEN` para GHCR. Dokploy
guarda un token de solo lectura de GHCR para el pull. El `IMAGE_TAG` es un dato de
despliegue, no un secreto.

## Risks / Trade-offs

- **Dependencia de GHCR y de la red de GitHub** → mitigar con `docker/build-push-action`
  y cache de build; si GHCR cae, no se despliega, pero producción sigue corriendo la
  imagen ya descargada.
- **La migración no es reversible automáticamente** → mantener la política actual:
  migraciones aditivas y compatibles; el rollback de código no revierte el esquema.
- **Race entre deploy web y API ante cambios de contrato** → unificar un
  `concurrency.group` que considere el commit y documentar el orden (primero API o
  compatible en ambos sentidos); alternativa completa (despliegue atómico) queda fuera.
- **Primer despliegue del nuevo mecanismo** → hacerlo primero en un proyecto Dokploy
  de staging o con el tag fijado a mano, verificar `migrate` y `/health`, y solo luego
  activar el disparo automático.
- **Secretos de GitHub con alcance amplio** → limitar la `DOKPLOY_API_KEY` al proyecto
  de la API y rotarla ante cualquier sospecha.

## Migration Plan

1. Publicar la imagen con `workflow_dispatch` y verificar tags y digest en GHCR.
2. En Dokploy, cambiar la aplicación de "build desde repo" a "imagen externa",
   configurar credenciales de lectura de GHCR y fijar `IMAGE_TAG` a un tag de prueba.
3. Desplegar manualmente, confirmar `migrate`, `/health` y login.
4. Verificar rollback: fijar `IMAGE_TAG` al commit anterior, redesplegar y comprobar.
5. Activar `deploy-api.yml` en push a `main` y luego `ci.yml` + branch protection.
6. Actualizar `apps/api/README.md`, `AGENTS.md` y el ADR de infraestructura.

Rollback: redeploy en Dokploy con el `IMAGE_TAG` del commit anterior; las migraciones
solo se revierten con una migración nueva.

## Open Questions

- ¿El VPS es `amd64` o `arm64`? Si es ARM, el build debe publicar `linux/arm64`
  (o multi-arch), lo que cambia el tiempo de CI pero no el diseño.
- ¿La `DOKPLOY_API_KEY` usa el endpoint de "deploy" o un webhook por aplicación?
  Se resolverá al implementar según la versión de Dokploy instalada.
