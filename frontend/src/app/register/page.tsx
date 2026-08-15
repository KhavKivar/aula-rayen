import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f4f4f4] px-4 py-10">
      <Card className="w-full max-w-sm gap-8 rounded-[28px] px-1 py-7 shadow-[0_2px_3px_rgba(0,0,0,0.12),0_12px_28px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
        <CardHeader className="gap-2 px-6">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Crear cuenta
          </CardTitle>
          <CardDescription className="text-[15px] leading-relaxed">
            Completa tus datos para comenzar.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  );
}
