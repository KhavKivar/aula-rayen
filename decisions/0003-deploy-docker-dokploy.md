# 0003 - Despliegue de la API con Docker Compose y Dokploy

- Fecha: 2026-09-13
- Estado: reemplazada parcialmente por 0007 (build y disparo del despliegue)
- Ámbito: infra

## Contexto

La API NestJS necesita PostgreSQL, migraciones versionadas y secretos de producción
en un VPS pequeño (4 GB RAM o más). El frontend se despliega aparte en Cloudflare
Workers con `deploy-web.yml`.

## Decisión

- La API se despliega con Docker Compose desde `apps/api/docker-compose.yml` usando
  la imagen multi-stage de `apps/api/Dockerfile` (`pnpm deploy --legacy --prod`).
- Un servicio `migrate` one-shot aplica las migraciones de Drizzle y la API espera
  `service_completed_successfully` antes de arrancar.
- PostgreSQL corre en la red interna sin publicar puertos; los límites de memoria/CPU,
  `read_only`, `tmpfs` y `no-new-privileges` se declaran en el compose.
- Los secretos viven en el entorno de despliegue de Dokploy, nunca en el repo.
- GitHub Actions solo despliega web (`deploy-web.yml`); no existe `deploy-api.yml`.

## Alternativas consideradas

- Workflow `deploy-api.yml` con registry: descartado para no duplicar el mecanismo de
  despliegue de Dokploy ni almacenar credenciales adicionales.
- PM2 con `ecosystem.config.cjs`: descartado; queda como residuo histórico junto al
  nginx de ejemplo.
- PostgreSQL gestionado externo (Neon): descartado; el compose mantiene los datos en
  el VPS y evita latencia/costo adicional.

## Consecuencias

- Las migraciones son explícitas y bloquean el arranque de la API si fallan.
- El rollback se hace redeplegando una imagen anterior; no hay rollback automático de
  migraciones.
- La validación de la API (`eslint`, `test`, `build`) depende de correrla localmente;
  no hay CI que la bloquee antes del merge.
