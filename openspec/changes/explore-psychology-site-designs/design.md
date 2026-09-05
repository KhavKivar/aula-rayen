## Context

Ver [proposal.md](proposal.md) para el objetivo. El sitio público se revisó en navegador el 4 de septiembre de 2026: la portada de [psicologarayen.cl](https://psicologarayen.cl/) presenta Aula Rayen, formación para profesionales de la psicología, verde oscuro, acentos dorados y el retrato de Pamela Rayen Calderón. La exploración conserva esa identidad humana y suma dos recorridos: atención psicológica y formación.

Este documento y los mockups son artefactos de diseño. Se omiten delta specs mediante `skip_specs: true` porque no cambian requisitos ni comportamiento de la aplicación existente.

## Goals / Non-Goals

**Goals:** comparar tres sistemas completos sobre el mismo contenido, mostrando escritorio, móvil, agenda y movimiento 3D real. Facilitar una elección visual con una galería local.

**Non-Goals:** elegir por el usuario una alternativa definitiva, implementar el sitio productivo, definir el catálogo clínico definitivo, conectar disponibilidad, recopilar datos, cobrar o enviar confirmaciones. Ver alcance completo en la propuesta.

## Decisions

### 1. Arquitectura de marca y jerarquía

Propuesta de marca principal: **Psicóloga Rayen**. **Aula Rayen** permanece como el espacio de formación. Se mantiene el nombre de Pamela y su retrato público para dar continuidad y presencia humana junto a la pieza 3D.

Orden de página: portada → servicios → Pamela y su enfoque → formación → agenda. La acción principal es **Agendar hora**; servicios es la alternativa de orientación y Aula Rayen tiene acceso permanente desde navegación. Se descarta dar el mismo peso a compra de cursos y reserva en la portada porque representan intenciones diferentes.

La oferta ilustrativa usa atención infantojuvenil, acompañamiento familiar y arteterapia/talleres, en relación con el enfoque descrito en el sitio actual. No constituye un catálogo clínico confirmado. La modalidad online, las fechas y horas son ejemplos. No se inventan testimonios, precios, métricas ni disponibilidad real.

### 2. Tres sistemas visuales

| Sistema | 01 · Florecer | 02 · A tu ritmo | 03 · Espacio |
|---|---|---|---|
| Sensación | Cálida, natural, cercana | Expresiva, creativa, lúdica | Serena, editorial, elegante |
| Fondo | Crema `#F7F5ED` | Blanco lavanda `#F8F7FF` | Arena `#F2EDE4` |
| Texto/primario | Bosque `#243D32` | Azul `#3036C8` | Carbón oliva `#30352D` |
| Acento | Terracota `#BE6746` | Lima `#DDF399`, coral `#EF8E77` | Terracota `#A45338` |
| Superficie secundaria | Salvia `#DCE5CB` | Lavanda, lima y coral | Piedra `#D9D0BE` |
| Tipografía | Fraunces + DM Sans | Manrope + DM Sans | Fraunces + DM Sans |
| Titulares escritorio/móvil | ~76 / 49 px, serif con cursiva | ~79 / 49 px, sans gruesa con resaltado | ~89 / 52 px, serif editorial |
| Componentes | Tarjetas de 24 px, botones cápsula | Bordes definidos, tarjetas de 20 px, acentos gráficos | Líneas finas, radios de 0–2 px, botones rectos |
| Composición | Dos columnas equilibradas, formas orgánicas | Bloques de color y tipografía dominante | Asimetría, títulos amplios, servicios separados por líneas |
| Blender | Flor de arcilla, balanceo leve | Formas infladas que flotan con desfase | Arco de cerámica, esfera suspendida |
| Mejor encaje visual | Continuidad de marca y convivencia de servicios | Cambio más notorio, arteterapia y creatividad | Mayor énfasis en marca personal y atención |

El ritmo de espaciado compartido es 8 / 16 / 24 / 48 / 80 px. El texto principal utiliza DM Sans con interlineado amplio; cada dirección cambia color, tipografía de títulos, composición y tratamiento de componentes. El símbolo floral es una exploración vectorial provisional, no una entrega final de identidad corporativa.

**Recomendación de diseño:** Florecer equilibra la cercanía existente con un lenguaje más luminoso. A tu ritmo responde mejor si la prioridad es una renovación atrevida y entretenida. Espacio es la opción contemplativa. Esta recomendación es criterio de diseño, no un resultado de investigación con usuarios.

### 3. Movimiento original en Blender

Las tres escenas se modelaron mediante `blender.execute_blender_code` de Blender MCP usando geometría procedural, materiales, cámaras ortográficas, luces de área y fotogramas clave. No se usaron imágenes generadas por IA ni modelos externos. Blender 4.5.3 LTS se ejecutó desde la instalación portátil disponible porque el ejecutable del sistema tenía un error de bibliotecas; se consiguió conexión efectiva con el addon MCP.

Entregables: tres renders PNG de 1000 × 1100, tres estudios MP4 H.264 de 560 × 616 y seis segundos, y [el archivo de escenas](mockups/blender/rayen-design-studies.blend). La línea de tiempo tiene 120 fotogramas a 20 fps; las vistas previas se renderizan cada dos fotogramas y se codifican a 10 fps. Son estudios de movimiento, no la exportación final de producción. Los scripts reproducibles están en `mockups/blender/`.

Los vídeos se reproducen sin sonido en la vista navegable y ofrecen pausa visible. Con `prefers-reduced-motion` o al capturar imágenes, se conserva el póster estático y la reproducción queda a elección de la persona. El encuadre de portada se adapta a móvil. Una futura implementación podrá aumentar la fluidez a 24/30 fps y ajustar resolución/compresión; no necesita incorporar un motor 3D al navegador para este efecto.

### 4. Agenda como interfaz local

El diálogo muestra tipo de atención, días de ejemplo, horarios y resumen. La selección cambia únicamente en memoria. El resumen declara que no se ha reservado una hora. No hay formularios de datos personales, persistencia, peticiones a APIs, correo ni pago.

Se usa un diálogo nativo con cierre explícito y Escape, controles con etiquetas, estados `aria-pressed`, foco visible y resumen anunciado. El detalle del curso conserva “Próximamente” y “Precio por anunciar”, sin conectarlo a la agenda clínica.

### 5. Entrega aislada y verificable

[Galería](mockups/index.html), [mockup](mockups/concept.html), estilos y comportamiento local viven junto a esta propuesta. Los retratos, tipografías y vídeos se sirven localmente; no se requiere instalar dependencias ni iniciar las aplicaciones. Hay enlaces a capturas de escritorio, móvil, página completa y agenda.

Ver [README de los mockups](mockups/README.md) para abrirlos, [créditos](mockups/CREDITS.md) para la procedencia de recursos y [verificación](mockups/VALIDATION.md) para los controles realizados.

## Risks / Trade-offs

- [Flor percibida como demasiado infantil] → Mantener textos y tipografía sobrios; valorar Espacio si se busca mayor neutralidad.
- [Color y movimiento compiten con la atención clínica] → Reservarlos para ilustración y acentos; mantener lectura y acción principal claras, con pausa y movimiento reducido.
- [Animación preliminar de baja tasa de cuadros] → El archivo editable permite generar una versión final más fluida tras elegir dirección.
- [Oferta y modalidad aún por definir] → Tratar los textos como muestras; validar estos datos antes de convertir una maqueta en un flujo real.
- [Tamaños editoriales pequeños en anotaciones] → La maqueta permite comparar jerarquía; una implementación debe revisar tamaño y contraste de todos los textos en dispositivos reales, además de sus estados.

## Migration Plan

No hay despliegue ni migración en esta exploración. Tras la elección del usuario, la incorporación del sistema a `apps/web` requiere una solicitud posterior y un cambio dedicado exclusivamente a interfaz. La integración de backend se mantiene fuera de ese alcance salvo nueva autorización.
