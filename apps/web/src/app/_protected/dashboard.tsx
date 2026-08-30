import { createFileRoute } from "@tanstack/react-router";

import { CourseDashboard } from "@/features/course-dashboard/components/course-dashboard";

export const Route = createFileRoute("/_protected/dashboard")({
  component: CourseDashboard,
});
