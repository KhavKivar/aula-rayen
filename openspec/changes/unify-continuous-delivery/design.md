## Context

Ver `proposal.md` (Why). Estado relevante:

- La API se despliega con `apps/api/docker-compose.yml`, que incluye `build:` con
  contexto `../..`: Dokploy instala dependencias y compila TypeScript en el VPS, y la
  imagen se referencia como `aula-rayen-api:latest`.
- `deploy-web.yml` ya valida (test, lint, typecheck, tests, build, `check:landing`) y
  publica con `wrangler deploy`, con `environment: production` y `concurrency`, pero
  solo corre post-merge y no etiqueta la versión con el commit.
- `packages/contracts/**` dispara el deploy web; cualquier workflow de API que se
  agregue dispararía también, sin orden entre ambos.
- Cloudflare ya ofrece versiones inmutables y rollback nativo (`wrangler rollback`,
  `wrangler versions deploy`); el diseño aprovecha eso en lugar de construirlo.
- La API expone `GET /health` con `{ status: 'ok' }` (`app.controller.ts:17-19`).

## Goals / Non-Goals

**Goals:**
- Un gate de validación en PR para contratos, API y web.
- Artefactos inmutables para ambas aplicaciones, ambos atados al commit.
- Orden API→web verificado por salud, no asumido.
- Un solo carril de despliegue y rollback documentado por commit.

**Non-Goals:**
- Blue-green, canary o despliegue multi-nodo para la API.
- Deploy atómico imposible de lograr con dos plataformas (Dokploy y Cloudflare).
- Migrar PostgreSQL local ni sustituir `pnpm deploy --legacy` o el Dockerfile.
- Preview deploys por PR (se evalúa como mejora posterior, fuera de este change).
- E2E de Playwright en el pipeline: se difieren porque son difíciles de correr de
  forma estable; por ahora la cobertura web queda en unitarias, build y `check:landing`.

## Decisions

### 1. Un workflow orquestador `deploy.yml` con jobs ordenados, en lugar de workflows independientes
En push a `main`, un job `changes` detecta áreas con `git diff --name-only` entre
`github.event.before` y `github.sha` (sin acciones de terceros). Luego corren
`deploy-api` y `deploy-web`; este último declara `needs: deploy-api`.
Como GitHub salta jobs cuyos `needs` se omitieron, `deploy-api` siempre corre y
decide internamente si es no-op cuando la API no cambió. Alternativas:
`workflow_run` encadenado (más complejo, difícil de razonar), workflows separados con
`concurrency` compartida (serializa pero no garantiza orden), y `dorny/paths-filter`
(añade una dependencia de terceros que el repo evita). Se elige el orquestador único.

### 2. Orden API→web con verificación por `/health`
Tras disparar el redeploy de Dokploy, el pipeline hace polling a
`https://api.psicologarayen.cl/health` hasta que reporte la versión del commit
(timeout y reintentos acotados). Solo entonces despliega la web. Esto convierte
"API primero" en una garantía verificable. Requiere que la API incluya la versión en
la respuesta de salud; se hornea en la imagen como build-arg `APP_VERSION`, en lugar
de mutar el entorno de Dokploy en cada deploy: su API solo permite reemplazar el env
completo de la compose, así que actualizar `IMAGE_TAG` desde CI obligaría a que la
credencial del pipeline leyera y reescribiera los secretos de ejecución. Alternativa
descartada: confiar en que Dokploy termine antes (su endpoint puede ser asíncrono y
las migraciones pueden tardar).

### 3. Detección de cambios con `git` nativo
El job `changes` usa `fetch-depth: 0` y `git diff --name-only`, con reglas por prefijo:
`packages/contracts/`, `apps/api/`, `apps/web/`, y archivos compartidos de la raíz
(`pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package.json`) que afectan a ambas. Evita
una acción de terceros y mantiene el pipeline auditable.

### 4. Tags en ambos planos
API: GHCR con `sha-<short>` (identidad del release) y `main`, que el pipeline re-apunta
de forma atómica al digest del commit; nunca `latest`. Producción consume `main`
porque Dokploy mantiene la referencia de imagen en el Compose y no admite override por
deploy sin tocar el entorno; el digest registrado y `APP_VERSION` horneada mantienen
la trazabilidad. Web: `wrangler deploy --tag "sha-<short>" --message "deploy <commit>"`,
que persiste en el historial de versiones de Cloudflare. El resumen del job registra
digest de la imagen y version ID del Worker.

### 5. Contratos retrocompatibles como política, no como automatización
El pipeline no puede demostrar compatibilidad semántica, así que se documenta la regla
expand/contract: agregar primero, eliminar en un release posterior. El orden API→web
hace seguros los cambios aditivos; los incompatibles requieren dos releases.
Automatizar tests de compatibilidad de esquemas queda como mejora futura.

### 6. Rollback por commit en cada plataforma
API: `workflow_dispatch` con `image_tag=sha-<anterior>`; el workflow re-apunta `main`
a esa imagen, redespliega y verifica `/health`. Web: `wrangler rollback <version-id>` o
`wrangler versions deploy`. Un release se revierte volviendo ambos al commit anterior.
Las migraciones no se revierten; la política existente (migraciones aditivas y
compatibles) es la que hace viable el rollback de la API.

## Risks / Trade-offs

- **Dependencia de GHCR y del endpoint de Dokploy** → el deploy no ocurre si fallan,
  pero producción sigue corriendo lo desplegado; reintentar el workflow es seguro.
- **Polling de `/health` con timeout** → umbral generoso (minutos) y fallo visible;
  no reintenta solo, se relanza el workflow.
- **`git diff` con force-push o primer push de rama** → usar `github.event.before`
  inválido obliga a desplegar todo; se maneja como caso conservador (desplegar ambos).
- **Rollback con esquema migrado** → la API anterior debe soportar el esquema nuevo;
  si no, el procedimiento documenta el paso manual requerido.
- **Dos plataformas, sin atomicidad** → se mitiga con el orden y con contratos
  compatibles; una reversión puede dejar una ventana breve, documentada.

## Migration Plan

1. Añadir la versión a `/health` y `APP_VERSION` al esquema de entorno, horneada en
   la imagen como build-arg.
2. Publicar la imagen de prueba con `workflow_dispatch` y verificar tags/digest en GHCR.
3. Configurar Dokploy como imagen externa de GHCR, desplegar un tag fijo y comprobar
   migración, `/health` con versión, login y un pago en integración.
4. Verificar el rollback de la API con un tag anterior.
5. Incorporar `ci.yml` en PRs y el orquestador `deploy.yml`; probar con un cambio
   solo-web, uno solo-API y uno de contratos.
6. Activar el smoke post-deploy contra producción.
7. Actualizar `apps/api/README.md`, `apps/web/README.md`, `AGENTS.md` y el ADR de
   infraestructura; documentar el runbook de rollback.

## Open Questions

- ¿El VPS es `amd64` o `arm64`? Define `platforms` del build.
- ¿La API key de Dokploy usa el endpoint de deploy o un webhook por aplicación?
