import {
  courseDetailResponseSchema,
  courseCreateRequestSchema,
} from "@aula-rayen/contracts/course";
import type { CourseDetailResponse } from "@aula-rayen/contracts/course";

import { apiClient } from "@/lib/api-client";

export async function createCourse(
  data: Parameters<typeof courseCreateRequestSchema.parse>[0],
): Promise<CourseDetailResponse> {
  const parsed = courseCreateRequestSchema.parse(data);

  const { data: response } = await apiClient.post<unknown>("/courses", parsed);

  return courseDetailResponseSchema.parse(response);
}
