import { lazy, Suspense } from "react";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";

import { OG_IMAGE_URL } from "@/config/seo";
import { SessionExpiryListener } from "@/components/session-expiry-listener";
import appCss from "@/styles/app.css?url";
import { QueryClient } from "@tanstack/react-query";

const title = "Psicóloga Rayen | Psicología, arteterapia y formación";
const description =
  "Un espacio para florecer a tu ritmo. Acompañamiento psicológico, arteterapia y cursos para profesionales de la psicología.";
const socialImage = OG_IMAGE_URL;

interface RouterContext {
  queryClient: QueryClient;
}

const AppDevtools = import.meta.env.DEV
  ? lazy(() => import("@/components/devtools"))
  : null;

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_CL" },
      { property: "og:site_name", content: "Psicóloga Rayen" },
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: description,
      },
      { property: "og:image", content: socialImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: socialImage },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFoundPage,
  errorComponent: RootErrorPage,
});

function RootDocument() {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-full flex-col">
        <Outlet />
        <SessionExpiryListener />
        <Scripts />
        {AppDevtools ? (
          <Suspense fallback={null}>
            <AppDevtools />
          </Suspense>
        ) : null}
      </body>
    </html>
  );
}

function NotFoundPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 py-16 text-center">
      <p className="section-kicker">Error 404</p>
      <h1 className="font-heading text-4xl font-normal tracking-tight">
        No encontramos esta página
      </h1>
      <p className="max-w-md text-sm leading-7 text-muted-foreground">
        Puede que el enlace esté roto o que la página se haya movido.
      </p>
      <Link to="/" className="text-link">
        Volver al inicio
      </Link>
    </main>
  );
}

function RootErrorPage({ reset }: ErrorComponentProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 py-16 text-center">
      <p className="section-kicker">Algo salió mal</p>
      <h1 className="font-heading text-4xl font-normal tracking-tight">
        No pudimos cargar la página
      </h1>
      <p className="max-w-md text-sm leading-7 text-muted-foreground">
        Ocurrió un error inesperado. Intenta nuevamente o vuelve al inicio.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button type="button" onClick={reset} className="text-link">
          Reintentar
        </button>
        <Link to="/" className="text-link">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
