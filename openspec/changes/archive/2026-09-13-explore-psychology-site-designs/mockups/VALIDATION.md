# Verificación de la propuesta

Realizada el 4 de septiembre de 2026 con Chrome mediante agent-browser.

| Control | Resultado |
|---|---|
| Tres portadas a 1440 × 1080 | Capturadas y revisadas visualmente |
| Tres portadas a 390 × 844 | Capturadas y revisadas; `scrollWidth === innerWidth`, sin desbordamiento horizontal |
| Imágenes y fuentes de las portadas | Recursos locales cargados |
| Tres estudios de vídeo | Reproducción y pausa comprobadas; `readyState: 4`, duración de 6 segundos |
| Exportaciones | FFprobe confirma H.264, 560 × 616, 10 fps, sin pista de audio |
| Reproducción predeterminada | Activa y silenciada sin preferencia de movimiento reducido |
| Movimiento reducido | Vídeo pausado y sin descargar; póster disponible |
| Agenda | Abre en las tres direcciones; selección del 17 de septiembre, 16:00, reflejada en resumen |
| Agenda móvil | Diálogo de 352 px dentro de viewport de 390 px; foco dentro del diálogo, cierre con Escape |
| Navegación móvil | Menú abre y refleja `aria-expanded`; navegación hacia cursos comprobada |
| Detalle de curso | Abre, conserva “Precio por anunciar” y oculta el CTA de agenda clínica |
| JavaScript | `node --check mockups/concept.js` correcto |
| OpenSpec | `openspec validate explore-psychology-site-designs --strict` correcto |
| Enlaces de galería | 19 enlaces locales verificados por HTTP; sin errores |
| Alcance Git | Archivos nuevos solo en `openspec/changes/explore-psychology-site-designs/` |

El conocimiento estructural de los archivos fuente usados fue contrastado con `check_index_coverage`, proyecto `home-kvir-PersonalProjects-aula-rayen`, generación `2026-09-04T23:40:31Z`: no se registraron lagunas en los paths consultados. Es una señal de mejor esfuerzo, no una prueba de exhaustividad. No se hicieron afirmaciones sobre la arquitectura funcional de las aplicaciones.

No se ejecutaron builds de web/API porque no se modificó código de las aplicaciones, configuración ni dependencias. La verificación corresponde a los mockups: no prueba integraciones, disponibilidad, pagos o reservas reales. No equivale a una auditoría integral de accesibilidad ni a pruebas en todos los navegadores.
