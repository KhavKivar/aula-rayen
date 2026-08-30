## Purpose

Permite a usuarios autenticados gestionar el catálogo de cursos directamente desde el dashboard, alternando entre la vista de consumo y un panel de administración simple y público hasta la introducción de roles.

## ADDED Requirements

### Requirement: Acceso autenticado al panel de gestión
El sistema SHALL requerir sesión autenticada para acceder a `/dashboard` y a todas las operaciones del panel de gestión; usuarios no autenticados MUST ser redirigidos a `/login`. Durante esta fase, cualquier usuario autenticado SHALL poder crear, editar y eliminar cursos (sin restricción de rol).

#### Scenario: Usuario autenticado accede al dashboard
- **WHEN** un usuario con sesión válida navega a `/dashboard`
- **THEN** ve el dashboard con las dos pestañas: "Ver cursos" y "Gestionar cursos"

#### Scenario: Usuario no autenticado intenta acceder
- **WHEN** un visitante sin sesión navega a `/dashboard`
- **THEN** es redirigido a `/login` con parámetro de retorno

#### Scenario: Usuario autenticado realiza operación CRUD
- **WHEN** un usuario autenticado envía `POST /courses`, `PATCH /courses/:id` o `DELETE /courses/:id` con payload válido
- **THEN** la operación se ejecuta sin exigir rol admin

### Requirement: Navegación por pestañas dentro del dashboard
El dashboard SHALL ofrecer dos pestañas persistentes: "Ver cursos" (catálogo existente) y "Gestionar cursos" (panel CRUD). El cambio de pestaña SHALL ser instantáneo, sin navegación a rutas distintas, preservando estado de sesión y con indicador visual y atributos accesibles.

#### Scenario: Cambio entre vistas
- **WHEN** el usuario hace clic en "Gestionar cursos"
- **THEN** el contenido cambia al panel de gestión y la pestaña activa se marca con `aria-selected="true"` y foco visible

#### Scenario: Estado por defecto
- **WHEN** el usuario entra a `/dashboard` por primera vez
- **THEN** la pestaña activa por defecto es "Ver cursos"

### Requirement: Listado y gestión de cursos
En la pestaña "Gestionar cursos" el sistema SHALL mostrar la lista completa de cursos en formato tabla/cards con columnas `título`, `descripción (truncada)`, `duración`, `precio`, `fecha de creación` y acciones `Editar` / `Eliminar`, más un botón primario "Crear curso". La vista SHALL reutilizar la fuente de datos del catálogo y reflejar mutaciones sin recarga manual.

#### Scenario: Listado inicial
- **WHEN** la pestaña de gestión se monta y la consulta de cursos resuelve
- **THEN** se renderiza cada curso con sus acciones; si no hay cursos se muestra estado vacío con CTA "Crear tu primer curso"

#### Scenario: Sincronización tras mutación
- **WHEN** una creación, edición o eliminación termina con éxito
- **THEN** la lista se invalida y vuelve a consultar el catálogo actualizado

### Requirement: Creación de curso
El sistema SHALL ofrecer un formulario modal o sección para crear cursos con campos `title`, `description`, `videoLink`, `fileLink`, `duration`, `price` validados en cliente con los schemas de `@aula-rayen/contracts` y mensajes en español. Al enviar, SHALL llamar a `POST /courses`; en éxito SHALL cerrar el formulario, mostrar toast de éxito y actualizar la lista.

#### Scenario: Creación exitosa
- **WHEN** el usuario completa todos los campos válidos y confirma "Crear"
- **THEN** la API responde `201` con el curso creado, el modal se cierra y aparece "Curso creado correctamente"

#### Scenario: Validación fallida
- **WHEN** el usuario deja `title` vacío o `videoLink` no es URL válida
- **THEN** el formulario muestra error inline en español y no envía la petición

#### Scenario: Error de servidor
- **WHEN** la creación falla por error de red o validación backend
- **THEN** se muestra mensaje de error no bloqueante y el formulario permanece abierto con datos preservados

### Requirement: Edición de curso
El sistema SHALL permitir editar cualquier curso existente precargando sus valores actuales en el mismo formulario reutilizado para creación. Al confirmar SHALL enviar `PATCH /courses/:id` con solo los campos modificados (validado con `updateCourseRequestSchema` que exige al menos un campo). En éxito SHALL actualizar la lista y mostrar confirmación.

#### Scenario: Edición exitosa
- **WHEN** el usuario modifica `price` de un curso y guarda
- **THEN** la API responde con el curso actualizado y la tabla refleja el nuevo precio inmediatamente

#### Scenario: Sin cambios
- **WHEN** el usuario abre edición y guarda sin modificar ningún campo
- **THEN** el cliente muestra validación "Debes enviar al menos un campo para actualizar" y no llama a la API

### Requirement: Eliminación con confirmación
El sistema SHALL requerir confirmación explícita antes de eliminar. Al pulsar "Eliminar" SHALL abrir un modal de confirmación con nombre del curso y advertencia irreversible; solo al confirmar SHALL ejecutar `DELETE /courses/:id`. Durante la operación el botón SHALL mostrar estado de carga y estar deshabilitado.

#### Scenario: Eliminación confirmada
- **WHEN** el usuario confirma la eliminación en el modal
- **THEN** se ejecuta el DELETE, al éxito se cierra el modal, se muestra "Curso eliminado correctamente" y el curso desaparece de la lista

#### Scenario: Eliminación cancelada
- **WHEN** el usuario pulsa "Cancelar" o cierra el modal
- **THEN** no se realiza ninguna petición y el curso permanece en la lista

#### Scenario: Error al eliminar
- **WHEN** el DELETE falla
- **THEN** el modal permanece abierto, se muestra error "No se pudo eliminar el curso" y el usuario puede reintentar

### Requirement: Manejo de errores y estados de carga
Todas las vistas SHALL manejar estados `pending`, `error` y `empty` con mensajes en español y accesibilidad (`role="status"` / `role="alert"`). Los botones de mutación SHALL deshabilitarse durante la operación y restaurar su estado al finalizar.

#### Scenario: Carga del listado falla
- **WHEN** la consulta del catálogo falla
- **THEN** se muestra alerta "No fue posible cargar los cursos. Inténtalo nuevamente." con opción de reintentar

#### Scenario: Mutación en curso
- **WHEN** se está creando o actualizando un curso
- **THEN** el botón de envío muestra spinner y texto "Guardando..." y no permite doble envío

### Requirement: Consistencia visual y accesibilidad
El panel SHALL reutilizar el sistema de diseño existente (Tailwind, shadcn, lucide-react) y mantener contraste, foco visible y navegación por teclado. Todos los labels, placeholders y mensajes SHALL estar en español.

#### Scenario: Navegación por teclado
- **WHEN** el usuario navega con Tab entre pestañas y acciones
- **THEN** cada elemento enfocable tiene `focus-ring` visible y orden lógico

