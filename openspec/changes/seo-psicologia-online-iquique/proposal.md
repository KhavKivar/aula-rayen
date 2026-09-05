## Why

psicologarayen.cl recibe poco tráfico orgánico porque una sola URL (/) compite a la vez por psicología online nacional, presencial en Iquique y formación/talleres, sin títulos ni datos estructurados por intención. Con foco confirmado en psicología online + presencial en Iquique y cero capacidad de publicar contenidos, la oportunidad es rankear por intención transaccional (agendar hora) con 3 páginas mínimas y fundamentos técnicos, aparcando talleres y blog.

## What Changes

- Reorientar `/` a psicología online Chile: título, descripción, H1/H2 con keywords transaccionales (online, Chile, infantojuvenil, familiar), manteniendo tono de marca.
- Crear ruta `/psicologa-iquique` para captación local presencial + online: H1 local, NAP (Iquique/Tarapacá), mapa/zona, CTA de agenda.
- Crear ruta `/sobre-pamela-rayen` como pilar E-E-A-T: U. de Tarapacá, Magíster en Salud y Arteterapia, psicodrama, experiencia infantojuvenil/familiar, enlazada desde home y página local.
- Añadir fundamentos técnicos SEO: `head()` por ruta (title/description/canonical/OG/Twitter), `sitemap.xml` + directiva `Sitemap:` en `robots.txt`, imagen OG JPG/PNG 1200×630, alts descriptivos, JSON-LD (`ProfessionalService`, `LocalBusiness/Psychologist` con `areaServed: Iquique`, `Person`, `FAQPage`).
- Aparcar talleres: sin ruta ni SEO propio; se mantiene solo como bloque existente en `/` sin optimización adicional.
- Registrar fuera del código (plan operativo, no deploy): Google Business Profile Iquique + altas en Doctoralia, Psychology Today CL y MejorMente con enlace al dominio.
- No incluye: blog, glosario, páginas de talleres, checkout, cambios de agenda (solo CTAs existentes).

## Capabilities

### New Capabilities

- `online-psychology-seo`: SEO de la home orientada a psicología online Chile (metadatos, headings, schemas base, OG, FAQ estructurado).
- `local-seo-iquique`: Página local `/psicologa-iquique` con SEO presencial Iquique + online (metadatos locales, NAP, schema LocalBusiness, enlace a GBP).
- `professional-authority-seo`: Página `/sobre-pamela-rayen` con credenciales E-E-A-T verificables (formación, magíster, experiencia) y schema Person enlazado desde las demás páginas.

### Modified Capabilities

<!-- Sin cambios a capabilities existentes: openspec/specs está vacío y no se altera comportamiento de otras features. -->

## Impact

- Afecta `apps/web/src/routes/__root.tsx` (metadatos globales), `apps/web/src/routes/index.tsx` (head + headings), 2 rutas nuevas, `apps/web/public/` (OG image, `robots.txt`, `sitemap.xml`), componentes landing existentes (hero, services, professional, FAQ, footer).
- Sin cambios en API NestJS, auth, pagos ni contratos (`packages/contracts/`).
- Riesgo de despliegue bajo; el mayor riesgo es canibalización si a futuro se reintroducen talleres sin re-mapear keywords (se deja nota en design).
