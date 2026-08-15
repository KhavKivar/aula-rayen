import type { NextRequest } from "next/server";

const backendOrigin =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyAuthRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const target = new URL(`/api/auth/${path.join("/")}`, backendOrigin);
  target.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  return fetch(target, {
    method: request.method,
    headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : request.body,
    redirect: "manual",
    // Required when streaming a request body through Node-compatible fetch.
    duplex: "half",
  } as RequestInit);
}

export const GET = proxyAuthRequest;
export const POST = proxyAuthRequest;
export const PUT = proxyAuthRequest;
export const PATCH = proxyAuthRequest;
export const DELETE = proxyAuthRequest;
export const OPTIONS = proxyAuthRequest;
