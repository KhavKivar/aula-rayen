# Revisión de la web frente a Bulletproof React

Fecha: 7 de septiembre de 2026.

Alcance: `apps/web`, sobre el estado local del proyecto después de corregir los tres errores de caché y mensajes de error. Este documento registra una exploración y propone trabajo pendiente; no representa una reorganización ya implementada.

## Referencias

- [Bulletproof React](https://github.com/alan2207/bulletproof-react).
- [Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md).
- [Performance](https://github.com/alan2207/bulletproof-react/blob/master/docs/performance.md).
- [Components and Styling](https://github.com/alan2207/bulletproof-react/blob/master/docs/components-and-styling.md).
- [TanStack Router: Automatic Code Splitting](https://tanstack.com/router/latest/docs/guide/automatic-code-splitting).

Bulletproof React es una guía de principios y prácticas. Su estructura admite adaptaciones al framework y no exige crear todas las carpetas ni incorporar todas las librerías de sus ejemplos.

## Evaluación general

La web ya tiene una base compatible con Bulletproof React:

- Organización por features: `auth`, `landing`, `course-dashboard`, `course-management` y `admin-dashboard`.
- Composición entre features desde rutas. Por ejemplo, [la ruta de administración de cursos](../src/routes/_authenticated/dashboard/admin/courses.tsx) conecta catálogo, gestión y compradores mediante props.
- Componentes compartidos en `src/components/ui`.
- Tailwind CSS, Base UI, shadcn y `class-variance-authority` para construir y adaptar la interfaz.
- Cliente HTTP centralizado, contratos compartidos y validación de respuestas con Zod.
- TanStack Query para estado remoto, con opciones reutilizables y hooks de mutación.
- Pruebas junto al código y utilidades comunes en `src/testing`.

Las mejoras principales son completar las restricciones de dependencias, acercar el código de dominio a sus features, dividir paneles por responsabilidades y reducir recursos innecesarios en la carga inicial.

`src/routes` y `src/router.tsx` son una adaptación válida de la capa de aplicación a TanStack Start. No hace falta moverlos a `src/app` únicamente para imitar el árbol del ejemplo.

## 1. Completar las restricciones arquitectónicas

### Hallazgo

[La configuración de ESLint](../eslint.config.mjs) restringe los imports entre los cinco features conocidos, pero no protege todas las direcciones documentadas en [AGENTS.md](../AGENTS.md).

Durante la revisión se probaron imports sintéticos en memoria:

| Dependencia | Resultado de ESLint |
| --- | --- |
| Módulo compartido importa un feature | Aceptado |
| Feature importa una ruta | Aceptado |
| Feature importa otro feature conocido | Rechazado correctamente |

Por tanto, un lint exitoso no garantiza actualmente el aislamiento completo. La lista manual de pares también requiere mantenimiento al incorporar nuevos features.

### Propuesta

Aplicar estas reglas:

- La capa de aplicación puede importar features y módulos compartidos.
- Un feature puede importar sus propios módulos y módulos compartidos.
- Un feature no puede importar otro feature ni la capa de aplicación.
- Los módulos compartidos no pueden importar features ni la capa de aplicación.

La capa de aplicación debe contemplar `routes`, `router.tsx` y el árbol de rutas generado. Los módulos compartidos incluyen `components`, `config`, `hooks`, `lib`, `testing`, `types` y `utils`, según existan.

Generar las restricciones a partir de los directorios de features y añadir pruebas de imports permitidos y prohibidos. Revisar el tratamiento de las pruebas existentes de manera explícita, conservando el aislamiento del código de producción.

Prioridad: alta, porque evita que futuras incorporaciones vuelvan a romper la arquitectura.

## 2. Ubicar el código según su responsabilidad

Mantener los cinco features actuales y realizar movimientos acotados:

| Ubicación actual | Ubicación propuesta | Motivo |
| --- | --- | --- |
| [components/ui/navbar.tsx](../src/components/ui/navbar.tsx) | `components/layouts/site-navbar.tsx` | Es navegación del sitio, con enlaces y comportamiento específico del layout. |
| [components/flower-visual.tsx](../src/components/flower-visual.tsx) y su CSS | `features/landing/components/flower-visual.tsx` y CSS adyacente | El consumidor encontrado es `LandingHero`; la ilustración pertenece a esa experiencia. |
| Catálogo promocional, beneficios, pasos y preguntas en [config/static-content.ts](../src/config/static-content.ts) | `features/landing/content/` | Son contenido y tipos del dominio de la landing. |
| [course-management/components/use-course-form.ts](../src/features/course-management/components/use-course-form.ts) | `course-management/hooks/use-course-form.ts` | Encapsula estado, validación y envío del formulario. |
| Vista y mensajes en [routes/payment-result.tsx](../src/routes/payment-result.tsx) | `course-dashboard/components/payment-result.tsx`, con los datos necesarios dentro del mismo feature | El resultado de checkout pertenece al flujo de cursos. |
| `LocalModality` en [routes/psicologa-iquique.tsx](../src/routes/psicologa-iquique.tsx) | `landing/components/local-modality.tsx` | Es una sección de presentación de la landing local. |

En `config` conservar entorno, identidad profesional y configuración global. Separar esos datos del contenido promocional sin duplicarlos. Revisar los consumidores de `static-content.ts` y los scripts que leen `site-content.json` antes de mover contenido.

Las rutas conservarían navegación, parámetros, metadatos, carga de datos y composición. Por ejemplo, `payment-result.tsx` puede validar el parámetro de búsqueda y pasar el estado a la vista del feature.

Usar imports directos y crear solamente las carpetas necesarias. Las reubicaciones deben conservar rutas públicas, contenido, estilos y comportamiento.

## 3. Dividir paneles y consolidar estilos repetidos

### Panel de pagos

[payments-panel.tsx](../src/features/admin-dashboard/components/payments-panel.tsx) reúne consulta de datos, filtros, métricas, tabla de escritorio, lista móvil y diálogo de detalle.

Extraer unidades dentro de `features/admin-dashboard`, por ejemplo:

- `payment-filters.tsx`.
- `payment-metrics.tsx`.
- `payment-list.tsx`, con las presentaciones necesarias para escritorio y móvil.
- `payment-detail-dialog.tsx`.

El panel seguiría coordinando los datos y la selección. El estado debe permanecer cerca de los componentes que lo necesitan, sin introducir un store global para resolver esta separación.

### Gestión de cursos

[course-management-panel.tsx](../src/features/course-management/components/course-management-panel.tsx) también combina presentación del catálogo, estados de carga/error, acciones y coordinación de diálogos. Separar las unidades de interfaz que puedan probarse y entenderse de forma independiente, conservando la composición por props desde la ruta.

El criterio es la responsabilidad de cada componente; el número de líneas es solamente una señal para revisar.

### Tokens y componentes compartidos

Hay colores y estilos de error repetidos en:

- [course-dashboard.tsx](../src/features/course-dashboard/components/course-dashboard.tsx).
- [course-content.tsx](../src/features/course-dashboard/components/course-content.tsx).
- [course-management-panel.tsx](../src/features/course-management/components/course-management-panel.tsx).
- [purchasers-dialog.tsx](../src/features/admin-dashboard/components/purchasers-dialog.tsx).

Ejemplos: `#934d3b`, `#fff8f4` y `#e4c5b9`. También se repiten sombras personalizadas en tarjetas de cursos.

Propuesta:

- Definir tokens semánticos para estados de error y sombras compartidas en [styles/app.css](../src/styles/app.css).
- Extraer un componente compartido de estado de error con mensaje y acción opcional.
- Reutilizar las primitivas existentes antes de crear otras nuevas.
- Mantener componentes específicos, como los estados de pago, dentro de su feature.

Tailwind, Base UI, shadcn y `cva` ya cubren las necesidades identificadas. No se justifica agregar otra librería de UI para esta reorganización.

## 4. Afinar la carga inicial de JavaScript

### Evidencia del build

El build existente sí separa pantallas en chunks. No se encontró una aplicación completa empaquetada en un único archivo.

Sin embargo, la entrada y sus dependencias estáticas reúnen aproximadamente:

| Medida | Resultado |
| --- | --- |
| Archivos JavaScript alcanzables mediante imports estáticos | 16 |
| Tamaño sin comprimir | 511 KB |
| Suma de los tamaños comprimidos con gzip local | 166 KB |

Estos valores no son el peso total transferido de una página: excluyen CSS, fuentes, imágenes y chunks específicos de la ruta. Los tamaños corresponden al build local analizado y cambiarán en builds futuros.

Entre esas dependencias aparecen consultas de cursos, Axios y validaciones de autenticación. [El loader del dashboard](../src/routes/_authenticated/dashboard/index.tsx) importa `courseDashboardQueries` desde la definición de ruta. El manifiesto del build incluye su chunk entre las dependencias de la entrada.

### Propuesta

Evaluar de manera selectiva qué dependencias del área privada pueden cargarse al navegar hacia ella. TanStack Router permite ajustar la separación por ruta y por propiedad, incluido el loader.

No activar más fragmentación de manera general: cargar un loader de forma diferida puede añadir una espera antes de iniciar su petición. Comparar ambos efectos:

- Tamaño y dependencias de la entrada pública antes y después.
- Solicitudes y tiempo de navegación hacia el dashboard y los cursos.
- Comportamiento del prefetch, la autenticación y la caché.

Mover archivos entre carpetas no produce por sí mismo una reducción del bundle.

### Estado y renderizado

El proyecto ya usa estado local y composición mediante props. `useDeferredSearch` ayuda a diferir el valor de búsqueda, pero la conveniencia de memoizar listas o cálculos debe verificarse con perfiles de renderizado y volúmenes representativos de datos.

No añadir `memo`, `useMemo`, virtualización ni stores globales de forma indiscriminada.

## 5. Servir imágenes ajustadas al tamaño mostrado

### Hallazgo medido

[LandingHero](../src/features/landing/components/landing-hero.tsx) muestra un avatar de 44×44 píxeles, pero usa el mismo recurso que el retrato grande de [LandingProfessional](../src/features/landing/components/landing-professional.tsx).

El recurso configurado en [site-content.json](../src/config/site-content.json) respondió con un JPEG de 1280×1280 píxeles y 111.601 bytes, aproximadamente 112 KB.

Se probaron conversiones en memoria a WebP con calidad 80:

| Variante | Peso medido | Uso posible |
| --- | --- | --- |
| 88 px de ancho | 1.464 bytes | Avatar de 44 px con densidad 2× |
| 430 px de ancho | 9.782 bytes | Retrato mediano |
| 860 px de ancho | 24.674 bytes | Retrato con mayor densidad |

Son mediciones de alternativas, no assets incorporados al proyecto. Falta revisar su calidad visual y decidir cómo se generarán y servirán.

### Propuesta

- Crear variantes responsivas y declarar `srcSet` y `sizes` según el tamaño mostrado.
- Conservar dimensiones explícitas para reservar espacio.
- Mantener `loading="lazy"` para el retrato inferior, que ya lo utiliza.
- Dar al avatar visible inicialmente un recurso pequeño adecuado a su tamaño.

La misma URL usada por avatar y retrato puede reutilizarse desde la caché del navegador. Por eso, el ahorro debe evaluarse tanto para la primera pantalla como para el recorrido completo, sin contar dos descargas del original por defecto.

## Correcciones ya realizadas antes de esta exploración

Estos tres problemas se corrigieron previamente y no deben volver a aparecer como trabajo pendiente:

1. **Caché entre cuentas:** se cancelan consultas y se limpia la caché en las transiciones de login, logout y registro mediante [session-cache.ts](../src/lib/session-cache.ts).
2. **Detalle de cursos desactualizado:** editar invalida el detalle y eliminar retira su caché, además de invalidar el catálogo, en [use-course-mutations.ts](../src/features/course-management/api/use-course-mutations.ts).
3. **Errores técnicos visibles:** [api-error.ts](../src/lib/api-error.ts) usa el mensaje alternativo para errores inesperados. [UserFacingError](../src/lib/user-facing-error.ts) identifica errores previstos cuyos mensajes pueden mostrarse, preservando autenticación y Webpay. Esto también eliminó el import de `AuthError` desde la utilidad compartida de producción.

La validación de esas correcciones pasó: 118 pruebas, lint, TypeScript y build. Una prueba en Chromium verificó el cambio de cuenta sin recarga con API simulada; no constituye una prueba de integración con el backend real.

## Orden de trabajo propuesto

1. Completar las restricciones ESLint y probar sus límites.
2. Reubicar contenido, componentes y hooks según su responsabilidad.
3. Dividir los paneles y consolidar tokens y estados de error compartidos.
4. Incorporar variantes de imágenes con revisión visual.
5. Optimizar las dependencias iniciales con comparación de bundles y navegación.

Para cada paso, ejecutar las verificaciones cercanas al cambio. Antes de integrar la reorganización, validar lint, tipos, suite de pruebas y build; comprobar con navegador los flujos afectados y la presentación en escritorio y móvil.

## Límites de la revisión

- Se revisaron código, configuración, relaciones del grafo, build local y tamaños de imágenes. Se verificó la cobertura del índice y se leyó directamente el CSS señalado como parcialmente indexado y los artefactos de build excluidos del grafo.
- La cobertura del grafo es una señal orientativa, no una garantía de exhaustividad.
- No se midieron LCP, INP, CLS ni puntuaciones Lighthouse. Los tamaños de archivos no permiten afirmar por sí solos que la página sea lenta ni cuantificar una mejora temporal.
- La exploración no modificó código. Las ubicaciones y extracciones de este documento son propuestas pendientes de implementación.
- Había cambios locales previos, incluidas las correcciones citadas y la ilustración de la landing. El análisis se hizo sobre ese estado local.
