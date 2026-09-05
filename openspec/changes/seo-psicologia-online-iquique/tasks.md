## 1. Fundamentos técnicos (sitemap, robots, OG)

- [x] 1.1 Añadir `robots.txt` en `apps/web/public/` con `Allow: /` y `Sitemap: https://psicologarayen.cl/sitemap.xml`
- [x] 1.2 Generar `sitemap.xml` en build con `/`, `/psicologa-iquique` y `/sobre-pamela-rayen` canónicas
- [x] 1.3 Reemplazar OG SVG por imagen raster 1200×630 (JPG/PNG) y referenciarla en `head()` global y por ruta
- [x] 1.4 Fijar canonical absoluto desde `VITE_PUBLIC_SITE_URL` de producción con test que lo verifica

## 2. Home psicología online Chile (`/`)

- [x] 2.1 Reescribir `title`/`description` de `/` (online + Chile + infantojuvenil/familiar + agenda) con `head()` propio en `routes/index.tsx`
- [x] 2.2 Ajustar H1/H2 de hero y servicios a keywords transaccionales manteniendo un único H1
- [x] 2.3 Añadir `alt` descriptivos (psicóloga online / Iquique) y quitar `alt=""` del hero
- [x] 2.4 Añadir JSON-LD `ProfessionalService` + `FAQPage` en `/` con `areaServed: CL` y `sameAs` a Instagram
- [x] 2.5 Añadir CTAs WhatsApp (`https://wa.me/56979363667`) junto a Instagram en hero y agenda

## 3. Página local Iquique (`/psicologa-iquique`)

- [x] 3.1 Crear ruta `/psicologa-iquique` reutilizando componentes landing (sin copiar estilos nuevos)
- [x] 3.2 Redactar H1/title/description locales (Iquique + presencial + online) diferenciados de `/`
- [x] 3.3 Mostrar NAP solo-ciudad (Iquique, Tarapacá) + doble modalidad + CTAs WhatsApp e Instagram
- [x] 3.4 Añadir JSON-LD `Psychologist` con `addressLocality: Iquique`, `addressRegion: Tarapacá`, `addressCountry: CL`, `telephone: +56979363667`, `areaServed` Iquique+CL
- [x] 3.5 Enlazar `/` ↔ `/psicologa-iquique` ↔ `/sobre-pamela-rayen` con textos "Iquique" y de autoridad

## 4. Página autoridad (`/sobre-pamela-rayen`)

- [x] 4.1 Crear ruta `/sobre-pamela-rayen` con bio completa (nombre, U. de Tarapacá, Magíster, psicodrama, infantojuvenil)
- [x] 4.2 Añadir JSON-LD `Person` con `alumniOf`, `jobTitle` y `sameAs` a Instagram
- [x] 4.3 Verificar que no se crea ningún schema `Course` ni ruta de talleres en este change

## 5. Validación y puesta en producción

- [x] 5.1 Validar heads/canonicals con `curl`, schemas con Rich Results Test y OG con previsualizador
- [x] 5.2 Ejecutar `pnpm lint`, `pnpm exec tsc --noEmit` y `pnpm build` desde `apps/web/`
- [ ] 5.3 Enviar `sitemap.xml` y solicitar indexación de las 3 URLs en Search Console tras el deploy
- [ ] 5.4 Checklist manual fuera del repo: Google Business Profile Iquique + altas en Doctoralia, Psychology Today CL y MejorMente con enlace al dominio
