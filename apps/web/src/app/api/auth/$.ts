import { createFileRoute } from "@tanstack/react-router";

import { env } from "@/config/env";
import { proxyAuthRequest } from "@/lib/auth-proxy";

function handleAuthRequest({ request }: { request: Request }) {
  const requestUrl = new URL(request.url);
  const path = requestUrl.pathname.replace(/^\/api\/auth\/?/, "");

  return proxyAuthRequest({
    request,
    path,
    backendOrigin: env.NEXT_PUBLIC_API_URL,
  });
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: handleAuthRequest,
      POST: handleAuthRequest,
      PUT: handleAuthRequest,
      PATCH: handleAuthRequest,
      DELETE: handleAuthRequest,
      OPTIONS: handleAuthRequest,
    },
  },
});
