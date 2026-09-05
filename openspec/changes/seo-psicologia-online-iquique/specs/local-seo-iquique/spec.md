## Purpose

Capta búsquedas locales de psicología presencial en Iquique (con alternativa online) mediante una página dedicada con señales locales verificables por crawlers y usuarios.

## ADDED Requirements

### Requirement: Página local indexable de Iquique

El sitio SHALL exponer la ruta `/psicologa-iquique` con título, descripción y canonical propios orientados a "psicóloga en Iquique" + online.

#### Scenario: Head local único

- **WHEN** un crawler solicita `GET /psicologa-iquique`
- **THEN** responde 200 con un `<title>` distinto al de `/` que contiene "Iquique" y ("presencial" u "online"), una `meta[name=description]` con "Iquique", "presencial" y "online", y un `link[rel=canonical]` a su propia URL canónica.

#### Scenario: Enlace bidireccional con la home

- **WHEN** un usuario o crawler recorre `/` y `/psicologa-iquique`
- **THEN** `/` enlaza a `/psicologa-iquique` con texto que contiene "Iquique" y la página local enlaza de vuelta a `/` y a `/sobre-pamela-rayen`.

### Requirement: Señales NAP y de área de servicio

La página local SHALL mostrar de forma visible la ciudad (Iquique, Tarapacá), la doble modalidad (presencial + online) y el CTA de agenda, con schema `LocalBusiness`/`Psychologist` coherente.

#### Scenario: NAP visible y estructurado

- **WHEN** se lee `/psicologa-iquique` como texto y como JSON-LD
- **THEN** el texto visible menciona "Iquique" y "Tarapacá" junto a "presencial" y "online", y el JSON-LD `Psychologist` incluye `address.addressLocality: Iquique`, `address.addressRegion: Tarapacá`, `address.addressCountry: CL` y `areaServed` con Iquique y CL, con `name` idéntico al visible.

### Requirement: No canibaliza a la home

La página local SHALL diferenciar su keyword principal de la home para evitar canibalización.

#### Scenario: Keywords diferenciadas

- **WHEN** se comparan H1 y title de `/` y `/psicologa-iquique`
- **THEN** el H1 local contiene "Iquique" y el H1 de `/` no contiene "Iquique" como término principal, y los titles no comparten más del 60% de tokens en el mismo orden.
