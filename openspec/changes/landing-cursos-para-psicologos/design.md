## Context

La portada de `frontend` es actualmente un componente cliente mínimo que solo enlaza a `/login` y `/register`. El proyecto utiliza Next.js 16, React 19, Tailwind CSS 4 y componentes UI locales. No hay un catálogo ni endpoints de comercio en el backend, y la propuesta excluye pagos y entrega protegida.

La información profesional inicial proviene del sitio público de Elena, pero las fotografías, publicaciones de talleres, métricas, precios y textos comerciales definitivos deben ser aprobados por ella antes de publicarse. Instagram no ofrece una fuente pública estable para renderizar el perfil sin autenticación.

## Goals / Non-Goals

**Goals:**

- Construir una portada pública rápida y orientada a conversión para psicólogos y psicólogas.
- Mantener el contenido inicial sencillo de actualizar sin introducir un CMS.
- Separar datos comerciales, composición visual y componentes reutilizables.
- Hacer que los CTA funcionen tanto con destinos internos futuros como con destinos externos provisionales.
- Evitar que una dependencia de Instagram determine la disponibilidad o el rendimiento de la portada.

**Non-Goals:**

- Crear checkout, pagos, carrito, panel administrativo o entrega de archivos.
- Sincronizar automáticamente publicaciones, seguidores o métricas de Instagram.
- Crear páginas de detalle completas para cada curso en este cambio.
- Publicar afirmaciones clínicas, resultados o testimonios que no estén expresamente aprobados.

## Decisions

### Renderizar la landing principalmente en el servidor

La ruta principal se compondrá como página de servidor y reservará componentes cliente solo para interacciones que realmente lo requieran, como un menú móvil o acordeones. Esto reduce JavaScript enviado al navegador y favorece carga inicial, indexación y accesibilidad.

Alternativa considerada: conservar toda la portada como componente cliente. Se descarta porque la mayor parte del contenido es estático y no necesita estado de sesión para renderizarse.

### Modelar el contenido comercial como datos tipados locales

Los cursos, beneficios, credenciales, preguntas frecuentes y evidencias se definirán en un módulo de contenido tipado. Cada curso tendrá estado (`available` o `coming-soon`) y un destino opcional; solo el estado disponible aceptará un CTA navegable.

Alternativas consideradas: incrustar todo el texto directamente en JSX o introducir un CMS. JSX dificultaría mantener consistencia entre tarjetas; un CMS agrega operación y dependencias antes de que exista un flujo editorial que lo justifique.

### Usar evidencia editorial local enlazada a Instagram

Las imágenes o capturas aprobadas se servirán como activos optimizados del proyecto, con descripción y enlace a la publicación o perfil de origen. No se incrustará un feed automático ni se raspará Instagram en tiempo de ejecución.

Alternativa considerada: widget de feed de terceros. Se descarta por privacidad, rendimiento, fragilidad ante cambios de Instagram y dependencia de un proveedor adicional.

### Organizar la página como recorrido de decisión

La composición seguirá: encabezado, hero, problema/beneficio, catálogo, contenido de cada producto, metodología, evidencia, biografía, licencia, preguntas frecuentes y CTA final. La navegación utilizará anclas estables y conservará enlaces visibles a autenticación.

Alternativa considerada: priorizar una biografía extensa antes del catálogo. Se descarta porque retrasa la comprensión del producto; las credenciales funcionan mejor después de establecer la oferta.

### Diferenciar destinos externos

Los CTA se resolverán desde configuración de contenido. Los enlaces externos tendrán indicación accesible y tratamiento seguro; los cursos sin destino mostrarán “Próximamente” en lugar de una acción ficticia.

Alternativa considerada: apuntar todos los CTA al registro existente. Se descarta porque registrarse no equivale todavía a comprar ni solicitar información de un curso.

### Extender la identidad visual existente con una dirección cálida y profesional

Se reutilizarán Tailwind y los componentes locales, incorporando tokens visuales apropiados para una marca de psicología y arteterapia: superficies cálidas, contraste suficiente, tipografía editorial y detalles gráficos moderados. La identidad no copiará el sitio profesional actual; empleará activos y colores aprobados.

Alternativa considerada: reproducir exactamente el tema púrpura/beige del sitio existente. Se descarta para evitar una copia literal y porque la plataforma necesita una identidad comercial propia y accesible.

### Tratar metadatos y activos como parte del lanzamiento

La ruta declarará español, título, descripción, Open Graph y una imagen social local. Las imágenes usarán dimensiones conocidas y alternativas textuales; los activos decorativos no se anunciarán a tecnologías de asistencia.

## Risks / Trade-offs

- [Contenido definitivo incompleto] → Mantener placeholders claramente identificados en datos de desarrollo y exigir revisión editorial antes del lanzamiento.
- [Uso no autorizado de imágenes o publicaciones] → Incorporar solo activos entregados o aprobados por Elena y registrar su URL de origen.
- [Confusión entre formación y atención clínica] → Usar lenguaje dirigido a profesionales y separar la oferta educativa de los servicios terapéuticos.
- [Confusión sobre la licencia] → Mostrar un resumen visible y enlazar los términos completos cuando estén disponibles.
- [CTA sin infraestructura comercial] → Configurar destinos por curso y representar cursos sin destino como próximos lanzamientos.
- [Página extensa en móvil] → Priorizar contenido, usar secciones escaneables y evitar carruseles o interacciones que oculten información esencial.

## Migration Plan

1. Reunir y aprobar contenido, destinos de CTA y activos visuales antes de activar cursos como disponibles.
2. Implementar la nueva portada manteniendo `/login` y `/register` sin cambios.
3. Verificar la página en tamaños móviles y de escritorio, navegación por teclado, metadatos y enlaces externos.
4. Ejecutar lint y build de producción antes del despliegue.
5. Desplegar la portada; ante una regresión crítica, restaurar temporalmente la portada mínima anterior sin afectar autenticación ni backend.

## Open Questions

- ¿Cuál será el nombre comercial definitivo visible junto a Elena: “La plataforma”, una marca nueva o su nombre profesional?
- ¿Cuáles serán los primeros cursos, precios y destinos temporales de sus CTA?
- ¿Qué publicaciones e imágenes de Instagram autoriza Elena para reutilización comercial?
- ¿La licencia permitirá editar archivos fuente con identidad propia o únicamente imprimir y completar los materiales entregados?
