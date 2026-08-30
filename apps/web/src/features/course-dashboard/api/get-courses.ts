import { courseCatalogSchema } from "@aula-rayen/contracts/course";
import type { CourseCatalog } from "@aula-rayen/contracts/course";
import { createServerFn } from "@tanstack/react-start";

import { requestBackendJson } from "@/lib/backend-api.server";

const getCoursesServerFn = createServerFn({ method: "GET" }).handler(
  async () => courseCatalogSchema.parse(await requestBackendJson("/courses")),
);

export async function getCourses(): Promise<CourseCatalog> {
  return getCoursesServerFn();
}
