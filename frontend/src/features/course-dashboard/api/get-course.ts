import { apiClient } from "@/lib/api-client";
import type { CourseContent } from "@/features/course-dashboard/types/course";

export async function getCourse(courseId: number): Promise<CourseContent> {
  const { data } = await apiClient.get<CourseContent>(`/courses/${courseId}`);

  return data;
}
