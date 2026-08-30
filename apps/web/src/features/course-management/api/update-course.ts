import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  courseDetailSchema,
  updateCourseRequestSchema,
} from "@aula-rayen/contracts/course";
import type { CourseDetail } from "@aula-rayen/contracts/course";

import { requestBackendJson } from "@/lib/backend-api.server";

const updateCourseInputSchema = z.object({
  id: z.number().int().positive(),
  data: updateCourseRequestSchema,
});

const updateCourseServerFn = createServerFn({ method: "POST" })
  .validator(updateCourseInputSchema)
  .handler(async ({ data: { id, data } }) => {
    const response = await requestBackendJson(`/courses/${id}`, {
      method: "PATCH",
      body: data,
    });

    return courseDetailSchema.parse(response);
  });

export async function updateCourse(
  input: z.infer<typeof updateCourseInputSchema>,
): Promise<CourseDetail> {
  return updateCourseServerFn({ data: input });
}
