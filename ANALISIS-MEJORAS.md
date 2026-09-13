# Análisis de mejoras — Aula Rayen

Fecha: 2026-09-13
Alcance: monorepo completo (`apps/api`, `apps/web`, `packages/contracts`, `workers/`, CI/CD, infra y documentación).
Método: revisión estática del código, verificación directa de hallazgos críticos y cruce con el grafo de código (indexado 2026-09-12).

---

## 1. Críticos (verificados con código)

### 1.1 El panel de pagos muestra datos DEMO si la API falla

- `apps/web/src/features/admin-dashboard/components/payments-panel.tsx:153`
  ```ts
  const payments = paymentsQuery.data ?? demoTransactions; // sin rama isError
  ```
- No existe UI de error para `paymentsQuery` (solo `isPending`, líneas 195-205).
- Si la API cae, la administradora ve compradores, correos y montos ficticios (`demo-transactions.ts:5-69`) como si fueran reales.
- El test **codifica** el comportamiento: `payments-panel.test.tsx:53-61` ("falls back to demo fixtures without demo labeling when the query fails").
- Corrección: eliminar el fallback, mostrar estado de error con reintento y actualizar el test para exigir ese estado.

### 1.2 `GET /webpay` filtra datos de pago a cualquier usuario autenticado

- `apps/api/src/modules/webpay/webpay.controller.ts:36-39`: no tiene `@Roles` ni `@AllowAnonymous`; el guard global solo exige sesión.
- Devuelve filas crudas con `tokenWs`, `cardNumber`, `userId` y montos (`webpay.service.ts:90-92`; contrato en `packages/contracts/src/webpay.ts:53-57`).
- Es un endpoint **muerto**: el frontend solo usa `POST /webpay` y `GET /webpay/payments`.
- Corrección: eliminarlo o restringirlo a `admin` excluyendo `tokenWs`/`cardNumber`.

### 1.3 Claim de Webpay sin recuperación

- `apps/api/src/modules/webpay/webpay.service.ts:183-198`: `takeSession` (UPDATE atómico de `taken_at`) se ejecuta **antes** de `webpayTransaction.commit`.
- Si la red falla, Transbank responde algo que no parsea, o el proceso reinicia, la sesión queda `taken_at != null` y `committed_at = null` para siempre.
- El reintento del navegador recibe `claimed = null` y redirige `timeout` (`webpay.service.ts:184-187`), aunque el pago pudo haber sido autorizado y cobrado.
- No existe job de reconciliación ni reintento. Los `//Todo: Capture as Critical` (`webpay.service.ts:193,222`) confirman que se conoce el problema.
- Corrección: al encontrarse `taken_at` sin `committed_at`, reintentar el commit si `token_ws` llega de nuevo; devolver `ok` si `committedAt` ya está seteado; job de reconciliación periódica.

### 1.4 No existe CI de API ni validación en PRs

- `.github/workflows/` solo contiene `deploy-web.yml` (push a `main` + `workflow_dispatch`).
- `AGENTS.md:60-63` documenta `deploy-api.yml`, eliminado en `1467538`; el job E2E en `7c7f73d`; CodeQL en `7733a36`.
- `apps/api/test/**` (incluye e2e con Testcontainers), los tests de `packages/contracts` y las E2E Playwright nunca corren en CI.
- Sin `ci.yml` ni `pull_request`: no hay protección real de rama. Ya reconocido en `TODO.md:3-6`.
- Corrección: `ci.yml` para PRs con jobs de contracts, API y web (con cache de pnpm), restaurar `deploy-api.yml` y E2E.

### 1.5 `docker-compose.yml` raíz roto

