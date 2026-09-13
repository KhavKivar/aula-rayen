import { z } from "zod";

export const bookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "expired",
  "cancelled",
]);

export const bookingResponseSchema = z
  .object({
    id: z.number().int().positive(),
    clientId: z.string().trim().min(1),
    slotId: z.number().int().positive(),
    status: bookingStatusSchema,
    expiresAt: z.iso.datetime(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict();

export const bookingListSchema = z.array(bookingResponseSchema);

export const createBookingRequestSchema = z
  .object({
    slotId: z.number().int().positive(),
    expiresAt: z.iso.datetime(),
    status: bookingStatusSchema.optional(),
  })
  .strict();

export const updateBookingRequestSchema = z
  .object({
    expiresAt: z.iso.datetime().optional(),
    status: bookingStatusSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });

export type BookingStatus = z.infer<typeof bookingStatusSchema>;
export type BookingResponse = z.infer<typeof bookingResponseSchema>;
export type BookingList = z.infer<typeof bookingListSchema>;
export type CreateBookingRequest = z.infer<typeof createBookingRequestSchema>;
export type UpdateBookingRequest = z.infer<typeof updateBookingRequestSchema>;
