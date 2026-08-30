import { createFileRoute } from "@tanstack/react-router";

import { CourseContent } from "@/features/course-dashboard/components/course-content";

export const Route = createFileRoute("/_protected/courses/$courseId")({
  component: CoursePage,
});

function CoursePage() {
  const { courseId } = Route.useParams();

  return <CourseContent courseId={Number(courseId)} />;
}
