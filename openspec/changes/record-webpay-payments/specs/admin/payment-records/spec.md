## Purpose

El panel administrativo de Pagos muestra transacciones reales registradas cuando alguien paga, en vez de datos de demostración, sin cambiar el schema de la base de datos.

## ADDED Requirements

### Requirement: Authorized payments grant course access

When a payment gateway confirms an authorized payment with matching order and amount, the system SHALL record the completed payment and grant the buyer access to the course.

#### Scenario: Successful payment registers access
- **WHEN** the gateway confirms an authorized payment for a course with matching order and amount
- **THEN** the payment is marked completed with gateway details and the buyer gains access to the course

#### Scenario: Repeated confirmation is idempotent
- **WHEN** the gateway confirmation callback is received more than once for the same order
- **THEN** the buyer holds exactly one access grant and the payment stays completed

### Requirement: Rejected gateway responses are recorded without granting access

When the gateway returns a commit response that is not authorized, the system SHALL persist the attempt details on the existing payment record without completing it and without granting course access.

#### Scenario: Rejected payment appears in admin list
- **WHEN** the gateway responds with a non-authorized result for a known order
- **THEN** the payment appears in the admin list as rejected and the buyer has no access to the course

#### Scenario: Completed payments are never overwritten
- **WHEN** a new callback arrives for an already completed payment
- **THEN** the completed record and the access grant remain unchanged

### Requirement: Mismatched confirmations never grant access

When the gateway confirmation references a different order or a different amount than the recorded payment intent, the system SHALL NOT mark the payment completed and SHALL NOT grant course access.

#### Scenario: Amount mismatch
- **WHEN** the confirmed amount differs from the recorded intent amount
- **THEN** the payment is not completed and no access is granted

### Requirement: Admins can list real payments

Admin users SHALL be able to list recorded payments with order, buyer, course, amount, date, derived status (approved, pending, rejected), masked card, and authorization code when available.

#### Scenario: Payments list shows registered data
- **WHEN** an admin opens the Pagos section after real payment activity
- **THEN** the list, metrics, and filters operate over registered payments instead of demo fixtures

#### Scenario: Non-admin users cannot list payments
- **WHEN** a non-admin authenticated user requests the payments list
- **THEN** the system denies access

### Requirement: Card data is never fully exposed

The system SHALL never expose full card numbers through the payments list; only masked representations (last digits) may be shown.

#### Scenario: Masked card display
- **WHEN** an admin views a payment with card data
- **THEN** only a masked value is visible
