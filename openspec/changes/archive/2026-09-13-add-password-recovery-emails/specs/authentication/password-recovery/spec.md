## Purpose

Provide users with a secure, private, and reliable email flow for replacing a forgotten password and regaining access to their account.

## ADDED Requirements

### Requirement: Password reset request
The system SHALL allow a user to request a password reset by submitting a valid email address from the login experience.

#### Scenario: User opens password recovery
- **WHEN** a user activates "¿La olvidaste?" from the login form
- **THEN** the system displays a password-recovery form that requests an email address

#### Scenario: Valid request is submitted
- **WHEN** a user submits a syntactically valid email address
- **THEN** the system accepts the request once
- **AND** the form prevents duplicate submissions while the request is pending

#### Scenario: Invalid email is submitted
- **WHEN** a user submits an invalid email address
- **THEN** the system displays an accessible validation error
- **AND** no password-reset request is sent

### Requirement: Account enumeration protection
The system MUST NOT reveal whether a submitted password-recovery email belongs to an account.

#### Scenario: Registered email is submitted
- **WHEN** a password reset is requested for a registered email
- **THEN** the system displays a generic confirmation that reset instructions will arrive if an account exists

#### Scenario: Unregistered email is submitted
- **WHEN** a password reset is requested for an unregistered email
- **THEN** the system displays the same generic confirmation used for a registered email
- **AND** the system does not send an email

### Requirement: Reset email delivery
The system SHALL send a Spanish password-reset email to a registered address using the configured verified sender and SHALL include a single-use reset link.

#### Scenario: Reset email is sent
- **WHEN** a valid reset request is accepted for a registered credential account
- **THEN** the email identifies Aula Rayen as the sender
- **AND** the email explains that the request can be ignored if the recipient did not initiate it
- **AND** the email includes a link to the password-reset page
- **AND** the email includes both HTML and plain-text content

#### Scenario: Delivery provider rejects the email
- **WHEN** the email provider does not accept the reset email
- **THEN** the failure is recorded for operators without exposing the reset token or account details in client responses
- **AND** the requester still receives the generic confirmation

### Requirement: Reset token security
The system SHALL issue reset links that expire after one hour and MUST reject invalid, expired, or previously used tokens.

#### Scenario: Valid token is opened
- **WHEN** a user opens an unused reset link before it expires
- **THEN** the system displays the new-password form

#### Scenario: Invalid or expired token is opened
- **WHEN** a reset link has an invalid or expired token
- **THEN** the system does not display an actionable password-reset form
- **AND** the user receives accessible guidance to request a new link

#### Scenario: Used token is submitted again
- **WHEN** a token that already completed a password reset is submitted again
- **THEN** the system rejects the reset
- **AND** the user is instructed to request a new link

### Requirement: New password validation
The system SHALL require a new password of at least eight characters and matching password confirmation before submitting the reset.

#### Scenario: Password is too short
- **WHEN** the new password contains fewer than eight characters
- **THEN** the system displays an accessible validation error
- **AND** the reset token is not consumed

#### Scenario: Confirmation does not match
- **WHEN** the password confirmation differs from the new password
- **THEN** the system displays an accessible validation error
- **AND** the reset token is not consumed

### Requirement: Successful password reset
The system SHALL replace the credential password when a valid token and valid new password are submitted, SHALL revoke the user's existing sessions, and SHALL require a new sign-in.

#### Scenario: Password reset succeeds
- **WHEN** a user submits a valid new password with a valid reset token
- **THEN** the password is replaced
- **AND** all existing sessions for that user are revoked
- **AND** the token cannot be used again
- **AND** the user is directed to sign in with the new password

### Requirement: Password reset abuse protection
The system SHALL rate-limit password-reset requests and SHALL preserve the generic response when a limit is reached.

#### Scenario: Request limit is exceeded
- **WHEN** a client exceeds the configured password-reset request limit
- **THEN** the system does not send another email during the limit window
- **AND** the client does not learn whether the submitted account exists
