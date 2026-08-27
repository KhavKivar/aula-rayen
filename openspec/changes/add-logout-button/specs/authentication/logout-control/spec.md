## Purpose

Provide authenticated web users with a clear, accessible, and recoverable way to end their current session from the site navigation.

## ADDED Requirements

### Requirement: Logout control visibility
The system SHALL display a logout control labeled "Cerrar sesión" in the landing navigation when the user has an active session, and SHALL NOT display that control when the session is absent or still being resolved.

#### Scenario: Active session
- **WHEN** the landing navigation is rendered for a user with an active session
- **THEN** the navigation displays a control labeled "Cerrar sesión"

#### Scenario: No active session
- **WHEN** the landing navigation is rendered for a user without an active session
- **THEN** the navigation does not display the logout control

#### Scenario: Session is pending
- **WHEN** the user's session state is still being resolved
- **THEN** the navigation does not display an actionable logout control

### Requirement: Successful logout
The system SHALL end the active session when the user activates the logout control and SHALL present the public landing page in its signed-out state after logout succeeds.

#### Scenario: User logs out successfully
- **WHEN** an authenticated user activates "Cerrar sesión" and logout succeeds
- **THEN** the user's session is ended
- **AND** the user is on the public landing page
- **AND** the navigation displays the signed-out authentication actions instead of authenticated actions

### Requirement: Logout progress
The system SHALL prevent duplicate logout requests while logout is in progress and SHALL communicate the pending state accessibly.

#### Scenario: Logout request is pending
- **WHEN** the logout request has started but has not completed
- **THEN** the logout control cannot initiate another logout request
- **AND** the navigation communicates that logout is in progress

### Requirement: Logout failure recovery
The system SHALL preserve the user's authenticated state when logout fails and SHALL allow the user to retry the action.

#### Scenario: Logout request fails
- **WHEN** an authenticated user activates "Cerrar sesión" and logout fails
- **THEN** the user remains in the authenticated navigation state
- **AND** the logout control becomes actionable again
- **AND** the user receives accessible failure feedback
