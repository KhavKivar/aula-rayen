import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSessionMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
}));

vi.mock("@/config/env", () => ({
  env: {
    VITE_PUBLIC_API_URL: "https://api.example.com",
    VITE_PUBLIC_AUTH_URL: "https://api.example.com/auth",
    VITE_PUBLIC_SITE_URL: "https://app.example.com",
  },
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: { getSession: getSessionMock },
  signOut: vi.fn(),
}));

import { routeTree } from "@/routeTree.gen";

function createTestRouter(initialEntry: string) {
  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
    context: {
      queryClient: new QueryClient({
        defaultOptions: { queries: { retry: false } },
      }),
    },
  });
}

describe("/reservar route guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirige a /login con redirect=/reservar si no hay sesión", async () => {
    getSessionMock.mockResolvedValueOnce({ data: null });
    const router = createTestRouter("/reservar");

    await router.load();

    expect(router.state.location.pathname).toBe("/login");
    expect(router.state.location.search).toEqual({ redirect: "/reservar" });
  });

  it("mantiene a un usuario autenticado en /reservar", async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: { id: "session-1" },
        user: { id: "user-1" },
      },
    });
    const router = createTestRouter("/reservar");

    await router.load();

    expect(router.state.location.pathname).toBe("/reservar");
  });
});
