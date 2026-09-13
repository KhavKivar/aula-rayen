## Purpose

Define secure, testable session-cookie behavior that allows the production frontend and API sibling subdomains to recognize the same authenticated user.

## ADDED Requirements

### Requirement: Production sessions are shared across the application subdomains
The system SHALL issue newly established production authentication sessions with the configured parent cookie domain, making the session available to both the frontend and API sibling subdomains.

#### Scenario: New production session reaches the API
- **WHEN** a user establishes a new authenticated session through the production frontend
- **THEN** the browser stores a session cookie scoped to the configured parent domain
- **AND** the browser includes that session cookie on credentialed requests to the API subdomain

#### Scenario: Protected API request uses the shared session
- **WHEN** an authenticated user makes a credentialed request from the frontend subdomain to a protected endpoint on the API subdomain
- **THEN** the API recognizes the user session instead of returning `401` due to a missing session cookie

### Requirement: Shared session cookies retain security attributes
The system MUST issue shared authentication cookies with `Secure`, `HttpOnly`, `SameSite=Lax`, and `Path=/` attributes.

#### Scenario: Production cookie attributes are inspected
- **WHEN** the production authentication service creates or refreshes a session cookie
- **THEN** the response cookie includes the configured parent `Domain`, `Secure`, `HttpOnly`, `SameSite=Lax`, and `Path=/`

### Requirement: Local development remains host-only
The system SHALL retain host-only authentication cookies when no shared cookie domain is configured, including the default local development setup.

#### Scenario: Local login does not use a parent domain
- **WHEN** a developer establishes a session without configuring a shared cookie domain
- **THEN** the session cookie omits the `Domain` attribute
- **AND** localhost authentication continues to work without production-domain configuration

### Requirement: Cookie-domain configuration is validated
The system MUST reject shared cookie-domain values that contain a scheme, port, path, or otherwise do not represent a valid hostname, and production SHALL require an explicit cookie-domain value.

#### Scenario: Production starts with the expected domain
- **WHEN** the production API starts with the expected parent cookie domain configured
- **THEN** authentication initializes with cross-subdomain cookie sharing enabled

#### Scenario: Production omits the domain
- **WHEN** the production API starts without a shared cookie-domain value
- **THEN** startup fails with a configuration validation error

#### Scenario: Domain contains URL components
- **WHEN** the API starts with a value such as `https://example.com`, `example.com:443`, or `example.com/path`
- **THEN** startup fails with a configuration validation error

### Requirement: Existing host-only sessions require renewal
The system SHALL document that sessions created before cross-subdomain sharing is enabled do not change scope automatically and MUST be renewed before they can authenticate direct API requests.

#### Scenario: Existing session predates deployment
- **WHEN** a browser only has the previous host-only session cookie after deployment
- **THEN** the deployment guidance directs the user or operator to clear the old cookie and establish a new session
- **AND** no claim is made that the existing cookie was converted to a domain-scoped cookie
