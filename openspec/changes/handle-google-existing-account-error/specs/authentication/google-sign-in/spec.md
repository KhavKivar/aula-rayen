## Purpose

Provide safe and actionable feedback when Google sign-in cannot authenticate an identity whose email belongs to an existing unlinked account.

## ADDED Requirements

### Requirement: Existing-account conflict guidance
The system SHALL explain that an account already exists when Google sign-in returns an `account_not_linked` outcome and SHALL direct the user to authenticate with the existing email and password.

#### Scenario: Google email belongs to an existing password account
- **WHEN** Google sign-in returns `account_not_linked` to the login page
- **THEN** the login page displays "Ya existe una cuenta con este correo. Ingresa con tu correo y contraseña."
- **AND** the system does not create a duplicate account or implicitly link identities

### Requirement: Safe OAuth error presentation
The system SHALL accept only recognized OAuth error values for user-facing presentation and MUST NOT expose raw provider or callback details.

#### Scenario: Unknown OAuth error is returned
- **WHEN** the login page receives an OAuth error value that is not recognized
- **THEN** the login page displays a generic sign-in failure message
- **AND** the raw error value is not rendered

#### Scenario: Login page has no OAuth error
- **WHEN** the user opens the login page without an OAuth error
- **THEN** no OAuth error alert is displayed

### Requirement: Google sign-in remains available
The system SHALL continue to offer Google sign-in while account-linking controls remain absent from the authenticated dashboard.

#### Scenario: User opens the login page
- **WHEN** the login page is rendered
- **THEN** an action labeled "Continuar con Google" is available

#### Scenario: User opens the authenticated dashboard
- **WHEN** the dashboard is rendered for an authenticated user
- **THEN** no action to connect or link a Google account is displayed
