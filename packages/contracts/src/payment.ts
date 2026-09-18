import { z } from "zod";

export const paymentStatusSchema = z.enum(["approved", "pending", "rejected"]);

export const paymentResponseSchema = z
  .object({
    orderId: z.string().trim().min(1),
    userId: z.string().trim().min(1),
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

export const paymentListResponseSchema = z.array(paymentResponseSchema);

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
export type PaymentListResponse = z.infer<typeof paymentListResponseSchema>;
