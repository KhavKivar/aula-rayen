## 1. CI de validación (PR y push)

- [x] 1.1 Crear `.github/workflows/ci.yml` para `pull_request` y push que valide `packages/contracts`, `apps/api` y `apps/web` (lint, typecheck, tests y build) con cache de pnpm.
- [x] 1.2 Incluir `pnpm --filter @aula-rayen/web check:landing` en la validación web de CI.
- [ ] 1.3 Activar branch protection en `main` exigiendo `ci.yml` una vez comprobado en un PR real.

## 2. Versión de la API en `/health`

- [x] 2.1 Añadir `APP_VERSION` (opcional, con default no vacío) al esquema de entorno de `apps/api`.
- [x] 2.2 Exponer la versión en `GET /health` manteniendo `{ status: 'ok' }`.
- [x] 2.3 Añadir/actualizar tests de `AppController`/`AppService` para la respuesta de salud con y sin versión.
- [x] 2.4 Documentar `APP_VERSION` en `apps/api/.env.example` y hornearla en la imagen como build-arg.

## 3. API como imagen inmutable

- [x] 3.1 Construir y publicar la imagen en GHCR con tags `sha-<short>` y `main` (sin `latest`), registrando el digest en el resumen del job.
- [x] 3.2 Cambiar `apps/api/docker-compose.yml` para que `api` y `migrate` usen `image:` publicado en GHCR con `IMAGE_TAG` y eliminar el bloque `build:`.
- [x] 3.3 Mantener `migrate` one-shot y la dependencia `service_completed_successfully`.
- [ ] 3.4 Configurar Dokploy como imagen externa de GHCR con credenciales de solo lectura y desplegar un tag fijo de prueba.
- [x] 3.5 Confirmar la arquitectura del VPS y fijar `platforms` del build (`linux/arm64`).
- [x] 3.6 Implementar el disparo del redeploy de Dokploy con `compose.deploy`, solo después de publicar la imagen.

## 4. Web trazable y verificada

- [x] 4.1 Etiquetar el deploy con `wrangler deploy --tag "sha-<short>" --message` y registrar el version ID en el resumen del job.
- [x] 4.2 Eliminar la duplicación de `test:run` y verificar si `pnpm build` + `wrangler deploy` compila dos veces; dejar un solo build.
- [x] 4.3 Añadir smoke test post-deploy contra `https://psicologarayen.cl` (respuesta y contenido clave de la landing).
- [x] 4.4 Validar temprano las variables `VITE_PUBLIC_*` y comprobar que los destinos corresponden al entorno antes de construir.

## 5. Orquestación del release

- [x] 5.1 Crear `.github/workflows/deploy.yml` en push a `main` con un job `changes` que use `git diff --name-only` (fetch-depth 0) y reglas por prefijo para `packages/contracts/`, `apps/api/`, `apps/web/` y archivos compartidos de la raíz.
- [x] 5.2 Hacer que `deploy-api` siempre corra y sea no-op cuando la API no cambió, para no saltar `deploy-web` por dependencias omitidas.
- [x] 5.3 Declarar `deploy-web` con `needs: deploy-api` y verificar que la web solo se publica tras la API cuando ambas cambian.
- [x] 5.4 Implementar el polling de `/health` hasta que reporte la versión del commit, con timeout y fallo visible sin desplegar la web.
- [x] 5.5 Fijar un único `concurrency.group` de producción con `cancel-in-progress: false`.
- [x] 5.6 Migrar la lógica de `deploy-web.yml` al orquestador (o a un workflow reutilizable) y retirar el workflow anterior.
- [ ] 5.7 Probar los tres casos: cambio solo-web, solo-API y de contratos.

## 6. Verificación y rollback

- [ ] 6.1 Desplegar un release completo de prueba y confirmar que el resumen registra commit, tag de imagen y version ID del Worker.
- [ ] 6.2 Verificar el rollback de la API con `IMAGE_TAG` anterior y el de la web con `wrangler rollback`, documentando el orden.
- [ ] 6.3 Comprobar que un fallo de la API impide el despliegue de la web.
- [ ] 6.4 Documentar la política de contratos retrocompatibles (expand/contract) y el procedimiento de dos releases.

## 7. Documentación y decisión

- [x] 7.1 Actualizar `apps/api/README.md` y `apps/web/README.md` con el pipeline, la trazabilidad y el runbook de rollback.
- [x] 7.2 Corregir `AGENTS.md` (retirar la referencia a `deploy-api.yml` inexistente) y documentar los secretos nuevos.
- [x] 7.3 Crear un ADR en `decisions/` que reemplace la parte de build del ADR 0003 y registre la coordinación API→web.
- [x] 7.4 Corregir el drift de dominios detectado en `apps/web/README.md` y en el CSP de `apps/web/public/_headers`.
