import { courseCatalogSchema } from "@aula-rayen/contracts/course";
import type { CourseCatalog } from "@aula-rayen/contracts/course";
import { apiClient } from "@/lib/api-client";

export async function getCourses(): Promise<CourseCatalog> {
  const { data } = await apiClient.get<unknown>("/courses");

  return courseCatalogSchema.parse(data);
}
