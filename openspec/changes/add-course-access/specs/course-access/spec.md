## Purpose

Permite que cada usuario vea qué cursos ha adquirido y consuma únicamente el contenido que le pertenece.

## ADDED Requirements

### Requirement: Catálogo muestra el estado de acceso del usuario

El sistema SHALL entregar al usuario autenticado el catálogo de cursos junto con un indicador de acceso para cada curso, calculado desde sus compras registradas.

#### Scenario: Usuario con un curso adquirido

- **WHEN** un usuario autenticado solicita su catálogo y tiene una compra registrada para un curso
- **THEN** la respuesta marca ese curso como accesible y conserva sus datos de catálogo

#### Scenario: Usuario sin compra del curso

- **WHEN** un usuario autenticado solicita su catálogo y no tiene una compra registrada para un curso
- **THEN** la respuesta marca ese curso como no accesible

### Requirement: Catálogo ofrece la acción adecuada para cada curso

El sistema SHALL mostrar “Ver curso” para un curso accesible y “Pagar con Webpay” para un curso no accesible.

#### Scenario: Curso adquirido en el catálogo

- **WHEN** el catálogo recibe un curso marcado como accesible
- **THEN** muestra una acción para abrir el contenido del curso en lugar de iniciar otro pago

#### Scenario: Curso no adquirido en el catálogo

- **WHEN** el catálogo recibe un curso marcado como no accesible
- **THEN** conserva la acción para iniciar el pago con Webpay

### Requirement: Contenido de curso protegido por compra

El sistema SHALL entregar y mostrar el contenido de un curso únicamente si el usuario autenticado tiene una compra registrada para ese curso.

#### Scenario: Acceso autorizado al curso

- **WHEN** un usuario con una compra registrada abre un curso
- **THEN** recibe el título, video y material del curso y puede consumirlos en la vista del curso

#### Scenario: Acceso no autorizado al curso

- **WHEN** un usuario sin una compra registrada solicita el contenido de un curso
- **THEN** el sistema rechaza la solicitud y no expone los enlaces de contenido
