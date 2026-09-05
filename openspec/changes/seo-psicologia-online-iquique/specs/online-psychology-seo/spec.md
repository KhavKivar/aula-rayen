## Purpose

Posiciona la home de psicologarayen.cl para búsquedas transaccionales de psicología online en Chile (infantojuvenil y familiar), con metadatos, headings y datos estructurados que un crawler puede verificar sin ejecutar interacción.

## ADDED Requirements

### Requirement: Home con metadatos de psicología online Chile

La home SHALL exponer título, descripción, canonical y Open Graph/Twitter orientados a "psicóloga online Chile" con mención de infantojuvenil/familiar y CTA implícita de agenda.

#### Scenario: Crawler lee el head de la home

- **WHEN** un crawler solicita `GET /` y lee el `<head>`
- **THEN** encuentra un único `<title>` de 50–60 caracteres que contiene "Psicóloga online" y "Chile", una `meta[name=description]` de 150–160 caracteres con "online", "Chile" y "agendar/primera hora", un `link[rel=canonical]` absoluto al dominio canónico y tags OG/Twitter con imagen raster (JPG/PNG 1200×630).

#### Scenario: Sin títulos duplicados

- **WHEN** se comparan los `<title>` de `/`, `/psicologa-iquique` y `/sobre-pamela-rayen`
- **THEN** los tres son distintos entre sí.

### Requirement: Headings transaccionales en la home

La home SHALL presentar un único H1 con keyword principal online + Chile y H2s que cubran psicología infantojuvenil online y acompañamiento familiar online.

#### Scenario: Jerarquía de headings verificable

- **WHEN** se extrae el outline de headings de `/`
- **THEN** existe exactamente un `h1` que contiene "online" y ("Chile" o "Iquique"), al menos un `h2` con "infantojuvenil" y uno con "familiar", y ningún `h2` duplica el texto del `h1`.

### Requirement: Datos estructurados base de la home

La home SHALL exponer JSON-LD `ProfessionalService` (o `Psychologist`) y `FAQPage` con las preguntas visibles, además de imágenes con `alt` descriptivo.

#### Scenario: Schemas parseables

- **WHEN** se parsean los bloques `script[type="application/ld+json"]` de `/`
- **THEN** existe un nodo `ProfessionalService` con `name`, `url`, `areaServed: CL` y `sameAs` a Instagram, y un nodo `FAQPage` cuyas preguntas coinciden con las visibles en la sección de preguntas frecuentes.

#### Scenario: Imágenes con alternativa textual

- **WHEN** se listan las `img` del hero de `/`
- **THEN** cada una tiene `alt` no vacío que menciona psicóloga y (online o Iquique), y ninguna usa `alt=""` salvo decorativas marcadas `aria-hidden`.

### Requirement: Fundamentos rastreables del sitio

El sitio SHALL exponer `sitemap.xml` con las 3 páginas indexables y `robots.txt` con directiva `Sitemap:` absoluta.

#### Scenario: Sitemap y robots consistentes

- **WHEN** un crawler pide `/sitemap.xml` y `/robots.txt`
- **THEN** el sitemap responde 200 con las URLs canónicas de `/`, `/psicologa-iquique` y `/sobre-pamela-rayen`, y `robots.txt` contiene `Sitemap: https://<dominio-canónico>/sitemap.xml`.
