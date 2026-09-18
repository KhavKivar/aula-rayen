## Purpose

Define cómo la API de Aula Rayen se valida, empaqueta y despliega en Dokploy como
una imagen inmutable, de modo que producción nunca dependa de una compilación en el
VPS ni de un tag móvil para identificar la versión en ejecución.

## ADDED Requirements

### Requirement: Validación previa al despliegue
El sistema de CI MUST ejecutar lint, typecheck, tests y build de `packages/contracts`
y `apps/api` antes de que una imagen de la API pueda publicarse o desplegarse.

#### Scenario: Cambio válido en la API
- **WHEN** se abre un PR que modifica `apps/api/**` o `packages/contracts/**`
- **THEN** CI corre la validación de contratos y API y reporta éxito o fallo en el PR

#### Scenario: Cambio inválido no llega a producción
- **WHEN** un push a `main` no pasa la validación de contratos o API
- **THEN** no se publica ninguna imagen nueva y Dokploy no recibe un nuevo despliegue

### Requirement: Imagen inmutable y trazable
Cada despliegue de la API MUST usar una imagen identificable de forma unívoca con el
commit que la produjo, publicada en un registry de contenedores, y MUST NOT usar
`:latest` como referencia de producción.

#### Scenario: Publicación de imagen
- **WHEN** un push a `main` pasa la validación
- **THEN** se publica una imagen con el tag del commit y su digest queda registrado en el log del workflow

#### Scenario: Identificación de la versión desplegada
- **WHEN** se inspecciona el servicio de la API en producción
- **THEN** la imagen en ejecución corresponde a un tag de commit y no a `latest`

### Requirement: Despliegue sin compilación en el VPS
El backend desplegado por Dokploy MUST consumir una imagen ya construida y MUST NOT
recompilar el repositorio en el host de producción durante el despliegue.

#### Scenario: Despliegue normal
- **WHEN** se dispara un despliegue de la API tras publicar una imagen
- **THEN** Dokploy descarga y ejecuta la imagen publicada sin ejecutar `docker build` sobre el código fuente

### Requirement: Migraciones antes del arranque de la API
El despliegue MUST aplicar las migraciones de Drizzle de forma explícita y la API
MUST arrancar solo después de que las migraciones terminen correctamente.

#### Scenario: Migración exitosa
- **WHEN** un despliegue arranca con migraciones pendientes
- **THEN** el servicio de migración corre desde la misma imagen, termina con éxito y luego inicia la API

#### Scenario: Migración fallida
- **WHEN** la migración termina con error
- **THEN** la API no arranca con el nuevo código y el despliegue queda en fallo visible

### Requirement: La API reporta la versión desplegada
La API MUST exponer en su endpoint de salud la versión correspondiente al tag de la
imagen en ejecución, de forma que el pipeline pueda verificar qué commit está sirviendo
producción en lugar de asumirlo.

#### Scenario: Consulta de salud
- **WHEN** se consulta `GET /health` en una instancia desplegada
- **THEN** la respuesta incluye el estado y la versión asociada al tag de la imagen

#### Scenario: Verificación de despliegue
- **WHEN** el pipeline despliega el commit `sha-abc1234`
- **THEN** considera el despliegue completado solo cuando `/health` reporta `sha-abc1234`

#### Scenario: Versión ausente en desarrollo
- **WHEN** la API corre localmente sin variable de versión configurada
- **THEN** `/health` sigue respondiendo con estado correcto y una versión por defecto no vacía

### Requirement: Rollback por versión publicada
El sistema MUST permitir volver a una versión anterior de la API redesplegando una
imagen ya publicada, sin reconstruir el código.

#### Scenario: Reversión de un despliegue defectuoso
- **WHEN** la versión recién desplegada presenta un fallo y se elige la imagen del commit anterior
- **THEN** Dokploy ejecuta esa imagen previa y la API vuelve a ese comportamiento

### Requirement: Separación entre secretos de aplicación y credenciales de despliegue
Los secretos de ejecución de la API MUST permanecer en el entorno de Dokploy, y las
credenciales usadas por el pipeline MUST limitarse a publicar la imagen y disparar el
despliegue.

#### Scenario: Rotación de un secreto de aplicación
- **WHEN** cambia un secreto de la API (por ejemplo la clave de Transbank)
- **THEN** se actualiza en Dokploy sin modificar el workflow ni reconstruir la imagen

#### Scenario: Fuga de credencial del pipeline
- **WHEN** se compromete la credencial usada por CI
- **THEN** su alcance permite publicar imágenes y disparar despliegues, pero no expone los secretos de ejecución de la API
