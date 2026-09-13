import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { sessionQueries } from "@/lib/session-queries";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  beforeLoad: async ({ context, location }) => {
    // Un fallo de red no debe cerrar la sesión: la ruta lanza el error y
    // SessionGuardError ofrece reintentar.
    const session = await context.queryClient.query(sessionQueries.session);
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
  errorComponent: SessionGuardError,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <Outlet />;
}

function SessionGuardError({ reset }: ErrorComponentProps) {
  const queryClient = useQueryClient();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 py-16 text-center">
      <p className="section-kicker">Sesión no disponible</p>
      <h1 className="font-heading text-4xl font-normal tracking-tight">
        No pudimos verificar tu sesión
      </h1>
      <p className="max-w-md text-sm leading-7 text-muted-foreground">
        Revisa tu conexión a internet e inténtalo nuevamente.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          className="text-link"
          onClick={() => {
            queryClient.removeQueries({
              queryKey: sessionQueries.session.queryKey,
            });
            reset();
          }}
        >
          Reintentar
        </button>
        <Link to="/login" className="text-link">
          Ir a iniciar sesión
        </Link>
      </div>
    </main>
  );
}
