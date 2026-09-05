# Tres propuestas de diseño para Rayen

Abrir **[la galería](index.html)** para comparar Florecer, A tu ritmo y Espacio. Cada propuesta contiene portada, servicios, presentación de Pamela, formación, agenda y una muestra del sistema visual. Los controles funcionan como simulación local de interfaz.

## Abrir en el navegador

Desde la raíz del repositorio:

```bash
python -m http.server 4177 --bind 127.0.0.1 --directory openspec/changes/explore-psychology-site-designs
```

Visitar http://localhost:4177/mockups/.

También se puede abrir `index.html` directamente desde el explorador de archivos. El servidor local facilita la reproducción de vídeo y navegación por los documentos. No requiere ejecutar las aplicaciones ni instalar paquetes.

## Las propuestas

| Dirección | Mockup | Escritorio | Móvil | Agenda | Animación |
|---|---|---|---|---|---|
| Florecer | [Abrir](concept.html?theme=florecer) | [PNG](previews/florecer-desktop.png) | [PNG](previews/florecer-mobile.png) | [PNG](previews/florecer-booking.png) | [MP4](assets/florecer.mp4) |
| A tu ritmo | [Abrir](concept.html?theme=ritmo) | [PNG](previews/ritmo-desktop.png) | [PNG](previews/ritmo-mobile.png) | [PNG](previews/ritmo-booking.png) | [MP4](assets/ritmo.mp4) |
| Espacio | [Abrir](concept.html?theme=espacio) | [PNG](previews/espacio-desktop.png) | [PNG](previews/espacio-mobile.png) | [PNG](previews/espacio-booking.png) | [MP4](assets/espacio.mp4) |

En `previews/*-full.png` están las páginas completas. [Comparación visual](previews/comparison.png).

## Qué se puede probar

- Recorrer servicios, presentación de Pamela y cursos desde la navegación.
- Reproducir/pausar las tres animaciones de portada. Con movimiento reducido se mantiene la imagen estática hasta pulsar reproducir.
- Abrir “Agendar hora”, seleccionar atención, día y hora, y visualizar el resumen de ejemplo.
- Cambiar el ancho de ventana para explorar la adaptación móvil.
- Abrir el detalle de un servicio o el curso, que mantiene su estado “Próximamente”.

La agenda no crea reservas. Fechas, horarios, modalidad y servicios nuevos son contenido ilustrativo; no se solicitan datos personales ni se llama a ninguna API.

## Entrega de Blender

- [Archivo editable](blender/rayen-design-studies.blend): tres escenas separadas; se conserva la escena inicial.
- [Script de creación](blender/create_scenes.py): ejecutado desde Blender MCP. Genera geometría, materiales, luces, cámaras y animaciones originales.
- [Script de vídeo](blender/render_motion.py): exporta las tres vistas previas con Blender y FFmpeg/OpenH264.
- Renders de portada: 1000 × 1100 PNG.
- Estudios de vídeo: 560 × 616, 6 segundos, 10 fps, H.264 sin audio.

Para repetir los vídeos desde esta carpeta, con Blender 4.5 y FFmpeg/OpenH264 disponibles:

```bash
blender -b blender/rayen-design-studies.blend --python blender/render_motion.py
```

La versión portátil usada en esta sesión fue `/tmp/blender-4.5.3-linux-x64/blender`. No se cambió la instalación del sistema. Antes de una implementación final se ajustarán resolución y fluidez de la alternativa elegida.

Ver [decisiones de diseño](../design.md), [créditos](CREDITS.md) y [verificación](VALIDATION.md). Todo el contenido está aislado dentro de esta propuesta; no se modificaron ni desplegaron las aplicaciones.
