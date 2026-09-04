import {
  courseBuyersResponseSchema,
  type CourseBuyersResponse,
} from "@aula-rayen/contracts/course";
import { z } from "zod";

import { apiClient } from "@/lib/api-client";

const courseIdSchema = z.number().int().positive();

export async function getCourseBuyers(
  courseId: number | null,
): Promise<CourseBuyersResponse> {
  const parsedId = courseIdSchema.safeParse(courseId);
  if(parsedId.data){
    const { data } = await apiClient.get<unknown>(`/courses/buyers/${parsedId.data}`);
    return courseBuyersResponseSchema.parse(data);
  }
  throw Error("invalid course id")
}
