import { courseDetailSchema } from "@aula-rayen/contracts/course";
import type { CourseDetail } from "@aula-rayen/contracts/course";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requestBackendJson } from "@/lib/backend-api.server";

const courseIdSchema = z.number().int().positive();

const getCourseServerFn = createServerFn({ method: "GET" })
  .validator(courseIdSchema)
  .handler(async ({ data: courseId }) =>
    courseDetailSchema.parse(await requestBackendJson(`/courses/${courseId}`)),
  );

export async function getCourse(courseId: number): Promise<CourseDetail> {
  return getCourseServerFn({ data: courseId });
}
