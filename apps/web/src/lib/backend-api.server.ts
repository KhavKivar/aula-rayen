import { getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";

import { env } from "@/config/env";

type BackendRequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
};

type BackendErrorBody = {
  message?: string | string[];
};

export class BackendApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "BackendApiError";
  }
}

export async function requestBackendJson(
  path: `/${string}`,
  options: BackendRequestOptions = {},
): Promise<unknown> {
  const cookie = getRequestHeader("cookie");
  const headers = new Headers({ Accept: "application/json" });

  if (cookie) headers.set("cookie", cookie);
  if (options.body !== undefined) headers.set("content-type", "application/json");

  setResponseHeader("Cache-Control", "no-store");

  const response = await fetch(new URL(path, env.NEXT_PUBLIC_API_URL), {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const responseBody: unknown = await response.json();

  if (!response.ok) {
    const errorBody = responseBody as BackendErrorBody;
    const backendMessage = Array.isArray(errorBody.message)
      ? errorBody.message.join(" ")
      : errorBody.message;

    throw new BackendApiError(
      backendMessage ?? "La API no pudo procesar la solicitud.",
      response.status,
    );
  }

  return responseBody;
}
