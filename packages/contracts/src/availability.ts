import { z } from "zod";

export const availabilitySlotStatusSchema = z.enum(["available", "disabled"]);

const availabilitySlotMutableFieldsSchema = z
  .object({
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
    assignedTo: z.string().trim().min(1),
    status: availabilitySlotStatusSchema,
  })
  .strict();

export const availabilitySlotResponseSchema = z
  .object({
    id: z.number().int().positive(),
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
    assignedTo: z.string().trim().min(1),
    createdBy: z.string().trim().min(1),
    createdAt: z.iso.datetime(),
    status: availabilitySlotStatusSchema,
  })
  .strict();

export const availabilitySlotListResponseSchema = z.array(
  availabilitySlotResponseSchema,
);

export const availabilitySlotCreateRequestSchema =
  availabilitySlotMutableFieldsSchema
    .omit({ status: true })
    .extend({ status: availabilitySlotStatusSchema.optional() })
    .strict();

export const availabilitySlotUpdateRequestSchema =
  availabilitySlotMutableFieldsSchema
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
      message: "Debes enviar al menos un campo para actualizar",
    });

export const MAX_AVAILABILITY_SLOTS_BATCH = 1000;

export const availabilitySlotBulkCreateRequestSchema = z
  .array(availabilitySlotCreateRequestSchema)
  .min(1)
  .max(MAX_AVAILABILITY_SLOTS_BATCH);

export type AvailabilitySlotStatus = z.infer<
  typeof availabilitySlotStatusSchema
>;
export type AvailabilitySlotResponse = z.infer<
  typeof availabilitySlotResponseSchema
>;
export type AvailabilitySlotListResponse = z.infer<typeof availabilitySlotListResponseSchema>;
export type AvailabilitySlotCreateRequest = z.infer<
  typeof availabilitySlotCreateRequestSchema
>;
export type AvailabilitySlotUpdateRequest = z.infer<
  typeof availabilitySlotUpdateRequestSchema
>;
export type AvailabilitySlotBulkCreateRequest = z.infer<
  typeof availabilitySlotBulkCreateRequestSchema
>;
