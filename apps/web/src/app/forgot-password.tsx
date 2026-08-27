import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f4f4f4] px-4 py-10">
      <Card className="w-full max-w-sm gap-8 rounded-[28px] px-1 py-7 shadow-[0_2px_3px_rgba(0,0,0,0.12),0_12px_28px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
        <CardHeader className="gap-2 px-6">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Recuperar contraseña
          </CardTitle>
          <CardDescription className="text-[15px] leading-relaxed">
            Ingresa tu correo y te enviaremos instrucciones si existe una cuenta
            asociada.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </main>
  );
}