- `docker-compose.yml:26-28` compila `./apps/web/Dockerfile`, que **no existe** (solo hay `apps/api/Dockerfile`). `apps/web/` tampoco tiene Dockerfile.
- El servicio `api` usa `context: ./apps/api` (líneas 2-5), pero el Dockerfile hace `COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./` (`apps/api/Dockerfile:7-9`); el lockfile/workspace solo existen en la raíz → build falla.
- No incluye PostgreSQL (el README lo exige) y monta el código sobre una imagen de producción con bind mount `./apps/api:/app` (líneas 16-17).
- `README.md:51-55` documenta `docker compose up --build` como flujo local válido.
- El compose correcto y endurecido es `apps/api/docker-compose.yml`.

### 1.6 `workers/` (proxy de producción) no está versionado

- `git check-ignore workers/index.ts` → ignorado; `git ls-files` no lo contiene.
- Aun así `AGENTS.md:53` y `apps/web/README.md:87` lo documentan como infraestructura vigente.
- `workers/index.ts:11` apunta a `app.vasvani.shop` hardcodeado, dominio en desuso.
- Sin `routes` en `workers/wrangler.jsonc` (viven en el dashboard), sin historial, sin revisión ni CI.
- Además: `url.pathname.replace(/^\/api/, "")` reescribe también `/apiary`; `fetch` sin `try/catch` ni timeout → 500 genérico si el origen falla.

---

## 2. Backend (`apps/api`)

### 2.1 Alto

| # | Hallazgo | Ubicación |
|---|---|---|
| A1 | Rate limit global compartido: `ThrottlerGuard` mide `req.ip` y `main.ts` nunca hace `app.set('trust proxy', ...)`; detrás del proxy el límite de 50/min (`app.module.ts:21-28`) es un cupo global (DoS trivial, incluido el callback de pago). El `ADMIN_RATE_LIMIT=1000/min` de Better Auth queda inútil. | `main.ts:18-29`, `app.module.ts:21-28`, `modules/auth/auth.ts:15-18` |
| A2 | Reservas sin control de pertenencia: `findAll`, `findById`, `update` y `remove` operan sobre cualquier ID para cualquier usuario autenticado. Tampoco se valida `slotId` activo ni `expiresAt`. | `modules/booking/booking.controller.ts:27-77`, `booking.service.ts:15-57` |
| A3 | Pago duplicado permitido: `create` no verifica si el usuario ya compró el curso. `onConflictDoNothing` evita duplicar el acceso, pero el usuario puede ser cobrado de nuevo sin recibir nada. | `modules/webpay/webpay.service.ts:127-161`, `webpay.repository.ts:107-113` |
| A4 | `findPayments` filtra solo `tb_status = 'AUTHORIZED'`: la lógica `rejected`/`pending` de `getPayments` es inalcanzable en producción; el test la cubre con mocks irreales. | `webpay.repository.ts:75`, `webpay.service.ts:100-123`, `webpay.service.spec.ts:173-247` |
| A5 | Cookies/Authorization en logs de producción: `LoggerModule.forRoot({ pinoHttp })` sin `redact`; en prod el serializador por defecto incluye `req.headers` (cookie de sesión completa). | `app.module.ts:29-45` |
| A6 | Reservas expiradas bloquean el slot permanentemente: el índice único parcial cubre `pending`/`confirmed`, pero no hay job que pase a `expired`, ni validación de `expiresAt`, ni índice por `expiresAt`. Un INSERT duplicado devuelve 500 (unique violation 23505 sin mapear) en vez de 409. | `db/schema.ts:57-61`, `drizzle/0005_cultured_blade.sql:27` |

### 2.2 Medio

