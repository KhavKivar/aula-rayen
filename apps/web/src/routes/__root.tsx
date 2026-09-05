import "@fontsource-variable/geist-mono";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { OG_IMAGE_URL } from "@/config/seo";
import appCss from "@/styles/app.css?url";
import { QueryClient } from "@tanstack/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

const title = "Psicóloga Rayen | Psicología, arteterapia y formación";
const description =
  "Un espacio para florecer a tu ritmo. Acompañamiento psicológico, arteterapia y cursos para profesionales de la psicología.";
const socialImage = OG_IMAGE_URL;

interface RouterContext {
  queryClient: QueryClient;
}

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
});

function RootDocument() {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-full flex-col">
        <Outlet />
        <Scripts />
        {import.meta.env.DEV ? (
          <TanStackDevtools
            plugins={[
              {
                name: "TanStack Query",
                render: <ReactQueryDevtoolsPanel />,
              },
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        ) : null}
      </body>
    </html>
  );
}
