import * as z from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Ingresa tu nombre."),
    email: z
      .string()
      .trim()
      .pipe(z.email("Ingresa un correo electrónico válido.")),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string().min(1, "Confirma tu contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type RegisterCredentials = z.infer<typeof registerSchema>;