- **Sin filtro global de excepciones**: no hay `@Catch`/`ExceptionFilter`. Violaciones de FK (borrar curso con `webpay_sessions`, borrar slot con reservas) y unique (booking duplicado) terminan en 500 sin `code`. `CourseService.remove` tiene TOCTOU (`course.service.ts:76-94`); el FK `webpay_sessions.course_id` es `ON DELETE restrict` (`db/schema.ts:88-90`).
- **Validación mixta**: solo `CreateWebpayDto` usa class-validator; el resto usa `ZodValidationPipe`. `ValidationPipe` global y `ParseIntPipe` devuelven el formato por defecto de Nest sin `code`, mientras los errores de dominio usan `{statusCode, message, code, error}` (`common/errors/http-error.ts:9-24`). El pipe Zod descarta siempre `issue.message` (`common/pipes/zod-validation.pipe.ts:15-19`).
- **`drizzle-kit push` puede destruir constraints manuales**: el `EXCLUDE USING gist` y `CREATE EXTENSION btree_gist` de la migración 0005 no están declarados en `schema.ts`; `db:push` (`package.json:28`) podría eliminarlos. Los typo/migraciones 0003/0004 (`istaken_at`) confirman fragilidad.
- **Callback de commit requiere sesión**: `GET /webpay/commit` no tiene `@AllowAnonymous`; si la cookie no llega (sesión expirada, restricciones de cookies), Transbank recibe 401. La autorización real ya la da `token_ws` + `buyOrder`.
- **Refresco tras pago exitoso muestra `timeout`**: al repetir el callback con `taken_at` seteado, `checkCommit` devuelve `pending` sin mirar `committedAt` (`webpay.service.ts:174-187`).
- **`cf-connecting-ip` spoofable** si el origen es accesible sin Cloudflare: Better Auth usa ese header como identidad (`modules/auth/auth.ts:55-57`). El README del compose indica exponer el dominio público.
- **Orígenes localhost en producción**: CORS (`main.ts:18-21`) y `trustedOrigins` (`modules/auth/auth.ts:45`) incluyen siempre `http://localhost:3001`.
- **`findAll` sin paginación**; falta índice en `booking_attempts(client_id, expires_at)`.

### 2.3 Bajo / limpieza

- Código muerto: `CourseRepository.findPurchasersByCourseId` sin uso y con bug de destructuring (`course.repository.ts:27-34`); `CourseService.getAll` solo usado por tests; `AppService.getHello`/`GET /` residuales.
- Scripts npm rotos en clon limpio: `loginplataforma`, `bomb`, `login-hermana` apuntan a `scripts/` ignorado (`package.json:30-31`); `scripts/migrate.ts` duplica `src/db/migrate.ts`.
- `requests.http` y `postman-collection.json` documentan un CRUD `/users` inexistente.
- Artefactos locales con sesión real: `apps/api/cookies.txt` (0644) y `.auth/session.json` (0600), gitignoreados pero presentes.
- Comentarios pendientes: `// Todo clean this shit` (`webpay.repository.ts:8`), dos `Capture as Critical` (`webpay.service.ts:193,222`).
- `it.todo` pendiente (`test/course.e2e-spec.ts:162`); sin umbrales de cobertura en Jest.
- `availability.service.ts:115` usa `let` con inferencia evolutiva (any implícito).
- `ecosystem.config.cjs` obsoleto (PM2, `cwd` hardcodeado `/opt/aula-rayen-backend/current`), reemplazado por Docker; nginx de ejemplo solo HTTP plano.
- Sin `AGENTS.md` específico en `apps/api`.

### 2.4 Pruebas

- Unitarias por servicio con repos mockeados (course, availability, booking, webpay), `webpay.controller.spec`, `auth.spec`, `password-reset-mailer.spec`, `env.spec`.
- Integración real: `test/course.e2e-spec.ts` con Testcontainers + migraciones + contratos. `test/app.e2e-spec.ts` es un smoke test unitario disfrazado (mockea Better Auth).
- Faltan: e2e de auth/roles (el mock de `Session` anula el guard real), e2e de webpay (claim concurrente, transacción, doble callback), e2e de booking/availability con DB real, tests de repositorio (SQL de `takeSession`/`findPayments`), cobertura mínima.

---

## 3. Frontend (`apps/web`)

### 3.1 Alto

