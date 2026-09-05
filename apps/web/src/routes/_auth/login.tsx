import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";
import { OAuthErrorAlert } from "@/features/auth/components/oauth-error-alert";
import { loginSearchSchema } from "@/features/auth/errors/oauth-error";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  validateSearch: loginSearchSchema,
  component: LoginPage,
});

function LoginPage() {
  const { error, redirect } = Route.useSearch();

  return (
    <Card className="w-full max-w-md gap-8 overflow-visible rounded-none bg-transparent py-0 shadow-none ring-0">
      <CardHeader className="gap-3 px-0">
        <CardTitle
          role="heading"
          aria-level={1}
          className="font-heading text-4xl font-normal tracking-tight"
        >
          Iniciar sesión
        </CardTitle>
        <CardDescription className="text-[15px] leading-relaxed">
          Ingresa tus credenciales para acceder a tu cuenta.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <OAuthErrorAlert error={error} />
        <LoginForm redirectTo={redirect ?? "/dashboard"} />
      </CardContent>
    </Card>
  );
}
