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

export const bookingListResponseSchema = z.array(bookingResponseSchema);

export const bookingCreateRequestSchema = z
  .object({
    slotId: z.number().int().positive(),
    expiresAt: z.iso.datetime(),
    status: bookingStatusSchema.optional(),
  })
  .strict();

export const bookingUpdateRequestSchema = z
  .object({
    expiresAt: z.iso.datetime().optional(),
    status: bookingStatusSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });

export const bookingGetRequestSchema = z
  .object({
    search: z.string().optional(),
    status: bookingStatusSchema.optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  })
  .strict();

export type BookingStatus = z.infer<typeof bookingStatusSchema>;
export type BookingResponse = z.infer<typeof bookingResponseSchema>;
export type BookingListResponse = z.infer<typeof bookingListResponseSchema>;
export type BookingCreateRequest = z.infer<typeof bookingCreateRequestSchema>;
export type BookingUpdateRequest = z.infer<typeof bookingUpdateRequestSchema>;
export type BookingGetRequest = z.infer<typeof bookingGetRequestSchema>;
