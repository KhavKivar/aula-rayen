import { courseDetailResponseSchema } from "@aula-rayen/contracts/course";
import type { CourseDetailResponse } from "@aula-rayen/contracts/course";
import { apiClient } from "@/lib/api-client";
import { z } from "zod";

const courseIdSchema = z.number().int().positive();

export async function getCourse(courseId: number): Promise<CourseDetailResponse> {
  const parsedId = courseIdSchema.parse(courseId);

  const { data } = await apiClient.get<unknown>(`/courses/${parsedId}`);

  return courseDetailResponseSchema.parse(data);
}
