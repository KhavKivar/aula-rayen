import { z } from "zod";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { BookingPage } from "@/features/booking/components/booking-page";
import { sessionQueries } from "@/lib/session-queries";

const reservarSearchSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  slot: z.coerce.number().int().positive().optional(),
});

export const Route = createFileRoute("/reservar")({
  ssr: false,
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  validateSearch: reservarSearchSchema,
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.query(sessionQueries.session);
    if (!session?.session || !session?.user) {
      throw redirect({
        to: "/login",
        search: { redirect: "/reservar" },
        replace: true,
      });
    }
  },
  component: BookingPageRoute,
});

function BookingPageRoute() {
  const { date, slot } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <BookingPage
      selectedDate={date}
      selectedSlotId={slot}
      onSelectionChange={({ date: nextDate, slot: nextSlot }) => {
        navigate({
          search: {
            date: nextDate,
            ...(nextSlot ? { slot: nextSlot } : {}),
          },
          replace: true,
        });
      }}
    />
  );
}
