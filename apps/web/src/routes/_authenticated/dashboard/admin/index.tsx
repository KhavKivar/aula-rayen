import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/admin/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/admin/courses", replace: true });
  },
});
