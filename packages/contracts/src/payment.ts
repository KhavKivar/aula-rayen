import { z } from "zod";

export const paymentStatusSchema = z.enum(["approved", "pending", "rejected"]);

export const paymentSchema = z
  .object({
    orderId: z.string().trim().min(1),
    buyerName: z.string().trim().min(1),
    buyerEmail: z.email(),
    courseId: z.number().int().positive(),
    courseTitle: z.string().trim().min(1),
    amount: z.number().int().nonnegative(),
    date: z.iso.datetime(),
    status: paymentStatusSchema,
    maskedCard: z.string().trim().min(1),
    authorizationCode: z.string().trim().min(1).optional(),
  })
  .strict();

export const paymentsResponseSchema = z.array(paymentSchema);

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type PaymentsResponse = z.infer<typeof paymentsResponseSchema>;
