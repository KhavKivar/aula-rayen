# 0004 - Retirar el proxy Worker de la API

- Fecha: 2026-09-13
- Estado: aceptada
- Ámbito: general

## Contexto

Para evitar CORS y compartir cookies, el frontend usó un Cloudflare Worker en
`aula-rayen.vasvani.shop/api/*` más un proxy TanStack Start `/api/auth/*` y server
functions SSR. Con el dominio final (`psicologarayen.cl` + `api.psicologarayen.cl`) y
las cookies cross-subdominio ya resueltas, ambos proxies eran una capa redundante:
hop extra, streaming manual de headers, tests y `routeTree` que mantener, y errores
del backend ocultos.

## Decisión

- El frontend consume la API directamente en `https://api.psicologarayen.cl` con la
  capa `apiClient` (axios `withCredentials: true`), sin `createServerFn` ni
  `backend-api.server.ts`.
- Better Auth se consume directo contra `VITE_PUBLIC_AUTH_URL`
  (`https://api.psicologarayen.cl/auth`), sin proxy catch-all.
- CORS y `trustedOrigins` se toman de `allowedOrigins`: solo el origen del frontend en
  producción y el puerto local en desarrollo.
- Las rutas privadas usan `ssr: false`, por lo que no hace falta reenviar cookies en
  SSR.
- El Worker proxy quedó eliminado del repositorio (`chore: retirar worker proxy de API
  en desuso`); Cloudflare solo sirve los assets del frontend.

## Alternativas consideradas

- Mantener el Worker same-origin: descartado; duplicaba el punto de entrada y el
  despliegue sin eliminar el proxy.
- BFF genérico en el frontend: descartado por añadir otra capa que mantener.
- Shim de redirección 301 al API: descartado; no aporta sobre la petición directa.

## Consecuencias

- El login y las peticiones autenticadas dependen de que CORS con credenciales y la
  cookie `Domain=.psicologarayen.cl` estén bien configurados en producción.
- El round-trip desde Chile ya no pasa por una capa extra.
- Cualquier regresión de CORS o cookies se depura directo entre ambos orígenes, sin
  intermediarios.
