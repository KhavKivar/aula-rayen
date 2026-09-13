## 1. API de acceso a cursos

- [x] 1.1 Añadir consultas de repositorio que devuelvan el catálogo con `hasAccess` para el usuario autenticado y verifiquen una compra por curso.
- [x] 1.2 Exponer endpoints autenticados para el catálogo del usuario y el contenido de un curso adquirido, con respuestas de acceso denegado seguras.
- [x] 1.3 Añadir pruebas de servicio o controlador para acceso adquirido, no adquirido y contenido no autorizado.

## 2. Dashboard y contenido del curso

- [x] 2.1 Adaptar el tipo y la consulta del catálogo frontend al estado de acceso proporcionado por la API.
- [x] 2.2 Cambiar la tarjeta para mostrar “Ver curso” en cursos adquiridos y conservar Webpay para cursos sin acceso.
- [x] 2.3 Crear la ruta protegida de contenido que muestra video y material usando los enlaces actuales del curso.

## 3. Verificación

- [x] 3.1 Añadir pruebas de interfaz para las acciones de pago y acceso, y para la vista de curso adquirida.
- [x] 3.2 Ejecutar lint, typecheck, pruebas y build de las aplicaciones afectadas.
