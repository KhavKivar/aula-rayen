## Context

El frontend actual compone `CourseDashboard` en `/dashboard` y alterna localmente entre catálogo y `CourseManagementPanel`. Ese panel ya ejecuta CRUD real mediante las APIs existentes. Better Auth ya incluye el plugin admin en API y cliente, y la sesión puede distinguir el rol, pero la gestión de cursos backend continúa abierta a cualquier usuario autenticado. También existen sesiones Webpay y relaciones de compras en la base de datos, aunque no hay UI administrativa ni contratos frontend para consultarlas.

La aplicación sigue la frontera `shared → features → routes`: las rutas deben componer features y los features no deben importar internals de otros features. Ver `proposal.md` para la motivación y `specs/admin/operations-dashboard/spec.md` para el comportamiento observable.

## Goals / Non-Goals

**Goals:**
- Separar la experiencia del alumno de la experiencia administrativa sin duplicar el guard de sesión ni el marco de cuenta.
- Integrar el CRUD de cursos existente dentro de una arquitectura de información capaz de crecer hacia compradores y pagos.
- Mantener los prototipos nuevos deterministas, tipados, accesibles y fáciles de sustituir por consultas reales.
- Probar la composición en rutas, escritorio y móvil sin introducir dependencias nuevas.

**Non-Goals:**
- Añadir autorización admin a controladores o endpoints existentes.
- Crear endpoints, contratos compartidos, tablas o migraciones para pagos o compradores.
- Implementar conciliación, reembolsos, exportaciones o notificaciones.
- Rediseñar el catálogo y consumo de cursos del alumno.

## Decisions

### 1. Usar rutas administrativas anidadas en lugar de más tabs locales

Se creará `/dashboard/admin` como layout protegido de presentación, con rutas hijas `/dashboard/admin/courses` y `/dashboard/admin/payments`; la raíz redirigirá a cursos. El layout comprobará la sesión y el rol `admin`, mostrará el shell y renderizará el contenido hijo. `/dashboard` volverá a ser exclusivamente el espacio del alumno.

Esto da URLs enlazables, conserva filtros al usar historial del navegador y evita que un componente monolítico monte todas las tablas. La alternativa de añadir más tabs a `CourseDashboard` se rechaza porque mezcla responsabilidades de alumno y administrador, y escala mal en móvil.

La comprobación de rol es intencionalmente una barrera de UI. No se presentará como seguridad: el CRUD backend existente seguirá requiriendo un cambio separado de RBAC antes de manejar datos administrativos sensibles.

### 2. Componer features desde las rutas

Se introducirá un feature `admin-dashboard` para el shell, modelos mock y módulos administrativos nuevos. `CourseManagementPanel` expondrá un callback opcional para la acción "Ver compradores"; la ruta de cursos conectará ese callback con la vista mock y compondrá ambos elementos sin hacer que `course-management` importe el nuevo feature. La ruta de pagos renderizará su sección desde `admin-dashboard`.

Esto mantiene la regla `shared → features → routes`. La alternativa de importar `CourseManagementPanel` desde otro feature se rechaza por crear acoplamiento lateral y contradecir las zonas ESLint existentes.

### 3. Mantener el CRUD real existente y simular solo capacidades nuevas

`CourseManagementPanel` conservará sus consultas y mutaciones reales. Compradores y pagos usarán fixtures tipados locales; no llamarán a `GET /webpay`, a repositorios de cursos ni a nuevos endpoints. La UI mostrará una etiqueta persistente "Datos de demostración" en esas vistas.

Esta frontera evita degradar una función ya terminada y cumple el alcance UI para las nuevas áreas. La alternativa de reemplazar también el CRUD de cursos por mocks se rechaza porque rompería comportamiento existente sin aportar valor a la validación visual.

### 4. Fixtures inmutables y selectores puros

Compradores y pagos serán de solo lectura y se obtendrán desde fixtures inmutables. Selectores puros calcularán filtros, totales y relaciones por curso sin duplicar estado. No se usará un proveedor global, `localStorage`, cookies ni llamadas de red.

La alternativa de TanStack Query con mocks se rechaza porque representaría falsamente datos remotos y añadiría complejidad de cache innecesaria.

### 5. Diseñar tablas responsivas con detalle progresivo

En escritorio se usarán tablas semánticas con acciones por fila. En móvil, cada registro se mostrará como tarjeta etiquetada, mientras los detalles usarán las primitivas de diálogo ya disponibles.

Esta decisión conserva legibilidad y evita tablas comprimidas o scroll horizontal de página.

### 6. Definir un vocabulario visual consistente para estados

Pagos usarán `approved`, `pending` y `rejected`, presentados como "Aprobado", "Pendiente" y "Rechazado". Los modelos mantendrán valores internos en inglés y todo texto visible estará en español.

Los estados se representarán con texto e icono además de color. Esto permite fixtures consistentes y accesibles, y evita que cada componente invente variantes incompatibles.

## Risks / Trade-offs

- [El guard visual puede confundirse con autorización real] → Mostrar la limitación en documentación y no conectar datos administrativos sensibles hasta proteger los endpoints por rol.
- [El CRUD real de cursos convive con módulos mock] → Etiquetar solo las áreas simuladas y describir explícitamente qué acciones persisten.
- [Fixtures de pagos y compradores pueden divergir entre sí] → Generarlos desde un conjunto compartido de transacciones mock con identificadores estables.
- [Mover la gestión cambia hábitos de usuarios autenticados actuales] → Mantener `/dashboard` intacto para consumo, ofrecer enlace admin solo por rol y cubrir redirecciones con pruebas de ruta.
- [Componentes densos degradan la experiencia móvil] → Definir representaciones de tarjeta y probar viewports estrechos sin scroll horizontal de página.

## Migration Plan

1. Añadir fixtures, modelos y selectores del feature administrativo con pruebas puras.
2. Crear el layout y las rutas hijas admin con comprobación visual de rol y navegación responsiva.
3. Mover la composición de `CourseManagementPanel` desde el dashboard general a la ruta admin de cursos y añadir compradores mock.
4. Implementar pagos mock con métricas, filtros, tabla/tarjetas y detalle.
5. Validar accesibilidad, rutas, responsive, lint, tipos, pruebas y build del frontend.

Rollback: retirar las rutas y el feature administrativo, y restaurar la composición anterior de `CourseManagementPanel` en `CourseDashboard`; no se requiere migración de datos porque los módulos nuevos no persisten información.
