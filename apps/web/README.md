# Frontend de Aula Rayen

Aplicación React full-stack construida con TanStack Start, TanStack Router y Vite.
Se despliega como Cloudflare Worker mediante el plugin oficial de Cloudflare.

## Desarrollo local

Instala dependencias y levanta el servidor en `http://localhost:3001`:

```bash
pnpm install
pnpm dev
```

Copia `.env.example` a `.env.local` y configura:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

Las dos variables son públicas y se incluyen en el bundle del navegador. No deben
contener secretos.

## Validación

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test:run
pnpm build
pnpm check:landing
```

`check:landing` inicia temporalmente el preview de producción y comprueba por HTTP
el contenido y metadatos esenciales de la página principal.

## Rutas

Las rutas basadas en archivos viven en `src/app/`. TanStack Router genera
`src/routeTree.gen.ts`; el archivo generado se versiona pero no se edita a mano.

El endpoint catch-all `src/app/api/auth/$.ts` reenvía `/api/auth/*` al backend para
mantener el flujo de cookies de Better Auth en el mismo origen.

## Cloudflare Workers

```bash
pnpm preview
pnpm run cf-typegen
pnpm deploy
```

`pnpm deploy` compila y publica el Worker `aula-rayen`. No lo ejecutes para una
validación local; los pushes a `main` bajo `apps/web/**` activan el workflow de
producción.

Consulta la [documentación de TanStack Start](https://tanstack.com/start/latest)
y la [guía de Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/).
