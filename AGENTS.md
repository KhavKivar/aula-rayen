# Guía del monorepo

## Alcance y estructura

Este repositorio es un monorepo con dos aplicaciones independientes:

- `apps/web/`: TanStack Start y React, desplegado en Cloudflare Workers mediante
  Vite y el plugin oficial de Cloudflare.
- `apps/api/`: NestJS, Better Auth, Drizzle ORM y PostgreSQL.
- `packages/contracts/`: contratos HTTP compartidos y neutrales al framework,
  publicados dentro del workspace como `@aula-rayen/contracts`.
- `.github/workflows/`: despliegues separados según los paths modificados.

Trata la raíz como el único repositorio Git. No inicialices repositorios ni crees
directorios `.git` dentro de `apps/web/` o `apps/api/`.

## Forma de trabajar

- Ejecuta los comandos desde la aplicación correspondiente; no existe un workspace
  de pnpm compartido en la raíz.
- Usa `pnpm` y conserva el lockfile de cada aplicación.
- No mezcles cambios del frontend y backend salvo que la funcionalidad cruce la API.
- Antes de cambiar contratos HTTP, revisa y actualiza ambos consumidores.
- Mantén secretos fuera del repositorio. Documenta variables nuevas en el archivo
  `.env.example` de la aplicación correspondiente.
- No edites artefactos generados como `.next/`, `.open-next/`, `dist/` o archivos
  generados por Wrangler.

## Comandos de validación

Web, desde `apps/web/`:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

API, desde `apps/api/`:

```bash
pnpm exec eslint src test
pnpm test
pnpm build
```

Ejecuta las verificaciones más cercanas al cambio durante el desarrollo y el build
completo antes de publicar cambios de configuración, autenticación o despliegue.

## Integración entre aplicaciones

- El frontend usa `VITE_PUBLIC_API_URL` para la API general y `VITE_PUBLIC_AUTH_URL` para Better Auth (`https://aula-rayen.vasvani.shop/api/auth` en prod, `http://localhost:3000/auth` en dev).
- Better Auth ya no usa proxy TanStack Start `/api/auth/*`; el Worker `aula-rayen.vasvani.shop/api/` reenvía `/api/*` al origen NestJS (ver `workers/index.ts`).
- Al agregar un origen del frontend, actualiza tanto `trustedOrigins` de Better Auth (`apps/api/src/modules/auth/auth.ts`) como CORS en NestJS (`apps/api/src/main.ts`).
- Las cookies y peticiones autenticadas requieren `credentials: true` / `credentials: include` en ambos lados; `BETTER_AUTH_COOKIE_DOMAIN=vasvani.shop` en prod mantiene sesión cross-subdominio compatible con Worker same-origin.
- Evita duplicar URLs o valores de entorno dentro del código; `VITE_PUBLIC_SITE_URL` es el origen del site (`https://aula-rayen.vasvani.shop`).

## Despliegue

- Un push a `main` que modifica `apps/web/**` activa `deploy-web.yml`.
- Un push a `main` que modifica `apps/api/**` activa `deploy-api.yml`.
- Los cambios en `packages/contracts/**` activan ambos despliegues porque afectan sus
  contratos compartidos.
- Revisa el alcance del diff antes de hacer push, porque puede iniciar un despliegue
  de producción.
- No ejecutes despliegues manuales si el usuario solo pidió validar o compilar.

## Convenciones generales

- TypeScript estricto; evita `any` nuevo y aserciones `!` para ocultar configuración
  ausente.
- Usa imports absolutos con `@/` dentro de cada aplicación cuando estén disponibles.
- Prefiere módulos pequeños con una responsabilidad clara.
- Conserva los nombres del dominio en inglés en código y los mensajes visibles al
  usuario en español.
- Añade pruebas en el nivel más cercano al comportamiento modificado.

Las instrucciones de un `AGENTS.md` más cercano al archivo modificado tienen
precedencia sobre esta guía.
