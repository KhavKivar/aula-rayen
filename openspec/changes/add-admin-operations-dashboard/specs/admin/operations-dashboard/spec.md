## Purpose

Define una experiencia administrativa navegable para gestionar cursos y consultar compradores y pagos, permitiendo validar sus flujos antes de integrar datos comerciales reales y autorización backend.

## ADDED Requirements

### Requirement: Acceso visual exclusivo para administradores
El sistema SHALL mostrar el acceso al panel administrativo únicamente a sesiones autenticadas cuyo rol sea `admin`. Un usuario autenticado sin ese rol MUST permanecer en el dashboard de alumno y MUST NOT ver enlaces ni contenido administrativo. Esta restricción SHALL considerarse una barrera de presentación y no una garantía de autorización backend.

#### Scenario: Administrador abre el panel
- **WHEN** una sesión autenticada con rol `admin` navega a `/dashboard/admin`
- **THEN** el sistema muestra el panel administrativo y su navegación principal

#### Scenario: Usuario normal intenta abrir el panel
- **WHEN** una sesión autenticada sin rol `admin` navega directamente a `/dashboard/admin` o una ruta hija
- **THEN** el sistema la redirige a `/dashboard` sin renderizar contenido administrativo

#### Scenario: Usuario normal abre su dashboard
- **WHEN** una sesión autenticada sin rol `admin` navega a `/dashboard`
- **THEN** el sistema muestra el catálogo del alumno sin la pestaña "Gestionar cursos" ni un enlace al panel administrativo

### Requirement: Navegación administrativa adaptable
El panel SHALL ofrecer navegación hacia "Cursos" y "Pagos", indicar la sección activa y mantener acceso a la cuenta y al dashboard del alumno. En escritorio SHALL usar una navegación lateral persistente; en pantallas pequeñas SHALL usar un control compacto que no provoque desbordamiento horizontal.

#### Scenario: Cambio de sección en escritorio
- **WHEN** el administrador selecciona "Pagos" desde la navegación lateral
- **THEN** el sistema navega a la sección de pagos, marca el enlace activo y conserva el marco administrativo

#### Scenario: Navegación en móvil
- **WHEN** el panel se visualiza en un viewport móvil
- **THEN** ambas secciones siguen siendo accesibles mediante navegación compacta y el contenido se adapta sin scroll horizontal de página

#### Scenario: Entrada a la raíz administrativa
- **WHEN** el administrador navega a `/dashboard/admin`
- **THEN** el sistema abre "Cursos" como sección inicial

### Requirement: Gestión administrativa de cursos y compradores
La sección "Cursos" SHALL conservar las operaciones existentes para listar, crear, editar y eliminar cursos. Cada curso SHALL ofrecer además una acción "Ver compradores" que abra una vista con nombre, correo, fecha de compra, estado del pago e identificador de orden obtenidos desde datos mock.

#### Scenario: Administrador gestiona cursos
- **WHEN** el administrador abre la sección "Cursos"
- **THEN** puede usar los flujos existentes de creación, edición y eliminación sin perder las acciones administrativas adicionales

#### Scenario: Consulta de compradores
- **WHEN** el administrador selecciona "Ver compradores" para un curso con ventas simuladas
- **THEN** el sistema muestra únicamente los compradores asociados a ese curso y permite buscar por nombre o correo

#### Scenario: Curso sin compradores
- **WHEN** el administrador consulta compradores de un curso sin ventas simuladas
- **THEN** el sistema muestra un estado vacío que identifica el curso y explica que todavía no registra compras

### Requirement: Consulta y exploración de pagos
La sección "Pagos" SHALL presentar indicadores resumidos y una tabla de transacciones mock con identificador de orden, comprador, curso, monto en CLP, fecha y estado. El administrador SHALL poder buscar, filtrar por estado y rango temporal, limpiar los filtros y abrir el detalle de una transacción.

#### Scenario: Resumen inicial de pagos
- **WHEN** el administrador abre la sección "Pagos"
- **THEN** ve el monto aprobado, el total de transacciones y conteos por estado calculados desde el conjunto mock visible

#### Scenario: Filtrado de transacciones
- **WHEN** el administrador busca por comprador u orden y selecciona el estado "Aprobado"
- **THEN** la tabla y sus indicadores muestran solo las transacciones que cumplen ambos criterios

#### Scenario: Sin resultados de pago
- **WHEN** ninguna transacción coincide con los filtros activos
- **THEN** el sistema muestra un estado sin resultados y una acción para limpiar los filtros

#### Scenario: Detalle de transacción
- **WHEN** el administrador abre una transacción
- **THEN** el sistema muestra en un panel o diálogo sus datos completos, incluidos curso, comprador, monto, estado, fecha, medio de pago enmascarado y código de autorización cuando exista

### Requirement: Naturaleza demostrativa de los datos
Las vistas nuevas de compradores y pagos SHALL identificar claramente que usan datos de demostración. Los filtros y la exploración MUST NOT ejecutar peticiones de escritura ni alterar datos reales, y los datos SHALL volver al conjunto inicial al recargar.

#### Scenario: Administrador explora datos simulados
- **WHEN** el administrador filtra compradores o pagos y abre un detalle
- **THEN** el sistema actualiza únicamente la presentación local sin escribir datos

#### Scenario: Recarga de la aplicación
- **WHEN** el administrador recarga la página después de filtrar datos simulados
- **THEN** compradores y pagos vuelven al conjunto inicial de demostración

### Requirement: Estados y accesibilidad del panel
Todas las secciones SHALL ofrecer estados inicial, vacío y sin resultados representativos, mensajes visibles en español, navegación completa por teclado, foco visible, nombres accesibles para controles y anuncios de feedback mediante regiones de estado apropiadas.

#### Scenario: Uso solo con teclado
- **WHEN** el administrador recorre navegación, filtros, tablas y diálogos usando el teclado
- **THEN** puede activar todos los flujos en orden lógico, identificar el foco actual y devolver el foco al control de origen al cerrar una superposición

#### Scenario: Feedback de una interacción
- **WHEN** una interacción termina o una consulta no presenta resultados
- **THEN** el sistema comunica el resultado mediante un mensaje visible y una región accesible de estado o alerta
