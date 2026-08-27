import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email("Ingresa un correo electrónico válido.")),
  password: z.string().min(6, "Ingresa tu contraseña."),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
