import { createFileRoute } from "@tanstack/react-router";

import { DashboardGate } from "@/features/course-dashboard/components/dashboard-gate";
import { CourseDashboard } from "@/features/course-dashboard/components/course-dashboard";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <DashboardGate>
      <CourseDashboard />
    </DashboardGate>
  );
}
