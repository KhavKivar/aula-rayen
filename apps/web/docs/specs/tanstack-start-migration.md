# Spec: Migración de Next.js a TanStack Start

> Nota (2026-08-30, `remove-frontend-auth-proxy`): el proxy `/api/auth/*` descrito en este documento fue eliminado tras mover la API a `aula-rayen.vasvani.shop/api` vía Cloudflare Worker. Ver `openspec/changes/remove-frontend-auth-proxy/` para el transporte directo actual.

## Supuestos

1. La migración debe conservar la UI y el comportamiento actuales de las rutas `/`,
   `/login`, `/register` y `/dashboard`.
2. El frontend seguirá desplegándose como un único Cloudflare Worker llamado
   `aula-rayen`; no se hará un despliegue desde esta tarea.
3. Las variables públicas usan `VITE_PUBLIC_API_URL`, `VITE_PUBLIC_AUTH_URL` y
   `VITE_PUBLIC_SITE_URL`, configurando Vite para exponer exclusivamente ese
   prefijo.
4. El proxy `/api/auth/*` seguirá reenviando métodos, query string, cabeceras, cuerpo
   y respuestas hacia el backend, porque Better Auth depende de él.
5. La migración no debe modificar el backend ni sobrescribir los cambios locales que
   ya existen en frontend o backend.

## Objetivo

Reemplazar Next.js App Router y OpenNext por TanStack Start con Vite y el plugin
oficial de Cloudflare, manteniendo las rutas, autenticación, estilos, metadatos,
tests y despliegue existentes.

## Stack técnico

- React 19 y TypeScript estricto.
- TanStack Start y TanStack Router con rutas basadas en archivos bajo `src/routes`.
- Vite y `@vitejs/plugin-react`.
- Tailwind CSS 4 mediante `@tailwindcss/vite`.
- `@cloudflare/vite-plugin` y Wrangler para Cloudflare Workers.
- TanStack Query, Better Auth, Axios, shadcn/Base UI y Vitest existentes.

## Comandos

Ejecutados desde `apps/web/`:

```bash
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm test:run
pnpm build
pnpm preview
```

`pnpm deploy` seguirá disponible, pero no se ejecutará como parte de la migración.

## Estructura del proyecto

```text
src/routes/__root.tsx              layout raíz, head, estilos y providers
src/routes/index.tsx               ruta /
src/routes/login.tsx               ruta /login
src/routes/register.tsx            ruta /register
src/routes/dashboard.tsx           ruta /dashboard
src/routes/api/auth/$.ts           proxy catch-all de Better Auth
src/router.tsx                     creación y registro del router
src/routeTree.gen.ts               árbol generado por el plugin de TanStack Router
src/features/                      dominio existente, sin cruces entre features
src/components, config, lib, ...   módulos compartidos existentes
vite.config.ts                     TanStack Start, React, Tailwind y Cloudflare
wrangler.jsonc                     entrypoint y configuración del Worker
```

## Estilo de código

Se mantienen imports `@/`, nombres de dominio en inglés y mensajes visibles en
español. Cada ruta exportará una `Route` tipada y delegará la UI a un componente:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return <main>{/* composición existente */}</main>;
}
```

No se añadirán `any` ni aserciones no nulas para ocultar configuración ausente.

## Estrategia de pruebas

- Conservar y ejecutar todos los tests unitarios/de componentes con Vitest.
- Ajustar mocks y helpers que dependan de navegación de Next.js.
- Verificar por typecheck el árbol de rutas, links y navegación programática.
- Validar el bundle de producción con `pnpm build` y la integración Cloudflare con
  `pnpm preview` mediante una comprobación HTTP local si el entorno lo permite.
- Actualizar el chequeo de landing para inspeccionar el output de Vite en vez de
  artefactos de Next/OpenNext.

## Límites

- Siempre: preservar la UI y contratos HTTP; mantener `credentials` y cookies del
  flujo de autenticación; actualizar documentación, CI y configuración afectadas;
  ejecutar lint, typecheck, tests y build.
- Consultar primero: cambios de endpoints backend, nombres de secretos de
  producción, dominio de producción o comportamiento funcional visible.
- Nunca: desplegar, editar artefactos generados, tocar secretos, borrar cambios
  locales ajenos ni modificar el backend para simplificar la migración.

## Criterios de éxito

- No quedan dependencias ni imports de `next`, `eslint-config-next` u OpenNext.
- `/`, `/login`, `/register` y `/dashboard` renderizan la misma experiencia actual.
- Los links y redirects usan TanStack Router.
- `/api/auth/*` conserva el proxy hacia `VITE_PUBLIC_API_URL` para todos los métodos
  HTTP actualmente soportados.
- Head/SEO, favicon, fuentes y la imagen Open Graph tienen reemplazos funcionales.
- Las variables existentes funcionan en desarrollo, build, preview y CI sin
  renombrar secretos.
- Wrangler usa el entrypoint de TanStack Start y el plugin Vite de Cloudflare.
- El workflow deja de mencionar OpenNext y valida antes de desplegar.
- `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run` y `pnpm build` pasan.

## Riesgos y mitigaciones

- La semántica de variables entre Vite y Workers difiere de Next.js: se centraliza
  el acceso y se configura un prefijo público explícito.
- El proxy auth usa streaming y cookies: se implementará como server route nativa y
  se cubrirá la construcción del destino con pruebas unitarias.
- `next/image`, `next/font` y `next/og` no tienen equivalencia automática: se usarán
  HTML/CSS/assets estándar sin introducir otra librería salvo necesidad demostrada.
- El árbol de rutas es generado: se versionará siguiendo la convención oficial y no
  se editará manualmente.

## Preguntas abiertas

Ninguna. Especificación aprobada el 19 de agosto de 2026.

## Plan técnico

1. Sustituir dependencias, scripts y configuración de Next/OpenNext por TanStack
   Start, Vite y Cloudflare Vite Plugin.
2. Crear el router y trasladar layout y páginas al esquema de rutas de TanStack.
3. Migrar navegación declarativa/programática y el proxy de autenticación,
   protegiendo el comportamiento del proxy con pruebas.
4. Reemplazar integraciones exclusivas de Next (fuentes, imagen optimizada, OG y
   middleware vacío) con capacidades web estándar.
5. Actualizar ESLint, Vitest, Wrangler, CI, chequeo de landing y README.
6. Ejecutar todas las validaciones y una comprobación local del Worker sin desplegar.

## Tareas

- [x] Toolchain TanStack/Vite/Cloudflare instalado y configuración Next eliminada.
  - Verificar: `pnpm install --frozen-lockfile` y carga de `vite.config.ts`.
- [x] Router raíz y cuatro páginas migradas sin cambios funcionales visibles.
  - Verificar: typecheck y build generan el árbol de rutas.
- [x] Navegación y proxy `/api/auth/*` migrados.
  - Verificar: tests de formularios y tests del proxy pasan.
- [x] SEO, estilos, fuentes, assets y variables públicas conservados.
  - Verificar: chequeo de landing contra el servidor de preview.
- [x] CI, scripts, documentación y configuración de Worker actualizados.
  - Verificar: no quedan referencias activas a Next/OpenNext.
- [x] Suite completa aprobada.
  - Verificar: lint, typecheck, tests, build y dry-run de Wrangler.
