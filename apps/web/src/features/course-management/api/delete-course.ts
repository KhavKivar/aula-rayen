import { z } from "zod";
import { courseDetailSchema } from "@aula-rayen/contracts/course";
import type { CourseDetail } from "@aula-rayen/contracts/course";

import { apiClient } from "@/lib/api-client";

const deleteCourseInputSchema = z.object({
  id: z.number().int().positive(),
});

export async function deleteCourse(
  input: z.infer<typeof deleteCourseInputSchema>,
): Promise<CourseDetail> {
  const parsed = deleteCourseInputSchema.parse(input);

  const { data: response } = await apiClient.delete<unknown>(
    `/courses/${parsed.id}`,
  );

  return courseDetailSchema.parse(response);
}
