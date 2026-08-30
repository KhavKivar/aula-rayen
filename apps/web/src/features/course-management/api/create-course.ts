import { createServerFn } from "@tanstack/react-start";
import {
  courseDetailSchema,
  createCourseRequestSchema,
} from "@aula-rayen/contracts/course";
import type { CourseDetail } from "@aula-rayen/contracts/course";

import { requestBackendJson } from "@/lib/backend-api.server";

const createCourseServerFn = createServerFn({ method: "POST" })
  .validator(createCourseRequestSchema)
  .handler(async ({ data }) => {
    const response = await requestBackendJson("/courses", {
      method: "POST",
      body: data,
    });

    return courseDetailSchema.parse(response);
  });

export async function createCourse(
  data: Parameters<typeof createCourseServerFn>[0]["data"],
): Promise<CourseDetail> {
  return createCourseServerFn({ data });
}
