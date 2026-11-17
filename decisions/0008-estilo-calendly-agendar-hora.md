# 0008 - Estilo Calendly para la página de agendar hora

- Fecha: 2026-11-17
- Estado: aceptada
- Ámbito: web

## Contexto

Se va a rediseñar el sitio, comenzando por el calendario de "agendar hora". Por
ahora la página tendrá un solo propósito: que la persona reserve una sesión. Se
revisaron referencias de diseño (Calendly, Cal.com, Jicoo, galerías de Baymard y
Kombai, Dribbble) para elegir un patrón de reserva.

## Decisión

Por el momento se adopta el patrón de reserva estilo Calendly:

- Una sola pantalla con dos zonas: a la izquierda, la información de la sesión
  (foto y nombre de la psicóloga, tipo de sesión, duración, precio, modalidad
  online/presencial y zona horaria de Chile); a la derecha, un calendario mensual
  con una columna de horarios disponibles.
- En mobile las zonas se apilan: información, calendario y horarios.
- Solo se muestran horarios disponibles; los días sin cupos aparecen deshabilitados.
- Botones de horario grandes y fáciles de tocar, con la selección claramente
  destacada antes de confirmar.
- Flujo corto: fecha → hora → datos → confirmación.
- Tono visual calmado (colores suaves, espacio en blanco, textos cálidos), adecuado
  para alguien que busca atención psicológica.

## Alternativas consideradas

- Selector con franja de días y línea de tiempo (estilo Kombai/timeline): pros:
  rápido en mobile; contras: menos visión del mes completo.
- Calendario semanal tipo agenda: pros: muestra mucha disponibilidad a la vez;
  contras: denso y más pensado para quien administra que para quien reserva.

## Consecuencias

- El rediseño del calendario se implementa sobre este patrón en `apps/web`.
- La decisión es provisoria ("por el momento"); el estilo general del sitio se
  define después con su propia búsqueda de inspiración y podría ajustar esta
  página para mantener coherencia visual.
- Referencias: https://calendly.com, https://cal.com,
  https://www.jicoo.com/en/changelog/booking-pages-have-a-new-design
