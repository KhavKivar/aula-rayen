import * as z from "zod";

const oauthErrorCodeSchema = z.literal("account_not_linked");

export type OAuthErrorCode = z.infer<typeof oauthErrorCodeSchema> | "unknown";

export const oauthSearchSchema = z
  .object({
    error: z.unknown().optional(),
  })
  .transform(({ error }) => {
    if (error === undefined) {
      return { error: undefined };
    }

    const result = oauthErrorCodeSchema.safeParse(error);
    return { error: result.success ? result.data : ("unknown" as const) };
  });

const oauthErrorMessages: Record<OAuthErrorCode, string> = {
  account_not_linked:
    "Ya existe una cuenta con este correo. Ingresa con tu correo y contraseña.",
  unknown: "No fue posible iniciar sesión con Google. Inténtalo nuevamente.",
};

export function getOAuthErrorMessage(error?: OAuthErrorCode): string | undefined {
  return error ? oauthErrorMessages[error] : undefined;
}
