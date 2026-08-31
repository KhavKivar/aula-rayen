import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getCoursesMock, getSessionMock } = vi.hoisted(() => ({
  getCoursesMock: vi.fn(),
  getSessionMock: vi.fn(),
}));

vi.mock("@/config/env", () => ({
  env: {
    VITE_PUBLIC_API_URL: "https://api.example.com",
    VITE_PUBLIC_AUTH_URL: "https://api.example.com/auth",
    VITE_PUBLIC_SITE_URL: "https://app.example.com",
  },
}));

vi.mock("@/features/course-dashboard/api/get-courses", () => ({
  getCourses: getCoursesMock,
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

describe("authenticated route layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCoursesMock.mockResolvedValue([]);
  });

  it("redirects anonymous visitors through login with their requested route", async () => {
    getSessionMock.mockResolvedValueOnce({ data: null });
    const router = createTestRouter("/courses/7");

    await router.load();

    expect(router.state.location.pathname).toBe("/login");
    expect(router.state.location.search).toEqual({ redirect: "/courses/7" });
  });

  it("keeps an authenticated visitor on protected content", async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: { id: "session-1" },
        user: { id: "user-1" },
      },
    });
    const router = createTestRouter("/dashboard");

    await router.load();

    expect(router.state.location.pathname).toBe("/dashboard");
    expect(router.state.matches.at(-1)?.routeId).toBe(
      "/_authenticated/dashboard",
    );
  });
});
