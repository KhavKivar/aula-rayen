import { z } from 'zod';

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

export const courseCatalogSchema = z.array(courseCatalogItemSchema);

export const courseDetailSchema = coursePublicFieldsSchema
  .extend({
    videoLink: z.url(),
    fileLink: z.url(),
  })
  .strict();

export const createCourseRequestSchema = courseMutableFieldsSchema;

export const updateCourseRequestSchema = courseMutableFieldsSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export const courseMutationResponseSchema = courseDetailSchema;

export type CourseCatalogItem = z.infer<typeof courseCatalogItemSchema>;
export type CourseCatalog = z.infer<typeof courseCatalogSchema>;
export type CourseDetail = z.infer<typeof courseDetailSchema>;
export type CreateCourseRequest = z.infer<typeof createCourseRequestSchema>;
export type UpdateCourseRequest = z.infer<typeof updateCourseRequestSchema>;
export type CourseMutationResponse = z.infer<
  typeof courseMutationResponseSchema
>;
