import { createFileRoute } from "@tanstack/react-router";

import { queries } from "@/config/queries";
import { AccountMenu } from "@/features/auth/components/account-menu";
import { CourseDashboard } from "@/features/course-dashboard/components/course-dashboard";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardPage,
  loader: ({ context }) => {
    context.queryClient.query({
      ...queries.courses,
      staleTime: "static",
    });
  },
});

function DashboardPage() {
  const { user } = Route.useRouteContext();
  return (
    <CourseDashboard
      isAdmin={user.role === "admin"}
      accountMenu={<AccountMenu />}
    />
  );
}
