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

export const Route = createFileRoute("/_auth/reset-password")({
  validateSearch: (search): ResetPasswordSearch => {
    const result = resetPasswordSearchSchema.safeParse(search);
    return result.success ? result.data : { error: "INVALID_TOKEN" };
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const search = Route.useSearch();

  return (
    <Card className="w-full max-w-md gap-8 overflow-visible rounded-none bg-transparent py-0 shadow-none ring-0">
      <CardHeader className="gap-3 px-0">
        <CardTitle
          role="heading"
          aria-level={1}
          className="font-heading text-4xl font-normal tracking-tight"
        >
          Nueva contraseña
        </CardTitle>
        <CardDescription className="text-[15px] leading-relaxed">
          Crea una contraseña de al menos ocho caracteres.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {search.token ? (
          <ResetPasswordForm token={search.token} />
        ) : (
          <InvalidResetLink />
        )}
      </CardContent>
    </Card>
  );
}
