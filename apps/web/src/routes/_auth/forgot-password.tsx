import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md gap-8 overflow-visible rounded-none bg-transparent py-0 shadow-none ring-0">
      <CardHeader className="gap-3 px-0">
        <CardTitle
          role="heading"
          aria-level={1}
          className="font-heading text-4xl font-normal tracking-tight"
        >
          Recuperar contraseña
        </CardTitle>
        <CardDescription className="text-[15px] leading-relaxed">
          Ingresa tu correo y te enviaremos instrucciones si existe una cuenta
          asociada.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
