import { z } from "zod";

// POST /webpay — request. Espeja CreateWebpayDto del backend
// (class-validator) para que ambos lados validen lo mismo.
export const webpayCreateRequestSchema = z
  .object({
    course_id: z.number().int().positive(),
  })
  .strict();

// POST /webpay — response de Transbank reenviada al frontend
// para el auto-submit del form con token_ws.
export const webpayCreateResponseSchema = z
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

// GET /webpay — fila de webpay_sessions para el panel de administración.
// NO incluye tokenWs ni cardNumber: el endpoint es admin-only y nunca debe
// exponer credenciales de pago. Espejo manual de WebPaySession (Drizzle
// $inferSelect no puede entrar a contracts por ser neutral al framework): si
// cambia apps/api/src/db/schema.ts hay que actualizarlo a mano.
export const webpayAdminSessionSchema = z
  .object({
    buyOrderId: z.string().trim().min(1),
    userId: z.string().trim().min(1),
    courseId: z.number().int().positive(),
    amount: z.number().int().nonnegative(),
    vci: z.string().nullable(),
    tbAmount: z.number().nullable(),
    tbStatus: z.string().nullable(),
    accountingDate: z.string().nullable(),
    transactionDate: z.date().nullable(),
    authorizationCode: z.string().nullable(),
    paymentTypeCode: z.string().nullable(),
    responseCode: z.number().int().nullable(),
    installmentsAmount: z.number().nullable(),
    installmentsNumber: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    committedAt: z.date().nullable(),
    takenAt: z.date().nullable(),
  })
  .strict();

export const webpayAdminSessionsResponseSchema = z.array(
  webpayAdminSessionSchema,
);

export type WebpayCreateRequest = z.infer<typeof webpayCreateRequestSchema>;
export type WebpayCreateResponse = z.infer<typeof webpayCreateResponseSchema>;
export type CommitResult = z.infer<typeof commitResultSchema>;
export type CommitRedirect = z.infer<typeof commitRedirectSchema>;
export type PaymentResultStatus = z.infer<typeof paymentResultStatusSchema>;
export type WebpayAdminSession = z.infer<typeof webpayAdminSessionSchema>;
export type WebpayAdminSessionsResponse = z.infer<
  typeof webpayAdminSessionsResponseSchema
>;
