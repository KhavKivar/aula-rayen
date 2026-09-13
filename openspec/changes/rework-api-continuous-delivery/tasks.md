## 1. CI de validación

- [ ] 1.1 Crear `.github/workflows/ci.yml` para `pull_request` y push que valide `packages/contracts` y `apps/api` (lint, typecheck, test, build) con cache de pnpm.
- [ ] 1.2 Verificar que `pnpm exec eslint src test`, `pnpm test`, `pnpm typecheck` y `pnpm build` corren en CI sin depender de secretos de producción.
- [ ] 1.3 Activar branch protection en `main` exigiendo el workflow `ci.yml` una vez comprobado en un PR real.

## 2. Publicación de la imagen

- [ ] 2.1 Crear `.github/workflows/deploy-api.yml` con `on.push` a `main` filtrado por `apps/api/**`, `packages/contracts/**`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` y el propio workflow, más `workflow_dispatch`.
- [ ] 2.2 Añadir el job `test` (contratos + API) como gate previo al job `deploy`, reutilizando el patrón de `deploy-web.yml`.
- [ ] 2.3 Construir y publicar la imagen con `docker/build-push-action` en GHCR usando `GITHUB_TOKEN`, tags `sha-<short>` y `main`, sin publicar `latest`; registrar el digest en el resumen del job.
- [ ] 2.4 Confirmar la arquitectura del VPS y fijar `platforms` (o multi-arch) en consecuencia.

## 3. Compose con imagen inmutable

- [ ] 3.1 Cambiar `apps/api/docker-compose.yml` para que `api` y `migrate` usen `image:` con el tag del commit (`IMAGE_TAG`) y eliminar el bloque `build:` de ambos.
- [ ] 3.2 Mantener el servicio `migrate` one-shot y la dependencia `service_completed_successfully` de `api`.
- [ ] 3.3 Actualizar `apps/api/.env.example` y la documentación del Compose con `IMAGE_TAG`/`API_IMAGE` y quitar las variables de build que ya no aplican.
- [ ] 3.4 Probar el Compose localmente con una imagen publicada (sin `docker build` en el host) y confirmar que `migrate`, `/health` y el arranque funcionan.

## 4. Disparo de despliegue y secretos

- [ ] 4.1 Configurar en Dokploy la aplicación de la API como imagen externa de GHCR con credenciales de solo lectura.
- [ ] 4.2 Guardar en GitHub la credencial de despliegue (`DOKPLOY_API_KEY` o URL de webhook) y validar su presencia al inicio del job `deploy`.
- [ ] 4.3 Implementar el paso que dispara el redeploy en Dokploy con el `IMAGE_TAG` del commit, solo después de publicar la imagen.
- [ ] 4.4 Documentar que los secretos de ejecución (Transbank, Resend, Better Auth, `DATABASE_URL`) permanecen solo en Dokploy.

## 5. Verificación y rollback

- [ ] 5.1 Desplegar manualmente con `workflow_dispatch` a un tag fijo y verificar migración, `/health`, login y un flujo de pago en integración.
- [ ] 5.2 Verificar el rollback fijando `IMAGE_TAG` al commit anterior y comprobando que la API vuelve a esa versión.
- [ ] 5.3 Revisar el orden respecto a `deploy-web.yml` ante cambios de contrato y fijar un `concurrency.group` que evite carreras.

## 6. Documentación

- [ ] 6.1 Actualizar `apps/api/README.md` describiendo la imagen inmutable en GHCR, el disparo de Dokploy y el procedimiento de rollback.
- [ ] 6.2 Corregir `AGENTS.md` (retirar la afirmación de que no existe `deploy-api.yml`) y documentar los secretos nuevos.
- [ ] 6.3 Crear un ADR en `decisions/` que reemplace la parte de build del ADR 0003 y registre la alternativa de registry elegida.
