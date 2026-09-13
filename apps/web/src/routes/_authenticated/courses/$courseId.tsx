import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

import { CourseContent } from "@/features/course-dashboard/components/course-content";

const courseIdSchema = z.coerce.number().int().positive();

export const Route = createFileRoute("/_authenticated/courses/$courseId")({
  beforeLoad: ({ params }) => {
    const parsed = courseIdSchema.safeParse(params.courseId);
    if (!parsed.success) {
      throw notFound();
    }

    return { courseId: parsed.data };
  },
  component: CoursePage,
});

function CoursePage() {
  const { courseId } = Route.useRouteContext();

  return <CourseContent courseId={courseId} />;
}
