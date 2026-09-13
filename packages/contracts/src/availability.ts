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

export const availabilitySlotListSchema = z.array(
  availabilitySlotResponseSchema,
);

export const createAvailabilitySlotRequestSchema =
  availabilitySlotMutableFieldsSchema
    .omit({ status: true })
    .extend({ status: availabilitySlotStatusSchema.optional() })
    .strict();

export const updateAvailabilitySlotRequestSchema =
  availabilitySlotMutableFieldsSchema
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
      message: "Debes enviar al menos un campo para actualizar",
    });

export const MAX_AVAILABILITY_SLOTS_BATCH = 1000;

export const createAvailabilitySlotsRequestSchema = z
  .array(createAvailabilitySlotRequestSchema)
  .min(1)
  .max(MAX_AVAILABILITY_SLOTS_BATCH);

export type AvailabilitySlotStatus = z.infer<
  typeof availabilitySlotStatusSchema
>;
export type AvailabilitySlotResponse = z.infer<
  typeof availabilitySlotResponseSchema
>;
export type AvailabilitySlotList = z.infer<typeof availabilitySlotListSchema>;
export type CreateAvailabilitySlotRequest = z.infer<
  typeof createAvailabilitySlotRequestSchema
>;
export type UpdateAvailabilitySlotRequest = z.infer<
  typeof updateAvailabilitySlotRequestSchema
>;
export type CreateAvailabilitySlotsRequest = z.infer<
  typeof createAvailabilitySlotsRequestSchema
>;
