import { createFileRoute } from "@tanstack/react-router";

import { DashboardGate } from "@/features/course-dashboard/components/dashboard-gate";
import { CourseContent } from "@/features/course-dashboard/components/course-content";

export const Route = createFileRoute("/courses/$courseId")({
  component: CoursePage,
});

function CoursePage() {
  const { courseId } = Route.useParams();

  return (
    <DashboardGate>
      <CourseContent courseId={Number(courseId)} />
    </DashboardGate>
  );
}
