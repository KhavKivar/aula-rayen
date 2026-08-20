import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAccount } from "@/features/auth/api/register";
import { AuthError } from "@/features/auth/errors/auth-error";
import {
  registerSchema,
  type RegisterCredentials,
} from "@/features/auth/schemas/register-schema";

export function RegisterForm() {
  const navigate = useNavigate();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((credentials) =>
        registerMutation.mutate(credentials),
      )}
      noValidate
    >
      <div className="space-y-2.5">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          type="text"
          placeholder="Tu nombre"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="h-11 bg-muted/80 px-4 shadow-none"
          {...register("name")}
        />
        {errors.name?.message ? (
          <p id="name-error" className="text-xs text-destructive">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="register-email">Correo electrónico</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="nombre@ejemplo.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          className="h-11 bg-muted/80 px-4 shadow-none"
          {...register("email")}
        />
        {errors.email?.message ? (
          <p id="register-email-error" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="register-password">Contraseña</Label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "register-password-error" : undefined
          }
          className="h-11 bg-muted/80 px-4 shadow-none"
          {...register("password")}
        />
        {errors.password?.message ? (
          <p id="register-password-error" className="text-xs text-destructive">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="confirm-password">Confirmar contraseña</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={
            errors.confirmPassword ? "confirm-password-error" : undefined
          }
          className="h-11 bg-muted/80 px-4 shadow-none"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword?.message ? (
          <p id="confirm-password-error" className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

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
