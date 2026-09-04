import { createFileRoute } from "@tanstack/react-router";

import { PaymentsPanel } from "@/features/admin-dashboard/components/payments-panel";

export const Route = createFileRoute(
  "/_authenticated/dashboard/admin/payments",
)({ component: PaymentsPanel });
