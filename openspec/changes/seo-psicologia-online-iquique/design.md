## Context

Ver proposal.md (why) y specs (online-psychology-seo, local-seo-iquique, professional-authority-seo). Estado actual: TanStack Start con SSR, `head()` solo global en `apps/web/src/routes/__root.tsx`, `routes/index.tsx` sin `head()` propio, sin `robots.txt`/`sitemap.xml` (sitemap hoy 404, robots es default Cloudflare sin `Sitemap:`), OG con `/opengraph-image.svg`, hero con `alt=""`, todo el contenido en `/` con anchors (`#atencion`, `#profesional`, `#cursos`). Dominio canónico en producción: `psicologarayen.cl` (`VITE_PUBLIC_SITE_URL`). Sin capacidad de publicar contenidos: no hay blog ni nuevas secciones informativas.

## Goals / Non-Goals

**Goals:**
- 3 URLs indexables diferenciadas (online nacional / local Iquique / autoridad) con metadatos y schemas verificables por crawler.
- Reutilizar componentes y contenido existente (`site-content.json`, hero, services, professional, FAQ) sin rediseño visual.

**Non-Goals:**
- Blog, páginas de talleres/cursos, cambio de sistema de agenda (solo CTAs existentes a Instagram), cambios en API/auth/pagos, rediseño Florecer.

## Decisions

- **3 rutas TanStack Router con `head()` por ruta (`/`, `/psicologa-iquique`, `/sobre-pamela-rayen`) en vez de single-page con anchors.**
  Rationale: cada intención (online / Iquique / E-E-A-T) necesita title+H1+schema propios para no canibalizar; los anchors no generan URLs indexables.
  Alternativa considerada: solo retocar `/` — descartada porque mezcla intenciones y no captura "Iquique".
- **Reutilizar secciones landing como componentes en las 3 páginas en vez de contenido duplicado.**
  Rationale: sin capacidad de redactar, se reordena y re-titula lo existente; canonical + titles distintos evitan duplicado.
  Alternativa: redactar copy nuevo — descartada por constraint 4.
- **JSON-LD inline por ruta (`ProfessionalService` + `FAQPage` en `/`, `Psychologist` LocalBusiness en Iquique, `Person` en sobre) en vez de un único schema global.**
  Rationale: cada schema refuerza la intención de su URL; Google valida por página.
- **Archivos estáticos en `apps/web/public/` (`robots.txt`, `sitemap.xml` generado en build, OG raster) en vez de SSR dinámico.**
  Rationale: sitio de 3 páginas, deploy Cloudflare Workers estático; simple y cacheable. `robots.txt` debe incluir `Sitemap: https://psicologarayen.cl/sitemap.xml`.
- **OG JPG/PNG 1200×630 generado desde `opengraph-image.svg` en vez de mantener SVG.**
  Rationale: WhatsApp/FB/Twitter no renderizan SVG; se pierde tráfico social (principal fuente actual vía Instagram).
- **Operativa off-site (GBP Iquique + Doctoralia/Psychology Today/MejorMente) documentada en tasks como checklist manual, no como código.**
  Rationale: el mayor multiplicador de visitas locales con 0 contenidos está fuera del repo.

## Risks / Trade-offs

- [Risk] Contenido fino (thin content) en `/psicologa-iquique` y `/sobre-...` por reutilizar bloques → Google las ve como duplicadas. Mitigación: H1/title/schema/NAP diferenciados, canonical propio, al menos 300 palabras visibles únicas por página reordenando bio + modalidades + FAQs filtradas.
- [Risk] Caída temporal de ranking de `/` al cambiar title/H1. Mitigación: mantener slug `/`, redirects innecesarios (no se borra nada), deploy en horario bajo + reindexación manual en Search Console.
- [Risk] `VITE_PUBLIC_SITE_URL` apunta a dominio distinto en preview (aula-rayen vs psicologarayen.cl) y canonical sale mal. Mitigación: canonical construido desde env canónico de producción con test que lo fija.
- [Risk] Talleres futuros canibalizan ("arteterapia" compite con home). Mitigación: nota en tasks — cualquier ruta de talleres deberá usar prefijo `/aula-rayen/...` + keyword B2B, nunca reutilizar H1 de `/`.
- [Trade-off] Sin blog no se capturan keywords informativas; se acepta: el objetivo es intención transaccional, no volumen.

## Migration Plan

1. Deploy con las 3 rutas + `robots.txt`/`sitemap.xml`/OG nuevos (sin borrar anchors antiguos: `#atencion` etc. siguen funcionando como scroll en `/`).
2. Validar en preview: `curl` de heads, Rich Results Test (schemas), `og:debug`-like para imagen.
3. Deploy a prod → "Solicitar indexación" en Search Console para las 3 URLs + enviar sitemap.
4. Checklist manual GBP + 3 directorios (fuera del deploy).
5. Rollback: revert del deploy Cloudflare (las URLs nuevas devuelven 404, `/` intacta al no cambiar slug).

## Open Questions

Ninguna pendiente (resueltas durante planificación 2026-09-05):
- NAP = solo ciudad: `addressLocality: Iquique`, `addressRegion: Tarapacá`, `addressCountry: CL`, sin calle ni mapa embebido.
- Contacto = Instagram + WhatsApp `+56 9 7936 3667` (`telephone: +56979363667` en schema, link `https://wa.me/56979363667` como CTA junto a Instagram).
