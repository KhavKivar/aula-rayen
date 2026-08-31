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
VITE_PUBLIC_API_URL=http://localhost:3000
VITE_PUBLIC_AUTH_URL=http://localhost:3000/auth
VITE_PUBLIC_SITE_URL=http://localhost:3001
```

Las tres variables son públicas y se incluyen en el bundle del navegador. No deben
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

## Estrategia de pruebas

Elige el nivel más bajo que proteja el contrato completo:

| Nivel | Úsalo para | Ejemplo de contrato |
| --- | --- | --- |
| Unit | Lógica pura con reglas, transformaciones o casos límite | Un error de autenticación se convierte en el mensaje correcto |
| Componente/integración | La mayor parte de React: interacción, providers, carga, éxito y error | Al enviar el login se deshabilita el botón y se muestra el resultado visible |
| E2E | Pocos recorridos críticos entre páginas y fronteras | Login correcto devuelve al usuario a la ruta protegida solicitada |

Las pruebas de interfaz consultan como lo haría una persona: primero `getByRole`
con nombre, luego `getByLabelText`, texto visible y otras queries semánticas.
No uses selectores CSS. `data-testid` solo es aceptable cuando no existe semántica
estable y el test documenta el motivo.

Renderiza componentes hijos y hooks reales dentro de la feature bajo prueba. Los
dobles se reservan para fronteras externas o no deterministas, como HTTP, Better
Auth, pagos y el reloj. Prefiere afirmar mensajes, navegación y estados visibles
en vez de llamadas internas; no uses spies cuando el resultado observable cubre
el contrato.

La suite rápida usa Vitest y Testing Library:

```bash
pnpm test:run
pnpm test:run src/features/auth/components/login-form.test.tsx
```

Los recorridos críticos usan Playwright. La primera ejecución local requiere el
navegador de Chromium:

```bash
pnpm exec playwright install chromium
pnpm test:e2e
pnpm test:e2e:debug
```

Playwright inicia la aplicación con variables locales controladas e intercepta
las fronteras remotas del escenario; no requiere una API ni cuentas reales. Ante
un fallo, revisa `test-results/` y abre el trace indicado con
`pnpm exec playwright show-trace <ruta-del-trace.zip>`. Usa `--headed` o
`test:e2e:debug` para reproducirlo visualmente.

## Rutas

Las rutas basadas en archivos viven en `src/routes/`. TanStack Router genera
`src/routeTree.gen.ts`; el archivo generado se versiona pero no se edita a mano.

La autenticación usa Better Auth contra `VITE_PUBLIC_AUTH_URL` (`https://aula-rayen.vasvani.shop/api/auth` en prod) vía `src/lib/auth-client.ts`; el Worker elimina el prefijo `/api` y reenvía `/auth/*` al origen NestJS. No existe proxy de autenticación dentro de TanStack Start.

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
