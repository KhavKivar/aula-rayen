import { z } from "zod";
import {
  courseDetailResponseSchema,
  courseUpdateRequestSchema,
} from "@aula-rayen/contracts/course";
import type { CourseDetailResponse } from "@aula-rayen/contracts/course";

import { apiClient } from "@/lib/api-client";

const updateCourseInputSchema = z.object({
  id: z.number().int().positive(),
  data: courseUpdateRequestSchema,
});

export async function updateCourse(
  input: z.infer<typeof updateCourseInputSchema>,
): Promise<CourseDetailResponse> {
  const parsed = updateCourseInputSchema.parse(input);

  const { data: response } = await apiClient.patch<unknown>(
    `/courses/${parsed.id}`,
    parsed.data,
  );

  return courseDetailResponseSchema.parse(response);
}
