## Purpose

Ofrecer una identidad Florecer coherente para atención psicológica, formación y administración, preservando los flujos existentes de la plataforma.

## ADDED Requirements

### Requirement: Unified responsive identity
All public, authentication, learning and administration screens SHALL use the selected Florecer identity and remain usable on mobile and desktop.

#### Scenario: Navigate across the application
- **WHEN** a user moves between the landing page, login, registration, password recovery, courses, payment result or administration
- **THEN** typography, brand, colors, controls and feedback retain a consistent identity
- **AND** existing access restrictions and operations remain intact

### Requirement: Original flower motion
The landing page SHALL use the original Blender flower with muted automatic looping, a visible pause control and a static poster when reduced motion is requested.

#### Scenario: Reduced motion preference
- **WHEN** a visitor requests reduced motion
- **THEN** the flower remains static unless they explicitly start playback

### Requirement: Psychological services and course entry points
The home page SHALL present psychological accompaniment, the professional profile and Aula Rayen courses with clear navigation and an appointment contact action.

#### Scenario: Request an appointment
- **WHEN** a visitor follows the appointment action
- **THEN** the site explains the available contact channel
- **AND** no fictitious availability or reservation confirmation is presented

### Requirement: Administrative operations remain available
Course management, buyers, payment filtering and payment details SHALL remain accessible with the refreshed visual identity, including loading, empty, error, modal and mobile states.

#### Scenario: Administrator uses a management action
- **WHEN** an administrator opens a course editor, deletion confirmation, buyers or transaction detail
- **THEN** the existing operation and permissions remain intact within the Florecer interface
