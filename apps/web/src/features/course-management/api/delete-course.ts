import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { courseDetailSchema } from "@aula-rayen/contracts/course";
import type { CourseDetail } from "@aula-rayen/contracts/course";

import { requestBackendJson } from "@/lib/backend-api.server";

const deleteCourseInputSchema = z.object({
  id: z.number().int().positive(),
});

const deleteCourseServerFn = createServerFn({ method: "POST" })
  .validator(deleteCourseInputSchema)
  .handler(async ({ data: { id } }) => {
    const response = await requestBackendJson(`/courses/${id}`, {
      method: "DELETE",
    });

    return courseDetailSchema.parse(response);
  });

export async function deleteCourse(
  input: z.infer<typeof deleteCourseInputSchema>,
): Promise<CourseDetail> {
  return deleteCourseServerFn({ data: input });
}
