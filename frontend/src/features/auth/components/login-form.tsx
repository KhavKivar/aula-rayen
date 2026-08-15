"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, loginWithGoogle } from "@/features/auth/api/login";
import { AuthError } from "@/features/auth/errors/auth-error";
import {
  loginSchema,
  type LoginCredentials,
} from "@/features/auth/schemas/login-schema";
import { GoogleIcon } from "@/features/auth/components/google-icon";

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation<void, AuthError, LoginCredentials>({
    mutationFn: login,
    onSuccess: () => {
      router.replace("/");
      router.refresh();
    },
  });

  const googleLoginMutation = useMutation<void, AuthError>({
    mutationFn: loginWithGoogle,
  });

  function onSubmit(credentials: LoginCredentials) {
    loginMutation.mutate(credentials);
  }

  return (
    <form className="space-y-7" onSubmit={handleSubmit(onSubmit)} noValidate>
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

      <div className="space-y-2.5">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="nombre@ejemplo.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="h-11 bg-muted/80 px-4 shadow-none"
          {...register("email")}
        />
        {errors.email?.message ? (
          <p id="email-error" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="password">Contraseña</Label>
          <a
            href="#"
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            ¿La olvidaste?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          className="h-11 bg-muted/80 px-4 shadow-none"
          {...register("password")}
        />
        {errors.password?.message ? (
          <p id="password-error" className="text-xs text-destructive">
            {errors.password.message}
          </p>
        ) : null}
      </div>

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
          href="/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </form>
  );
}
