import { courseDetailSchema } from "@aula-rayen/contracts/course";
import type { CourseDetail } from "@aula-rayen/contracts/course";
import { apiClient } from "@/lib/api-client";

export async function getCourse(courseId: number): Promise<CourseDetail> {
  const { data } = await apiClient.get<unknown>(`/courses/${courseId}`);

  return courseDetailSchema.parse(data);
}
