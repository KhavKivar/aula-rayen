import { z } from "zod";

const courseMutableFieldsSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    videoLink: z.url(),
    fileLink: z.url(),
    duration: z.string().trim().min(1),
    price: z.number().int().nonnegative(),
  })
  .strict();

const coursePublicFieldsSchema = courseMutableFieldsSchema
  .omit({ videoLink: true, fileLink: true })
  .extend({
    id: z.number().int().positive(),
    createdAt: z.iso.datetime(),
  });

export const courseCatalogItemSchema = coursePublicFieldsSchema
  .extend({
    hasAccess: z.boolean(),
  })
  .strict();

export const courseCatalogResponseSchema = z.array(courseCatalogItemSchema);

export const courseDetailResponseSchema = coursePublicFieldsSchema
  .extend({
    videoLink: z.url(),
    fileLink: z.url(),
  })
  .strict();

export const courseCreateRequestSchema = courseMutableFieldsSchema;

export const courseUpdateRequestSchema = courseMutableFieldsSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });

export const userPublicResponseSchema = z.object({
  id: z.string().trim().min(1),
  email: z.email(),
  name: z.string().trim().min(1),
});

export const courseBuyerResponseSchema = userPublicResponseSchema
  .extend({
    purchasedAt: z.iso.datetime(),
  })
  .strict();

export const courseBuyerListResponseSchema = z.array(courseBuyerResponseSchema);
export const courseMutationResponseSchema = courseDetailResponseSchema;

export type UserPublicResponse = z.infer<typeof userPublicResponseSchema>;
export type CourseBuyerResponse = z.infer<typeof courseBuyerResponseSchema>;
export type CourseBuyerListResponse = z.infer<typeof courseBuyerListResponseSchema>;
export type CourseCatalogItem = z.infer<typeof courseCatalogItemSchema>;
export type CourseCatalogResponse = z.infer<typeof courseCatalogResponseSchema>;
export type CourseDetailResponse = z.infer<typeof courseDetailResponseSchema>;
export type CourseCreateRequest = z.infer<typeof courseCreateRequestSchema>;
export type CourseUpdateRequest = z.infer<typeof courseUpdateRequestSchema>;
export type CourseMutationResponse = z.infer<
  typeof courseMutationResponseSchema
>;
