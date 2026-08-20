## Purpose

Proporcionar una portada comercial pública que permita a profesionales de la psicología comprender, evaluar y explorar los cursos de talleres facilitados por Elena Montes.

## ADDED Requirements

### Requirement: Propuesta profesional clara
La landing SHALL comunicar en su primera vista que los cursos están dirigidos inicialmente a profesionales de la psicología y que enseñan a facilitar talleres mediante formación, dinámicas y materiales listos para usar.

#### Scenario: Primera visita desde escritorio o móvil
- **WHEN** una persona abre la ruta pública principal
- **THEN** visualiza el nombre o marca, la propuesta de valor profesional y una acción para explorar los cursos sin necesidad de autenticarse

### Requirement: Navegación por el contenido comercial
La landing SHALL proporcionar navegación hacia las secciones principales y SHALL mantener accesibles las rutas existentes para iniciar sesión y crear una cuenta.

#### Scenario: Navegación a una sección
- **WHEN** la persona activa un enlace a cursos, metodología, Elena o preguntas frecuentes
- **THEN** llega a la sección correspondiente de la misma página

#### Scenario: Acceso de usuario existente
- **WHEN** la persona activa la acción de inicio de sesión o registro
- **THEN** navega a la ruta de autenticación correspondiente

### Requirement: Catálogo inicial de cursos
La landing SHALL mostrar una colección de cursos con título, temática, público profesional, resumen, contenido incluido, estado de disponibilidad y acción asociada.

#### Scenario: Curso disponible
- **WHEN** un curso publicado dispone de un destino de adquisición o información
- **THEN** su tarjeta muestra una acción habilitada que conduce a ese destino

#### Scenario: Curso aún no disponible
- **WHEN** un curso no dispone de un destino válido
- **THEN** su tarjeta comunica que estará disponible próximamente y no presenta un enlace de compra roto

### Requirement: Contenido del producto
La landing SHALL explicar que cada oferta puede incluir formación para el facilitador, una dinámica paso a paso y un kit de materiales, y SHALL distinguir claramente cuáles de esos elementos están incluidos en cada curso.

#### Scenario: Evaluación de un curso
- **WHEN** la persona revisa la información de un curso
- **THEN** puede determinar qué aprenderá, qué recursos recibirá y cómo podrá utilizarlos profesionalmente

### Requirement: Condiciones de uso de materiales
La landing SHALL resumir que la licencia permite al comprador utilizar repetidamente los materiales en su propia práctica profesional y realizar adaptaciones limitadas, pero prohíbe revender o redistribuir los archivos originales.

#### Scenario: Consulta de la licencia
- **WHEN** la persona revisa las condiciones o preguntas frecuentes
- **THEN** encuentra el alcance general del uso permitido y las restricciones antes de avanzar a la adquisición

### Requirement: Presentación verificable de Elena
La landing SHALL presentar la trayectoria profesional de Elena usando únicamente información aprobada por ella y SHALL separar sus credenciales profesionales de cualquier afirmación comercial sobre resultados de los cursos.

#### Scenario: Revisión de la autora
- **WHEN** la persona consulta la sección sobre Elena
- **THEN** encuentra su nombre, profesión, formación pertinente, áreas de experiencia y enfoque como tallerista

### Requirement: Evidencia editorial de talleres
La landing SHALL poder mostrar una selección editorial de evidencia visual de talleres realizados y SHALL atribuirla al perfil profesional de Instagram de Elena sin depender de la disponibilidad de un feed automático.

#### Scenario: Evidencia aprobada disponible
- **WHEN** existen publicaciones o imágenes aprobadas para uso comercial
- **THEN** la landing muestra una selección con contexto y un enlace al perfil original de Instagram

#### Scenario: Evidencia aún no aprobada
- **WHEN** no existen recursos aprobados para publicación
- **THEN** la sección no inventa métricas, testimonios ni resultados y ofrece como máximo un enlace al perfil profesional

### Requirement: Llamados a la acción confiables
La landing SHALL ofrecer acciones claras para explorar cursos y avanzar hacia un destino configurable, sin presentar la navegación externa como un checkout propio de La plataforma.

#### Scenario: Destino externo
- **WHEN** la persona activa una acción cuyo destino pertenece a otro servicio
- **THEN** se informa de forma comprensible que continuará fuera de La plataforma

### Requirement: Experiencia adaptable y accesible
La landing SHALL conservar jerarquía, legibilidad, navegación por teclado, foco visible, textos alternativos útiles y controles operables en tamaños de pantalla móviles y de escritorio.

#### Scenario: Uso con teclado
- **WHEN** una persona recorre la página sin utilizar un puntero
- **THEN** puede alcanzar y activar todos los enlaces y controles interactivos en un orden comprensible

#### Scenario: Visualización móvil
- **WHEN** la página se visualiza en una pantalla móvil común
- **THEN** el contenido no produce desplazamiento horizontal y las acciones principales permanecen legibles y operables

### Requirement: Identidad y descubrimiento
La landing SHALL declarar el idioma español y SHALL proporcionar título, descripción y datos de vista previa social coherentes con los cursos profesionales de Elena.

#### Scenario: Vista previa del enlace
- **WHEN** un servicio compatible genera una vista previa de la URL pública
- **THEN** recibe un título, una descripción y una imagen configurada que identifican correctamente la oferta

