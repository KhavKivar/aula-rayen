import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminShell } from "@/features/admin-dashboard/components/admin-shell";
import { AccountMenu } from "@/features/auth/components/account-menu";

export const Route = createFileRoute("/_authenticated/dashboard/admin")({
  beforeLoad: ({ context }) => {
    // Presentation guard only. Backend endpoints need separate RBAC protection.
    if (context.user.role !== "admin") {
      throw redirect({ to: "/dashboard", replace: true });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminShell accountMenu={<AccountMenu />}>
      <Outlet />
    </AdminShell>
  );
}
