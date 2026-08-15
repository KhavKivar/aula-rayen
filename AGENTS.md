# Guía del monorepo

## Alcance y estructura

Este repositorio es un monorepo con dos aplicaciones independientes:

- `frontend/`: Next.js y React, desplegado en Cloudflare Workers mediante OpenNext.
- `backend/`: NestJS, Better Auth, Drizzle ORM y PostgreSQL.
- `.github/workflows/`: despliegues separados según los paths modificados.

Trata la raíz como el único repositorio Git. No inicialices repositorios ni crees
directorios `.git` dentro de `frontend/` o `backend/`.

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

Frontend, desde `frontend/`:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Backend, desde `backend/`:

```bash
pnpm exec eslint src test
pnpm test
pnpm build
```

Ejecuta las verificaciones más cercanas al cambio durante el desarrollo y el build
completo antes de publicar cambios de configuración, autenticación o despliegue.

## Integración entre aplicaciones

- El frontend usa `NEXT_PUBLIC_API_URL` para llamadas directas a la API.
- Better Auth puede pasar por el proxy de Next.js bajo `/api/auth/*`.
- Al agregar un origen del frontend, actualiza tanto `trustedOrigins` de Better Auth
  como CORS en NestJS.
- Las cookies y peticiones autenticadas requieren `credentials: true` en ambos lados.
- Evita duplicar URLs o valores de entorno dentro del código.

## Despliegue

- Un push a `main` que modifica `frontend/**` activa `deploy-frontend.yml`.
- Un push a `main` que modifica `backend/**` activa `deploy-backend.yml`.
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
