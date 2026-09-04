import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { registerAccount } from "@/features/auth/api/register";
import { AuthError } from "@/features/auth/errors/auth-error";
import {
  registerSchema,
  type RegisterCredentials,
} from "@/features/auth/schemas/register-schema";

export function RegisterForm() {
  const navigate = useNavigate();
  const router = useRouter();

  const registerMutation = useMutation<
    void,
    AuthError,
    RegisterCredentials
  >({
    mutationFn: registerAccount,
    onSuccess: async () => {
      await navigate({ to: "/", replace: true });
      await router.invalidate();
    },
  });

  const form = useForm({
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
      <form.Field name="name">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;

          return (
            <FormField inputId="name" label="Nombre" error={error}>
              <Input
                id="name"
                name={field.name}
                type="text"
                placeholder="Tu nombre"
                autoComplete="name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "name-error" : undefined}
                className="h-11 bg-muted/80 px-4 shadow-none"
              />
            </FormField>
          );
        }}
      </form.Field>

      <form.Field name="email">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;

          return (
            <FormField
              inputId="register-email"
              label="Correo electrónico"
              error={error}
            >
              <Input
                id="register-email"
                name={field.name}
                type="email"
                placeholder="nombre@ejemplo.com"
                autoComplete="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "register-email-error" : undefined}
                className="h-11 bg-muted/80 px-4 shadow-none"
              />
            </FormField>
          );
        }}
      </form.Field>

      <form.Field name="password">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;

          return (
            <FormField
              inputId="register-password"
              label="Contraseña"
              error={error}
            >
              <Input
                id="register-password"
                name={field.name}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "register-password-error" : undefined}
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
              inputId="confirm-password"
              label="Confirmar contraseña"
              error={error}
            >
              <Input
                id="confirm-password"
                name={field.name}
                type="password"
                placeholder="••••••••"
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
