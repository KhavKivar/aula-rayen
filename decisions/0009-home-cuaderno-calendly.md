# 0009 - Home «cuaderno» con agenda en Calendly

- Fecha: 2026-11-17
- Estado: aceptada
- Ámbito: web

## Contexto

La home se rediseña con foco en agendar hora. Se eligió el estilo «cuaderno»: fondo de cuaderno, dibujos de línea que se pintan con el scroll (referencia: Therapy in London), los colores del logo de Rayen (rojo, mostaza, menta) y Coco Drila, el perro que dibujó Rayen, caminando con el scroll.

La API todavía no permite ver horarios ni reservar sin sesión: `GET /availability-slots` y `/bookings` exigen cuenta. La web anterior agendaba por WhatsApp.

## Decisión

- La home (`/`) pasa al diseño cuaderno (`apps/web/src/features/landing/home/`).
- **Todos los botones «Agendar hora» abren Calendly** en una pestaña nueva. El enlace se configura en `site-content.json` → `booking.calendlyUrl`. Si es `null`, los botones abren WhatsApp con un mensaje listo.
- Junto a «Agendar hora» hay un botón secundario «Escribir por WhatsApp».
- En el inicio hay un dibujo (la consulta), no un calendario embebido: se probó el iframe de Calendly, pero se prefirió la simpleza de un enlace y no abrir el CSP a terceros.
- Los textos siguen `docs/voz-y-tono.md` y `docs/textos-home.md`.
- Las fuentes Figtree y Caveat se sirven desde el sitio (fontsource), porque el CSP no permite Google Fonts.

## Alternativas consideradas

- Calendly embebido en la página: funciona, pero obliga a permitir `frame-src https://calendly.com` y a cargar el calendario de un tercero en la primera pantalla.
- Calendario propio conectado a la API: es lo ideal a futuro, pero requiere un endpoint público de disponibilidad, definir si se reserva sin cuenta y el pago con Webpay.

## Consecuencias

- El evento de Calendly debe estar a nombre de Rayen, en español, con la duración real y la dirección de la consulta, porque la home dice que «la dirección llega con la confirmación».
- Las páginas `/psicologa-iquique` y `/sobre-pamela-rayen` siguen con el diseño anterior.
- `landing-courses.tsx` ya no se usa en la home.
- Pendiente: el hero 3D y, más adelante, el calendario propio.
