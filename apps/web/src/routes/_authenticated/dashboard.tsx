import { createFileRoute } from "@tanstack/react-router";

import { CourseDashboard } from "@/features/course-dashboard/components/course-dashboard";

import { queries } from "@/config/queries";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: CourseDashboard,
  loader: ({ context }) => {
    context.queryClient.query({
      ...queries.courses,
      staleTime: "static",
    });
  },
});
