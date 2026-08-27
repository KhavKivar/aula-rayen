import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InvalidResetLink,
  ResetPasswordForm,
} from "@/features/auth/components/reset-password-form";
import {
  resetPasswordSearchSchema,
  type ResetPasswordSearch,
} from "@/features/auth/schemas/password-recovery-schema";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search): ResetPasswordSearch => {
    const result = resetPasswordSearchSchema.safeParse(search);
    return result.success ? result.data : { error: "INVALID_TOKEN" };
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const search = Route.useSearch();

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f4f4f4] px-4 py-10">
      <Card className="w-full max-w-sm gap-8 rounded-[28px] px-1 py-7 shadow-[0_2px_3px_rgba(0,0,0,0.12),0_12px_28px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
        <CardHeader className="gap-2 px-6">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Nueva contraseña
          </CardTitle>
          <CardDescription className="text-[15px] leading-relaxed">
            Crea una contraseña de al menos ocho caracteres.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          {search.token ? (
            <ResetPasswordForm token={search.token} />
          ) : (
            <InvalidResetLink />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
