import { DashboardGate } from "@/features/course-dashboard/components/dashboard-gate";
import { CourseDashboard } from "@/features/course-dashboard/components/course-dashboard";

export default function DashboardPage() {
  return (
    <DashboardGate>
      <CourseDashboard />
    </DashboardGate>
  );
}
