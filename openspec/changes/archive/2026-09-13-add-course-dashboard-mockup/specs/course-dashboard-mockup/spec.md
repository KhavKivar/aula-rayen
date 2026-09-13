## Purpose

Define la experiencia visual mediante la cual una persona autenticada descubre los cursos disponibles y reconoce una opción simulada de pago con Webpay.

## ADDED Requirements

### Requirement: Dashboard posterior al inicio de sesión
El frontend SHALL mostrar el dashboard de cursos como destino de una persona que complete correctamente el flujo de inicio de sesión existente.

#### Scenario: Inicio de sesión exitoso
- **WHEN** una persona completa correctamente el inicio de sesión
- **THEN** el frontend muestra el dashboard de cursos

### Requirement: Catálogo visual de cursos disponibles
El dashboard SHALL presentar una colección de cursos de demostración, y cada curso SHALL mostrar como mínimo su título, una descripción breve y su precio visible en pesos chilenos.

#### Scenario: Hay cursos de demostración
- **WHEN** la persona abre el dashboard y el conjunto local contiene cursos
- **THEN** ve una tarjeta por curso con título, descripción breve y precio

#### Scenario: No hay cursos de demostración
- **WHEN** la persona abre el dashboard y el conjunto local está vacío
- **THEN** ve un estado vacío en español que informa que no hay cursos disponibles

### Requirement: Acción Webpay simulada
Cada curso SHALL incluir un control visible y accesible etiquetado para pagar con Webpay. Al activarlo, la interfaz SHALL comunicar que se trata de una demostración y MUST NOT crear órdenes, realizar solicitudes de pago ni redirigir a un proveedor externo.

#### Scenario: Activar pago de demostración
- **WHEN** la persona activa el control Webpay de un curso
- **THEN** la interfaz muestra una confirmación visual de demostración asociada al curso seleccionado
- **AND** no inicia una transacción ni abandona la aplicación

#### Scenario: Navegación mediante teclado
- **WHEN** la persona recorre los controles del catálogo utilizando el teclado
- **THEN** cada acción Webpay puede recibir foco y activarse sin usar un puntero

### Requirement: Presentación adaptable
El dashboard SHALL mantener legibles el contenido del curso y su acción Webpay tanto en pantallas móviles como de escritorio, sin desbordamiento horizontal de la página.

#### Scenario: Visualización móvil
- **WHEN** la persona abre el dashboard en un viewport móvil
- **THEN** las tarjetas se reorganizan para conservar contenido y acciones visibles sin desplazamiento horizontal

#### Scenario: Visualización de escritorio
- **WHEN** la persona abre el dashboard en un viewport de escritorio
- **THEN** las tarjetas aprovechan el ancho disponible en una cuadrícula legible
