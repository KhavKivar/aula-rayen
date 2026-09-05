import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { login, loginWithGoogle } from "@/features/auth/api/login";
import { GoogleIcon } from "@/features/auth/components/google-icon";
import { AuthError } from "@/features/auth/errors/auth-error";
import {
  loginSchema,
  type LoginCredentials,
} from "@/features/auth/schemas/login-schema";

import { sessionQueries } from "@/lib/session-queries";

export function LoginForm({
  redirectTo = "/dashboard",
}: {
  redirectTo?: string;
}) {
  const router = useRouter();

  // const { refetch: refetchSession } = useSession();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const loginMutation = useMutation<
    Awaited<ReturnType<typeof login>>,
    AuthError,
    LoginCredentials
  >({
    mutationFn: login,

    onSuccess: async () => {
      // await refetchSession();

      // await router.invalidate();
      // router.history.push(redirectTo);
      await queryClient.invalidateQueries({
        queryKey: sessionQueries.session.queryKey,
      });
      await router.invalidate();
      await navigate({ to: redirectTo, replace: true });
    },
  });

  const googleLoginMutation = useMutation<void, AuthError>({
    mutationFn: () => loginWithGoogle(redirectTo),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value);
    },
  });

  return (
    <form
      className="space-y-7"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      noValidate
    >
      <div className="space-y-5">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={googleLoginMutation.isPending}
          onClick={() => googleLoginMutation.mutate()}
        >
          <GoogleIcon data-icon="inline-start" />
          {googleLoginMutation.isPending
            ? "Conectando con Google..."
            : "Continuar con Google"}
        </Button>

        {googleLoginMutation.isError ? (
          <p role="alert" className="text-sm text-destructive">
            {googleLoginMutation.error.message}
          </p>
        ) : null}

        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            o con correo
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>

      <form.Field name="email">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;

          return (
            <FormField
              inputId={field.name}
              label="Correo electrónico"
              error={error}
            >
              <Input
                id={field.name}
                name={field.name}
                type="email"
                placeholder="nombre@ejemplo.com"
                autoComplete="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "email-error" : undefined}
                className="h-11 bg-card px-4 shadow-none"
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
              inputId={field.name}
              label="Contraseña"
              error={error}
              labelAction={
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                >
                  ¿La olvidaste?
                </Link>
              }
            >
              <Input
                id={field.name}
                name={field.name}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "password-error" : undefined}
                className="h-11 bg-card px-4 shadow-none"
              />
            </FormField>
          );
        }}
      </form.Field>

      {loginMutation.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {loginMutation.error.message || "No fue posible iniciar sesión."}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loginMutation.isPending}
      >
        <LogIn data-icon="inline-start" />
        {loginMutation.isPending ? "Ingresando..." : "Ingresar"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link
          to="/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </form>
  );
}
