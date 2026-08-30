import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_protected")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data: session } = await authClient.getSession();

    if (!session) {
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
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return <Outlet />;
}
