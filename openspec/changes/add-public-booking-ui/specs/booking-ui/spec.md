## Purpose

Interfaz pública de reserva de sesiones: permite a una visita autenticada
seleccionar una modalidad online, fecha y hora desde la página `/reservar`, con
datos mock mientras la integración con la API de booking/availability y Webpay
queda para cambios posteriores.

## ADDED Requirements

### Requirement: Acceso con sesión a /reservar
La ruta `/reservar` SHALL requerir una sesión activa: si no hay sesión, el
usuario DEBE ser redirigido a `/login` con el parámetro `redirect=/reservar`
para volver al flujo después de autenticarse.

#### Scenario: Visitante sin sesión
- **WHEN** un visitante sin sesión navega a `/reservar`
- **THEN** es redirigido a `/login?redirect=/reservar`

#### Scenario: Usuario autenticado
- **WHEN** un usuario autenticado navega a `/reservar`
- **THEN** ve la página de reserva sin redirección

### Requirement:Selección de modalidad
La página SHALL presentar la modalidad de atención "Online" como única
modalidad disponible y seleccionada por defecto.

#### Scenario: Modalidad única disponible
- **WHEN** el usuario ve la página de reserva
- **THEN** solo ve la opción "Online" y está seleccionada por defecto

### Requirement: Picker de sesión con datos mock
La página SHALL permitir elegir una fecha y una hora entre slots de
disponibilidad provistos por fixtures locales con el mismo shape que
`availabilitySlotResponseSchema` (solo slots con estado `available`). No DEBE
realizar llamadas al backend.

#### Scenario: Seleccionar fecha y hora
- **WHEN** el usuario selecciona una fecha con slots disponibles
- **THEN** se muestran solo los horarios `available` de esa fecha y el usuario
  puede seleccionar uno

#### Scenario: Fecha sin slots disponibles
- **WHEN** el usuario selecciona una fecha sin slots `available`
- **THEN** el grid de horas muestra un estado vacío coherente y no permite
  seleccionar ninguna hora

### Requirement: Resumen de selección
La página SHALL mostrar un resumen con la modalidad, la fecha/hora
seleccionadas y un precio placeholder, actualizado a medida que el usuario
selecciona.

#### Scenario: Resumen actualizado
- **WHEN** el usuario selecciona un slot
- **THEN** el resumen muestra modalidad "Online", la fecha y hora del slot y
  el precio placeholder

#### Scenario: Sin selección completa
- **WHEN** el usuario no ha seleccionado fecha y hora todavía
- **THEN** el resumen muestra estados placeholder y el botón de pago no está
  disponible

### Requirement: Pago en estado placeholder
El botón "Pagar con Webpay" SHALL estar deshabilitado mientras no exista
integración de pago, sin iniciar ninguna transacción real.

#### Scenario: Botón deshabilitado
- **WHEN** el usuario completa la selección de slot
- **THEN** el botón "Pagar con Webpay" permanece deshabilitado y no se
  realiza ninguna petición de pago

### Requirement: Entrada desde la landing
La sección CTA de la landing (`#agenda`) SHALL incluir un acceso a la página
`/reservar` manteniendo WhatsApp e Instagram como canales alternativos.

#### Scenario: Link desde el CTA
- **WHEN** el usuario está en la landing y va a la sección agenda
- **THEN** puede acceder a `/reservar` junto a los enlaces de WhatsApp e
  Instagram
