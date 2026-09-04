import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useRef } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/features/auth/api/password-recovery";
import { AuthError } from "@/features/auth/errors/auth-error";
import {
  newPasswordSchema,
  type NewPassword,
} from "@/features/auth/schemas/password-recovery-schema";

export function ResetPasswordForm({ token }: { token: string }) {
  const submissionPending = useRef(false);
  const mutation = useMutation<void, AuthError, NewPassword>({
    mutationFn: (values) => resetPassword(token, values),
  });
  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    validators: { onSubmit: newPasswordSchema },
    onSubmit: ({ value }) => {
      if (submissionPending.current) return;

      submissionPending.current = true;
      mutation.mutate(value, {
        onSettled: () => {
          submissionPending.current = false;
        },
      });
    },
  });

  if (mutation.isSuccess) {
    return (
      <div className="space-y-6">
        <div role="status" className="space-y-2 text-sm leading-relaxed">
          <p className="font-medium text-foreground">Contraseña actualizada.</p>
          <p className="text-muted-foreground">
            Cerramos tus sesiones en todos los dispositivos. Inicia sesión
            nuevamente con tu nueva contraseña.
          </p>
        </div>
        <Link to="/login" className={buttonVariants({ className: "w-full" })}>
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (mutation.error?.code === "INVALID_TOKEN") {
    return <InvalidResetLink />;
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      noValidate
    >
      <form.Field name="password">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;

          return (
            <FormField
              inputId={field.name}
              label="Nueva contraseña"
              error={error}
              errorId="new-password-error"
            >
              <Input
                id={field.name}
                name={field.name}
                type="password"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "new-password-error" : undefined}
                className="h-11 bg-muted/80 px-4 shadow-none"
              />
            </FormField>
          );
        }}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;

          return (
            <FormField
              inputId={field.name}
              label="Confirmar nueva contraseña"
              error={error}
              errorId="confirm-password-error"
            >
              <Input
                id={field.name}
                name={field.name}
                type="password"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "confirm-password-error" : undefined}
                className="h-11 bg-muted/80 px-4 shadow-none"
              />
            </FormField>
          );
        }}
      </form.Field>

      {mutation.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {mutation.error.message}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={mutation.isPending}
      >
        <KeyRound data-icon="inline-start" />
        {mutation.isPending ? "Actualizando..." : "Actualizar contraseña"}
      </Button>
    </form>
  );
}

export function InvalidResetLink() {
  return (
    <div role="alert" className="space-y-6">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Este enlace venció, ya fue utilizado o no es válido. Solicita uno nuevo
        para continuar.
      </p>
      <Link
        to="/forgot-password"
        className={buttonVariants({ className: "w-full" })}
      >
        Solicitar un nuevo enlace
      </Link>
    </div>
  );
}
