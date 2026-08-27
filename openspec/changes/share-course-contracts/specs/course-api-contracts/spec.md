## Purpose

Defines a single runtime-validatable HTTP contract for Course operations so frontend and backend consumers agree without depending on persistence models.

## ADDED Requirements

### Requirement: Course contracts are shared independently of persistence
The system SHALL provide Course request and response schemas, with inferred static types, through a framework-neutral shared contract that does not expose database schemas, database clients, repositories, or backend-only modules.

#### Scenario: Frontend and backend consume the same contract
- **WHEN** either application handles a Course API payload
- **THEN** it can import the corresponding schema or inferred type from the shared contract package

#### Scenario: Contract consumers remain independent of Drizzle
- **WHEN** the frontend installs and builds the shared contract package
- **THEN** it does not require or import the backend database schema or Drizzle

### Requirement: Course catalog responses expose only catalog-safe fields
The Course catalog contract SHALL contain `id`, `title`, `description`, `createdAt`, `duration`, `price`, and `hasAccess`. It MUST reject or omit purchased-content fields such as `videoLink` and `fileLink`.

#### Scenario: Purchased course appears in catalog
- **WHEN** an authenticated user requests the Course catalog and has purchased a course
- **THEN** the course response satisfies the catalog contract with `hasAccess` equal to `true`
- **THEN** the response does not expose `videoLink` or `fileLink`

#### Scenario: Unpurchased course appears in catalog
- **WHEN** an authenticated user requests the Course catalog and has not purchased a course
- **THEN** the course response satisfies the catalog contract with `hasAccess` equal to `false`
- **THEN** the response does not expose `videoLink` or `fileLink`

### Requirement: Purchased Course details use a distinct contract
The purchased Course detail contract SHALL contain the public Course fields plus `videoLink` and `fileLink`, and SHALL only describe responses returned after access has been authorized.

#### Scenario: Authorized user receives Course details
- **WHEN** a user requests a course they have purchased
- **THEN** the successful response satisfies the purchased Course detail contract and contains both content links

#### Scenario: Unauthorized user receives no Course details
- **WHEN** a user requests a course they have not purchased
- **THEN** the API returns an error response rather than a purchased Course detail payload
- **THEN** no content links are exposed

### Requirement: Course timestamps have an explicit wire representation
Every Course response contract SHALL represent `createdAt` as an ISO 8601 string, regardless of the date representation used by persistence code.

#### Scenario: Database date is returned over HTTP
- **WHEN** a persisted Course is serialized into a successful API response
- **THEN** its `createdAt` value is an ISO 8601 string accepted by the shared response schema

### Requirement: Course mutation requests are runtime validated
The system SHALL define separate request schemas for creating and updating courses. Creation SHALL require `title`, `description`, `videoLink`, `fileLink`, `duration`, and a non-negative integer `price`; update SHALL accept a non-empty subset of those fields. Unknown properties SHALL be rejected.

#### Scenario: Valid Course creation request
- **WHEN** a client submits all required fields with valid values
- **THEN** the API accepts the request and returns a Course response satisfying the shared contract

#### Scenario: Invalid Course creation request
- **WHEN** a client omits a required field, supplies an invalid value, or includes an unknown property
- **THEN** the API rejects the request with a client error satisfying the shared API error contract

#### Scenario: Valid partial Course update
- **WHEN** a client submits a non-empty subset of valid mutable Course fields
- **THEN** the API accepts the update and returns a Course response satisfying the shared contract

#### Scenario: Empty Course update
- **WHEN** a client submits an empty update object
- **THEN** the API rejects the request with a client error satisfying the shared API error contract

### Requirement: Course API errors have a shared shape
Course API failures covered by the shared contract SHALL expose a numeric `statusCode`, a human-readable `message` or list of messages, and an `error` label when provided by the API framework.

#### Scenario: Course deletion conflicts with existing purchases
- **WHEN** a client attempts to delete a Course that has purchases
- **THEN** the API returns status code 409 with an error payload accepted by the shared API error schema

#### Scenario: Course is not found
- **WHEN** a Course operation targets a nonexistent identifier
- **THEN** the API returns the applicable client error with a payload accepted by the shared API error schema

### Requirement: Frontend validates Course responses at runtime
The frontend SHALL validate Course API response bodies with the corresponding shared response schema before making them available to UI components.

#### Scenario: Backend returns a compatible response
- **WHEN** the frontend receives a Course response matching the expected shared schema
- **THEN** it returns the parsed, statically typed value to the caller

#### Scenario: Backend returns an incompatible response
- **WHEN** the frontend receives a Course response that does not match the expected shared schema
- **THEN** response validation fails instead of exposing the incompatible value as a valid Course