| # | Hallazgo | Ubicación |
|---|---|---|
| F1 | Query de compradores con `courseId = null` y sin `enabled`: el diálogo se monta siempre y hace 3 reintentos al abrir el admin. Usa `if (parsedId.data)` en vez de `parsedId.success` y lanza `Error` genérico. | `features/admin-dashboard/components/purchasers-dialog.tsx:33-35`, `api/get-course-buyers.ts:14-19`, `routes/.../admin/courses.tsx:30-34` |
| F2 | `requestPasswordReset` ignora `{ error }`: Better Auth devuelve errores como `{ error }` sin lanzar; un 500 se muestra como "Si existe una cuenta..." (éxito). El test solo cubre fallos de red. | `features/auth/api/password-recovery.ts:13-19` |
| F3 | Devtools de TanStack llegan al build: `devtools({ removeDevtoolsOnBuild: false })` + imports estáticos en `__root.tsx`. Emite 155 KB de fuentes huérfanas de `@tanstack/devtools-ui` en `dist/client/assets`. | `vite.config.ts:18-20`, `routes/__root.tsx:12-14` |
| F4 | Retrato remoto de 1280×1280 (~112 KB) usado a 44 px sin `srcSet`/`sizes`. | `config/site-content.json:28`, `features/landing/components/landing-hero.tsx:50-56` |
| F5 | E2E `florecer.spec.ts` roto: espera un `<video>` con `loop`/`poster` y un enlace "Consultar disponibilidad" que ya no existen (hoy es SVG animado y "Consultar por Instagram"). Las 3 pruebas fallan; nunca corre en CI. | `e2e/florecer.spec.ts:5-57`, `components/flower-visual.tsx:20-33`, `landing-cta.tsx:38-40` |
| F6 | 401 no fuerza logout/redirección: `SessionExpiredError` no se intercepta globalmente; el usuario ve el error en la pantalla actual. | `lib/api-client.ts:20-28` |
| F7 | Calendario admin hardcodeado y botones sin handler en el panel de reservas. | `features/admin-reservations/components/reservations-panel.tsx:70-75,224-225` |

### 3.2 Medio

- **PNG de 1.085.869 B** en el layout auth (`/images/florecer.png`, 1000×1100) sin `loading="lazy"` ni formato moderno (`routes/_auth.tsx:18-24`).
- **Tipografías sobredimensionadas**: DM Sans en 4 TTF (~193 KB) en vez de woff2 (`styles/app.css:161-188`); `font-4.ttf`/`font-6.ttf` (Fraunces) muertos; `@fontsource-variable/geist-mono` importado completo pero `--font-mono` sin uso.
- **Peso del entry público**: ~452 KB crudos / ~145 KB gzip en el grafo estático; el landing no necesita Zod/contratos de Webpay ni `authClient` en el arranque.
- **SSR hace fetch de sesión en páginas públicas** sin cookies (`landing-page.tsx:15`, `psicologa-iquique.tsx:127`, `sobre-pamela-rayen.tsx:49`): ida y vuelta al API por render y posibles reintentos si falla.
- **Sin `public/_headers`**: sin caché inmutable para `/assets/*` ni CSP/HSTS/`X-Content-Type-Options`/`Referrer-Policy`.
- **Precio vacío se guarda como 0** (`Number("") === 0`, `course-form-fields.tsx:127-129`): curso gratuito sin advertencia.
- **`mutateAsync` sin `try/catch`** en `onSubmit` (`use-course-form.ts:86,103`, `course-form-dialog.tsx:65-69`) → unhandled rejection.
- **Guard de sesión sin fallback de red**: `_authenticated.tsx:7-17` sin try/catch ni `errorComponent`.
- **A11y**: `FormField` renderiza el error sin `role="alert"`/`aria-live` y los campos de curso no declaran `aria-describedby` (`components/ui/form-field.tsx:40-44`); contraste del acento terracota `#a85e40` sobre `#f7f5ed` = 4.43:1 (< 4.5 AA) afecta `.section-kicker`; `<h2>` del aside antes del `<h1>` en auth (`_auth.tsx:14`).
- **Rutas privadas sin `noindex`** (`/login`, `/register`, `/dashboard*`, `/payment-result`) y sin `notFoundComponent`/`errorComponent` en `__root.tsx`.
- **Param sin validar**: `Number(courseId)` en `courses/$courseId.tsx:12` → `NaN` para "abc".
- **ESLint de fronteras incompleto**: solo restringe feature→feature con lista manual (`eslint.config.mjs:42-147`); shared→feature y feature→route pasan.
- **Lógica de dominio en rutas**: `LocalModality` (`psicologa-iquique.tsx:55-124`) y vista de pago (`payment-result.tsx:20-93`).

