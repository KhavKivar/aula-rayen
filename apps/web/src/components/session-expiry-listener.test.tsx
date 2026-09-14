import { QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";

vi.mock("@/config/env", () => ({
  env: {
    VITE_PUBLIC_API_URL: "https://api.example.com",
    VITE_PUBLIC_AUTH_URL: "https://auth.example.com",
    VITE_PUBLIC_SITE_URL: "https://app.example.com",
  },
}));

import { apiClient } from "@/lib/api-client";
import { createTestQueryClient } from "@/testing/test-utils";
import { SessionExpiryListener } from "./session-expiry-listener";

const originalAdapter = apiClient.defaults.adapter;

afterEach(() => {
  apiClient.defaults.adapter = originalAdapter;
});

function respondUnauthorized() {
  apiClient.defaults.adapter = (async () => {
    const error = new Error("Request failed with status code 401");
    throw Object.assign(error, {
      isAxiosError: true,
      response: { status: 401, data: {} },
      config: {},
    });
  }) as typeof apiClient.defaults.adapter;
}

async function renderAt(initialEntry: string, content: ReactElement) {
  const rootRoute = createRootRoute({ component: Outlet });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => content,
  });
  const protectedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/courses",
    component: () => content,
  });
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: () => <p>Iniciar sesión</p>,
  });
  const queryClient = createTestQueryClient();
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, protectedRoute, loginRoute]),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
  });

  await router.load();

  const view = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  await waitFor(() => {
    expect(router.state.location.pathname).toBe(initialEntry);
  });

  return { view, queryClient, router };
}

describe("SessionExpiryListener", () => {
  it("clears the session cache and redirects to login with the requested route", async () => {
    respondUnauthorized();
    const { queryClient, router } = await renderAt(
      "/courses",
      <SessionExpiryListener />,
    );

    queryClient.setQueryData(["private", "data"], { total: 2 });
    expect(queryClient.getQueryData(["private", "data"])).toEqual({ total: 2 });

    await expect(apiClient.get("/courses")).rejects.toMatchObject({
      name: "SessionExpiredError",
    });

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/login");
    });
    expect(router.state.location.search).toEqual({ redirect: "/courses" });
    expect(queryClient.getQueryData(["private", "data"])).toBeUndefined();
    expect(queryClient.getQueryData(["session"])).toBeNull();
  });

  it("does not redirect before any 401 happens", async () => {
    const { router } = await renderAt("/", <SessionExpiryListener />);

    expect(router.state.location.pathname).toBe("/");
    expect(router.state.location.search).toEqual({});
  });
});
