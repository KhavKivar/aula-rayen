import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource-variable/plus-jakarta-sans";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { env } from "@/config/env";
import { siteContent } from "@/config/static-content";
import appCss from "@/styles/app.css?url";
import { QueryClient } from "@tanstack/react-query";

const title = `${siteContent.brandName} | Talleres para profesionales de la psicología`;
const description =
  "Cursos para psicólogos y psicólogas con formación, dinámicas paso a paso y materiales editables para facilitar talleres.";
const socialImage = new URL(
  "/opengraph-image.svg",
  env.VITE_PUBLIC_SITE_URL,
).toString();

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
      { property: "og:site_name", content: siteContent.brandName },
      {
        property: "og:title",
        content: `${siteContent.brandName} | Talleres listos para llevar a la práctica`,
      },
      {
        property: "og:description",
        content:
          "Formación, dinámicas y materiales editables para profesionales de la psicología.",
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
      </body>
    </html>
  );
}
