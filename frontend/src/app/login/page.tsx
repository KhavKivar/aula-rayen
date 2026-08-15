import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f4f4f4] px-4 py-10">
      <Card className="w-full max-w-sm gap-8 rounded-[28px] px-1 py-7 shadow-[0_2px_3px_rgba(0,0,0,0.12),0_12px_28px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
        <CardHeader className="gap-2 px-6">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Iniciar sesión
          </CardTitle>
          <CardDescription className="text-[15px] leading-relaxed">
            Ingresa tus credenciales para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
