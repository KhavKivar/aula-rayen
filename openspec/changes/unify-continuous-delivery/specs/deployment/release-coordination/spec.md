## Purpose

Define cómo se coordinan los despliegues de la API y la web para que un cambio
compartido (contratos o configuración del workspace) nunca deje producción con dos
versiones incompatibles, y para que ambos artefactos de un release queden atados al
mismo commit.

## ADDED Requirements

### Requirement: Detección de áreas cambiadas
El pipeline de despliegue MUST determinar qué aplicaciones cambió un push a `main`
(`packages/contracts/**` afecta a ambas, `apps/api/**` a la API, `apps/web/**` a la
web, y los archivos compartidos del workspace a ambas) y MUST desplegar únicamente
lo afectado.

#### Scenario: Cambio solo en la web
- **WHEN** un push a `main` modifica únicamente `apps/web/**`
- **THEN** se despliega la web y no se publica ni se despliega una imagen nueva de la API

#### Scenario: Cambio solo en la API
- **WHEN** un push a `main` modifica únicamente `apps/api/**`
- **THEN** se despliega la API y no se publica una nueva versión de la web

#### Scenario: Cambio en contratos
- **WHEN** un push a `main` modifica `packages/contracts/**`
- **THEN** se despliegan ambas aplicaciones en el orden coordinado

#### Scenario: Cambio en archivos compartidos
- **WHEN** un push a `main` modifica `pnpm-lock.yaml`, `pnpm-workspace.yaml` o la configuración raíz
- **THEN** se consideran ambas aplicaciones afectadas

### Requirement: Orden API antes que web
Cuando ambas aplicaciones se despliegan en el mismo release, la API MUST quedar
desplegada y verificada antes de que la web comience a publicarse.

#### Scenario: Release con contratos nuevos
- **WHEN** un release despliega una nueva imagen de la API y una nueva versión de la web
- **THEN** la web se publica solo después de que la API nueva esté sirviendo

#### Scenario: API falla
- **WHEN** el despliegue de la API falla o no supera su verificación de salud
- **THEN** la web NO se publica y el release queda en fallo visible

### Requirement: Verificación de salud de la API
Antes de desplegar la web, el pipeline MUST comprobar que la API responde en su
dominio público y reporta la versión del commit que se está desplegando.

#### Scenario: API lista
- **WHEN** la API desplegada reporta la versión del commit del release
- **THEN** el pipeline continúa con el despliegue de la web

#### Scenario: API no lista a tiempo
- **WHEN** la API no reporta la versión esperada dentro del tiempo límite
- **THEN** el pipeline falla sin desplegar la web

#### Scenario: Web sin cambios
- **WHEN** el release solo afecta a la API
- **THEN** el pipeline verifica la salud de la API y termina sin desplegar la web

### Requirement: Carril único de despliegue
Dos ejecuciones del pipeline de producción MUST NOT desplegar a la vez; una nueva
ejecución MUST esperar a que termine la anterior en lugar de cancelarla.

#### Scenario: Push consecutivo
- **WHEN** llega un segundo push a `main` mientras un despliegue está en curso
- **THEN** el segundo despliegue espera a que el primero termine y luego corre con su propio commit

### Requirement: Contratos retrocompatibles
Los cambios de contrato MUST ser retrocompatibles con la versión anterior durante la
ventana de despliegue (ampliar antes de eliminar), y una ruptura MUST NOT publicarse
en un solo release.

#### Scenario: Campo nuevo
- **WHEN** un contrato agrega un campo o endpoint
- **THEN** la versión anterior de la web sigue funcionando contra la API nueva

#### Scenario: Cambio incompatible
- **WHEN** un cambio de contrato elimina o renombra un campo en uso
- **THEN** se planifica en dos releases: primero ampliar y migrar, luego eliminar

### Requirement: Trazabilidad del release
Ambos artefactos de un release (imagen de la API y versión del Worker) MUST quedar
asociados al mismo commit, de modo que una reversión pueda volver al par consistente.

#### Scenario: Release completo
- **WHEN** un release despliega API y web
- **THEN** el resumen del pipeline registra el commit, el tag de la imagen y el identificador de la versión del Worker

#### Scenario: Auditoría de lo desplegado
- **WHEN** se quiere saber qué versión de cada aplicación está en producción
- **THEN** es posible determinar que ambas corresponden al mismo commit a partir de los artefactos y sus etiquetas

### Requirement: Rollback coordinado
El proyecto MUST documentar el orden y los comandos para revertir un release completo,
respetando que las migraciones de base de datos no se revierten automáticamente.

#### Scenario: Reversión de un release con contratos
- **WHEN** un release con cambios compartidos presenta un fallo
- **THEN** existe un procedimiento para volver la API y la web a versiones compatibles del mismo commit anterior

#### Scenario: Esquema ya migrado
- **WHEN** la API se revierte a una imagen anterior pero el esquema ya tiene migraciones nuevas
- **THEN** la versión anterior debe seguir funcionando con ese esquema o el procedimiento indica el paso manual requerido
