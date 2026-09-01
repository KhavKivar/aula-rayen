# Learning Platform API

NestJS service for authentication, courses, enrollment, payments, and password-recovery email delivery. See the [root README](../../README.md) for full setup and architecture notes.

```bash
cp .env.example .env
pnpm start:dev
pnpm test
```

Use development-only credentials locally. Production secrets must be supplied by the deployment platform.

## Cross-subdomain sessions

Production deployments whose frontend and API use sibling subdomains must set
`BETTER_AUTH_COOKIE_DOMAIN` to their shared parent hostname. Use a hostname only,
without a protocol, port, or path. Local development should leave the variable
unset so Better Auth continues to issue host-only cookies.

Before enabling the setting, inventory every subdomain under the parent domain.
Do not share session cookies when an untrusted application, third-party service,
or dangling DNS record exists within that scope.

Cookies created before this setting is enabled remain host-only. During rollout:

1. Clear the old authentication cookies in a test browser.
2. Sign in again to establish a domain-scoped session.
3. Inspect browser storage for cookies with the same name but different domains.
4. Verify `Domain`, `Secure`, `HttpOnly`, `SameSite=Lax`, and `Path=/` before
   enabling direct browser-to-API traffic.

To roll back, remove the production setting, redeploy the API, expire the
domain-scoped session cookie through logout or an operational cleanup response,
and require users to sign in again to establish host-only sessions.

## Dokploy con PostgreSQL local

Despliega `apps/api/docker-compose.yml` como una aplicación Compose desde la
raíz del repositorio. El Compose crea:

- `api`: NestJS, limitado por defecto a 768 MiB y 1 CPU.
- `migrate`: ejecución única de las migraciones Drizzle antes de iniciar la API.
- `postgres`: PostgreSQL 17, limitado por defecto a 1 GiB y 1 CPU.

PostgreSQL no publica el puerto 5432. Solo `api` y `migrate` pueden alcanzarlo
por la red privada de Compose usando el hostname `postgres`. El volumen
`aula_rayen_postgres_data` persiste aunque los contenedores se recreen.

Configura estas variables en Dokploy además de las variables normales de la API:

```dotenv
POSTGRES_USER=aula_rayen
POSTGRES_PASSWORD=<contraseña-url-safe-larga>
POSTGRES_DB=aula_rayen
DATABASE_URL=postgresql://aula_rayen:<misma-contraseña>@postgres:5432/aula_rayen

API_MEMORY_LIMIT=768m
API_CPU_LIMIT=1.0
POSTGRES_MEMORY_LIMIT=1g
POSTGRES_CPU_LIMIT=1.0
```

La contraseña debe estar codificada para URL si contiene `@`, `:`, `/`, `?`,
`#` o `%`. No expongas 5432 mediante Domains ni Ports en Dokploy. Asocia el
dominio público únicamente al servicio `api` y su puerto 3000.

### Migración desde Neon

El primer despliegue crea el esquema, pero no copia datos. Antes de dirigir
producción a PostgreSQL local:

1. Genera un dump solo de datos desde Neon.
2. Detén escrituras o programa una ventana breve de mantenimiento.
3. Restaura el dump dentro del servicio `postgres` después de que `migrate`
   haya creado el esquema.
4. Compara cantidades de usuarios, sesiones, cuentas, cursos, compras y pagos.
5. Valida login, acceso a cursos y Webpay antes de cambiar tráfico.
6. Conserva Neon sin escrituras durante el periodo de rollback.

Ejemplo desde una máquina que tenga acceso a Neon y al proyecto Dokploy:

```bash
pg_dump "$NEON_DATABASE_URL" \
  --data-only --no-owner --no-privileges \
  --file aula-rayen-data.sql
```

Restaura el archivo desde la terminal del contenedor o mediante una copia segura
al VPS:

```bash
psql "$DATABASE_URL" --set ON_ERROR_STOP=on --file aula-rayen-data.sql
```

Configura backups automáticos fuera del VPS y prueba una restauración antes del
corte. El volumen Docker por sí solo no constituye un backup.
