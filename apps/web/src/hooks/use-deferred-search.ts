import { useDeferredValue } from "react";

export function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("es-CL");
}

/**
 * Búsqueda diferida y normalizada (trim + minúsculas es-CL) para
 * filtrar listas sin bloquear el input. El valor diferido tarda un
 * render en actualizarse; los tests deben esperar con findBy o waitFor.
 */
export function useDeferredSearch(query: string) {
  return useDeferredValue(normalizeSearch(query));
}
