# Aula Rayen

Plataforma de cursos y talleres de Pamela Rayen Calderón. Aula Rayen reúne el
catálogo, la inscripción, el acceso a contenidos y los pagos en una experiencia
web integrada.

## Características

- Aplicación web con TanStack Start y React 19
- API NestJS con configuración tipada y health checks
- Contratos TypeScript compartidos entre frontend y backend
- Autenticación con correo y contraseña o Google
- Catálogo de cursos, panel de inscripciones y acceso a contenidos
- Pagos con Webpay Plus mediante el SDK oficial de Transbank
- Entorno local con Docker Compose
- Pruebas unitarias, de integración y end-to-end

## Estructura del repositorio

```text
apps/
  api/        API NestJS y acceso a la base de datos
  web/        Aplicación web con TanStack Start
packages/
  contracts/  Esquemas y tipos TypeScript compartidos
  config/     Configuración compartida del proyecto
```

## Desarrollo local

Requisitos: Node.js 20+, pnpm 10+ y PostgreSQL.

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm build
```

Completa las variables locales antes de iniciar las aplicaciones. Los archivos de
entorno versionados contienen únicamente valores de ejemplo.

```bash
pnpm --filter @aula-rayen/api start:dev
pnpm --filter @aula-rayen/web dev
```

Por defecto, la API escucha en `http://localhost:3000` y la aplicación web en
`http://localhost:3001`.

## Docker

```bash
docker compose up --build
```

## Validación

```bash
pnpm typecheck
pnpm test
pnpm build
```

Las credenciales de despliegue, variables privadas y secretos de terceros se
mantienen fuera del repositorio.

## Contenido de producción

Los textos públicos y metadatos de producción se encuentran en
`apps/web/src/config/site-content.json`, junto a su JSON Schema. GitHub Actions
construye ese contenido directamente desde el monorepo. Las credenciales y
variables privadas se administran como secretos de despliegue y nunca se guardan
en el archivo de contenido.
