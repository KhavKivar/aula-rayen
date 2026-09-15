import { courseCatalogResponseSchema } from "@aula-rayen/contracts/course";
import type { CourseCatalogResponse } from "@aula-rayen/contracts/course";
import { apiClient } from "@/lib/api-client";

export async function getCourses(): Promise<CourseCatalogResponse> {
  const { data } = await apiClient.get<unknown>("/courses");

  return courseCatalogResponseSchema.parse(data);
}
