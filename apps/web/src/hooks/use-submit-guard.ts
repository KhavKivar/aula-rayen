import { useRef } from "react";

/**
 * Evita doble submit de formularios (doble Enter/click) mientras una
 * mutación está en vuelo. La tarea recibe `release` para liberar el
 * guard, típicamente en `onSettled` de la mutación.
 *
 * @example
 * const guardedSubmit = useSubmitGuard();
 * onSubmit: ({ value }) =>
 *   guardedSubmit((release) => mutation.mutate(value, { onSettled: release }));
 */
export function useSubmitGuard() {
  const pendingRef = useRef(false);

  return (task: (release: () => void) => void) => {
    if (pendingRef.current) return;

    pendingRef.current = true;
    task(() => {
      pendingRef.current = false;
    });
  };
}
