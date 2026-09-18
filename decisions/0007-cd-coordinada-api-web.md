# 0007 - Entrega continua coordinada de API y web

- Fecha: 2026-09-13
- Estado: aceptada
- Ámbito: infra

## Contexto

La web tenía un CD propio que validaba y publicaba en cada push, mientras la API
compilaba en el VPS con `:latest` y sin CI. Los cambios en `packages/contracts/**`
disparaban el deploy web y afectaban a la API, pero no existía orden ni verificación
entre ambos: un contrato nuevo podía convivir con una web vieja (o al revés) durante
minutos. Tampoco había rollback fiable de la API ni trazabilidad commit↔versión en
ninguno de los dos planos.

## Decisión

- `ci.yml` valida contratos, API y web en cada PR (lint, typecheck, tests, build y
  `check:landing`); el deploy tiene su propio gate por área.
- `deploy.yml` es el único orquestador en push a `main`: detecta áreas cambiadas con
  `git diff` y despliega solo lo afectado, en un carril único de producción.
- La API se construye en GitHub Actions y se publica en GHCR con tags `sha-<commit>`
  y `main`; Dokploy ejecuta la imagen sin `docker build` en el VPS.
- El pipeline re-apunta `main` de forma atómica en cada release. La versión se hornea
  en la imagen (`APP_VERSION` como build-arg) y `GET /health` la reporta.
- Cuando cambian contratos o archivos compartidos, la API se despliega y el pipeline
  espera a que `/health` reporte el commit **antes** de publicar la web. Si la API
  falla o no responde a tiempo, la web no se publica.
- La web se publica con `wrangler deploy --tag sha-<commit>`, se etiqueta en el
  historial de Cloudflare y se verifica con un smoke test contra producción.
- Rollback: API con `workflow_dispatch` e `image_tag=sha-<anterior>` (re-apunta
  `main`, redeploy y verificación); web con `wrangler rollback <version-id>`.
- Los contratos deben ser retrocompatibles entre releases consecutivos
  (ampliar antes de eliminar); los cambios incompatibles se planifican en dos releases.

## Alternativas consideradas

- Mantener el build en Dokploy: descartado; consume CPU/RAM del VPS y no permite gate
  ni artefacto inmutable.
- Actualizar `IMAGE_TAG` en el entorno de Dokploy vía API en cada deploy: descartado;
  la API solo permite reemplazar el env completo, lo que obligaría a que la credencial
  de CI leyera y reescribiera los secretos de ejecución.
- Workflows separados con `workflow_run` encadenado o `concurrency` compartida:
  descartado; más difícil de razonar y la concurrencia serializa pero no garantiza
  el orden API→web.
- Tests E2E de Playwright en el pipeline: diferidos por su dificultad de ejecución;
  la cobertura web queda en unitarias, build y `check:landing`.
- Preview deploys por PR: fuera de alcance; se evalúa como mejora posterior.

## Consecuencias

- `deploy-web.yml` se retira; el despliegue web pasa a `deploy.yml`.
- GitHub necesita `DOKPLOY_URL` y `DOKPLOY_COMPOSE_ID` (variables) y
  `DOKPLOY_API_KEY` (secreto); Dokploy necesita credenciales de solo lectura de GHCR.
- Producción consume `main`, que solo el pipeline mueve; la identificación exacta del
  commit está en el digest publicado, el tag `sha-*` y `/health`.
- La ventana de inconsistencia entre web y API se reduce a un release compatible; no
  existe atomicidad entre dos plataformas.
- Las migraciones no se revierten: el rollback de la API depende de que la versión
  anterior siga siendo compatible con el esquema.
