import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useAppForm, TextField } from "@/components/ui/form";
import { resetPassword } from "@/features/auth/api/password-recovery";
import { AuthError } from "@/features/auth/errors/auth-error";
import {
  newPasswordSchema,
  type NewPassword,
} from "@/features/auth/schemas/password-recovery-schema";
import { useSubmitGuard } from "@/hooks/use-submit-guard";

export function ResetPasswordForm({ token }: { token: string }) {
  const guardedSubmit = useSubmitGuard();
  const mutation = useMutation<void, AuthError, NewPassword>({
    mutationFn: (values) => resetPassword(token, values),
  });
  const form = useAppForm({
    defaultValues: { password: "", confirmPassword: "" },
    validators: { onSubmit: newPasswordSchema },
    onSubmit: ({ value }) => {
      guardedSubmit((release) => {
        mutation.mutate(value, { onSettled: release });
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
      <form.AppField name="password">
        {() => (
          <TextField
            label="Nueva contraseña"
            type="password"
            autoComplete="new-password"
            inputClassName="h-11 bg-card px-4 shadow-none"
          />
        )}
      </form.AppField>

      <form.AppField name="confirmPassword">
        {() => (
          <TextField
            label="Confirmar nueva contraseña"
            type="password"
            autoComplete="new-password"
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
