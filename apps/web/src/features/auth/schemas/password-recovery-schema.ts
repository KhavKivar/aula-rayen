import * as z from "zod";

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email("Ingresa un correo electrónico válido.")),
});

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

const resetTokenSearchSchema = z
  .object({
    token: z.string().trim().min(1),
    error: z.never().optional(),
  })
  .strict();

const invalidResetSearchSchema = z
  .object({
    token: z.never().optional(),
    error: z.literal("INVALID_TOKEN"),
  })
  .strict();

export const resetPasswordSearchSchema = z.union([
  resetTokenSearchSchema,
  invalidResetSearchSchema,
]);

export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type NewPassword = z.infer<typeof newPasswordSchema>;
export type ResetPasswordSearch = z.infer<typeof resetPasswordSearchSchema>;
