import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/env", () => ({
  env: {
    VITE_PUBLIC_API_URL: "https://api.example.com",
    VITE_PUBLIC_AUTH_URL: "https://auth.example.com",
    VITE_PUBLIC_SITE_URL: "https://app.example.com",
  },
}));

import { apiClient, setUnauthorizedHandler, SessionExpiredError } from "./api-client";

const originalAdapter = apiClient.defaults.adapter;

function rejectWith(status: number | undefined) {
  const adapter = vi.fn(async () => {
    const error = new Error("Request failed");
    throw Object.assign(error, {
      isAxiosError: true,
      response: status === undefined ? undefined : { status, data: {} },
      config: {},
    });
  });
  apiClient.defaults.adapter = adapter as typeof apiClient.defaults.adapter;
  return adapter;
}

afterEach(() => {
  setUnauthorizedHandler(null);
  apiClient.defaults.adapter = originalAdapter;
  vi.restoreAllMocks();
});

describe("apiClient 401 handling", () => {
  it("maps 401 responses to SessionExpiredError", async () => {
    rejectWith(401);

    await expect(apiClient.get("/me")).rejects.toBeInstanceOf(
      SessionExpiredError,
    );
    await expect(apiClient.get("/me")).rejects.toMatchObject({
      name: "SessionExpiredError",
      message: "Sesión expirada",
    });
  });

  it("keeps non-401 errors untouched", async () => {
    rejectWith(409);

    await expect(apiClient.get("/me")).rejects.not.toBeInstanceOf(
      SessionExpiredError,
    );
    await expect(apiClient.get("/me")).rejects.toMatchObject({
      isAxiosError: true,
      response: { status: 409 },
    });
  });

  it("keeps network failures untouched", async () => {
    rejectWith(undefined);

    await expect(apiClient.get("/me")).rejects.not.toBeInstanceOf(
      SessionExpiredError,
    );
  });

  it("notifies the registered handler once for a burst of parallel 401s", async () => {
    rejectWith(401);
    const handler = vi.fn();
    setUnauthorizedHandler(handler);

    const results = await Promise.allSettled([
      apiClient.get("/a"),
      apiClient.get("/b"),
      apiClient.get("/c"),
    ]);

    expect(results.every(({ status }) => status === "rejected")).toBe(true);
    expect(handler).toHaveBeenCalledTimes(1);

    // El bloqueo se libera al terminar el handler: un 401 posterior vuelve
    // a notificar.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await expect(apiClient.get("/d")).rejects.toBeInstanceOf(
      SessionExpiredError,
    );
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("does nothing when no handler is registered", async () => {
    rejectWith(401);
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    setUnauthorizedHandler(null);

    await expect(apiClient.get("/me")).rejects.toBeInstanceOf(
      SessionExpiredError,
    );
    expect(handler).not.toHaveBeenCalled();
  });
});
