## Why

Después de un pago autorizado, el usuario obtiene una fila en `course_purchases`, pero el catálogo sigue mostrando el mismo botón de pago y no existe una vista para consumir el curso adquirido. El acceso debe reflejar la compra real almacenada en la base de datos.

## What Changes

- Exponer el estado de compra del curso para el usuario autenticado al cargar el catálogo.
- Cambiar la acción de un curso adquirido desde pago Webpay a acceso al contenido.
- Añadir una vista protegida de curso que muestre el video y el material ya disponibles en los datos actuales.
- Rechazar el acceso directo a contenido de cursos no adquiridos.

## Capabilities

### New Capabilities

- `course-access`: Estado de compra, acceso protegido a cursos y presentación de contenido adquirido.

### Modified Capabilities

- Ninguna.

## Impact

- Backend: consultas autenticadas de cursos y validación de `course_purchases`.
- Frontend: tipo y consulta de curso, tarjeta del catálogo y nueva ruta de contenido.
- API: el catálogo autenticado incluirá el estado de acceso por curso.
