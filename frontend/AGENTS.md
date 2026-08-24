# Librerías del frontend

## Arquitectura

El flujo de dependencias es `shared → features → app`:

- `src/app`: rutas de TanStack Router, documento raíz, providers y composición.
- `src/features`: lógica de dominio autocontenida.
- `src/components`, `config`, `hooks`, `lib`, `testing`, `types` y `utils`:
  módulos compartidos que no dependen de features ni de app.

No importes internals entre features. Compón features desde `app`, usa imports
directos en vez de barrel files y añade una zona ESLint al crear un feature.

## Librerías

Usa primero las dependencias ya instaladas:

- Componentes: **shadcn** y **Base UI**. Reutiliza `src/components/ui/` antes de
  crear una primitiva nueva.
- Estilos: **Tailwind CSS**. Combina clases con `cn()` de `@/lib/utils`.
- Iconos: **Lucide React**.
- Formularios: **TanStack React Form** para formularios nuevos o migrados. React
  Hook Form permanece temporalmente en formularios existentes aún no migrados.
- Validación: **Zod** mediante Standard Schema con TanStack Form; usa
  **zodResolver** solamente en formularios que todavía usan React Hook Form.
- Peticiones y estado remoto: **TanStack Query** con `useQuery` y `useMutation`.
- Cliente HTTP: **Axios** mediante `@/lib/api-client`; no crees otra instancia.
- Autenticación: **Better Auth** mediante `@/lib/auth-client`.
- Navegación: `Link`, `useNavigate` y `useRouter` de TanStack Router.
- Imágenes: elementos HTML responsivos con dimensiones explícitas y loading
  apropiado; no agregues una librería de imágenes sin justificarla.
- Variantes de componentes: **class-variance-authority**.
- Tests: **Vitest**, **Testing Library**, **jest-dom** y **user-event**.

No agregues una librería que duplique alguna de estas capacidades sin justificarlo.

## Reglas mínimas

- Usa imports con `@/`.
- Centraliza variables de entorno en `src/config/env.ts`.
- Nunca guardes secretos en variables `NEXT_PUBLIC_*`.
- Mantén peticiones y transformación de errores fuera de los componentes.
- Mantén el SSR universal de TanStack Start y evita APIs exclusivas del navegador
  durante el render del servidor.

## Validación

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test:run
```

Ejecuta también `pnpm build` al cambiar rutas o configuración. Husky ejecuta
`pnpm test:run` antes de cada commit y debe bloquearlo si una prueba falla.
