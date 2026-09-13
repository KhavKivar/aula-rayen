## Context

`apps/web` ya usa Vitest con `jsdom`, Testing Library, `jest-dom` y `user-event`. La suite contiene pruebas de autenticación, dashboard y administración de cursos, además de un render compartido con TanStack Query, pero no dispone de una convención formal por niveles ni de infraestructura E2E. El frontend es TanStack Start sobre Vite y Cloudflare Workers; su arquitectura exige el flujo `shared → features → routes` y SSR universal.

La estrategia debe mejorar el valor de la suite sin convertir la implementación inicial en una reescritura de todas las pruebas existentes ni exigir cambios a la API. Véanse `proposal.md` y `specs/web/testing-strategy/spec.md` para motivación y contratos.

## Goals / Non-Goals

**Goals:**

- Dar una regla práctica para elegir entre unit, component/integration y E2E.
- Hacer que el entorno de componentes represente providers reales y mantenga aislamiento entre pruebas.
- Establecer queries y aserciones orientadas a comportamiento observable como patrón por defecto.
- Añadir una capa E2E pequeña, repetible y útil para diagnosticar regresiones críticas.
- Migrar ejemplos de alto valor que sirvan como referencia para pruebas futuras.

**Non-Goals:**

- Alcanzar un porcentaje global de cobertura arbitrario o probar cada componente trivial.
- Reescribir en un solo cambio todas las pruebas actuales que ya protegen contratos útiles.
- Probar internals de React, TanStack, Better Auth o librerías de UI.
- Incorporar pruebas del backend o reemplazar sus suites.
- Ejecutar servicios de terceros reales durante las pruebas ordinarias.

## Decisions

### Mantener Vitest y Testing Library como base de la suite rápida

Los unit tests y las pruebas de componente/integración permanecerán en Vitest. Se conservará `jsdom` como entorno por defecto y se ampliará `src/testing/test-utils.tsx` para aceptar estado inicial y providers necesarios sin compartir clientes entre casos.

Esto aprovecha las dependencias y pruebas existentes. Separar unit y component en runners distintos añadiría configuración sin aportar aislamiento significativo en esta etapa; ambos niveles pueden distinguirse por el alcance de cada archivo y por lo que renderizan.

### Usar Playwright para los pocos recorridos E2E

Playwright será la herramienta E2E porque puede iniciar el servidor web, controlar navegadores reales, usar queries accesibles y conservar traces, capturas o videos al fallar. La configuración vivirá dentro de `apps/web` y expondrá un comando no interactivo independiente de Vitest.

Se consideró Vitest Browser Mode, pero su fortaleza está en componentes dentro de navegador y no reemplaza con la misma claridad los recorridos completos entre rutas. También se descartó Cypress para evitar incorporar un segundo modelo de queries y una experiencia más distante de Testing Library.

### Controlar dependencias externas en sus fronteras

Las pruebas de componente preferirán providers y componentes reales. Las solicitudes HTTP y SDK externos se controlarán en la frontera mediante handlers o adaptadores existentes; no se hará mock de cada hook ni de componentes hijos. Para E2E, Playwright interceptará únicamente las fronteras remotas necesarias con respuestas contractuales y estado por escenario, evitando depender de cuentas, pagos o servicios reales.

No se añade inicialmente un servidor de mocks general como MSW. Los mocks de módulo existentes pueden mantenerse cuando representan una frontera estable, y la adopción de MSW deberá justificarse si la cantidad de interceptaciones repetidas demuestra una necesidad concreta.

### Adoptar una jerarquía explícita de queries

Las pruebas usarán `getByRole` con nombre, `getByLabelText`, texto visible y otras queries semánticas antes de recurrir a `data-testid`. Los selectores CSS y consultas de clases quedan fuera del patrón aceptado. Un `data-testid` será excepcional y deberá acompañarse de una razón local que explique por qué el elemento carece de semántica estable.

Esta decisión alinea la suite con la experiencia accesible. No se impondrá una prohibición ESLint inicial porque distinguir excepciones legítimas requiere contexto y una regla rígida generaría evasiones; la guía y los ejemplos de referencia serán la primera barrera.

### Priorizar contratos, no métricas globales de cobertura

La aceptación se basará en escenarios críticos y calidad de aserciones, no en un umbral porcentual. Se revisarán primero autenticación, protección de rutas y una acción importante disponible en la web. El login será el E2E inicial: solicitud de ruta protegida, redirección o presentación del acceso, envío de credenciales controladas y retorno a la ruta solicitada.

Los umbrales de coverage se descartan en esta fase porque incentivan tests triviales y no prueban por sí mismos contratos relevantes. Podrán añadirse más adelante por módulos de lógica crítica si existe una señal de riesgo concreta.

### Separar la suite rápida de E2E en automatización

`test:run` seguirá siendo la validación rápida no interactiva y se añadirá un comando E2E dedicado. CI ejecutará la suite rápida para cambios web y el E2E en un job con navegador y servidor controlados. Los artefactos diagnósticos se conservarán solo al fallar para limitar tiempo y almacenamiento.

Separar jobs evita que el feedback principal dependa de descargar o iniciar un navegador y permite reintentar únicamente la capa más costosa sin ocultar fallos unitarios.

## Risks / Trade-offs

- [El E2E con red interceptada puede divergir del backend real] → Mantener respuestas alineadas con contratos compartidos y reservar integraciones reales para validaciones específicas fuera de esta suite.
- [Los tests actuales usan mocks de módulos que podrían estar demasiado cerca de la implementación] → Migrar primero casos representativos y cambiar los restantes solo cuando se toquen o demuestren fragilidad.
- [Playwright aumenta dependencias, tiempo y requisitos de CI] → Limitar inicialmente la suite a recorridos críticos y separar su ejecución de la suite rápida.
- [Queries accesibles pueden revelar problemas de accesibilidad existentes] → Corregir nombres y relaciones accesibles como parte del caso afectado, sin sustituirlas por selectores estructurales.
- [Un entorno compartido demasiado configurable puede ocultar dependencias] → Mantener defaults mínimos y exigir opciones explícitas para estado, ruta o respuestas externas relevantes al escenario.

## Migration Plan

1. Documentar la matriz de niveles, queries preferidas, política de dobles y criterios para agregar E2E.
2. Ajustar las utilidades compartidas de Vitest y añadir pruebas de aislamiento para sus providers.
3. Auditar pruebas web existentes y migrar una muestra representativa de autenticación y features con mayor valor, sin reescribir casos correctos por estilo.
4. Incorporar Playwright, su servidor local controlado, scripts y exclusiones de artefactos generados.
5. Implementar el recorrido E2E inicial de login y retorno a ruta protegida con fronteras remotas controladas.
6. Integrar las suites en la validación automatizada de la web y documentar diagnóstico local.

El rollback elimina el job, configuración y dependencia E2E manteniendo intacta la suite Vitest. Las mejoras independientes realizadas a las pruebas de componente pueden conservarse.
