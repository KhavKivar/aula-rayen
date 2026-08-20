## Why

La plataforma necesita presentar y vender con claridad la experiencia de Elena Montes como psicóloga tallerista a otros profesionales de la psicología. La página actual del producto solo conduce al inicio de sesión y no comunica la oferta de cursos, las metodologías listas para facilitar ni el valor de los materiales profesionales incluidos.

## What Changes

- Sustituir la portada pública actual por una landing comercial en español dirigida inicialmente a psicólogos y psicólogas.
- Presentar una propuesta de valor centrada en talleres psicológicos listos para facilitar: formación, dinámica paso a paso y kit de materiales descargables.
- Incorporar un catálogo inicial de cursos con información suficiente para comprender cada oferta y avanzar hacia su adquisición.
- Comunicar la experiencia, formación y enfoque de Elena con datos provenientes de sus canales profesionales públicos y contenido aprobado por ella.
- Incorporar evidencia de su experiencia práctica mediante una selección editorial de publicaciones o recursos de Instagram, sin depender de un feed automático.
- Explicar qué incluye el producto, para quién es, cómo funciona y qué licencia de uso recibe el comprador.
- Definir llamados a la acción hacia los cursos y conservar el acceso a las rutas existentes de autenticación.
- Establecer una experiencia adaptable, accesible, rápida y con metadatos básicos para buscadores y redes sociales.
- Dejar fuera de este cambio el checkout, el procesamiento de pagos, la entrega autenticada de archivos y la administración del catálogo; los llamados de compra podrán apuntar a destinos configurables hasta que esas capacidades existan.

## Capabilities

### New Capabilities

- `professional-course-landing`: Portada comercial pública que presenta a Elena, su oferta de cursos para psicólogos, la evidencia profesional, los términos generales de uso de materiales y las vías para explorar o adquirir cursos.

### Modified Capabilities

<!-- No existing capabilities are modified. -->

## Impact

- Reemplaza el contenido de `frontend/src/app/page.tsx` y amplía los estilos/componentes públicos del frontend Next.js.
- Actualiza los metadatos globales y el idioma del documento para reflejar la oferta comercial en español.
- Requiere activos y contenido aprobados por Elena: fotografía, imágenes de talleres, datos profesionales, cursos iniciales, precios o destino de CTA y texto definitivo de licencia.
- Puede enlazar a Instagram y a destinos externos configurables, pero no requiere una integración con la API de Instagram.
- No modifica las APIs del backend ni las rutas existentes de inicio de sesión y registro.
