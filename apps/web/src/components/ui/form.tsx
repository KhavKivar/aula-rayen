import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import type { ReactNode } from "react";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

/**
 * Campo de texto ligado a TanStack Form: encapsula el wiring repetido
 * (error, aria-invalid, aria-describedby) sobre FormField + Input.
 * Debe renderizarse dentro de `form.AppField` (usa `useFieldContext`).
 */
export function TextField({
  label,
  labelAction,
  placeholder,
  type,
  autoComplete,
  min,
  step,
  inputClassName,
}: {
  label: string;
  labelAction?: ReactNode;
  placeholder?: string;
  type?: "email" | "password" | "text" | "url";
  autoComplete?: string;
  min?: number;
  step?: number;
  inputClassName?: string;
}) {
  const field = useFieldContext<string>();
  const error = field.state.meta.errors[0]?.message;

  return (
    <FormField
      inputId={field.name}
      label={label}
      labelAction={labelAction}
      error={error}
    >
      <Input
        id={field.name}
        name={field.name}
        type={type}
        min={min}
        step={step}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${field.name}-error` : undefined}
        className={inputClassName}
      />
    </FormField>
  );
}

/**
 * Campo de textarea ligado a TanStack Form, con el mismo wiring que
 * `TextField`. Debe renderizarse dentro de `form.AppField`.
 */
export function TextareaField({
  label,
  placeholder,
  inputClassName,
}: {
  label: string;
  placeholder?: string;
  inputClassName?: string;
}) {
  const field = useFieldContext<string>();
  const error = field.state.meta.errors[0]?.message;

  return (
    <FormField inputId={field.name} label={label} error={error}>
      <textarea
        id={field.name}
        name={field.name}
        placeholder={placeholder}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${field.name}-error` : undefined}
        className={cn(
          "min-h-24 w-full rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm outline-none transition-[color,box-shadow,background-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          inputClassName,
        )}
      />
    </FormField>
  );
}

export const { useAppForm } = createFormHook({
  fieldComponents: { TextField, TextareaField },
  formComponents: {},
  fieldContext,
  formContext,
});
