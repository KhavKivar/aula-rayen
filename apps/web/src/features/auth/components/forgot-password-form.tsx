import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useAppForm, TextField } from "@/components/ui/form";
import { requestPasswordReset } from "@/features/auth/api/password-recovery";
import { AuthError } from "@/features/auth/errors/auth-error";
import {
  passwordResetRequestSchema,
  type PasswordResetRequest,
} from "@/features/auth/schemas/password-recovery-schema";
import { useSubmitGuard } from "@/hooks/use-submit-guard";

const CONFIRMATION =
  "Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.";

export function ForgotPasswordForm() {
  const guardedSubmit = useSubmitGuard();
  const mutation = useMutation<void, AuthError, PasswordResetRequest>({
    mutationFn: requestPasswordReset,
  });
  const form = useAppForm({
    defaultValues: { email: "" },
    validators: { onSubmit: passwordResetRequestSchema },
    onSubmit: ({ value }) => {
      guardedSubmit((release) => {
        mutation.mutate(value, { onSettled: release });
      });
    },
  });

  if (mutation.isSuccess) {
    return (
      <div className="space-y-6">
        <p role="status" className="text-sm leading-relaxed text-foreground">
          {CONFIRMATION}
        </p>
        <Link
          to="/login"
          className={buttonVariants({
            variant: "outline",
            className: "w-full",
          })}
        >
          Volver a iniciar sesión
        </Link>
      </div>
    );
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
      <form.AppField name="email">
        {() => (
          <TextField
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="nombre@ejemplo.com"
            inputClassName="h-11 bg-card px-4 shadow-none"
          />
        )}
      </form.AppField>

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
        <Mail data-icon="inline-start" />
        {mutation.isPending ? "Enviando..." : "Enviar instrucciones"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          to="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Volver a iniciar sesión
        </Link>
      </p>
    </form>
  );
}
