import { z } from "zod";

// POST /webpay — request. Espeja CreateWebpayDto del backend
// (class-validator) para que ambos lados validen lo mismo.
export const createWebpayRequestSchema = z
  .object({
    course_id: z.number().int().positive(),
  })
  .strict();

// POST /webpay — response de Transbank reenviada al frontend
// para el auto-submit del form con token_ws.
export const createWebpayResponseSchema = z
  .object({
    token: z.string().min(1),
    url: z.url(),
  })
  .strict();

// Resultado interno del commit en el backend. No viaja al frontend tal cual:
// el controller lo mapea a paymentResultStatusSchema para ?status=.
export const commitResultSchema = z
  .object({
    paymentStatus: z.enum(["ok", "pending", "canceled"]),
  })
  .strict();

// GET /webpay/commit — redirect 302. El frontend nunca parsea este JSON,
// navega directo a /payment-result?status=...
export const commitRedirectSchema = z
  .object({
    url: z.url(),
  })
  .strict();

// ?status= de /payment-result. Compartido con la route del frontend.
export const paymentResultStatusSchema = z.enum([
  "success",
  "rejected",
  "timeout",
]);

export type CreateWebpayRequest = z.infer<typeof createWebpayRequestSchema>;
export type CreateWebpayResponse = z.infer<typeof createWebpayResponseSchema>;
export type CommitResult = z.infer<typeof commitResultSchema>;
export type CommitRedirect = z.infer<typeof commitRedirectSchema>;
export type PaymentResultStatus = z.infer<typeof paymentResultStatusSchema>;
