import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const Route = createFileRoute("/_auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <Card className="w-full max-w-md gap-8 overflow-visible rounded-none bg-transparent py-0 shadow-none ring-0">
      <CardHeader className="gap-3 px-0">
        <CardTitle
          role="heading"
          aria-level={1}
          className="font-heading text-4xl font-normal tracking-tight"
        >
          Crear cuenta
        </CardTitle>
        <CardDescription className="text-[15px] leading-relaxed">
          Completa tus datos para comenzar.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
