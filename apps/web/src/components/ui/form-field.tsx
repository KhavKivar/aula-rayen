import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

export function formFieldErrorId(inputId: string) {
  return `${inputId}-error`;
}

/**
 * Bloque Label + control + error para formularios TanStack Form.
 * El control (Input/textarea) se pasa como children y debe apuntar
 * `aria-describedby` a `errorId` cuando hay error.
 */
export function FormField({
  inputId,
  label,
  error,
  errorId = formFieldErrorId(inputId),
  labelAction,
  children,
}: {
  inputId: string;
  label: string;
  error?: string;
  errorId?: string;
  labelAction?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      {labelAction ? (
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor={inputId}>{label}</Label>
          {labelAction}
        </div>
      ) : (
        <Label htmlFor={inputId}>{label}</Label>
      )}
      {children}
      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
