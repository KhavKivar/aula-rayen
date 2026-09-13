## Purpose

Allow authenticated users to securely connect Google to an existing account while preserving protection against unsafe implicit same-email account linking.

## ADDED Requirements

### Requirement: Unlinked-account recovery guidance
The system SHALL explain how to recover when Google sign-in matches an existing account but cannot be linked implicitly, without weakening the account-linking security policy.

#### Scenario: Google sign-in encounters an unlinked account
- **WHEN** Google sign-in returns an `account_not_linked` outcome
- **THEN** the user is directed to sign in with the existing account's password
- **AND** the user is told that Google can be connected from the authenticated dashboard
- **AND** the system does not create another user or implicitly link the accounts

### Requirement: Google connection status
The system SHALL show an authenticated user whether a Google identity is connected to the current account.

#### Scenario: Google is not connected
- **WHEN** an authenticated user opens the dashboard and the account has no Google identity
- **THEN** the dashboard displays an action labeled "Conectar Google"

#### Scenario: Google is connected
- **WHEN** an authenticated user opens the dashboard and the account has a Google identity
- **THEN** the dashboard indicates that Google is connected
- **AND** the dashboard does not offer another Google connection action

#### Scenario: Connection status cannot be loaded
- **WHEN** the system cannot determine whether Google is connected
- **THEN** the dashboard communicates the failure accessibly
- **AND** the system does not claim that Google is connected or start a linking flow

### Requirement: Authenticated explicit linking
The system SHALL allow only an authenticated user to initiate an explicit Google account-linking flow for the current account.

#### Scenario: User initiates linking
- **WHEN** an authenticated user activates "Conectar Google"
- **THEN** the system starts an explicit Google linking flow bound to that user's active session
- **AND** duplicate initiations are prevented while the request is pending

#### Scenario: Unauthenticated access
- **WHEN** a user without an active session attempts to access the linking control
- **THEN** the system requires authentication before a Google linking flow can begin

### Requirement: Linking completion
The system SHALL return the user to the dashboard after the Google linking callback and SHALL reflect the resulting account state.

#### Scenario: Linking succeeds
- **WHEN** Google confirms the identity and the account-linking callback succeeds
- **THEN** the user returns to the authenticated dashboard
- **AND** the dashboard indicates that Google is connected

#### Scenario: Linking fails or is cancelled
- **WHEN** the Google linking flow fails or the user cancels it
- **THEN** the user can return to the dashboard without losing the existing session
- **AND** the dashboard communicates that Google was not connected
- **AND** the user can start a new linking attempt

#### Scenario: OAuth callback is reused
- **WHEN** an already-consumed or invalid OAuth callback state is received
- **THEN** the system rejects the callback
- **AND** the user is instructed to start a new linking attempt rather than retrying the callback URL

### Requirement: Account-linking security policy
The system MUST retain the requirement that implicit same-email linking needs a verified local email and MUST use explicit authenticated linking for an unverified local account.

#### Scenario: Unverified local account uses Google sign-in
- **WHEN** a Google identity matches an existing local account whose email is not verified and no Google identity is linked
- **THEN** the system rejects implicit linking
- **AND** the system preserves both accounts without changing ownership
