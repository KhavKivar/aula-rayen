## 1. Modelos y datos de demostración

- [x] 1.1 Crear la estructura del feature `admin-dashboard`, añadir su zona ESLint y definir tipos estrictos para compradores, transacciones, estados y filtros.
- [x] 1.2 Crear fixtures coherentes de transacciones y derivar desde ellos los compradores por curso, incluidos escenarios con resultados y colecciones vacías.
- [x] 1.3 Añadir pruebas unitarias de fixtures, selectores, totales y filtros.

## 2. Rutas, acceso visual y shell administrativo

- [x] 2.1 Crear el layout `/dashboard/admin` y las rutas hijas `courses` y `payments`, con redirección de la raíz administrativa a cursos.
- [x] 2.2 Implementar la comprobación de sesión y rol para ocultar el acceso a usuarios normales y redirigir deep links a `/dashboard`, documentando en código que no sustituye autorización backend.
- [x] 2.3 Crear el shell administrativo con identidad Aula Rayen, cuenta, enlace al dashboard del alumno, navegación lateral de escritorio y navegación compacta móvil con indicador de ruta activa.
- [x] 2.4 Añadir pruebas de rutas para administrador, usuario normal, redirección inicial y persistencia del shell al cambiar de sección.

## 3. Cursos y compradores

- [x] 3.1 Retirar las tabs y la composición de `CourseManagementPanel` desde `CourseDashboard`, conservando el catálogo y sus estados de carga/error para el alumno.
- [x] 3.2 Extender `CourseManagementPanel` con un callback opcional y una acción accesible "Ver compradores" por curso, sin importar internals del feature administrativo.
- [x] 3.3 Componer el CRUD real de cursos en la ruta admin y crear la vista de compradores mock con búsqueda por nombre/correo, datos de compra y estado vacío por curso.
- [x] 3.4 Añadir pruebas que cubran el dashboard simplificado, el CRUD preservado, la apertura/cierre de compradores, la búsqueda y el curso sin ventas.

## 4. Pagos de demostración

- [x] 4.1 Crear indicadores de monto aprobado, total y conteos por estado, calculados desde el conjunto filtrado y formateados en CLP/es-CL.
- [x] 4.2 Implementar búsqueda por comprador u orden, filtros de estado y rango temporal, limpieza de filtros y estado sin resultados.
- [x] 4.3 Implementar tabla semántica en escritorio, tarjetas en móvil y detalle accesible con medio de pago enmascarado y código de autorización opcional.
- [x] 4.4 Añadir pruebas de métricas, combinación de filtros, limpieza, estado vacío, detalle y etiqueta persistente "Datos de demostración".

## 5. Responsive, accesibilidad y validación

- [x] 5.1 Verificar representaciones de tabla y tarjeta en viewports de escritorio y móvil, corrigiendo cualquier desbordamiento horizontal de página.
- [x] 5.2 Verificar navegación por teclado, foco visible y restaurado, labels, encabezados, estados expresados sin depender solo de color y regiones `status`/`alert`.
- [x] 5.3 Ejecutar `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run` y `pnpm build` desde `apps/web` y corregir los hallazgos.
- [ ] 5.4 Realizar QA manual con sesiones admin y user: rutas y redirecciones, CRUD real de cursos y compradores/pagos mock.
