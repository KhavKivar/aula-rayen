import { z } from "zod";
import {
  courseDetailSchema,
  updateCourseRequestSchema,
} from "@aula-rayen/contracts/course";
import type { CourseDetail } from "@aula-rayen/contracts/course";

import { apiClient } from "@/lib/api-client";

const updateCourseInputSchema = z.object({
  id: z.number().int().positive(),
  data: updateCourseRequestSchema,
});

export async function updateCourse(
  input: z.infer<typeof updateCourseInputSchema>,
): Promise<CourseDetail> {
  const parsed = updateCourseInputSchema.parse(input);

  const { data: response } = await apiClient.patch<unknown>(
    `/courses/${parsed.id}`,
    parsed.data,
  );

  return courseDetailSchema.parse(response);
}
