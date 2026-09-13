import { createFileRoute } from "@tanstack/react-router";

import { ReservationsPanel } from "@/features/admin-reservations/components/reservations-panel";

export const Route = createFileRoute(
  "/_authenticated/dashboard/admin/reservations",
)({ component: ReservationsPanel });
