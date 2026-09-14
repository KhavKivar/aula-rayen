import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppForm, TextField } from "@/components/ui/form";
import { registerAccount } from "@/features/auth/api/register";
import { clearSessionCache } from "@/lib/session-cache";
import { AuthError } from "@/features/auth/errors/auth-error";
import {
  registerSchema,
  type RegisterCredentials,
} from "@/features/auth/schemas/register-schema";

const inputClassName = "h-11 bg-card px-4 shadow-none";

export function RegisterForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const router = useRouter();

  const registerMutation = useMutation<void, AuthError, RegisterCredentials>({
    mutationFn: registerAccount,
    onSuccess: async () => {
      await clearSessionCache(queryClient);
      await navigate({ to: "/", replace: true });
      await router.invalidate();
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      registerMutation.mutate(value);
    },
  });

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
      <form.AppField name="name">
        {() => (
          <TextField
            label="Nombre"
            placeholder="Tu nombre"
            autoComplete="name"
            inputClassName={inputClassName}
          />
        )}
      </form.AppField>

      <form.AppField name="email">
        {() => (
          <TextField
            label="Correo electrónico"
            type="email"
            placeholder="nombre@ejemplo.com"
            autoComplete="email"
            inputClassName={inputClassName}
          />
        )}
      </form.AppField>

      <form.AppField name="password">
        {() => (
          <TextField
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            inputClassName={inputClassName}
          />
        )}
      </form.AppField>

      <form.AppField name="confirmPassword">
        {() => (
          <TextField
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            inputClassName={inputClassName}
          />
        )}
      </form.AppField>

      {registerMutation.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {registerMutation.error.message || "No fue posible crear la cuenta."}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={registerMutation.isPending}
      >
        <UserPlus data-icon="inline-start" />
        {registerMutation.isPending ? "Creando cuenta..." : "Crear cuenta"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link
          to="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
