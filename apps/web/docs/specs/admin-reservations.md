# Spec: Reservas del panel administrador

## Objective

Agregar una experiencia exclusivamente frontend para que una administradora configure horarios recurrentes y revise reservas ficticias desde una lista y un calendario.

## Tech Stack

TanStack Start/Router, React 19, TypeScript, Tailwind CSS, Lucide y componentes UI existentes. Los datos y cambios viven sólo en memoria.

## Commands

- Lint: `pnpm lint`
- Types: `pnpm exec tsc --noEmit`
- Tests: `pnpm test:run`
- Build: `pnpm build`

## Project Structure

- `src/features/admin-reservations/`: estado mock, componentes y pruebas del módulo.
- `src/routes/_authenticated/dashboard/admin/`: ruta que compone la feature.
- `src/features/admin-dashboard/`: navegación compartida del panel.

## Code Style

```tsx
export function ReservationsPanel() {
  return <section aria-labelledby="reservations-title">...</section>;
}
```

Nombres de dominio en inglés, contenido visible en español, imports `@/` y componentes accesibles/responsivos.

## Testing Strategy

Pruebas de interacción para alternar vistas y crear/eliminar horarios. Typecheck, lint y build validan integración y generación de rutas.

## Boundaries

- Always: reutilizar el diseño actual, permitir bloques de 1 o 2 horas y seleccionar días.
- Ask first: persistencia, endpoints, contratos o cambios de backend.
- Never: presentar los datos mock como persistidos o desplegar.

## Success Criteria

- “Reservas” aparece en la navegación del admin.
- El panel se concentra en configurar horarios, sin tarjetas de métricas ni listado de próximas reservas.
- El formulario permite elegir días, período de fechas, rango horario y duración de 1 o 2 horas.
- Antes de guardar, muestra todos los bloques que generará dentro del rango.
- “Calendario” es una sección independiente del panel admin y muestra las reservas mock organizadas por día.
- “Reservas” muestra una previsualización semanal de la disponibilidad guardada, con controles para agregar y eliminar bloques.
- La previsualización permite navegar por semanas y muestra fechas concretas; fuera del período configurado no muestra disponibilidad.
- Funciona en móvil y escritorio y supera las verificaciones del proyecto.

## Open Questions

La persistencia y las reglas de disponibilidad quedan fuera del alcance hasta contar con API.
