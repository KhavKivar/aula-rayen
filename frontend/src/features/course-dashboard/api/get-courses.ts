import { apiClient } from "@/lib/api-client";
import type { Course } from "@/features/course-dashboard/types/course";

export async function getCourses(): Promise<Course[]> {
  const { data } = await apiClient.get<Course[]>("/courses");

  return data;
}
