## 1. Documentar el contrato de pruebas web

- [x] 1.1 Añadir a la documentación de `apps/web` la matriz para elegir unit, component/integration o E2E y ejemplos de los contratos que corresponde proteger en cada nivel.
- [x] 1.2 Documentar la jerarquía de queries accesibles, las excepciones justificadas para `data-testid` y la política de mocks, spies y fronteras externas.
- [x] 1.3 Documentar los comandos no interactivos, requisitos locales y pasos de diagnóstico para la suite rápida y E2E.

## 2. Fortalecer el entorno Vitest compartido

- [x] 2.1 Extender las utilidades de `src/testing` para crear providers y estado aislados por render, incluyendo configuración explícita de TanStack Query y routing cuando un escenario lo requiera.
- [x] 2.2 Añadir pruebas para demostrar que el estado remoto, la ruta inicial y otros contextos configurables no se filtran entre casos.
- [x] 2.3 Revisar la configuración de Vitest para excluir artefactos E2E y conservar una ejecución rápida, determinista y sin modo watch mediante `test:run`.

## 3. Establecer pruebas de referencia

- [x] 3.1 Auditar las pruebas existentes de `apps/web` e identificar selectores estructurales, `data-testid`, spies y mocks de detalles internos que contradigan la estrategia.
- [x] 3.2 Ajustar las pruebas del formulario de login para que cubran validación, estado pendiente, error, éxito y retorno solicitado usando controles y resultados observables.
- [x] 3.3 Ajustar la prueba de protección de rutas para verificar el contrato de acceso y redirección con routing representativo en vez de internals del router.
- [x] 3.4 Migrar al menos una prueba representativa fuera de autenticación para demostrar composición real de componentes/providers y dobles limitados a fronteras externas.
- [x] 3.5 Ejecutar `pnpm test:run`, corregir regresiones y confirmar que los casos de referencia permanecen aislados cuando se ejecutan juntos o individualmente.

## 4. Incorporar recorridos E2E críticos

- [x] 4.1 Añadir Playwright como dependencia de desarrollo de `apps/web`, crear su configuración local y definir scripts separados para ejecución y diagnóstico E2E.
- [x] 4.2 Configurar el inicio y cierre controlado de la aplicación web para E2E, con `baseURL`, entorno de prueba y artefactos diagnósticos conservados al fallar.
- [x] 4.3 Crear fixtures o interceptaciones en fronteras remotas para representar una sesión ausente, login exitoso y acceso autenticado sin invocar servicios externos reales.
- [x] 4.4 Implementar el recorrido E2E que solicita una ruta protegida, completa el login mediante labels y roles y confirma el retorno a esa ruta.
- [x] 4.5 Añadir escenarios E2E para credenciales rechazadas y confirmar que el usuario permanece fuera del contenido protegido con un error visible.
- [x] 4.6 Ejecutar la suite E2E repetidamente en limpio y verificar que un fallo genera trace o captura suficiente para diagnosticarlo.

## 5. Automatizar y validar

- [x] 5.1 Integrar `pnpm test:run` en la validación automatizada que responde a cambios de `apps/web` y asegurar que bloquee ante regresiones.
- [x] 5.2 Añadir un job E2E separado con instalación reproducible del navegador, servidor controlado y publicación de evidencia solo al fallar.
- [x] 5.3 Ejecutar desde `apps/web` `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run`, la suite E2E y `pnpm build`, y corregir cualquier fallo relacionado con el cambio.