### 3.3 Bajo / limpieza

- **Código muerto**: `landing-benefits.tsx`, `landing-method.tsx`, `landing-experience.tsx`, `landing-license.tsx` sin importadores (con `benefits` y `methodSteps` de `static-content.ts:89-129`); `DEMO_TODAY` y `getCoursePurchasers` (solo usado por su test).
- **Assets muertos en `public/`**: `florecer.mp4`, `benign.avif`, `profile-placeholder.svg`, `next.svg`, `vercel.svg`, `window.svg`, `file.svg`, `globe.svg`, `opengraph-image.svg`, `fonts/florecer/font-4.ttf`, `font-6.ttf`.
- **Dependencias sin uso**: `cn`, `install`, `@fontsource-variable/geist`, `@fontsource-variable/plus-jakarta-sans`; `shadcn` como runtime (solo importa CSS, debería ser dev).
- **Artefactos históricos**: `apps/web/.next/` y `.open-next/` en disco; `"use client"` residual de Next en `dialog.tsx`, `dropdown-menu.tsx`, `popover.tsx`, `calendar.tsx`.
- **Componentes enormes**: `reservations-panel.tsx` (400 líneas, JSX de ~700 caracteres), `payments-panel.tsx` (421), `course-management-panel.tsx` (279).
- **Estilos duplicados**: hex `#934d3b`/`#fff8f4`/`#e4c5b9` repetidos en 5+ componentes en vez de tokens.
- **Bugs menores**: comillas literales visibles en UI (`payments-panel.tsx:109,190`), typo `opx` (`payments-panel.tsx:415`), ternario duplicado en navbar (`navbar.tsx:44-49`), error de logout solo `sr-only`.
- **Drift de entorno**: `env.ts:10,15,20` documenta `aula-rayen.vasvani.shop/api`; `.env.production:1-3` usa `api.psicologarayen.cl`; `e2e/fixtures` y `auth-client.test.ts` usan vasvani. `.env.prod` duplicado sin uso; `VITE_PUBLIC_PROD_API_URL` sin referencias en `src`.

### 3.4 Pruebas

- 34 archivos unit/componente (~132 casos) con Testing Library semántica, contratos mockeados a nivel HTTP, tests de guard de rol, invalidación de caché, E2E de cambio de cuenta.
- Faltan: cobertura de landing/Navbar/primitivas UI/`payment-result`/`use-webpay-checkout`/`session-cache`/`env`; sin umbrales de cobertura en `vitest.config.mts`.
- `payments-panel.test.tsx:53-61` fija el comportamiento indeseado del fallback demo.

---

## 4. Contratos, CI/CD e infraestructura

### 4.1 `packages/contracts` — bien, con matices

Bien: build dual real ESM (`dist/`) + CJS (`dist-cjs/`) con `exports` correcto (`package.json:6-42`), `dist*` ignorado y nunca commiteado, Zod 4 alineado en los tres paquetes, schemas `.strict()`, tests de rechazo de campos privados/extras, sincronización forzada por `prebuild`/`pretest` en ambos consumidores.

Riesgos:
- El build CJS no emite declaraciones (`tsconfig.cjs.json:6`) y `types` apunta a `.d.ts` ESM: con consumidores CJS/NodeNext puede derivar en TS1479 o tipos desalineados. Recomendado `.d.cts`.
- Versionado nominal (`0.0.0`, `private`), sin changesets; tests de contratos nunca corren en CI.
- Sin `engines` ni verificación de exports (`publint`/`attw`).

### 4.2 CI/CD

