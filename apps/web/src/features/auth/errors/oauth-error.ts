import * as z from "zod";

const oauthErrorCodeSchema = z.literal("account_not_linked");

export type OAuthErrorCode = z.infer<typeof oauthErrorCodeSchema> | "unknown";

export const loginSearchSchema = z
  .object({
    error: z.unknown().optional(),
    redirect: z.unknown().optional(),
  })
  .transform(({ error, redirect }) => {
    const safeRedirect =
      typeof redirect === "string" &&
      redirect.startsWith("/") &&
      !redirect.startsWith("//")
        ? redirect
        : undefined;

    if (error === undefined) {
      return { error: undefined, redirect: safeRedirect };
    }

    const result = oauthErrorCodeSchema.safeParse(error);
    return {
      error: result.success ? result.data : ("unknown" as const),
      redirect: safeRedirect,
    };
  });

const oauthErrorMessages: Record<OAuthErrorCode, string> = {
  account_not_linked:
    "Ya existe una cuenta con este correo. Ingresa con tu correo y contraseña.",
  unknown: "No fue posible iniciar sesión con Google. Inténtalo nuevamente.",
};

export function getOAuthErrorMessage(error?: OAuthErrorCode): string | undefined {
  return error ? oauthErrorMessages[error] : undefined;
}
