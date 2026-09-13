# 0006 - Cookies de sesión cross-subdominio

- Fecha: 2026-09-13
- Estado: aceptada
- Ámbito: api

## Contexto

El site vive en `psicologarayen.cl` y la API en `api.psicologarayen.cl`. La sesión de
Better Auth debe viajar entre ambos orígenes. En local, frontend y API usan puertos
distintos de `localhost` y no deben heredar el scope de producción.

## Decisión

- `DOMAIN` es un hostname opcional validado (`env.schema.ts`): sin esquema, puerto ni
  path; obligatorio cuando `NODE_ENV=production`.
- Better Auth activa `advanced.crossSubDomainCookies` solo si `DOMAIN` está presente;
  en local conserva cookies host-only.
- Las cookies mantienen `Secure`, `HttpOnly`, `SameSite=Lax` y `Path=/`.
- CORS y `trustedOrigins` usan `allowedOrigins` con `credentials: true`, y el frontend
  envía `withCredentials`/`credentials: include`.
- El rate limiting de la API identifica al cliente por `cf-connecting-ip` con fallback
  a `req.ip` (con `app.set('trust proxy', 1)`).

## Alternativas consideradas

- Cookies host-only con proxy same-origin: quedó obsoleta al retirar el Worker
  (`decisions/0004-retirar-proxy-worker-api.md`).
- Hardcodear el dominio padre en el código: descartado; acopla el código a un
  despliegue y complica preview/test/local.
- Reescribir `Set-Cookie` en un proxy: descartado; duplica el comportamiento de Better
  Auth y pierde cookies de callbacks o plugins.

## Consecuencias

- Todos los subdominios activos del dominio padre reciben la cookie de sesión: hay que
  inventariar DNS y no alojar aplicaciones no confiables bajo el mismo dominio.
- Al migrar desde cookies host-only, los usuarios deben iniciar sesión de nuevo; el
  logout de Better Auth expira la cookie de dominio.
- Producción falla al arrancar si `DOMAIN` no está configurado, en lugar de degradar a
  host-only silenciosamente.
