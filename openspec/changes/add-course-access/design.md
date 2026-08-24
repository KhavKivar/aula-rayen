## Context

La confirmación de Webpay crea una fila única en `course_purchases` para el usuario y curso. El dashboard actual carga cursos sin estado de compra y sus enlaces de video y archivo no se presentan en una ruta de aprendizaje.

## Goals / Non-Goals

**Goals:**

- Usar `course_purchases` como única fuente de autorización de acceso.
- Cambiar la acción de pago por navegación para cursos adquiridos.
- Proteger el endpoint que entrega enlaces de contenido.

**Non-Goals:**

- Carro con múltiples cursos, progreso del alumno, certificados o gestión de reembolsos.
- Migrar o cambiar la integración de Webpay.
- Generar URLs firmadas para los proveedores de video o archivos existentes.

## Decisions

### Catálogo autenticado separado

El dashboard solicitará un endpoint autenticado de catálogo que devuelve cada curso con `hasAccess`. Se conserva el catálogo general existente para no cambiar su contrato público. Alternativa descartada: entregar todas las compras al navegador y calcular la pertenencia allí; expondría datos innecesarios y deja la autorización fuera del servidor.

### Contenido mediante endpoint protegido

La nueva ruta frontend `/courses/$courseId` cargará el detalle desde un endpoint autenticado que exige una fila `course_purchases` del usuario. Alternativa descartada: reutilizar el detalle público actual; sus enlaces de contenido no deben ser la fuente de una vista protegida.

### Experiencia de consumo con datos actuales

La vista mostrará los datos del curso, un reproductor o enlace al video según el valor existente de `videoLink`, y una acción para abrir o descargar `fileLink`. Esto permite exponer el contenido actual sin incorporar un nuevo proveedor multimedia.

## Risks / Trade-offs

- [Los enlaces actuales pueden ser públicos] → El backend no los entrega a usuarios sin compra; proteger el almacenamiento con URLs firmadas queda como mejora posterior.
- [Una compra se confirma durante una sesión abierta del dashboard] → El usuario recarga o vuelve al panel tras la pantalla de pago y recibe el estado actualizado de la API.
- [Rutas estáticas y rutas parametrizadas pueden solaparse] → Registrar los endpoints estáticos del catálogo autenticado antes del parámetro `:id`.

## Migration Plan

1. Desplegar las consultas y rutas de backend protegidas.
2. Desplegar el dashboard y la ruta de contenido que consumen esas rutas.
3. Para rollback, restaurar el catálogo previo; no hay cambios de datos ni migraciones.