- Único workflow `deploy-web.yml`: `permissions: contents: read`, `environment: production` solo en deploy, secretos validados temprano, `concurrency`, gate de tests, no corre en PRs. Bien en lo que hace.
- Gaps: sin CI de API ni de PRs (crítico 1.4); tests de contratos nunca ejecutan; E2E deshabilitado; `test:run` duplicado (`test` y step "Validate web"); sin cache de pnpm (`package-manager-cache: false`, instalación global por npm) — deliberado en `861bd57` pero costoso; actions sin fijar por SHA; race entre deploy web y API (Dokploy) ante cambios de contrato; pnpm 10.33.0 (CI) vs 10.29.2 (`apps/api/package.json:7`) vs Node 20+ (README) vs Node 24 (CI).
- Husky solo corre tests web; API/contracts no se validan pre-commit.

### 4.3 `apps/api/docker-compose.yml` — bien

- Secretos exigidos con `${VAR:?}`, `read_only`, `tmpfs`, `no-new-privileges`, límites de memoria/CPU.
- `migrate` one-shot y `api` espera `service_completed_successfully`; postgres sin puerto publicado y con `pg_isready`; healthcheck vía `node fetch /health`.
- A mejorar: imagen final corre como **root** (sin `USER`); `pnpm deploy --legacy` deprecado; `ecosystem.config.cjs` y nginx de ejemplo residuos.

### 4.4 Documentación — drift

- **AGENTS.md** describe `deploy-api.yml` inexistente (líneas 60-63); afirma que "no existe workspace de pnpm en la raíz" (19-20), falso (`pnpm-workspace.yaml`, scripts raíz funcionan); menciona `BETTER_AUTH_COOKIE_DOMAIN` (55) cuando el código usa `DOMAIN` (`env.schema.ts:24,54`).
- **README.md** menciona `packages/config/` inexistente (línea 26) y un flujo Docker roto (51-55).
- Tres familias de dominios conviviendo: `vasvani.shop` (docs/AGENTS/openspec), `psicologarayen.cl` (`.env.production`, SEO, sitemap/robots/llms) y `localhost`.
- `apps/api/.env.example` incompleto: faltan `NODE_ENV`, `IMAGE_TAG`, `POSTGRES_VOLUME_NAME`; `DOMAIN` solo como comentario.
- `apps/web/.env.example:2-4` comenta prod como `app.vasvani.shop`.
- `requests.http` y `postman-collection.json` obsoletos.

### 4.5 Openspec y decisiones

- `openspec/` tiene 19 changes "activos" sin `specs/` ni `changes/archive/`; varios ya implementados con tareas sin marcar: `remove-frontend-auth-proxy` (7), `enable-cross-subdomain-cookies` (4), `record-webpay-payments` (2), `remove-backend-api-server-proxy` (2), SEO (2), landing (2), admin (1).
- Deriva: `enable-cross-subdomain-cookies` documenta `BETTER_AUTH_COOKIE_DOMAIN` inexistente; changes describen paths ya eliminados como estado actual; todo el bloque de dominio apunta a vasvani.
- `decisions/` bien formado (2 ADRs coherentes); faltan ADRs de infraestructura (Dokploy/Compose, Worker proxy, build dual de contracts, cookies cross-subdomain).

### 4.6 Archivos en el repo

- Bien fuera de git: `cookies.txt`, `dist/`, `.next/`, `.open-next/`, `tsbuildinfo`, `test-results/`, `node_modules`, `packages/contracts/dist*`, `.env` locales.
- Cuestionables: `apps/web/.env.production` versionado (fija dominio distinto al documentado); ~21 MB en `openspec/changes/explore-psychology-site-designs/mockups/` (destacan `seed-universe.blend` 14 MB y `rayen-design-studies.blend` 4 MB) que quedarán en el historial; `workers/` no versionado (1.6).

---

## 5. Lo que está bien hecho (no tocar sin motivo)

