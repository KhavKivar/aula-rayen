import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { queries } from "@/config/queries";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ context, location }) => {
    const session = await context.queryClient.ensureQueryData(queries.session);

    if (!session?.session || !session?.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
        replace: true,
      });
    }

    return {
      user: session.user,
      session: session.session,
    };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <Outlet />;
}
