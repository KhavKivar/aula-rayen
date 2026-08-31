## Purpose

Define un contrato de pruebas mantenible para la aplicación web que proteja el comportamiento observable, las integraciones del frontend y sus recorridos críticos sin acoplar las verificaciones a detalles internos.

## ADDED Requirements

### Requirement: Cada comportamiento se verifica en el nivel de prueba apropiado
La aplicación web MUST verificar la lógica pura compleja con unit tests, el comportamiento React principalmente con pruebas de componente o integración y únicamente los recorridos de mayor impacto con pruebas E2E.

#### Scenario: Lógica pura con múltiples reglas
- **WHEN** una función pura contiene reglas de dominio, transformaciones o casos límite significativos
- **THEN** sus entradas, salidas y errores se verifican directamente mediante unit tests sin renderizar interfaz

#### Scenario: Interacción de una feature React
- **WHEN** una feature presenta datos, recibe acciones del usuario o coordina estados de carga, éxito y error
- **THEN** su contrato observable se verifica mediante una prueba de componente o integración

#### Scenario: Recorrido crítico entre páginas
- **WHEN** un recorrido crítico atraviesa navegación, autenticación o varias fronteras de la aplicación
- **THEN** se verifica con una prueba E2E ejecutada en una aplicación desplegada localmente y controlada

### Requirement: Las pruebas de interfaz expresan contratos de usuario
Las pruebas de componente, integración y E2E SHALL localizar e interactuar con la interfaz mediante semántica accesible o contenido visible siempre que exista una opción equivalente, y MUST afirmar resultados observables en lugar de estructura o implementación interna.

#### Scenario: Interacción con un formulario
- **WHEN** una prueba completa un campo o activa una acción con nombre accesible
- **THEN** utiliza su label, role y nombre visible para localizar el control

#### Scenario: Resultado de una acción
- **WHEN** el usuario envía una acción que puede completar o fallar
- **THEN** la prueba verifica el estado visible, mensaje, navegación o efecto externo que forma parte del contrato

#### Scenario: Selector semántico no disponible
- **WHEN** un elemento relevante no puede localizarse mediante role, label, texto u otra semántica accesible estable
- **THEN** la prueba puede usar un identificador específico documentando por qué no existe una consulta orientada al usuario

### Requirement: Los dobles de prueba respetan fronteras públicas
Las pruebas de la web MUST usar implementaciones reales dentro de la unidad funcional bajo prueba y SHALL sustituir solamente fronteras externas o efectos no deterministas necesarios para mantener aislamiento y repetibilidad.

#### Scenario: Feature compuesta por componentes y hooks propios
- **WHEN** una prueba verifica el comportamiento de una feature React
- **THEN** renderiza sus componentes hijos y ejecuta sus hooks reales en vez de sustituir cada detalle interno

#### Scenario: Dependencia externa no determinista
- **WHEN** la feature depende de red, autenticación externa, pagos, reloj u otra frontera no determinista
- **THEN** la prueba controla esa frontera mediante un doble con respuestas que representan contratos reales

#### Scenario: Verificación de una colaboración interna
- **WHEN** el resultado observable permite comprobar el contrato sin inspeccionar llamadas internas
- **THEN** la prueba no usa spies para afirmar cómo colaboraron las funciones internas

### Requirement: Las pruebas de componentes usan un entorno compartido representativo
La suite de componentes e integración MUST ofrecer utilidades compartidas que reproduzcan los providers requeridos por la aplicación, creen estado aislado por prueba y eviten que una ejecución altere otra.

#### Scenario: Render de componente con estado remoto
- **WHEN** una prueba renderiza un componente que consume el estado remoto de la aplicación
- **THEN** recibe un cliente aislado con reintentos desactivados y sin datos residuales de otras pruebas

#### Scenario: Feature que requiere providers adicionales
- **WHEN** una feature necesita routing u otro contexto global para funcionar
- **THEN** la utilidad compartida permite configurarlo sin que cada prueba reconstruya una versión incompatible del entorno

### Requirement: La autenticación crítica conserva su contrato observable
La web MUST verificar que el flujo de autenticación cubre validación, estado pendiente, error, éxito y retorno seguro a una ruta protegida solicitada.

#### Scenario: Credenciales inválidas en el formulario
- **WHEN** el usuario intenta ingresar con datos que no satisfacen la validación
- **THEN** ve mensajes accesibles y no se inicia una solicitud de autenticación

#### Scenario: Autenticación rechazada
- **WHEN** el servicio de autenticación rechaza credenciales válidamente formadas
- **THEN** el usuario ve un error y permanece fuera del contenido protegido

#### Scenario: Acceso a una ruta protegida después de autenticarse
- **WHEN** una persona no autenticada solicita una ruta protegida y completa el login correctamente
- **THEN** obtiene acceso y vuelve a la ruta protegida solicitada

### Requirement: Las suites forman parte de la validación automatizada de la web
La aplicación web MUST exponer comandos separados y no interactivos para pruebas unitarias/de componente y pruebas E2E, y la validación automatizada SHALL bloquear cambios cuando falle la suite correspondiente.

#### Scenario: Validación rápida de un cambio web
- **WHEN** se ejecuta la validación habitual de `apps/web`
- **THEN** todas las pruebas unitarias, de componente e integración terminan sin modo watch y reportan un código de salida fallido ante cualquier regresión

#### Scenario: Validación de recorridos críticos
- **WHEN** se ejecuta la validación E2E en su entorno configurado
- **THEN** la aplicación se inicia de forma controlada, se recorren los escenarios críticos y cualquier incumplimiento produce un código de salida fallido con evidencia diagnóstica