- **API**: default-deny de autenticación, roles consistentes, validación de entorno estricta con reglas de negocio (`env.schema.ts`), contratos Zod con códigos de error estables, Webpay con precio desde DB + claim atómico + verificación de orden/monto + transacción, flujo de reset de contraseña cuidado, tests con buen foco en bordes, compose endurecido.
- **Web**: arquitectura por features con composición desde rutas, transporte de auth coherente (credentials/cookies/CORS), manejo de errores de usuario sin filtrar detalles técnicos, SEO sólido (metadatos probados, JSON-LD, sitemap, robots, llms.txt, `check:landing` en CI), a11y base sólida, code-splitting por ruta, TypeScript estricto sin `any`/`@ts-ignore`/`console.*` en código propio, ~132 tests.
- **Infra**: contratos dual build sin dist en historial, workflow web con permisos mínimos y gate de tests, un solo lockfile/workspace, `.gitignore` correcto en lo esencial.

---

## 6. Plan de mejora propuesto (por fases)

### Fase 0 — Pagos y seguridad (prioridad máxima)
1. Eliminar o restringir `GET /webpay` (admin, sin `tokenWs`/`cardNumber`).
2. Recuperación del claim Webpay: reintento si `taken_at` sin `committed_at`, devolver `ok` si `committedAt` existe, job de reconciliación.
3. Ownership en booking (usuario solo opera sobre sus reservas) y validación de `slotId`/`expiresAt`.
4. Bloquear pago duplicado del mismo curso (409).
5. `redact` de cookies/authorization en pino; `trust proxy` en `main.ts`; quitar localhost de orígenes en producción.
6. Filtro global de excepciones PG (FK/unique → códigos de dominio) y job de expiración de reservas.

### Fase 1 — CI/CD
1. `ci.yml` para PRs con jobs contracts/API/web y cache de pnpm.
2. Restaurar `deploy-api.yml`.
3. Arreglar o eliminar `florecer.spec.ts` y correr Playwright en CI.
4. Branch protection en `main`.
5. Unificar versiones de pnpm/Node y fijar actions por SHA.

### Fase 2 — Bugs de frontend
1. Quitar fallback demo del panel de pagos (y corregir el test).
2. `enabled`/montaje condicional en query de compradores; tipar errores.
3. Propagar `{ error }` en recuperación de contraseña.
4. 401 → logout + redirect global.
5. `removeDevtoolsOnBuild` + imágenes optimizadas (avatar, PNG auth) + `_headers` (cache/seguridad).
6. Precio vacío ≠ 0; try/catch en `onSubmit`.

### Fase 3 — Infra y documentación
1. Versionar `workers/` con `vars` para el upstream, manejo de errores y rewrite estricto.
2. Arreglar o eliminar `docker-compose.yml` raíz y su mención en README.
3. Unificar dominio canónico y actualizar `AGENTS.md`, `README.md`, `.env.example`, `.env.production`.
4. Actualizar/archivar changes de openspec; añadir ADRs de infraestructura.

### Fase 4 — Limpieza y calidad
1. Borrar código/assets/dependencias muertas (web y API).
2. Accesibilidad: `aria-describedby`/`role="alert"` en FormField, contraste `.section-kicker`, orden de encabezados.
3. Extraer lógica de rutas a features; dividir `reservations-panel`/`payments-panel`.
4. Umbrales de cobertura y tests faltantes (repositorio webpay, booking/availability e2e, auth real).
5. Corregir README/AGENTS drift restante.

---

## 7. Referencias rápidas

- Contratos HTTP: `packages/contracts/src/`
- Esquema DB: `apps/api/src/db/schema.ts` y `apps/api/drizzle/`
- Decisiones: `decisions/0001-webpay-create.md`, `decisions/0002-webpay-commit.md`
- CI: `.github/workflows/deploy-web.yml`
- Deploy API: `apps/api/docker-compose.yml`, `apps/api/README.md`
- SEO: `apps/web/src/config/seo.ts`, `apps/web/public/{robots,sitemap,llms}.txt`
