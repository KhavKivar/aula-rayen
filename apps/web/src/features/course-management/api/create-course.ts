import {
  courseDetailSchema,
  createCourseRequestSchema,
} from "@aula-rayen/contracts/course";
import type { CourseDetail } from "@aula-rayen/contracts/course";

import { apiClient } from "@/lib/api-client";

export async function createCourse(
  data: Parameters<typeof createCourseRequestSchema.parse>[0],
): Promise<CourseDetail> {
  const parsed = createCourseRequestSchema.parse(data);

  const { data: response } = await apiClient.post<unknown>("/courses", parsed);

  return courseDetailSchema.parse(response);
}
