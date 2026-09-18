## Purpose

Define cómo el Worker de Aula Rayen se valida, publica y verifica en Cloudflare,
de modo que cada despliegue sea trazable a un commit, esté cubierto por pruebas y
pueda revertirse con las versiones nativas de Cloudflare.

## ADDED Requirements

### Requirement: Validación previa al despliegue web
El sistema de CI MUST ejecutar lint, typecheck, tests unitarios, build y
`check:landing` de `apps/web` antes de que una versión pueda publicarse en producción.

#### Scenario: Cambio válido en la web
- **WHEN** se abre un PR que modifica `apps/web/**` o `packages/contracts/**`
- **THEN** CI corre la validación de la web y reporta éxito o fallo en el PR

#### Scenario: Cambio inválido no llega a producción
- **WHEN** la validación de la web falla
- **THEN** no se publica una nueva versión del Worker

### Requirement: Versión del Worker etiquetada con el commit
Cada despliegue del Worker MUST registrarse en Cloudflare con una etiqueta o mensaje
que identifique el commit que lo produjo, de forma que el historial de versiones sea
trazable sin depender del log de CI.

#### Scenario: Despliegue trazable
- **WHEN** el pipeline despliega la web del commit `abc1234`
- **THEN** la versión del Worker queda etiquetada con `abc1234` y su identificador se registra en el resumen del job

#### Scenario: Verificación de la versión
- **WHEN** se revisa el historial de versiones del Worker en Cloudflare
- **THEN** es posible asociar cada versión reciente con su commit

### Requirement: Verificación posterior al despliegue
Después de publicar la web, el pipeline MUST comprobar contra el dominio de producción
que la aplicación responde y sirve el contenido esperado de la landing.

#### Scenario: Smoke test exitoso
- **WHEN** termina un despliegue web
- **THEN** el pipeline consulta el dominio de producción y valida respuesta correcta y contenido clave

#### Scenario: Smoke test fallido
- **WHEN** el dominio de producción no responde o no sirve el contenido esperado
- **THEN** el job de despliegue falla de forma visible

### Requirement: Configuración pública validada antes del build
Las variables `VITE_PUBLIC_*` que se incorporan al bundle MUST estar presentes y
coincidir con los destinos de producción antes de construir, y el pipeline MUST NOT
publicar una web cuyos destinos no correspondan al entorno.

#### Scenario: Variables ausentes
- **WHEN** falta una variable `VITE_PUBLIC_*` requerida
- **THEN** el pipeline falla antes de construir y no se publica nada

### Requirement: Rollback documentado
El proyecto MUST documentar el procedimiento para revertir la web a una versión
anterior y MUST conservar las versiones recientes necesarias para hacerlo.

#### Scenario: Reversión de un despliegue defectuoso
- **WHEN** una versión recién publicada presenta un fallo
- **THEN** existe un procedimiento reproducible para volver a la versión anterior y verificar la reversión
