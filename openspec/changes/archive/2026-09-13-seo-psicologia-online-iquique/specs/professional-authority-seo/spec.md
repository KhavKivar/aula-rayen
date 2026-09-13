## Purpose

Sostiene el E-E-A-T del sitio con una página de autoridad sobre Pamela Rayen Calderón que hace verificables su formación, magíster y experiencia para crawlers y pacientes.

## ADDED Requirements

### Requirement: Página de autoridad con credenciales verificables

El sitio SHALL exponer `/sobre-pamela-rayen` con nombre completo, profesión, formación (U. de Tarapacá, Magíster en Salud y Arteterapia, psicodrama) y experiencia (infantojuvenil y familiar) en texto visible.

#### Scenario: Credenciales visibles completas

- **WHEN** se lee `/sobre-pamela-rayen` como texto
- **THEN** contiene "Pamela Rayen Calderón", "Psicóloga", "Universidad de Tarapacá", "Magíster en Salud y Arteterapia", "psicodrama" (o "psicoterapia grupal psicodramática") e "infantojuvenil".

### Requirement: Schema Person enlazado

La página SHALL exponer JSON-LD `Person` (o `Physician`/`Psychologist` individual) con credenciales y `sameAs`, enlazado desde home y página local.

#### Scenario: Person parseable y referenciado

- **WHEN** se parsea el JSON-LD de `/sobre-pamela-rayen` y se recorren `/` y `/psicologa-iquique`
- **THEN** existe un nodo `Person` con `name: Pamela Rayen Calderón`, `jobTitle` con "Psicóloga", `alumniOf` con Universidad de Tarapacá y Magíster, `sameAs` a Instagram, y ambas páginas enlazan a `/sobre-pamela-rayen` con texto de autoridad (nombre o "sobre mí").

### Requirement: Talleres fuera del foco SEO

El sitio SHALL NOT crear rutas indexables ni schemas de cursos/talleres en este change; la mención a talleres queda como bloque no prioritario dentro de `/` si ya existe.

#### Scenario: Sin indexación de talleres

- **WHEN** se lista `/sitemap.xml` y las rutas indexables del sitio tras el change
- **THEN** no existe ninguna URL de taller/curso ni schema `Course` indexable, y `/` no tiene H1/H2 cuyo keyword principal sea un taller.
